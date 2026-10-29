#!/usr/bin/env python3
"""Monte Carlo simulator for Appendix 7B.

Mirrors the browser order: callbacks -> event selection -> choice -> stamp ->
pressure growth -> ending priority.
"""

from __future__ import annotations

import argparse
import json
import random
from collections import Counter
from copy import deepcopy
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
STATS = ("heaven", "hell", "human", "pressure")
RELATIONS = ("bond", "memory", "trust")
STRATEGIES = ("random", "heaven", "hell", "human", "relation")


def build_story(thread: dict[str, Any], legacy: list[dict[str, Any]], config: dict[str, Any]) -> dict[str, Any]:
    """Mirror buildStoryFromLegacy() in game.js."""
    source_by_id = {event["id"]: event for event in legacy}
    events: list[dict[str, Any]] = []
    for index, event_id in enumerate(thread["sequence"]):
        source = deepcopy(source_by_id[event_id])
        connective = deepcopy(thread["events"][event_id])
        round_number = index + 1
        choices = []
        for original in source["choices"]:
            choice = deepcopy(original)
            old_effect = choice["effect"]
            effect = {
                "heaven": old_effect.get("heaven", 0),
                "hell": old_effect.get("hell", 0),
                "human": old_effect.get("stability", 0),
                "pressure": old_effect.get("pressure", 0),
            }
            human_choice = effect["human"] >= 3
            heavy_echo = max(effect["heaven"], effect["hell"]) >= 8
            choice["effect"] = effect
            choice["relations"] = {
                "bond": 2 if event_id == "event_010" and choice["id"] == "B" else 1 if event_id == "event_010" and choice["id"] == "C" else 0,
                "memory": 1 if heavy_echo else 0,
                "trust": 1 if human_choice else -1 if effect["human"] < 0 else 0,
            }
            choice["set_flags"] = (["chose_human"] if human_choice else []) + (["protected_pair"] if event_id == "event_010" and choice["id"] == "B" else [])
            if effect["pressure"] >= 2 and connective.get("callback_zh") and round_number < config["rounds"]:
                choice["delayed"] = {
                    "id": f"{event_id}_{choice['id']}_return",
                    "due_offset": 2,
                    "text_zh": connective["callback_zh"],
                    "text_en": connective["callback_en"],
                    "effect": {"pressure": 1},
                    "relations": {"bond": 0, "memory": 1, "trust": 0},
                    "set_flags": [f"returned_{event_id}"],
                }
            choices.append(choice)
        source.update(connective)
        source.update({
            "fixed_round": round_number,
            "choices": choices,
            "crossref": {
                "text_zh": connective["crossref_zh"],
                "text_en": connective["crossref_en"],
                "effect": {"human": 1, "pressure": 1},
                "relations": {"bond": 1, "memory": 1, "trust": 0},
                "set_flags": [f"crossed_{event_id}"],
            },
        })
        events.append(source)
    return {"meta": thread["meta"], "events": events}


def clamp(value: float, low: float = 0, high: float = 100) -> float:
    return max(low, min(high, value))


def hash_string(value: str) -> int:
    """FNV-1a with the same uint32 overflow as game.js."""
    result = 2166136261
    for char in value:
        result ^= ord(char)
        result = (result * 16777619) & 0xFFFFFFFF
    return result


@dataclass
class RunState:
    seed: int
    stats: dict[str, float]
    relationships: dict[str, float] = field(default_factory=lambda: {"bond": 0, "memory": 0, "trust": 0})
    evidence: int = 0
    flags: list[str] = field(default_factory=list)
    sequence: dict[int, str] = field(default_factory=dict)
    pending: list[dict[str, Any]] = field(default_factory=list)
    selected_stamps: list[str] = field(default_factory=list)
    stamp_charges: dict[str, int] = field(default_factory=dict)
    history: list[dict[str, Any]] = field(default_factory=list)


