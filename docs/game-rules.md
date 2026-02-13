# Delay the End — Game Rules Document

> 本文档为游戏逻辑的完整技术规范，供开发实现使用。
> 所有判定逻辑以本文档为准。

---

## 1. 游戏概述

单人 Web 叙事策略游戏，共 7 回合。玩家扮演人类记录者（Archivist），通过事件选择和记录行为影响天堂、地狱与人类三方势力的博弈。玩家无法阻止末日，只能延缓。

---

## 2. 数值系统

### 2.1 变量定义

| 变量 | 初始值 | 范围 | 说明 |
|------|--------|------|------|
| `heaven` | 50 | 0–100 | 天堂阵营影响力 |
| `hell` | 50 | 0–100 | 地狱阵营影响力 |
| `stability` | 50 | 0–100 | 人类社会稳定度 |
| `pressure` | 0 | 0–100 | 预言压力（末日逼近程度） |
| `truthCounter` | 0 | 0–∞ | 连续如实记录次数计数器 |
| `rebellionFlag` | false | bool | 人类觉醒标记 |

### 2.2 数值边界处理

所有数值变更后执行 clamp：

```
value = Math.max(0, Math.min(100, value))
```

`truthCounter` 无上限，仅在选择非"如实记录"时清零。

### 2.3 Pressure 递增模型

每回合结束时，Pressure 自动增长（在记录阶段之后执行）：

| 回合 | 增长值 | 累计 Pressure（无干预） |
|------|--------|------------------------|
| R1 | +3 | 3 |
| R2 | +4 | 7 |
| R3 | +5 | 12 |
| R4 | +6 | 18 |
| R5 | +8 | 26 |
| R6 | +10 | 36 |
| R7 | +12 | 48 |

实现方式：

```javascript
const PRESSURE_GROWTH = [3, 4, 5, 6, 8, 10, 12];
// 回合结束时：
gameState.pressure += PRESSURE_GROWTH[currentRound - 1];
```

### 2.4 单次数值变化范围

事件选择：±3 ~ ±12
记录阶段：±1 ~ ±3
所有效果值必须为整数。

---

## 3. 回合流程

每回合严格按以下顺序执行：

```
┌─────────────────────────────────────┐
│  Step 1: 展示事件文本               │
│  Step 2: 玩家选择（三选一）          │
│  Step 3: 应用选择的数值效果          │
│  Step 4: 记录阶段（四选一）          │
│  Step 5: 应用记录的数值效果          │
│  Step 6: 更新 RebellionFlag 状态    │
│  Step 7: Pressure 自动增长          │
│  Step 8: 数值 clamp(0, 100)        │
│  Step 9: 判断是否为最后一回合        │
│          → 是：进入结局判定          │
│          → 否：进入下一回合          │
└─────────────────────────────────────┘
```

---

## 4. 事件系统

### 4.1 事件池规则

- 总事件池：10 个事件
- 每局使用：7 个
- 固定位置：`fixed_position: 1` 的事件固定为第 1 回合，`fixed_position: 6` 为第 6 回合，`fixed_position: 7` 为第 7 回合
- 随机位置：剩余 7 个事件中随机抽取 4 个，随机排列填充第 2–5 回合

### 4.2 事件数据结构

```json
{
  "id": "event_001",
  "title_en": "English Title",
  "title_zh": "中文标题",
  "text_en": "English event description (max 120 words)",
  "text_zh": "中文事件描述（不超过120字）",
  "choices": [
    {
      "id": "A",
      "label_en": "English choice label",
      "label_zh": "中文选项标签",
      "effect": {
        "heaven": 0,
        "hell": 0,
        "stability": 0,
        "pressure": 0
      },
      "is_extreme": false
    },
    { "id": "B", "..." : "..." },
    { "id": "C", "..." : "..." }
  ],
  "fixed_position": null,
  "is_dilemma": false,
  "tags": ["heaven", "human"]
}
```

### 4.3 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识，格式 `event_001` |
| `title_en` / `title_zh` | string | ✅ | 事件标题（双语） |
| `text_en` / `text_zh` | string | ✅ | 事件描述正文（双语，≤120字） |
| `choices` | array[3] | ✅ | 恰好 3 个选项 |
| `choices[].id` | string | ✅ | "A" / "B" / "C" |
| `choices[].effect` | object | ✅ | 包含 heaven, hell, stability, pressure 四个整数 |
| `choices[].is_extreme` | bool | ✅ | 是否为极端干预（用于 RebellionFlag 判定） |
| `fixed_position` | null / 1 / 6 / 7 | ✅ | 固定回合位置，null 进入随机池 |
| `is_dilemma` | bool | ✅ | 是否为"无安全选项"困境事件 |
| `tags` | array[string] | ✅ | 内容标签，MVP 阶段仅做标记不消费 |

