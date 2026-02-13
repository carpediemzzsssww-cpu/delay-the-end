#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Delay the End - Monte Carlo Balancer
------------------------------------
用途：
1) 随机模拟多局（默认 5000 局）
2) 统计结局分布
3) 统计 Human Rebellion 触发率（目标 5%~15%）
4) 统计极端干预次数分布、均值
5) 输出简易调参建议

兼容事件结构（MVP v3.1）：
{
  "id": "event_003",
  "title_en": "...",
  "title_zh": "...",
  "text_en": "...",
  "text_zh": "...",
  "choices": [
    {"id":"A","label_en":"...","label_zh":"...","effect":{"heaven":5,"hell":-3,"stability":0,"pressure":0},"is_extreme":false},
    ...
  ],
  "fixed_position": null,   # 或 1/6/7
  "is_dilemma": true,
  "tags": ["archive","human","dilemma"]
}
"""

import json
import random
import argparse
from dataclasses import dataclass
from collections import Counter, defaultdict
from statistics import mean
from pathlib import Path

# ---------------------------
# 默认参数（可命令行覆盖）
# ---------------------------

DEFAULT_GAME_CONFIG = {
    "rounds": 7,
    "pressure_growth": [3, 4, 5, 6, 8, 10, 12],
    "initial": {
        "heaven": 50,
        "hell": 50,
        "stability": 50,
        "pressure": 0
    },
    "record": {
        "truth_streak_target": 3,
        "truth_stability_bonus": 3,
        "polish_heaven_bonus": 2,
        "blur_hell_bonus": 2,
        "seal_pressure_delta": -2,
        "seal_penalty_chance": 0.2,
        "seal_penalty": {
            "stability": -5,
            "heaven": 3
        }
    },
    "rebellion": {
        "balance_diff_max": 10,
        "stability_min": 65,
        "consecutive_required": 3,
        "max_extreme_choices": 1
    },
    "endings": {
        "stability_collapse_lt": 20,
        "heaven_dominance_gte": 90,
        "hell_dominance_gte": 90,
        "rebellion_pressure_lt": 85
    }
}

# 记录阶段策略概率（模拟参数）
DEFAULT_RECORD_PROBS = {
    "truth": 0.25,   # 如实记录
    "polish": 0.25,  # 美化记录
    "blur": 0.25,    # 模糊记录
    "seal": 0.25     # 封存档案
}

# 以下变量由配置在运行时注入，先占位默认值
DEFAULT_ROUNDS = 7
PRESSURE_RAMP = {1: 3, 2: 4, 3: 5, 4: 6, 5: 8, 6: 10, 7: 12}

INITIAL_HEAVEN = 50
INITIAL_HELL = 50
INITIAL_STABILITY = 50
INITIAL_PRESSURE = 0

TRUTH_STREAK_TARGET = 3
TRUTH_STREAK_BONUS = 3
POLISH_HEAVEN_BONUS = 2
BLUR_HELL_BONUS = 2
SEAL_PRESSURE_DELTA = -2
SEAL_PENALTY_PROB = 0.20
SEAL_PENALTY_STABILITY = -5
SEAL_PENALTY_HEAVEN = 3

THRESH_STABILITY_COLLAPSE = 20
THRESH_HEAVEN_DOM = 90
THRESH_HELL_DOM = 90
THRESH_REBELLION_PRESSURE = 85

REBELLION_BALANCE_DIFF = 10
REBELLION_MIN_STABILITY = 65
REBELLION_STREAK_REQUIRED = 3
REBELLION_MAX_EXTREME_CHOICES = 1


# ---------------------------
# 数据结构
# ---------------------------

@dataclass
class GameState:
    round: int = 1
    heaven: int = 50
    hell: int = 50
    stability: int = 50
    pressure: int = 0

    truth_counter: int = 0

    # Rebellion tracking
    consecutive_balance_count: int = 0
    rebellion_flag: bool = False

    # 封存惩罚延迟到“下一回合开始”更直观
    pending_penalty: bool = False

    # 统计信息
    extreme_count: int = 0
    history: list = None

    def __post_init__(self):
        if self.history is None:
            self.history = []


# ---------------------------
# 工具函数
# ---------------------------

def clamp(x, lo=0, hi=100):
    return max(lo, min(hi, x))

def weighted_choice(options_with_prob):
    # options_with_prob: [("truth", 0.25), ...]
    r = random.random()
    c = 0.0
    for opt, p in options_with_prob:
        c += p
        if r <= c:
            return opt
    return options_with_prob[-1][0]

def normalize_probs(probs_dict):
    s = sum(probs_dict.values())
    if s <= 0:
        raise ValueError("record probabilities sum must be > 0")
    return {k: v / s for k, v in probs_dict.items()}

def deep_merge(base, override):
    merged = dict(base)
    for k, v in (override or {}).items():
        if isinstance(v, dict) and isinstance(merged.get(k), dict):
            merged[k] = deep_merge(merged[k], v)
        else:
            merged[k] = v
    return merged

def load_game_config(path):
    default_copy = json.loads(json.dumps(DEFAULT_GAME_CONFIG))
    config_path = Path(path)
    if not config_path.exists():
        print(f"[WARN] 配置文件不存在，使用默认配置: {path}")
        return default_copy

    with open(config_path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    if not isinstance(raw, dict):
        raise ValueError("game-config.json 顶层必须是对象(object)")
    return deep_merge(default_copy, raw)

def apply_runtime_config(cfg):
    global DEFAULT_ROUNDS, PRESSURE_RAMP
    global INITIAL_HEAVEN, INITIAL_HELL, INITIAL_STABILITY, INITIAL_PRESSURE
    global TRUTH_STREAK_TARGET, TRUTH_STREAK_BONUS, POLISH_HEAVEN_BONUS, BLUR_HELL_BONUS
    global SEAL_PRESSURE_DELTA, SEAL_PENALTY_PROB, SEAL_PENALTY_STABILITY, SEAL_PENALTY_HEAVEN
    global THRESH_STABILITY_COLLAPSE, THRESH_HEAVEN_DOM, THRESH_HELL_DOM, THRESH_REBELLION_PRESSURE
    global REBELLION_BALANCE_DIFF, REBELLION_MIN_STABILITY, REBELLION_STREAK_REQUIRED, REBELLION_MAX_EXTREME_CHOICES

    rounds = int(cfg.get("rounds", 7))
    rounds = max(1, rounds)
    growth = cfg.get("pressure_growth", DEFAULT_GAME_CONFIG["pressure_growth"])
    if not isinstance(growth, list) or len(growth) == 0:
        growth = list(DEFAULT_GAME_CONFIG["pressure_growth"])
    growth = [int(v) for v in growth]
    if len(growth) < rounds:
        growth = growth + [growth[-1]] * (rounds - len(growth))
    growth = growth[:rounds]

    DEFAULT_ROUNDS = rounds
    PRESSURE_RAMP = {idx + 1: growth[idx] for idx in range(rounds)}

    initial = cfg.get("initial", {})
    INITIAL_HEAVEN = int(initial.get("heaven", 50))
    INITIAL_HELL = int(initial.get("hell", 50))
    INITIAL_STABILITY = int(initial.get("stability", 50))
    INITIAL_PRESSURE = int(initial.get("pressure", 0))

    record = cfg.get("record", {})
    TRUTH_STREAK_TARGET = int(record.get("truth_streak_target", 3))
    TRUTH_STREAK_BONUS = int(record.get("truth_stability_bonus", 3))
    POLISH_HEAVEN_BONUS = int(record.get("polish_heaven_bonus", 2))
    BLUR_HELL_BONUS = int(record.get("blur_hell_bonus", 2))
    SEAL_PRESSURE_DELTA = int(record.get("seal_pressure_delta", -2))
    SEAL_PENALTY_PROB = float(record.get("seal_penalty_chance", 0.2))
    penalty = record.get("seal_penalty", {})
    SEAL_PENALTY_STABILITY = int(penalty.get("stability", -5))
    SEAL_PENALTY_HEAVEN = int(penalty.get("heaven", 3))

    endings = cfg.get("endings", {})
    THRESH_STABILITY_COLLAPSE = int(endings.get("stability_collapse_lt", 20))
    THRESH_HEAVEN_DOM = int(endings.get("heaven_dominance_gte", 90))
    THRESH_HELL_DOM = int(endings.get("hell_dominance_gte", 90))
    THRESH_REBELLION_PRESSURE = int(endings.get("rebellion_pressure_lt", 85))

    rebellion = cfg.get("rebellion", {})
    REBELLION_BALANCE_DIFF = int(rebellion.get("balance_diff_max", 10))
    REBELLION_MIN_STABILITY = int(rebellion.get("stability_min", 65))
    REBELLION_STREAK_REQUIRED = int(rebellion.get("consecutive_required", 3))
    REBELLION_MAX_EXTREME_CHOICES = int(rebellion.get("max_extreme_choices", 1))

def load_events(path):
    with open(path, "r", encoding="utf-8") as f:
        events = json.load(f)
    if not isinstance(events, list):
        raise ValueError("events.json 顶层必须是数组(list)")
    return events

def validate_events(events, rounds=7):
    # 基础校验
    ids = set()
    fixed_map = defaultdict(list)
    dilemma_count = 0
    extreme_choices_total = 0

    for e in events:
        eid = e.get("id")
        if not eid:
            raise ValueError("发现事件缺少 id")
        if eid in ids:
            raise ValueError(f"事件 id 重复: {eid}")
        ids.add(eid)

        fp = e.get("fixed_position", None)
        if fp is not None:
            if not isinstance(fp, int) or fp < 1 or fp > rounds:
                raise ValueError(f"{eid} 的 fixed_position 非法: {fp}")
            fixed_map[fp].append(eid)

        choices = e.get("choices", [])
        if len(choices) != 3:
            raise ValueError(f"{eid} 选择项不是3个（当前={len(choices)}）")

        if e.get("is_dilemma", False):
            dilemma_count += 1

        for c in choices:
            if c.get("is_extreme", False):
                extreme_choices_total += 1
            eff = c.get("effect", {})
            # effect四字段可缺省，但若有须为数值
            for k in ["heaven", "hell", "stability", "pressure"]:
                if k in eff and not isinstance(eff[k], (int, float)):
                    raise ValueError(f"{eid} choice {c.get('id')} effect.{k} 必须是数值")

    # 固定位冲突检查（一个回合只能固定一个事件）
    for pos, arr in fixed_map.items():
        if len(arr) > 1:
            raise ValueError(f"fixed_position={pos} 有多个事件：{arr}")

    # 你当前设计要求 1/6/7 固定（可按需放宽）
    for pos in [1, 6, 7]:
        if pos not in fixed_map:
            print(f"[WARN] 建议固定回合 {pos}，当前未发现 fixed_position={pos} 的事件。")

    if dilemma_count < 3:
        print(f"[WARN] is_dilemma=true 事件少于3个（当前={dilemma_count}）。")

    if extreme_choices_total == 0:
        print("[WARN] 没有任何 is_extreme=true 的选项，隐藏结局逻辑将失真。")

def build_run_sequence(events, rounds=7):
    """按 fixed_position 构造一局事件序列"""
    fixed = {}
    pool = []
    for e in events:
        fp = e.get("fixed_position", None)
        if fp is None:
            pool.append(e)
        else:
            fixed[fp] = e

    seq = [None] * rounds
    for i in range(1, rounds + 1):
        if i in fixed:
            seq[i - 1] = fixed[i]

    empty_positions = [i for i in range(rounds) if seq[i] is None]
    if len(pool) < len(empty_positions):
        raise ValueError(
            f"随机池事件不足：需要 {len(empty_positions)} 个，只有 {len(pool)} 个。"
        )
    sampled = random.sample(pool, k=len(empty_positions))
    for idx, e in zip(empty_positions, sampled):
        seq[idx] = e

    return seq

def apply_effect(s: GameState, effect: dict):
    s.heaven = clamp(s.heaven + int(effect.get("heaven", 0)))
    s.hell = clamp(s.hell + int(effect.get("hell", 0)))
    s.stability = clamp(s.stability + int(effect.get("stability", 0)))
    s.pressure = max(0, s.pressure + int(effect.get("pressure", 0)))

def update_rebellion_tracking(s: GameState, chosen_choice: dict):
    # 极端干预累计
    if chosen_choice.get("is_extreme", False):
        s.extreme_count += 1

    # 连续平衡窗口
    balanced = (abs(s.heaven - s.hell) <= REBELLION_BALANCE_DIFF) and (s.stability >= REBELLION_MIN_STABILITY)
    if balanced:
        s.consecutive_balance_count += 1
    else:
        s.consecutive_balance_count = 0

def apply_record_phase(s: GameState, record_probs):
    # 注意：pending_penalty 在“本回合开始”已处理，这里只决定下一回合是否罚
    items = list(record_probs.items())
    record_action = weighted_choice(items)

    if record_action == "truth":
        s.truth_counter += 1
        if s.truth_counter >= TRUTH_STREAK_TARGET:
            s.stability = clamp(s.stability + TRUTH_STREAK_BONUS)
            s.truth_counter = 0

    elif record_action == "polish":
        s.heaven = clamp(s.heaven + POLISH_HEAVEN_BONUS)
        s.truth_counter = 0

    elif record_action == "blur":
        s.hell = clamp(s.hell + BLUR_HELL_BONUS)
        s.truth_counter = 0

    elif record_action == "seal":
        s.pressure = max(0, s.pressure + SEAL_PRESSURE_DELTA)
        s.truth_counter = 0
        # 20%概率触发下一回合惩罚
        s.pending_penalty = (random.random() < SEAL_PENALTY_PROB)

    return record_action

def apply_pending_penalty_if_any(s: GameState):
    if s.pending_penalty:
        s.stability = clamp(s.stability + SEAL_PENALTY_STABILITY)
        s.heaven = clamp(s.heaven + SEAL_PENALTY_HEAVEN)
        s.pending_penalty = False

def judge_ending(s: GameState):
    # MVP判定顺序
    if s.stability < THRESH_STABILITY_COLLAPSE:
        return "Human Collapse"
    if s.heaven >= THRESH_HEAVEN_DOM:
        return "Heaven Dominance"
    if s.hell >= THRESH_HELL_DOM:
        return "Hell Dominance"
    if s.rebellion_flag and s.pressure < THRESH_REBELLION_PRESSURE:
        return "Human Rebellion"
    return "False Peace"

def run_one_game(events, rounds=7, record_probs=None):
    if record_probs is None:
        record_probs = DEFAULT_RECORD_PROBS
    record_probs = normalize_probs(record_probs)

    s = GameState(
        heaven=INITIAL_HEAVEN,
        hell=INITIAL_HELL,
        stability=INITIAL_STABILITY,
        pressure=INITIAL_PRESSURE
    )
    seq = build_run_sequence(events, rounds=rounds)

    for r in range(1, rounds + 1):
        s.round = r

        # 先处理上回合封存带来的延迟惩罚
        apply_pending_penalty_if_any(s)

        ev = seq[r - 1]
        choice = random.choice(ev["choices"])  # baseline: 随机策略
        apply_effect(s, choice.get("effect", {}))
        update_rebellion_tracking(s, choice)

        record_action = apply_record_phase(s, record_probs)

        # 回合基础压力增长
        s.pressure += PRESSURE_RAMP.get(r, 0)

        s.history.append({
            "round": r,
            "event_id": ev.get("id"),
            "choice_id": choice.get("id", "?"),
            "is_extreme": bool(choice.get("is_extreme", False)),
            "record_action": record_action,
            "snapshot": {
                "heaven": s.heaven,
                "hell": s.hell,
                "stability": s.stability,
                "pressure": s.pressure,
                "rebellion_flag": s.rebellion_flag
            }
        })

    s.rebellion_flag = (
        s.consecutive_balance_count >= REBELLION_STREAK_REQUIRED and
        s.extreme_count <= REBELLION_MAX_EXTREME_CHOICES
    )

    ending = judge_ending(s)
    return ending, s

def monte_carlo(events, n_runs=5000, rounds=7, seed=None, record_probs=None):
    if seed is not None:
        random.seed(seed)

    ending_counter = Counter()
    extreme_counts = []
    final_stats = []

    for _ in range(n_runs):
        ending, s = run_one_game(events, rounds=rounds, record_probs=record_probs)
        ending_counter[ending] += 1
        extreme_counts.append(s.extreme_count)
        final_stats.append((s.heaven, s.hell, s.stability, s.pressure, s.rebellion_flag))

    # 概率化
    ending_prob = {k: v / n_runs for k, v in ending_counter.items()}

    # 极端干预分布
    extreme_dist = Counter(extreme_counts)
    extreme_dist_prob = {k: v / n_runs for k, v in sorted(extreme_dist.items(), key=lambda x: x[0])}

    # 统计均值
    avg_heaven = mean([x[0] for x in final_stats])
    avg_hell = mean([x[1] for x in final_stats])
    avg_stability = mean([x[2] for x in final_stats])
    avg_pressure = mean([x[3] for x in final_stats])
    rebellion_flag_rate = mean([1 if x[4] else 0 for x in final_stats])

    summary = {
        "n_runs": n_runs,
        "ending_probabilities": ending_prob,
        "extreme_count_distribution": extreme_dist_prob,
        "avg_extreme_count": mean(extreme_counts) if extreme_counts else 0.0,
        "avg_final_heaven": avg_heaven,
        "avg_final_hell": avg_hell,
        "avg_final_stability": avg_stability,
        "avg_final_pressure": avg_pressure,
        "rebellion_flag_rate_before_final_check": rebellion_flag_rate
    }
    return summary

def print_report(summary):
    print("\n===== Monte Carlo Report =====")
    print(f"Runs: {summary['n_runs']}")
    print("\n[Ending Probabilities]")
    for ending in ["Heaven Dominance", "Hell Dominance", "Human Collapse", "Human Rebellion", "False Peace"]:
        p = summary["ending_probabilities"].get(ending, 0.0)
        print(f"  {ending:18s}: {p*100:6.2f}%")

    print("\n[Extreme Intervention Count Distribution]")
    for k, v in summary["extreme_count_distribution"].items():
        print(f"  extreme={k}: {v*100:6.2f}%")

    print("\n[Final State Means]")
    print(f"  Heaven   : {summary['avg_final_heaven']:.2f}")
    print(f"  Hell     : {summary['avg_final_hell']:.2f}")
    print(f"  Stability: {summary['avg_final_stability']:.2f}")
    print(f"  Pressure : {summary['avg_final_pressure']:.2f}")

    print("\n[Hidden Path Indicator]")
    print(f"  Rebellion flag rate (pre-final check): {summary['rebellion_flag_rate_before_final_check']*100:.2f}%")

    # 自动建议
    hr = summary["ending_probabilities"].get("Human Rebellion", 0.0)
    fp = summary["ending_probabilities"].get("False Peace", 0.0)

    print("\n[Tuning Suggestions]")
    if hr < 0.05:
        print("  - Human Rebellion 过低：可放宽阈值（如 Pressure<88）或降低平衡条件难度。")
    elif hr > 0.15:
        print("  - Human Rebellion 过高：可收紧阈值（如 Pressure<80）或提高极端干预诱惑。")
    else:
        print("  - Human Rebellion 位于目标区间（5%~15%）。")

    if fp > 0.70:
        print("  - False Peace 偏高：增加中后期极端事件波动，或提高结局分叉敏感度。")
    elif fp < 0.25:
        print("  - False Peace 偏低：可能首通体验过于尖锐，可微调为更常见兜底结局。")
    else:
        print("  - False Peace 占比合理。")

def main():
    parser = argparse.ArgumentParser(description="Monte Carlo simulator for Delay the End")
    parser.add_argument("--events", type=str, default="data/events.json", help="Path to events.json")
    parser.add_argument("--config", type=str, default="data/game-config.json", help="Path to game-config.json")
    parser.add_argument("--runs", type=int, default=5000, help="Number of simulation runs")
    parser.add_argument("--seed", type=int, default=None, help="Random seed")
    parser.add_argument("--truth", type=float, default=0.25, help="Record prob: truth")
    parser.add_argument("--polish", type=float, default=0.25, help="Record prob: polish")
    parser.add_argument("--blur", type=float, default=0.25, help="Record prob: blur")
    parser.add_argument("--seal", type=float, default=0.25, help="Record prob: seal")
    parser.add_argument("--export", type=str, default="", help="Export summary JSON path")
    args = parser.parse_args()

    config = load_game_config(args.config)
    apply_runtime_config(config)
    events = load_events(args.events)
    validate_events(events, rounds=DEFAULT_ROUNDS)

    record_probs = {
        "truth": args.truth,
        "polish": args.polish,
        "blur": args.blur,
        "seal": args.seal
    }

    summary = monte_carlo(
        events=events,
        n_runs=args.runs,
        rounds=DEFAULT_ROUNDS,
        seed=args.seed,
        record_probs=record_probs
    )
    print_report(summary)

    if args.export:
        with open(args.export, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        print(f"\n[Saved] summary -> {args.export}")

if __name__ == "__main__":
    main()
