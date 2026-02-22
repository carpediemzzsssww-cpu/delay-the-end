# Delay the End

> *You cannot stop what is written. You can only delay it.*

**Play → [delay-the-end.github.io](https://carpediemzzsssww-cpu.github.io/delay-the-end/)**　｜　**Case Study → [Portfolio](https://carpediemzzsssww-cpu.github.io/Iris/)**

---

A single-player narrative strategy game about being caught between Heaven and Hell — and choosing how to record history before time runs out.

Built solo in 7 days. Inspired by Terry Pratchett & Neil Gaiman's *Good Omens*.

![Static Badge](https://img.shields.io/badge/language-EN%20%2F%20ZH-blue) ![Static Badge](https://img.shields.io/badge/platform-web-lightgrey) ![Static Badge](https://img.shields.io/badge/build-vanilla%20JS-yellow)

---

## The Game

You are **The Archivist** — a neutral keeper of records, summoned as the apocalypse approaches. For 7 rounds, you navigate between celestial and infernal demands, making two decisions each round:

**1. Event Choice** — How you respond to each crisis (influences Heaven, Hell, and Stability scores)

**2. Archive Phase** — How you *record* what happened:
- `Truthful` — document events as they occurred
- `Embellished` — favor one faction's narrative
- `Obscured` — bury inconvenient facts
- `Sealed` — destroy the record entirely

The archive isn't just flavor. It's a second decision axis with mechanical weight.

---

## Endings

| Ending | Condition | Simulated Rate |
|---|---|---|
| Celestial Dominion | Heaven overwhelms | ~12% |
| Infernal Triumph | Hell overwhelms | ~8% |
| **False Peace** | Neither faction wins outright | **~69%** |
| Collapse | Stability hits zero | ~3% |
| **Human Rebellion** *(hidden)* | Consecutive balance across 5+ rounds | **~8%** |

> The hidden ending requires sustained neutrality — a nearly impossible condition under escalating pressure. Most players never find it naturally.

---

## Design Pillars

**Delay, Not Victory** — There is no correct ending. The game is about navigating an unwinnable situation with grace, not escaping it.

**The Archive as Agency** — Recording history *is* an action. The four archive options create a moral dimension independent of faction loyalty.

**Atmosphere Over Mechanics** — Deep ink backgrounds, parchment cards, gold serif typography. The cocoa-cup motif recurs as a quiet anchor of humanity amid celestial bureaucracy.

---

## Systems Design

```
Four numerical variables (0–100):
  Heaven    — celestial influence
  Hell      — infernal influence  
  Stability — world coherence
  Pressure  — accelerating schedule (+3 → +12 per round)

10 events × 3 choices × bilingual consequence texts = 30 micro-narratives
5 endings with distinct mechanical trigger conditions
```

Pressure escalates each round (3 → 4 → 5 → 6 → 8 → 10 → 12), creating a ticking-clock structure that forces increasingly costly decisions.

---

## Playtesting & Iteration

**18 playtesters** across 3 rounds (3 internal → 15 external)

Key findings:
- False Peace ending dominated at ~69% — confirmed by Monte Carlo simulation
- Hidden ending had 0% natural discovery rate — required atmospheric hint system
- Archive Phase comprehension gap — players didn't understand the mechanical difference between the four options
- Consequence texts (the strongest writing) were invisible — feedback only showed numbers, not narrative

**3-round iteration plan:**
1. Surface consequence narrative text in feedback system ← highest leverage
2. Visual differentiation for archive buttons (color-coded borders + tooltips)
3. Atmospheric hints when hidden-ending conditions are being met

---

## Validation

Balance verified via **Monte Carlo simulation** — `simulate_balance.py` runs 10,000 playthroughs to test ending distribution and identify dominant strategies.

```bash
python simulate_balance.py
# Output: ending distribution across 10,000 simulated runs
```

---

## Tech

```
index.html      — single-file game (~1,800 lines vanilla JS/CSS/HTML)
data/
  events.json       — 10 events × 3 choices × bilingual consequence texts
  endings.json      — 5 ending conditions and narrative text
  game-config.json  — tunable parameters (score weights, pressure curve)
simulate_balance.py — Monte Carlo balance validator
```

**Stack:** Vanilla JS · CSS · HTML · Python (simulation only)
**Deployment:** GitHub Pages

Game parameters (pressure escalation, score weights, ending thresholds) are separated into `game-config.json` for easy tuning without touching game logic.

---

## Run Locally

```bash
git clone https://github.com/carpediemzzsssww-cpu/delay-the-end.git
cd delay-the-end
# Open index.html in any browser — no build step required
```

---

## About

Built by **Iris Zhou** as part of an AI-assisted solo development sprint (Feb 13–20, 2026).

This project was designed to demonstrate product thinking through a complete creative artefact — narrative design, systems design, user testing, and data-driven iteration — built from scratch in one week.

→ Full case study with playtesting methodology and design reflections: **[Portfolio](https://carpediemzzsssww-cpu.github.io/Iris/)**