class Simulator:
    def __init__(self, story: dict[str, Any], config: dict[str, Any]):
        self.story = story
        self.config = config
        self.events = story["events"]
        self.stamps = {stamp["id"]: stamp for stamp in config["stamps"]}

    def add_flags(self, state: RunState, flags: list[str] | None) -> None:
        for flag in flags or []:
            if flag not in state.flags:
                state.flags.append(flag)

    def apply_stats(self, state: RunState, effect: dict[str, Any] | None) -> None:
        for key in STATS:
            state.stats[key] = clamp(state.stats.get(key, 0) + float((effect or {}).get(key, 0)))

    def apply_relations(self, state: RunState, effect: dict[str, Any] | None) -> None:
        for key in RELATIONS:
            state.relationships[key] = clamp(
                state.relationships.get(key, 0) + float((effect or {}).get(key, 0)), -10, 20
            )

    @staticmethod
    def act_for_round(round_number: int) -> int:
        return 1 if round_number <= 3 else 2 if round_number <= 7 else 3

    def process_callbacks(self, state: RunState, round_number: int) -> None:
        due = [item for item in state.pending if item["dueRound"] <= round_number]
        state.pending = [item for item in state.pending if item["dueRound"] > round_number]
        for item in due:
            self.apply_stats(state, item.get("effect"))
            self.apply_relations(state, item.get("relations"))
            self.add_flags(state, item.get("set_flags"))

    def select_event(self, state: RunState, round_number: int) -> dict[str, Any]:
        fixed = next((event for event in self.events if event.get("fixed_round") == round_number), None)
        if fixed:
            state.sequence[round_number] = fixed["id"]
            return fixed
        act = self.act_for_round(round_number)
        used, flags = set(state.sequence.values()), set(state.flags)
        pool = [e for e in self.events if e.get("pool") and e["act"] == act and e["id"] not in used]

        def eligible(event: dict[str, Any]) -> bool:
            any_flags, all_flags = event.get("requires_any", []), event.get("requires_all", [])
            return (not any_flags or any(flag in flags for flag in any_flags)) and all(flag in flags for flag in all_flags)

        candidates = [event for event in pool if eligible(event)]
        if not candidates:
            candidates = [event for event in pool if not event.get("requires_any")]
        if not candidates:
            candidates = pool
        index = hash_string(f"{state.seed}:{round_number}:{','.join(sorted(flags))}") % len(candidates)
        event = candidates[index]
        state.sequence[round_number] = event["id"]
        return event

    @staticmethod
    def choice_score(choice: dict[str, Any], strategy: str) -> float:
        effect, rel = choice.get("effect", {}), choice.get("relations", {})
        if strategy == "heaven":
            return effect.get("heaven", 0) - .25 * effect.get("hell", 0) + .28 * effect.get("human", 0) - .12 * effect.get("pressure", 0)
        if strategy == "hell":
            return effect.get("hell", 0) - .25 * effect.get("heaven", 0) + .28 * effect.get("human", 0) - .12 * effect.get("pressure", 0)
        if strategy == "human":
            return 1.35 * effect.get("human", 0) - .42 * effect.get("pressure", 0) + .5 * rel.get("trust", 0) + .2 * rel.get("bond", 0)
        if strategy == "relation":
            return 2.8 * rel.get("bond", 0) + 1.9 * rel.get("trust", 0) + .65 * rel.get("memory", 0) + .42 * effect.get("human", 0) - .28 * effect.get("pressure", 0)
        return 0

    def choose(self, state: RunState, event: dict[str, Any], strategy: str, rng: random.Random) -> dict[str, Any]:
        if strategy == "random":
            return rng.choice(event["choices"])
        candidates = event["choices"]
        if strategy in ("heaven", "hell") and state.stats["human"] <= 45:
            safer = [choice for choice in candidates if choice.get("effect", {}).get("human", 0) >= 0]
            if safer:
                candidates = safer
        ranked = sorted(candidates, key=lambda choice: self.choice_score(choice, strategy), reverse=True)
        return rng.choice(event["choices"]) if rng.random() < .16 else ranked[0]

    def select_followup(self, event: dict[str, Any], strategy: str, rng: random.Random) -> dict[str, Any] | None:
        followup = event.get("followup")
        if not followup:
            return None
        answer_rate = .7 if strategy == "random" else .82 if strategy in ("heaven", "hell") else 1
        if rng.random() > answer_rate:
            return None
        answers = followup["answers"]
        if strategy == "random":
            return rng.choice(answers)
        if strategy == "relation":
            return max(answers, key=lambda answer: 3 * answer.get("relations", {}).get("bond", 0) + 2 * answer.get("relations", {}).get("trust", 0) + answer.get("evidence", 0))
        if strategy == "human":
            return max(answers, key=lambda answer: 2 * answer.get("relations", {}).get("trust", 0) + answer.get("evidence", 0))
        return rng.choice(answers)

    def stamp_loadout(self, strategy: str, rng: random.Random) -> list[str]:
        if strategy == "random":
            return rng.sample(list(self.stamps), 3)
        if strategy == "human":
            return ["truth", "redact", "seal"]
        if strategy == "relation":
            return ["truth", "crossref", "redact"]
        return ["truth", "crossref", "misfile"]

    def enabled_stamps(self, state: RunState, event: dict[str, Any], choice: dict[str, Any], pending_id: str | None) -> list[str]:
        enabled = []
        for stamp_id in state.selected_stamps:
            if state.stamp_charges.get(stamp_id, 0) <= 0:
                continue
            if stamp_id == "redact" and float(choice.get("effect", {}).get("pressure", 0)) <= 0:
                continue
            if stamp_id == "crossref" and not event.get("crossref"):
                continue
            if stamp_id == "seal" and not pending_id:
                continue
            enabled.append(stamp_id)
        return enabled

    def select_stamp(self, state: RunState, event: dict[str, Any], choice: dict[str, Any], pending_id: str | None, strategy: str, round_number: int, rng: random.Random) -> str | None:
        enabled = self.enabled_stamps(state, event, choice, pending_id)
        if not enabled:
            return None
        if strategy == "random":
            return rng.choice(enabled) if rng.random() < .42 else None
        if strategy == "human":
            if "truth" in enabled and state.evidence < 3:
                return "truth"
            if "redact" in enabled and (state.stats["pressure"] >= 48 or round_number >= 7):
                return "redact"
            if "seal" in enabled and state.stats["pressure"] >= 55:
                return "seal"
            return None
        if strategy == "relation":
            if "crossref" in enabled and state.relationships["bond"] < 5:
                return "crossref"
            if "truth" in enabled and state.evidence < 3:
                return "truth"
            if "redact" in enabled and (state.stats["pressure"] >= 56 or round_number >= 8):
                return "redact"
            return None
        if "crossref" in enabled and rng.random() < .55:
            return "crossref"
        if "truth" in enabled and rng.random() < .28:
            return "truth"
        return None

    def apply_stamp(self, state: RunState, stamp_id: str, event: dict[str, Any], choice: dict[str, Any], pending_id: str | None, round_number: int) -> None:
        state.stamp_charges[stamp_id] -= 1
        if stamp_id == "truth":
            self.apply_stats(state, {"human": 2, "pressure": 1})
            state.evidence += 1
        elif stamp_id == "redact":
            reduction = min(4, max(0, float(choice.get("effect", {}).get("pressure", 0))))
            self.apply_stats(state, {"human": -2, "pressure": -reduction})
            self.add_flags(state, ["audit_risk"])
            state.pending.append({
                "id": f"redaction_audit_{round_number}", "instanceId": f"redaction_audit:{round_number}",
                "sourceRound": round_number, "dueRound": min(self.config["rounds"], round_number + 2),
                "effect": {"heaven": 2, "human": -2, "pressure": 1},
                "relations": {"bond": 0, "memory": 1, "trust": -1}, "set_flags": ["redaction_reviewed"]
            })
        elif stamp_id == "crossref":
            crossref = event["crossref"]
            self.apply_stats(state, crossref.get("effect"))
            self.apply_relations(state, crossref.get("relations"))
            self.add_flags(state, crossref.get("set_flags"))
        elif stamp_id == "misfile":
            self.apply_stats(state, {"heaven": -3, "hell": 1} if state.stats["heaven"] >= state.stats["hell"] else {"hell": -3, "heaven": 1})
            self.add_flags(state, ["misfiled"])
        elif stamp_id == "seal":
            state.pending = [item for item in state.pending if item.get("instanceId") != pending_id]
            self.apply_stats(state, {"pressure": -5})
            self.add_flags(state, [f"sealed_{event['id']}"])

    def ending(self, state: RunState) -> str:
        stats, rel, th = state.stats, state.relationships, self.config["ending_thresholds"]
        if stats["human"] < th["human_blank_lt"]:
            return "human_blank"
        if stats["heaven"] >= th["double_echo_gte"] and stats["hell"] >= th["double_echo_gte"]:
            return "double_invasion"
        if stats["heaven"] >= th["dominance_gte"] and stats["heaven"] - stats["hell"] >= th["dominance_gap_gte"]:
            return "order_rewrite"
        if stats["hell"] >= th["dominance_gte"] and stats["hell"] - stats["heaven"] >= th["dominance_gap_gte"]:
            return "chaos_rewrite"
        ordinary = (
            stats["human"] >= th["ordinary_human_gte"] and stats["pressure"] < th["ordinary_pressure_lt"]
            and rel["bond"] >= th["ordinary_bond_gte"] and rel["trust"] >= th["ordinary_trust_gte"]
            and state.evidence >= th["ordinary_evidence_gte"]
            and abs(stats["heaven"] - stats["hell"]) <= th["ordinary_echo_gap_lte"]
        )
        return "ordinary_miracle" if ordinary else "appendix_sealed"

    def run(self, strategy: str, seed: int) -> tuple[str, RunState]:
        rng = random.Random((seed << 7) ^ hash_string(strategy))
        loadout = self.stamp_loadout(strategy, rng)
        state = RunState(seed=seed, stats=deepcopy(self.config["initial"]), selected_stamps=loadout)
        state.stamp_charges = {key: stamp["charges"] if key in loadout else 0 for key, stamp in self.stamps.items()}

        for round_number in range(1, self.config["rounds"] + 1):
            self.process_callbacks(state, round_number)
            event = self.select_event(state, round_number)
            choice = self.choose(state, event, strategy, rng)
            self.apply_stats(state, choice.get("effect"))
            self.apply_relations(state, choice.get("relations"))
            self.add_flags(state, choice.get("set_flags"))
            followup_answer = self.select_followup(event, strategy, rng)
            if followup_answer:
                self.apply_relations(state, followup_answer.get("relations"))
                self.add_flags(state, followup_answer.get("set_flags"))
                state.evidence += int(followup_answer.get("evidence", 0))
            pending_id = None
            if choice.get("delayed"):
                delayed = deepcopy(choice["delayed"])
                pending_id = f"{delayed['id']}:{round_number}:{len(state.history)}"
                delayed.update({"instanceId": pending_id, "sourceRound": round_number, "dueRound": min(self.config["rounds"], round_number + int(delayed.get("due_offset", 1)))})
                state.pending.append(delayed)
            stamp_id = self.select_stamp(state, event, choice, pending_id, strategy, round_number, rng)
            if stamp_id:
                self.apply_stamp(state, stamp_id, event, choice, pending_id, round_number)
            self.apply_stats(state, {"pressure": self.config["pressure_growth"][round_number - 1]})
            state.history.append({"round": round_number, "eventId": event["id"], "choiceId": choice["id"], "followupAnswerId": followup_answer.get("id") if followup_answer else None, "stampId": stamp_id})
        return self.ending(state), state