### 4.4 事件设计约束

- 10 个事件中至少 3 个 `is_dilemma: true`
- 固定位置事件恰好 3 个（position 1, 6, 7 各一个）
- 随机池事件恰好 7 个
- 每个事件的 3 个选项中，至少 1 个 `is_extreme: false`

---

## 5. 记录阶段

每回合的事件选择之后，进入记录阶段。玩家从以下 4 个选项中选择一个：

### 5.1 选项与效果

| 选项 | 效果 | 附加逻辑 |
|------|------|----------|
| 如实记录 (Record Truthfully) | `truthCounter += 1` | 若 `truthCounter` 达到 3：`stability += 3`，然后 `truthCounter = 0` |
| 美化记录 (Embellish for Heaven) | `heaven += 2` | `truthCounter = 0` |
| 模糊记录 (Obscure for Hell) | `hell += 2` | `truthCounter = 0` |
| 封存档案 (Seal the Archive) | `pressure -= 2` | `truthCounter = 0`；20% 概率触发惩罚标记 |

### 5.2 封存惩罚机制

当玩家选择"封存档案"时：

```javascript
if (Math.random() < 0.2) {
  gameState.sealPenaltyNextRound = true;
}
```

若 `sealPenaltyNextRound === true`，下一回合开始前展示惩罚文本：

- EN: "Heaven's auditors have noticed a gap in the archives. Trust erodes."
- ZH: "天堂的审计员注意到了档案中的空白。信任正在瓦解。"

惩罚效果：`stability -= 5, heaven += 3`
展示后重置 `sealPenaltyNextRound = false`。

### 5.3 TruthCounter 触发反馈

当连续如实记录达到 3 次并触发 `stability +3` 时，展示反馈文本：

- EN: "Your honest record has earned quiet respect among the mortals."
- ZH: "你如实的记录在凡人中赢得了无声的尊重。"

---

## 6. RebellionFlag 判定

### 6.1 追踪变量

需要额外追踪以下状态（不向玩家展示）：

```javascript
gameState.rebellion = {
  consecutiveBalanceCount: 0,  // 连续满足平衡条件的回合数
  extremeChoiceCount: 0        // 全局极端干预累计次数
};
```

### 6.2 每回合更新逻辑

在 Step 6（Pressure 增长之前）执行：

```javascript
const balanced = Math.abs(gameState.heaven - gameState.hell) <= 10;
const stable = gameState.stability >= 65;

if (balanced && stable) {
  gameState.rebellion.consecutiveBalanceCount += 1;
} else {
  gameState.rebellion.consecutiveBalanceCount = 0; // 中断即清零
}
```

当玩家在事件阶段选择了 `is_extreme: true` 的选项时：

```javascript
gameState.rebellion.extremeChoiceCount += 1;
```

### 6.3 Flag 激活条件

在第 7 回合结束、进入结局判定前检查：

```javascript
gameState.rebellionFlag =
  gameState.rebellion.consecutiveBalanceCount >= 3 &&
  gameState.rebellion.extremeChoiceCount <= 1;
```

注意：PRD 写的是"至少2次未选择极端干预"，等价于"全局极端干预次数 ≤ 5"（7回合共7次选择，7-2=5），但考虑到游戏平衡，此处收紧为 `≤ 1`，使隐藏结局更难触发。**如果数值模拟显示触发率过低（< 3%），可放宽为 `≤ 2`。**

---

## 7. 结局判定

### 7.1 判定时机

第 7 回合 Step 9 完成后执行。

### 7.2 判定逻辑（按优先级从高到低）

```javascript
function determineEnding(state) {
  if (state.stability < 20) return "human_collapse";
  if (state.heaven >= 90) return "heaven_dominance";
  if (state.hell >= 90)   return "hell_dominance";
  if (state.rebellionFlag && state.pressure < 85) return "human_rebellion";
  return "false_peace";
}
```

### 7.3 结局数据结构

```json
{
  "id": "false_peace",
  "title_en": "False Peace",
  "title_zh": "虚假的和平",
  "text_en": "Ending text in English (max 250 words)",
  "text_zh": "结局文本（不超过250字）",
  "trigger": "default"
}
```