def validate(story: dict[str, Any], config: dict[str, Any], endings: dict[str, Any]) -> None:
    assert len(story.get("events", [])) == 10, "Expected exactly 10 original story nodes"
    assert len(endings.get("endings", [])) == 6, "Expected exactly 6 endings"
    assert len(config.get("pressure_growth", [])) == config.get("rounds") == 10
    ids: set[str] = set()
    for event in story["events"]:
        assert event["id"] not in ids, f"Duplicate event id: {event['id']}"
        ids.add(event["id"])
        assert len(event.get("choices", [])) == 3, f"{event['id']} must have three choices"
        for choice in event["choices"]:
            for key in ("label_zh", "label_en", "consequence_zh", "consequence_en", "effect"):
                assert choice.get(key) is not None, f"Missing {key} in {event['id']}/{choice.get('id')}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Simulate Appendix 7B balance")
    parser.add_argument("--runs", type=int, default=5000, help="Runs per strategy")
    parser.add_argument("--seed", type=int, default=20260831)
    parser.add_argument("--output", type=Path, default=ROOT / "data" / "balance-report-v3.json")
    args = parser.parse_args()
    config = json.loads((ROOT / "data/game-config-v2.json").read_text(encoding="utf-8"))
    thread = json.loads((ROOT / "data/story-thread-v3.json").read_text(encoding="utf-8"))
    legacy = json.loads((ROOT / "data/events.json").read_text(encoding="utf-8"))
    story = build_story(thread, legacy, config)
    endings = json.loads((ROOT / "data/endings-v2.json").read_text(encoding="utf-8"))
    validate(story, config, endings)
    simulator = Simulator(story, config)
    report: dict[str, Any] = {"runs_per_strategy": args.runs, "seed": args.seed, "strategies": {}, "reachable_endings": [], "example_seeds": {}}
    reachable, examples = set(), {}

    for strategy_index, strategy in enumerate(STRATEGIES):
        counts, totals = Counter(), Counter()
        for index in range(args.runs):
            seed = args.seed + strategy_index * args.runs + index
            ending_id, state = simulator.run(strategy, seed)
            counts[ending_id] += 1
            reachable.add(ending_id)
            for key in STATS:
                totals[key] += state.stats[key]
            examples.setdefault(ending_id, {"strategy": strategy, "seed": seed, "history": state.history})
        report["strategies"][strategy] = {
            "endings": {key: round(value / args.runs, 4) for key, value in sorted(counts.items())},
            "mean_final_stats": {key: round(totals[key] / args.runs, 2) for key in STATS},
        }
    report["reachable_endings"], report["example_seeds"] = sorted(reachable), examples
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Validated 10 original nodes; {args.runs} runs × {len(STRATEGIES)} strategies")
    for strategy in STRATEGIES:
        outcomes = report["strategies"][strategy]["endings"]
        print(strategy.ljust(9), " ".join(f"{key}={value:.1%}" for key, value in outcomes.items()))
    print("Reachable:", ", ".join(report["reachable_endings"]))
    print("Report:", args.output)


if __name__ == "__main__":
    main()