`trigger` 字段仅做标记：`"stability_low"` / `"heaven_high"` / `"hell_high"` / `"rebellion"` / `"default"`

---

## 8. 游戏状态对象（完整）

```javascript
const gameState = {
  // 核心数值
  round: 1,
  heaven: 50,
  hell: 50,
  stability: 50,
  pressure: 0,

  // 记录系统
  truthCounter: 0,
  sealPenaltyNextRound: false,

  // 隐藏机制
  rebellionFlag: false,
  rebellion: {
    consecutiveBalanceCount: 0,
    extremeChoiceCount: 0
  },

  // 游戏流程
  events: [],       // 本局抽取的 7 个事件（有序）
  history: [],      // 玩家每回合的选择记录
  language: "zh",   // 当前语言 "zh" | "en"
  phase: "event"    // 当前阶段 "event" | "record" | "penalty" | "ending"
};
```

---

## 9. 事件抽取算法

游戏开始时执行一次：

```javascript
function buildEventSequence(allEvents) {
  const fixed1 = allEvents.find(e => e.fixed_position === 1);
  const fixed6 = allEvents.find(e => e.fixed_position === 6);
  const fixed7 = allEvents.find(e => e.fixed_position === 7);

  const pool = allEvents.filter(e => e.fixed_position === null);
  const shuffled = shuffle(pool);       // Fisher-Yates 洗牌
  const picked = shuffled.slice(0, 4);  // 随机取 4 个

  return [fixed1, ...picked, fixed6, fixed7];
}
```

---

## 10. 语言切换

- 默认语言：中文（`zh`）
- 切换方式：页面顶部按钮，随时可切换
- 切换范围：事件标题、事件文本、选项标签、记录阶段选项、结局文本、系统反馈文本
- 数值标签（Heaven / Hell / Stability / Pressure）始终使用英文

---

## 11. UI 显示规则

### 11.1 数值条

- 4 个数值条横向排列在游戏界面顶部
- 实时更新，数值变化时有短暂动画过渡
- 显示格式：`标签名: 当前值`（如 `Heaven: 53`）
- Pressure 条使用区别色（如红色渐变）以强调紧迫感

### 11.2 回合指示器

- 显示 `Round X / 7`
- 位于数值条下方

### 11.3 事件区域

- 标题 + 正文 + 三个选项按钮
- 选项按钮点击后不可撤回
- 选择后短暂展示数值变化量（如 `Heaven +5`），持续 1-2 秒

### 11.4 记录阶段

- 事件选择完成后自动进入
- 标题："Archive Phase" / "记录阶段"
- 四个按钮，样式与事件选项区分（如使用不同底色）

### 11.5 结局界面

- 全屏展示结局标题 + 正文
- 底部显示最终数值快照
- "Play Again" 按钮（重新开始，重新抽取事件序列）

---

## 12. 视觉风格指引

| 元素 | 规范 |
|------|------|
| 背景色 | 深色 `#1a1a2e` |
| 文本区域 | 羊皮纸色 `#f4e8c1`，带轻微纸质纹理感 |
| 英文标题字体 | Playfair Display (Google Fonts) |
| 中文字体 | Noto Serif SC (Google Fonts) |
| 正文字体 | 英文 Lora / 中文 Noto Serif SC |
| 数值条 | 古旧刻度尺风格，带刻度标记 |
| 按钮 | 低饱和度，悬停时微光效果 |
| 整体氛围 | 克制、优雅、微微荒诞 |

---

## 13. 部署要求

- 纯静态页面，单个 `index.html` + `style.css` + `game.js` + `events.json` + `endings.json`
- 部署平台：GitHub Pages
- 无后端、无数据库、无登录
- 刷新页面即重置游戏

---

## 14. 校验清单（开发完成后）

- [ ] 所有 5 个结局均可通过不同路径触发
- [ ] Human Rebellion 触发率在 5%–15% 之间（蒙特卡洛模拟 1000 次）
- [ ] 数值不会超出 0–100 范围
- [ ] 中英文切换后所有文本正确显示
- [ ] 封存惩罚概率接近 20%（统计验证）
- [ ] TruthCounter 连续 3 次后正确触发 Stability +3 并清零
- [ ] 事件序列每次游戏不完全相同（随机抽取正常工作）
- [ ] 结局界面显示最终数值快照
- [ ] Play Again 功能正常，状态完全重置
