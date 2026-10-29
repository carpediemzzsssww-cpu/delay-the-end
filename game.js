const DATA_PATHS = {
  thread: "./data/story-thread-v3.json",
  endings: "./data/endings-v2.json",
  config: "./data/game-config-v2.json",
  legacy: "./data/events.json"
};

const STORAGE = {
  save: "delay-end-save-v3",
  legacySave: "delay-end-save-v2",
  collection: "delay-end-collection-v2",
  settings: "delay-end-settings-v2",
  spoiler: "delay-end-spoiler-v2"
};

const UI = {
  zh: {
    landingEyebrow: "一个关于选择之后的故事",
    edition: "附录 7B",
    landingLede: "世界已经被重写。可伦敦正在重复十件本该消失的事。",
    landingSpoiler: "承接《好兆头》最终篇，包含重大剧透。",
    landingNote: "最后一页会记住你写下的版本。",
    fanwork: "非商业同人作品 · 与原版权方无关",
    newArchive: "开始故事",
    continueArchive: "继续上次选择",
    collection: "已读内容",
    worldGuide: "这局在做什么",
    yourGoal: "这一局要做什么",
    premiseShort: "十份旧报告正在伦敦成真。找到它们之间的联系，然后写下最后一页。",
    storySoFar: "故事进行到这里",
    round: "回合",
    heaven: "天堂回响",
    hell: "地狱回响",
    human: "人间自由",
    pressure: "重写压力",
    bondThread: "两条普通的人生",
    menu: "菜单",
    classification: "伦敦异常记录",
    filedAs: "你的选择带来了",
    optionalAction: "想再做一步？",
    applyStamp: "使用一种处理方式",
    stampHint: "可跳过",
    activeNotes: "已经留下的影响",
    continueRecord: "继续下一回",
    continueAfterStamp: "处理完成，继续下一回",
    finalDisposition: "故事的结尾",
    understood: "继续",
    spoilerTitle: "开始前的一句提醒",
    spoilerBody: "故事承接最终篇：世界被重写，两位主角开始了新的生活。",
    spoilerAgree: "我已看过最终篇，或愿意继续阅读剧透内容。",
    acknowledge: "确认并继续",
    stampSetupTitle: "带上三种处理方式",
    stampSetupBody: "它们能在选择之后稍微改变结果。次数有限，也可以完全不用。",
    selectedCount: "已选择",
    startWithStamps: "开始第一回",
    guideTitle: "这次到底发生了什么？",
    guideIntro: "世界被重写后，十份关于天堂与地狱的旧报告开始在伦敦成真。你处理每一件事，最后决定旧世界要不要回来。",
    collectionTitle: "已经读过的内容",
    discoveredEvents: "已发现事件",
    discoveredEndings: "已发现结局",
    residualArchive: "旧宇宙残档",
    residualArchiveNote: "首次完成一份附录后解锁；只供阅读，不提供永久加成。",
    runs: "完成周目",
    outcomes: "结果",
    lockedEnding: "尚未归档",
    menuTitle: "档案员菜单",
    resume: "返回当前页",
    restart: "放弃当前记录并重新开始",
    restartConfirm: "当前周目的进度会被覆盖。再次点击以确认。",
    fullscreen: "切换全屏",
    noFlags: "页边暂时没有可辨认的批注。",
    callbacks: "之前的选择回来了",
    delayedRegistered: "这个选择还没有结束，之后会再次出现。",
    stampApplied: "处理方式已生效",
    stampUnavailable: "这枚印章当前无法使用。",
    noCharges: "次数已用尽",
    chapterContinue: "进入下一幕",
    chapterArchive: "故事进入下一幕",
    loadError: "档案无法打开",
    loadErrorBody: "无法加载游戏数据。请通过本地静态服务器或 GitHub Pages 运行。",
    tutorialStats: "顶部四个数值会随选择变化。点击任意一项可看它的含义。",
    tutorialChoices: "选择前只看方向，选择后才会显示准确变化。也可以按数字键 1–3。",
    tutorialStamps: "处理方式是可选的。想保留次数，直接继续就好。",
    secret: "隐藏归档",
    returnLanding: "返回封面",
    languageName: "English",
    evidence: "线索",
    bondLow: "他们尚未想起彼此。",
    bondMid: "两条生活开始共享同一处页边。",
    bondHigh: "他们再次选择站在同一页上。"
  },
  en: {
    landingEyebrow: "A STORY ABOUT WHAT COMES AFTER THE CHOICE",
    edition: "APPENDIX 7B",
    landingLede: "The world was rewritten. London is repeating ten events that should no longer exist.",
    landingSpoiler: "Continues the Good Omens finale and contains major spoilers.",
    landingNote: "The last page will remember the version you write.",
    fanwork: "Non-commercial fan work · Unaffiliated with the rights holders",
    newArchive: "Begin the Story",
    continueArchive: "Continue Your Choices",
    collection: "What You've Read",
    worldGuide: "What Am I Doing?",
    yourGoal: "YOUR GOAL",
    premiseShort: "Ten old reports are coming true across London. Find their connection, then write the last page.",
    storySoFar: "THE STORY SO FAR",
    round: "Round",
    heaven: "Heaven Echo",
    hell: "Hell Echo",
    human: "Human Freedom",
    pressure: "Rewrite Pressure",
    bondThread: "Two ordinary lives",
    menu: "Menu",
    classification: "LONDON ANOMALY",
    filedAs: "Your choice caused",
    optionalAction: "One more thing?",
    applyStamp: "Use a response method",
    stampHint: "Optional",
    activeNotes: "Effects left behind",
    continueRecord: "Continue to the next chapter",
    continueAfterStamp: "Response applied · Continue",
    finalDisposition: "The End of the Story",
    understood: "Continue",
    spoilerTitle: "One Note Before You Begin",
    spoilerBody: "The story follows the finale: the world was rewritten and the two protagonists began new lives.",
    spoilerAgree: "I have seen the finale, or I choose to continue with spoilers.",
    acknowledge: "Confirm and Continue",
    stampSetupTitle: "Take Three Response Methods",
    stampSetupBody: "They can slightly alter a result after a choice. Uses are limited, and using none is fine.",
    selectedCount: "Selected",
    startWithStamps: "Begin Chapter One",
    guideTitle: "What Is Actually Happening?",
    guideIntro: "After the world was rewritten, ten old reports about Heaven and Hell began coming true across London. Deal with each one, then decide whether the old world should return.",
    collectionTitle: "What You've Already Read",
    discoveredEvents: "Events discovered",
    discoveredEndings: "Endings discovered",
    residualArchive: "Old-Universe Fragments",
    residualArchiveNote: "Unlocked after the first completed Appendix; readable only, with no permanent bonus.",
    runs: "Runs completed",
    outcomes: "outcomes",
    lockedEnding: "Not yet filed",
    menuTitle: "Archivist Menu",
    resume: "Return to current page",
    restart: "Abandon this record and start again",
    restartConfirm: "This run will be overwritten. Click again to confirm.",
    fullscreen: "Toggle fullscreen",
    noFlags: "No legible marginalia yet.",
    callbacks: "An earlier choice has returned",
    delayedRegistered: "This choice is not over. It will return later.",
    stampApplied: "Response applied",
    stampUnavailable: "This stamp cannot be used on the current page.",
    noCharges: "No charges remaining",
    chapterContinue: "Enter the next act",
    chapterArchive: "THE NEXT PART OF THE STORY",
    loadError: "The Archive Would Not Open",
    loadErrorBody: "Game data could not be loaded. Run the project through a local static server or GitHub Pages.",
    tutorialStats: "The four numbers at the top change with your choices. Select one to see what it means.",
    tutorialChoices: "You see directions before choosing and exact changes afterwards. Number keys 1–3 also work.",
    tutorialStamps: "Response methods are optional. Continue directly if you want to save them.",
    secret: "Secret file",
    returnLanding: "Return to cover",
    languageName: "中文",
    evidence: "Clues",
    bondLow: "They have not remembered one another.",
    bondMid: "Two lives begin sharing the same margin.",
    bondHigh: "They choose to stand on the same page again."
  }
};

const STAT_DESCRIPTIONS = {
  zh: {
    heaven: "秩序、服从与完美计划的旧回响；它不等于善良。",
    hell: "欲望、混乱与自我意志的旧回响；它不等于自由。",
    human: "人类犯错、犹豫、改变并自行选择的能力。",
    pressure: "旧宇宙覆盖新现实的速度；越高，重写越难阻止。"
  },
  en: {
    heaven: "The old echo of order, obedience, and perfect Plans; it is not goodness.",
    hell: "The old echo of appetite, chaos, and self-will; it is not freedom.",
    human: "Humanity's capacity to err, hesitate, change, and choose for itself.",
    pressure: "How quickly the old universe overwrites reality; higher means harder to stop."
  }
};

const FLAG_LABELS = {
  zh: {
    chose_human: "多次把决定交还人间",
    protected_pair: "保护两段普通人生",
    fed_memory: "旧记忆正在变得清晰",
    appeal_open: "旧机构的申诉通道仍开启",
    human_consultation: "人类意见进入正式档案",
    index_public: "创世索引已经公开",
    audit_risk: "删节引来审计风险",
    misfiled: "阵营回响被错置归档",
    third_handwriting: "页边出现第三种笔迹",
    final_margin: "最后一页保留空白",
    memory_restored: "两人已恢复旧记忆",
    choice_remembered: "他们记得曾经选择彼此",
    memory_in_trust: "旧记忆被暂时托管",
    finished_dessert: "宇宙学等了一份甜点",
    margins_promoted: "人类批注成为正文",
    migrated_v1: "旧版记录已迁入附录 7B"
  },
  en: {
    chose_human: "Decisions repeatedly returned to humanity",
    protected_pair: "Two ordinary lives protected",
    fed_memory: "Old memory is becoming legible",
    appeal_open: "The old institutions may still appeal",
    human_consultation: "Human opinion entered the official file",
    index_public: "The creation index is public",
    audit_risk: "Redactions attracted an audit risk",
    misfiled: "Faction echoes were deliberately misfiled",
    third_handwriting: "A third handwriting appeared",
    final_margin: "The final page retains a margin",
    memory_restored: "Their old memories have returned",
    choice_remembered: "They remember choosing one another",
    memory_in_trust: "Old memory is held in trust",
    finished_dessert: "Cosmology waited for dessert",
    margins_promoted: "Human annotations became the main text",
    migrated_v1: "A legacy save was migrated into Appendix 7B"
  }
};

const SAVE_VERSION = 3;
const STATS = ["heaven", "hell", "human", "pressure"];
const TEST_MODE = new URLSearchParams(location.search).get("test") === "1";

let story = null;
let threadData = null;
let endingData = null;
let config = null;
let legacyEvents = [];
let state = null;
let collection = null;
let language = "zh";
let toastTimer = null;
let lastFocusedElement = null;
let restartArmed = false;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const t = (key) => UI[language][key] ?? UI.zh[key] ?? key;
const localText = (item, key) => item?.[`${key}_${language}`] ?? item?.[`${key}_zh`] ?? "";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const cacheKey = TEST_MODE ? "test" : String(Date.now());
    const [threadRes, endingsRes, configRes, legacyRes] = await Promise.all([
      fetch(`${DATA_PATHS.thread}?v=${cacheKey}`, { cache: "no-store" }),
      fetch(`${DATA_PATHS.endings}?v=${cacheKey}`, { cache: "no-store" }),
      fetch(`${DATA_PATHS.config}?v=${cacheKey}`, { cache: "no-store" }),
      fetch(`${DATA_PATHS.legacy}?v=${cacheKey}`, { cache: "no-store" })
    ]);
    if (!threadRes.ok || !endingsRes.ok || !configRes.ok || !legacyRes.ok) throw new Error("data fetch failed");
    [threadData, endingData, config, legacyEvents] = await Promise.all([threadRes.json(), endingsRes.json(), configRes.json(), legacyRes.json()]);
    story = buildStoryFromLegacy(threadData, legacyEvents);
    validateData();
    collection = loadCollection();
    const settings = readJSON(STORAGE.settings, {});
    language = settings.language === "en" ? "en" : "zh";
    state = loadSavedState();
    if (state?.language) language = state.language;
    bindEvents();
    applyLanguage();
    renderLanding();
    installTestHooks();
  } catch (error) {
    console.error(error);
    renderFatalError();
  }
}

function validateData() {
  if (!Array.isArray(story?.events) || story.events.length !== 10) {
    throw new Error("The story must contain the 10 original events");
  }
  if (!Array.isArray(endingData?.endings) || endingData.endings.length !== 6) {
    throw new Error("endings-v2.json must contain exactly 6 endings");
  }
  if (!Array.isArray(legacyEvents) || legacyEvents.length !== 10) {
    throw new Error("events.json must retain the 10 old-universe fragments");
  }
  const ids = new Set();
  for (const event of story.events) {
    if (!event.id || ids.has(event.id) || !Array.isArray(event.choices) || event.choices.length !== 3) {
      throw new Error(`Invalid event node: ${event.id || "unknown"}`);
    }
    ids.add(event.id);
    for (const choice of event.choices) {
      if (!choice.id || !choice.label_zh || !choice.label_en || !choice.consequence_zh || !choice.consequence_en) {
        throw new Error(`Incomplete bilingual choice in ${event.id}`);
      }
      if (!choice.effect || STATS.some((key) => choice.effect[key] !== undefined && !Number.isFinite(Number(choice.effect[key])))) {
        throw new Error(`Invalid choice effect in ${event.id}/${choice.id}`);
      }
      if (choice.delayed && (!choice.delayed.id || !choice.delayed.text_zh || !choice.delayed.text_en || !choice.delayed.effect)) {
        throw new Error(`Invalid delayed callback in ${event.id}/${choice.id}`);
      }
    }
    if (event.crossref && (!event.crossref.text_zh || !event.crossref.text_en || !event.crossref.effect)) {
      throw new Error(`Invalid cross-reference in ${event.id}`);
    }
  }
}

function buildStoryFromLegacy(thread, legacy) {
  const sourceById = new Map((legacy || []).map((event) => [event.id, event]));
  const events = (thread?.sequence || []).map((id, index) => {
    const source = sourceById.get(id);
    const connective = thread?.events?.[id];
    if (!source || !connective) throw new Error(`Missing original event or story link: ${id}`);
    const round = index + 1;
    const choices = source.choices.map((choice) => {
      const effect = {
        heaven: Number(choice.effect?.heaven || 0),
        hell: Number(choice.effect?.hell || 0),
        human: Number(choice.effect?.stability || 0),
        pressure: Number(choice.effect?.pressure || 0)
      };
      const humanChoice = effect.human >= 3;
      const heavyEcho = Math.max(effect.heaven, effect.hell) >= 8;
      const relations = {
        bond: id === "event_010" && choice.id === "B" ? 2 : id === "event_010" && choice.id === "C" ? 1 : 0,
        memory: heavyEcho ? 1 : 0,
        trust: humanChoice ? 1 : effect.human < 0 ? -1 : 0
      };
      const setFlags = [];
      if (humanChoice) setFlags.push("chose_human");
      if (id === "event_010" && choice.id === "B") setFlags.push("protected_pair");
      const delayed = effect.pressure >= 2 && connective.callback_zh && round < config.rounds
        ? {
            id: `${id}_${choice.id}_return`,
            due_offset: 2,
            text_zh: connective.callback_zh,
            text_en: connective.callback_en,
            effect: { pressure: 1 },
            relations: { bond: 0, memory: 1, trust: 0 },
            set_flags: [`returned_${id}`]
          }
        : null;
      return {
        ...choice,
        effect,
        relations,
        set_flags: setFlags,
        ...(delayed ? { delayed } : {})
      };
    });
    return {
      ...source,
      ...connective,
      fixed_round: round,
      choices,
      crossref: {
        text_zh: connective.crossref_zh,
        text_en: connective.crossref_en,
        effect: { human: 1, pressure: 1 },
        relations: { bond: 1, memory: 1, trust: 0 },
        set_flags: [`crossed_${id}`]
      }
    };
  });
  return { meta: thread.meta, events };
}

function bindEvents() {
  $("#new-game-btn").addEventListener("click", requestNewGame);
  $("#continue-btn").addEventListener("click", resumeGame);
  $("#collection-btn").addEventListener("click", openCollection);
  $("#guide-btn").addEventListener("click", openGuide);
  $("#continue-round-btn").addEventListener("click", completeRound);
  $("#mobile-continue").addEventListener("click", completeRound);
  $("#tutorial-next").addEventListener("click", advanceTutorial);

  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "toggle-language") toggleLanguage();
    if (action === "open-menu") openMenu();
    if (action === "close-modal") closeModal();
    if (action === "open-collection") openCollection();
    if (action === "new-from-ending") openStampSetup();
  });

  $("#stat-ledger").addEventListener("click", handleStatDescription);
  $("#mobile-stat-grid").addEventListener("click", handleStatDescription);

  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "f" && !isTypingTarget(event.target)) {
      event.preventDefault();
      toggleFullscreen();
      return;
    }
    if (event.key === "Escape" && !$("#modal-layer").hidden) {
      closeModal();
      return;
    }
    if (event.key === "Tab" && !$("#modal-layer").hidden) {
      trapModalFocus(event);
      return;
    }
    if (!state || state.phase === "ending" || !$("#modal-layer").hidden) return;
    if (state.phase === "event" && ["1", "2", "3"].includes(event.key)) {
      const current = getCurrentEvent();
      const choice = current?.choices[Number(event.key) - 1];
      if (choice) chooseOption(choice.id);
    } else if (state.phase === "resolution" && event.key === "Enter") {
      completeRound();
    }
  });
}

function isTypingTarget(target) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
}

function renderLanding() {
  $("#landing").hidden = false;
  $("#game-shell").hidden = true;
  $("#ending-screen").hidden = true;
  $("#continue-btn").hidden = !state || state.phase === "ending";
}

function requestNewGame() {
  if (TEST_MODE) {
    startNewGame(config.default_stamps);
    return;
  }
  if (localStorage.getItem(STORAGE.spoiler) === "acknowledged") {
    openStampSetup();
  } else {
    openSpoilerWarning();
  }
}

function openSpoilerWarning() {
  openModal(`
    <p class="eyebrow">APPENDIX 7B · SPOILER NOTICE</p>
    <h2 id="modal-title">${escapeHTML(t("spoilerTitle"))}</h2>
    <div class="spoiler-box"><b>${escapeHTML(t("landingSpoiler"))}</b><p>${escapeHTML(t("spoilerBody"))}</p></div>
    <label class="spoiler-check"><input type="checkbox" id="spoiler-check"><span>${escapeHTML(t("spoilerAgree"))}</span></label>
    <button class="primary-action" id="spoiler-confirm" type="button" disabled>${escapeHTML(t("acknowledge"))}</button>
  `, () => {
    const check = $("#spoiler-check");
    const confirm = $("#spoiler-confirm");
    check.addEventListener("change", () => { confirm.disabled = !check.checked; });
    confirm.addEventListener("click", () => {
      localStorage.setItem(STORAGE.spoiler, "acknowledged");
      closeModal(false);
      openStampSetup();
    });
  });
}

function openStampSetup() {
  const selected = new Set(config.default_stamps);
  const render = () => {
    const cards = config.stamps.map((stamp) => `
      <button class="stamp-select" type="button" data-select-stamp="${stamp.id}" aria-pressed="${selected.has(stamp.id)}">
        <i>×${stamp.charges}</i>
        <b>${escapeHTML(localText(stamp, "name"))}</b>
        <small>${escapeHTML(localText(stamp, "short"))}</small>
      </button>
    `).join("");
    openModal(`
      <p class="eyebrow">ARCHIVAL METHOD · 3 / 5</p>
      <h2 id="modal-title">${escapeHTML(t("stampSetupTitle"))}</h2>
      <p>${escapeHTML(t("stampSetupBody"))}</p>
      <p class="selection-count"><b>${escapeHTML(t("selectedCount"))}:</b> <span id="selected-stamp-count">${selected.size} / 3</span></p>
      <div class="stamp-setup-grid">${cards}</div>
      <button class="primary-action" id="start-run-confirm" type="button" ${selected.size === 3 ? "" : "disabled"}>${escapeHTML(t("startWithStamps"))}</button>
    `, () => bindStampSetup(selected, render), false);
  };
  render();
}

function bindStampSetup(selected, rerender) {
  $$('[data-select-stamp]').forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.selectStamp;
      if (selected.has(id)) selected.delete(id);
      else if (selected.size < 3) selected.add(id);
      else showToast(language === "zh" ? "每局只能装备三枚印章。" : "Only three stamps may be equipped.");
      rerender();
    });
  });
  $("#start-run-confirm")?.addEventListener("click", () => {
    if (selected.size !== 3) return;
    closeModal(false);
    startNewGame([...selected]);
  });
}

function startNewGame(selectedStamps) {
  const seed = TEST_MODE ? 73191 : (crypto.getRandomValues(new Uint32Array(1))[0] || Date.now());
  const stampCharges = {};
  for (const stamp of config.stamps) stampCharges[stamp.id] = selectedStamps.includes(stamp.id) ? stamp.charges : 0;
  state = {
    version: SAVE_VERSION,
    seed,
    language,
    round: 1,
    act: 1,
    phase: "event",
    stats: { ...config.initial },
    relationships: { bond: 0, memory: 0, trust: 0 },
    evidence: 0,
    flags: [],
    selectedStamps: [...selectedStamps],
    stampCharges,
    sequence: {},
    history: [],
    pending: [],
    callbacksCurrent: [],
    currentResolution: null,
    tutorialStep: collection.tutorialSeen ? "done" : 0,
    priorEnding: collection.lastEnding || null,
    startedAt: new Date().toISOString()
  };
  enterRound();
  saveState();
  renderGame(true);
}

function resumeGame() {
  if (!state || state.phase === "ending") return;
  renderGame(true);
}

function enterRound() {
  state.act = getActForRound(state.round);
  processPendingCallbacks();
  ensureCurrentEvent();
}

function getActForRound(round) {
  if (round <= 3) return 1;
  if (round <= 7) return 2;
  return 3;
}

function ensureCurrentEvent() {
  if (state.sequence[state.round]) return;
  const fixed = story.events.find((event) => event.fixed_round === state.round);
  if (fixed) {
    state.sequence[state.round] = fixed.id;
    return;
  }
  const used = new Set(Object.values(state.sequence));
  const flags = new Set(state.flags);
  const pool = story.events.filter((event) => event.pool && event.act === state.act && !used.has(event.id));
  const eligible = pool.filter((event) => {
    const any = event.requires_any || [];
    const all = event.requires_all || [];
    return (any.length === 0 || any.some((flag) => flags.has(flag))) && all.every((flag) => flags.has(flag));
  });
  const candidates = eligible.length ? eligible : pool.filter((event) => !(event.requires_any?.length));
  const finalPool = candidates.length ? candidates : pool;
  const index = hashString(`${state.seed}:${state.round}:${[...flags].sort().join(",")}`) % finalPool.length;
  state.sequence[state.round] = finalPool[index].id;
}

function getCurrentEvent() {
  const id = state?.sequence?.[state.round];
  return story?.events?.find((event) => event.id === id) || null;
}

function processPendingCallbacks() {
  const due = state.pending.filter((item) => item.dueRound <= state.round);
  state.pending = state.pending.filter((item) => item.dueRound > state.round);
  state.callbacksCurrent = due.map((item) => ({ ...item }));
  for (const item of due) {
    applyStats(item.effect);
    applyRelations(item.relations);
    addFlags(item.set_flags);
  }
}

function chooseOption(choiceId) {
  if (!state || state.phase !== "event") return;
  const event = getCurrentEvent();
  const choice = event?.choices.find((item) => item.id === choiceId);
  if (!choice) return;

  applyStats(choice.effect);
  applyRelations(choice.relations);
  addFlags(choice.set_flags);

  let pendingId = null;
  if (choice.delayed) {
    pendingId = `${choice.delayed.id}:${state.round}:${state.history.length}`;
    state.pending.push({
      ...choice.delayed,
      instanceId: pendingId,
      sourceRound: state.round,
      dueRound: Math.min(config.rounds, state.round + Number(choice.delayed.due_offset || 1))
    });
  }

  state.currentResolution = {
    eventId: event.id,
    choiceId: choice.id,
    baseEffect: { ...(choice.effect || {}) },
    pendingId,
    stampApplied: null,
    stampEffect: null,
    clueLost: false,
    followupAnswerId: null,
    followupResponse: null
  };
  state.phase = "resolution";
  state.history.push({
    round: state.round,
    act: state.act,
    eventId: event.id,
    choiceId: choice.id,
    choiceEffect: { ...(choice.effect || {}) },
    relations: { ...(choice.relations || {}) },
    followupAnswerId: null,
    stampId: null,
    finalSnapshot: null
  });
  recordDiscoveredOutcome(event.id, choice.id);
  saveState();
  renderRound(false);
  if (state.tutorialStep === 2) showTutorial();
  requestAnimationFrame(() => {
    const resolution = $("#resolution");
    resolution?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    resolution?.focus({ preventScroll: true });
  });
}

function applyStamp(stampId) {
  if (!state || state.phase !== "resolution" || state.currentResolution.stampApplied !== null) return;
  if (!state.selectedStamps.includes(stampId) || state.stampCharges[stampId] <= 0 || !isStampEnabled(stampId)) {
    showToast(t("stampUnavailable"));
    return;
  }

  const event = getCurrentEvent();
  const choice = event.choices.find((item) => item.id === state.currentResolution.choiceId);
  const delta = { heaven: 0, hell: 0, human: 0, pressure: 0 };
  const relationDelta = { bond: 0, memory: 0, trust: 0 };
  let note = "";
  state.stampCharges[stampId] -= 1;

  if (stampId === "truth") {
    delta.human = 2;
    delta.pressure = 1;
    state.evidence += 1;
    note = language === "zh" ? "证词被保留为真本。" : "The testimony is preserved as a true copy.";
  } else if (stampId === "redact") {
    const reduction = Math.min(4, Math.max(0, Number(choice.effect?.pressure || 0)));
    delta.pressure = -reduction;
    delta.human = -2;
    addFlags(["audit_risk"]);
    state.pending.push({
      id: `redaction_audit_${state.round}`,
      instanceId: `redaction_audit:${state.round}`,
      sourceRound: state.round,
      dueRound: Math.min(config.rounds, state.round + 2),
      text_zh: `第 ${state.round} 回合的删节引来复核：缺失的文字在纸背留下了轮廓。`,
      text_en: `The redaction from Round ${state.round} triggers review: missing words leave an outline on the reverse.`,
      effect: { heaven: 2, human: -2, pressure: 1 },
      relations: { bond: 0, memory: 1, trust: -1 },
      set_flags: ["redaction_reviewed"]
    });
    note = language === "zh" ? `删去 ${reduction} 点重写压力，但审计已经注意到空白。` : `${reduction} Rewrite Pressure removed; the audit noticed the gap.`;
  } else if (stampId === "crossref") {
    applyStats(event.crossref.effect);
    applyRelations(event.crossref.relations);
    addFlags(event.crossref.set_flags);
    Object.assign(delta, { ...(event.crossref.effect || {}) });
    Object.assign(relationDelta, { ...(event.crossref.relations || {}) });
    note = localText(event.crossref, "text");
  } else if (stampId === "misfile") {
    if (state.stats.heaven >= state.stats.hell) {
      delta.heaven = -3;
      delta.hell = 1;
    } else {
      delta.hell = -3;
      delta.heaven = 1;
    }
    addFlags(["misfiled"]);
    note = language === "zh" ? "较强的回响被放进错误抽屉。它会花一段时间才发现。" : "The stronger echo was placed in the wrong drawer. It will take time to notice.";
  } else if (stampId === "seal") {
    const pendingId = state.currentResolution.pendingId;
    state.pending = state.pending.filter((item) => item.instanceId !== pendingId);
    delta.pressure = -5;
    state.currentResolution.clueLost = true;
    addFlags([`sealed_${event.id}`]);
    note = language === "zh" ? "后续影响被永久封存；与它相连的线索也消失了。" : "The delayed consequence is permanently sealed. Its connected clue is lost with it.";
  }

  if (stampId !== "crossref") {
    applyStats(delta);
    applyRelations(relationDelta);
  }

  state.currentResolution.stampApplied = stampId;
  state.currentResolution.stampEffect = delta;
  state.currentResolution.stampNote = note;
  const history = state.history[state.history.length - 1];
  history.stampId = stampId;
  history.stampEffect = { ...delta };
  saveState();
  renderRound(false);
  showToast(`${t("stampApplied")}: ${localText(config.stamps.find((stamp) => stamp.id === stampId), "name")}`);
}

function isStampEnabled(stampId) {
  if (!state || state.stampCharges[stampId] <= 0) return false;
  const event = getCurrentEvent();
  const choice = event?.choices.find((item) => item.id === state.currentResolution?.choiceId);
  if (stampId === "redact") return Number(choice?.effect?.pressure || 0) > 0;
  if (stampId === "crossref") return Boolean(event?.crossref);
  if (stampId === "seal") return Boolean(state.currentResolution?.pendingId && state.pending.some((item) => item.instanceId === state.currentResolution.pendingId));
  return true;
}

function completeRound() {
  if (!state || state.phase !== "resolution") return;
  if (state.currentResolution.stampApplied === null) state.currentResolution.stampApplied = "none";
  const growth = Number(config.pressure_growth[state.round - 1] || 0);
  applyStats({ pressure: growth });
  const history = state.history[state.history.length - 1];
  history.stampId = state.currentResolution.stampApplied;
  history.followupAnswerId = state.currentResolution.followupAnswerId || null;
  history.finalSnapshot = {
    stats: { ...state.stats },
    relationships: { ...state.relationships },
    evidence: state.evidence
  };

  if (state.round >= config.rounds) {
    finishGame();
    return;
  }

  const previousAct = state.act;
  state.round += 1;
  state.phase = "event";
  state.currentResolution = null;
  enterRound();
  saveState();
  renderRound(true);
  if (state.act !== previousAct) showActInterstitial();
}

function finishGame() {
  state.phase = "ending";
  const endingId = determineEnding();
  state.endingId = endingId;
  state.endedAt = new Date().toISOString();
  const ending = endingData.endings.find((item) => item.id === endingId);
  if (!collection.endings.includes(endingId)) collection.endings.push(endingId);
  collection.runs += 1;
  collection.lastEnding = endingId;
  writeJSON(STORAGE.collection, collection);
  localStorage.removeItem(STORAGE.save);
  renderEnding(ending);
}

function determineEnding() {
  const s = state.stats;
  const r = state.relationships;
  const th = config.ending_thresholds;
  if (s.human < th.human_blank_lt) return "human_blank";
  if (s.heaven >= th.double_echo_gte && s.hell >= th.double_echo_gte) return "double_invasion";
  if (s.heaven >= th.dominance_gte && s.heaven - s.hell >= th.dominance_gap_gte) return "order_rewrite";
  if (s.hell >= th.dominance_gte && s.hell - s.heaven >= th.dominance_gap_gte) return "chaos_rewrite";
  const ordinary = s.human >= th.ordinary_human_gte
    && s.pressure < th.ordinary_pressure_lt
    && r.bond >= th.ordinary_bond_gte
    && r.trust >= th.ordinary_trust_gte
    && state.evidence >= th.ordinary_evidence_gte
    && Math.abs(s.heaven - s.hell) <= th.ordinary_echo_gap_lte;
  if (ordinary) return "ordinary_miracle";
  return "appendix_sealed";
}

function renderGame(scrollTop = false) {
  $("#landing").hidden = true;
  $("#ending-screen").hidden = true;
  $("#game-shell").hidden = false;
  renderRound(scrollTop);
  showTutorial();
}

function renderRound(scrollTop = false) {
  const event = getCurrentEvent();
  if (!event) return;
  const act = story.meta.acts[String(state.act)];
  const roman = act.roman;
  $("#act-label").textContent = `ACT ${roman}`;
  $("#act-title").textContent = localText(act, "title");
  $("#mobile-act").textContent = `ACT ${roman}`;
  $("#mobile-round").textContent = `${pad(state.round)} / ${pad(config.rounds)}`;
  $("#round-current").textContent = pad(state.round);
  $("#chapter-note-number").textContent = roman;
  $("#chapter-note-copy").textContent = localText(act, "note");
  $("#folio-number").textContent = `7B—${String(state.seed).slice(-3)}—${pad(state.round)}`;
  $("#page-number").textContent = pad(state.round);
  $("#archive-seed").textContent = `SEED ${state.seed}`;
  $("#event-supratitle").textContent = language === "zh"
    ? `第 ${state.round} 回 · ${localText(act, "title")}`
    : `CHAPTER ${pad(state.round)} · ${localText(act, "title")}`;
  $("#event-title").textContent = localText(event, "title");
  $("#event-marginalia").textContent = "";
  const priorNote = state.round === 1 && state.priorEnding
    ? priorEndingHTML(state.priorEnding)
    : "";
  $("#event-body").innerHTML = `${paragraphHTML(localText(event, "text"))}${priorNote}`;

  renderStoryTrail(event);
  renderStats();
  renderCallbacks();
  renderChoices(event);
  renderResolution(event);
  renderFollowup(event);
  renderStamps(event);
  renderFlags();
  renderBond();
  applyLanguageToStaticNodes();

  if (scrollTop) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      $("#archive-page").focus({ preventScroll: true });
    });
  }
}

function renderStoryTrail(event) {
  const actItems = Object.values(story.meta.acts);
  $("#story-trail").innerHTML = actItems.map((act, index) => {
    const actNumber = index + 1;
    const stateClass = actNumber < state.act ? "is-done" : actNumber === state.act ? "is-current" : "";
    return `<span class="${stateClass}"><i>${actNumber}</i><b>${escapeHTML(localText(act, "title"))}</b></span>`;
  }).join("");
  $("#story-recap").textContent = localText(event, "recap");
  $("#story-goal").textContent = localText(event, "goal");
}

function renderStats() {
  const echoGap = state.stats.heaven - state.stats.hell;
  document.body.dataset.echo = echoGap >= 12 ? "heaven" : echoGap <= -12 ? "hell" : state.stats.human >= 72 ? "human" : "balanced";
  document.body.dataset.pressure = state.stats.pressure >= 70 ? "high" : "normal";
  for (const key of STATS) {
    const value = state.stats[key];
    $(`#${key}-value`).textContent = String(value);
    $(`#${key}-bar`).style.width = `${value}%`;
  }
  $("#mobile-stat-grid").innerHTML = STATS.map((key) => `
    <button class="mobile-stat ${key}" type="button" data-stat="${key}">
      <b>${escapeHTML(t(key))}</b><strong>${state.stats[key]}</strong><i style="width:${state.stats[key]}%"></i>
    </button>
  `).join("");
}

function renderCallbacks() {
  const box = $("#callback-stack");
  if (!state.callbacksCurrent.length) {
    box.hidden = true;
    box.innerHTML = "";
    return;
  }
  box.hidden = false;
  box.innerHTML = state.callbacksCurrent.map((callback) => `
    <div class="callback-note">
      <b>${escapeHTML(t("callbacks"))} · R${callback.sourceRound}</b>
      ${escapeHTML(localText(callback, "text"))}
    </div>
  `).join("");
}

function renderChoices(event) {
  const resolution = state.currentResolution;
  $("#choice-list").innerHTML = event.choices.map((choice, index) => {
    const selected = resolution?.choiceId === choice.id;
    const resolved = state.phase === "resolution";
    const classes = ["choice-card"];
    if (choice.is_extreme) classes.push("is-extreme");
    if (resolved && selected) classes.push("is-selected");
    if (resolved && !selected) classes.push("is-unselected");
    return `
      <button class="${classes.join(" ")}" type="button" data-choice="${choice.id}" ${resolved ? "disabled" : ""}>
        <span class="choice-card__index">${index + 1}</span>
        <span class="choice-card__copy">${escapeHTML(localText(choice, "label"))}</span>
        <span class="choice-card__preview">${previewHTML(choice.effect)}</span>
      </button>
    `;
  }).join("");
  $$('[data-choice]').forEach((button) => button.addEventListener("click", () => chooseOption(button.dataset.choice)));
}

function renderResolution(event) {
  const box = $("#resolution");
  if (state.phase !== "resolution" || !state.currentResolution) {
    box.hidden = true;
    return;
  }
  const choice = event.choices.find((item) => item.id === state.currentResolution.choiceId);
  box.hidden = false;
  const priorResponse = state.round === 1 && state.priorEnding
    ? priorEndingResponse(state.priorEnding)
    : "";
  $("#resolution-text").innerHTML = `${escapeHTML(localText(choice, "consequence"))}${priorResponse ? `<small class="prior-response">${escapeHTML(priorResponse)}</small>` : ""}`;
  const combined = { ...(choice.effect || {}) };
  if (state.currentResolution.stampEffect) {
    for (const key of STATS) combined[key] = Number(combined[key] || 0) + Number(state.currentResolution.stampEffect[key] || 0);
  }
  $("#effect-chips").innerHTML = effectChipsHTML(combined);
  const delayed = $("#delayed-note");
  if (state.currentResolution.stampNote) {
    delayed.hidden = false;
    delayed.textContent = state.currentResolution.stampNote;
  } else if (state.currentResolution.pendingId) {
    delayed.hidden = false;
    delayed.textContent = t("delayedRegistered");
  } else {
    delayed.hidden = true;
    delayed.textContent = "";
  }
}

function renderFollowup(event) {
  const box = $("#followup");
  if (state.phase !== "resolution" || !event.followup) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  $("#followup-speaker").textContent = `${localText(event.followup, "speaker")} · ${language === "zh" ? "可选问答" : "OPTIONAL QUESTION"}`;
  $("#followup-question").textContent = localText(event.followup, "question");
  const selectedId = state.currentResolution.followupAnswerId;
  $("#followup-answers").innerHTML = event.followup.answers.map((answer) => `
    <button type="button" data-followup-answer="${answer.id}" ${selectedId ? "disabled" : ""} class="${selectedId === answer.id ? "is-selected" : selectedId ? "is-unselected" : ""}">
      ${escapeHTML(localText(answer, "label"))}
    </button>
  `).join("");
  $$('[data-followup-answer]').forEach((button) => button.addEventListener("click", () => answerFollowup(button.dataset.followupAnswer)));
  const selectedAnswer = event.followup.answers.find((answer) => answer.id === selectedId);
  const response = $("#followup-response");
  response.hidden = !selectedAnswer;
  response.textContent = selectedAnswer ? localText(selectedAnswer, "response") : "";
}

function answerFollowup(answerId) {
  if (!state || state.phase !== "resolution" || state.currentResolution.followupAnswerId) return;
  const event = getCurrentEvent();
  const answer = event?.followup?.answers?.find((item) => item.id === answerId);
  if (!answer) return;
  applyRelations(answer.relations);
  addFlags(answer.set_flags);
  state.evidence += Number(answer.evidence || 0);
  state.currentResolution.followupAnswerId = answer.id;
  const history = state.history[state.history.length - 1];
  if (history) history.followupAnswerId = answer.id;
  saveState();
  renderRound(false);
  requestAnimationFrame(() => $("#followup-response")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" }));
}

function renderStamps() {
  const drawer = $("#stamp-drawer");
  const mobileContinue = $("#mobile-continue");
  if (state.phase !== "resolution") {
    drawer.hidden = true;
    mobileContinue.hidden = true;
    return;
  }
  drawer.hidden = false;
  const alreadyApplied = state.currentResolution.stampApplied !== null;
  $("#stamp-list").innerHTML = state.selectedStamps.map((id) => {
    const stamp = config.stamps.find((item) => item.id === id);
    const charges = state.stampCharges[id];
    const enabled = !alreadyApplied && charges > 0 && isStampEnabled(id);
    const applied = state.currentResolution.stampApplied === id;
    return `
      <button class="stamp-button${applied ? " is-applied" : ""}" type="button" data-stamp="${id}" ${enabled ? "" : "disabled"}>
        <b>${escapeHTML(localText(stamp, "name"))}</b>
        <small>${escapeHTML(charges > 0 ? localText(stamp, "short") : t("noCharges"))}</small>
        <span class="stamp-button__count">${charges}</span>
      </button>
    `;
  }).join("");
  $$('[data-stamp]').forEach((button) => button.addEventListener("click", () => applyStamp(button.dataset.stamp)));
  const continueText = alreadyApplied ? t("continueAfterStamp") : t("continueRecord");
  $("#continue-round-btn").textContent = continueText;
  mobileContinue.hidden = false;
  mobileContinue.textContent = continueText;
}

function renderFlags() {
  const visible = state.flags.filter((flag) => FLAG_LABELS[language][flag]).slice(-4).reverse();
  $("#flag-list").innerHTML = visible.length
    ? visible.map((flag) => `<p class="flag-note">${escapeHTML(FLAG_LABELS[language][flag])}</p>`).join("")
    : `<p class="flag-empty">${escapeHTML(t("noFlags"))}</p>`;
}

function renderBond() {
  const bond = state.relationships.bond;
  const distance = Math.max(0, 8 - Math.min(8, bond)) * .7;
  const lines = $$("#bond-thread i");
  if (lines[0]) lines[0].style.transform = `translateY(${distance}px) rotate(-1deg)`;
  if (lines[1]) lines[1].style.transform = `translateY(${-distance}px) rotate(1deg)`;
  $("#bond-copy").textContent = bond >= 5 ? t("bondHigh") : bond >= 2 ? t("bondMid") : t("bondLow");
}

function renderEnding(ending) {
  $("#landing").hidden = true;
  $("#game-shell").hidden = true;
  const screen = $("#ending-screen");
  screen.hidden = false;
  screen.scrollTop = 0;
  $("#ending-title").textContent = localText(ending, "title");
  $("#ending-subtitle").textContent = localText(ending, "subtitle");
  $("#ending-text").innerHTML = paragraphHTML(localText(ending, "text"));
  const variantId = state.relationships.bond >= 4 && state.relationships.memory >= 4
    ? "remembered"
    : state.relationships.bond >= 4 ? "ordinary" : "apart";
  const variant = endingData.relationship_variants[variantId];
  $("#ending-variant").innerHTML = `<b>${escapeHTML(localText(variant, "title"))}</b><br>${escapeHTML(localText(variant, "text"))}`;
  $("#ending-stats").innerHTML = STATS.map((key) => `
    <div class="ending-stat ${key}"><b>${escapeHTML(t(key))}</b><strong>${state.stats[key]}</strong></div>
  `).join("");
  const plate = $("#ending-plate");
  plate.dataset.ending = ending.id;
  const imagePath = `./assets/plates/${ending.image}.avif`;
  const mobileImagePath = `./assets/plates/${ending.image}-mobile.avif`;
  plate.style.setProperty("--ending-plate", `url("${imagePath}")`);
  plate.style.setProperty("--ending-plate-mobile", `url("${mobileImagePath}")`);
  applyLanguageToStaticNodes();
}

function showActInterstitial() {
  const act = story.meta.acts[String(state.act)];
  const platePath = `./assets/plates/act-${state.act}.avif`;
  const mobilePlatePath = `./assets/plates/act-${state.act}-mobile.avif`;
  openModal(`
    <div class="act-interstitial" style="--act-plate:url('${platePath}');--act-plate-mobile:url('${mobilePlatePath}')">
      <div class="act-interstitial__plate"></div>
      <div class="act-interstitial__copy">
        <p class="eyebrow">${escapeHTML(t("chapterArchive"))}</p>
        <h2 id="modal-title">ACT ${act.roman}<br>${escapeHTML(localText(act, "title"))}</h2>
        <p>${escapeHTML(localText(act, "note"))}</p>
        <button class="primary-action" id="act-continue" type="button">${escapeHTML(t("chapterContinue"))}</button>
      </div>
    </div>
  `, () => $("#act-continue").addEventListener("click", () => closeModal()), false);
}

function openGuide() {
  const acts = Object.values(story.meta.acts);
  openModal(`
    <p class="eyebrow">DELAY THE END · 10 CHAPTERS</p>
    <h2 id="modal-title">${escapeHTML(t("guideTitle"))}</h2>
    <p>${escapeHTML(t("guideIntro"))}</p>
    <div class="guide-route">
      ${acts.map((act, index) => `<article><span>${index + 1}</span><b>${escapeHTML(localText(act, "title"))}</b><small>${escapeHTML(localText(act, "note"))}</small></article>`).join("")}
    </div>
    <div class="guide-grid">
      ${STATS.map((key) => `<article class="guide-card ${key}"><b>${escapeHTML(t(key))}</b><p>${escapeHTML(STAT_DESCRIPTIONS[language][key])}</p></article>`).join("")}
    </div>
  `);
}

function openCollection() {
  const eventRows = story.events.map((event) => {
    const outcomes = collection.events[event.id] || [];
    return `<div class="event-index__row"><b>${escapeHTML(outcomes.length ? localText(event, "title") : "— · — · —")}</b><span>${outcomes.length} / 3 ${escapeHTML(t("outcomes"))}</span></div>`;
  }).join("");
  const endingCards = endingData.endings.map((ending) => {
    const found = collection.endings.includes(ending.id);
    return `<article class="ending-index__item${found ? "" : " is-locked"}"><b>${escapeHTML(found ? localText(ending, "title") : t("lockedEnding"))}</b><span>${ending.secret && found ? escapeHTML(t("secret")) : ending.id.toUpperCase().replaceAll("_", " ")}</span></article>`;
  }).join("");
  openModal(`
    <p class="eyebrow">DELAY THE END · INDEX</p>
    <h2 id="modal-title">${escapeHTML(t("collectionTitle"))}</h2>
    <div class="collection-summary">
      <span>${escapeHTML(t("discoveredEvents"))}: <b>${Object.keys(collection.events).length} / ${story.events.length}</b></span>
      <span>${escapeHTML(t("discoveredEndings"))}: <b>${collection.endings.length} / ${endingData.endings.length}</b></span>
      <span>${escapeHTML(t("runs"))}: <b>${collection.runs}</b></span>
    </div>
    <h3>${escapeHTML(t("discoveredEndings"))}</h3>
    <div class="ending-index">${endingCards}</div>
    <h3>${escapeHTML(t("discoveredEvents"))}</h3>
    <div class="event-index">${eventRows}</div>
  `);
}

function openMenu() {
  openModal(`
    <p class="eyebrow">APPENDIX 7B · PAUSED</p>
    <h2 id="modal-title">${escapeHTML(t("menuTitle"))}</h2>
    <button class="primary-action" id="menu-resume" type="button">${escapeHTML(t("resume"))}</button>
    <button class="secondary-action" id="menu-guide" type="button">${escapeHTML(t("worldGuide"))}</button>
    <button class="secondary-action" id="menu-collection" type="button">${escapeHTML(t("collection"))}</button>
    <button class="secondary-action" id="menu-fullscreen" type="button">${escapeHTML(t("fullscreen"))}</button>
    <button class="secondary-action" id="menu-restart" type="button">${escapeHTML(t("restart"))}</button>
  `, () => {
    $("#menu-resume").addEventListener("click", () => closeModal());
    $("#menu-guide").addEventListener("click", openGuide);
    $("#menu-collection").addEventListener("click", openCollection);
    $("#menu-fullscreen").addEventListener("click", toggleFullscreen);
    $("#menu-restart").addEventListener("click", (event) => {
      if (!restartArmed) {
        restartArmed = true;
        event.currentTarget.textContent = t("restartConfirm");
        return;
      }
      restartArmed = false;
      localStorage.removeItem(STORAGE.save);
      state = null;
      closeModal(false);
      openStampSetup();
    });
  });
}

function openModal(html, onOpen, preserveFocus = true) {
  if (preserveFocus) lastFocusedElement = document.activeElement;
  const layer = $("#modal-layer");
  $("#modal-content").innerHTML = html;
  layer.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    const title = $("#modal-title");
    if (title) {
      title.tabIndex = -1;
      title.focus({ preventScroll: true });
    }
    onOpen?.();
  });
}

function closeModal(restoreFocus = true) {
  $("#modal-layer").hidden = true;
  $("#modal-content").innerHTML = "";
  document.body.style.overflow = "";
  restartArmed = false;
  if (restoreFocus && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function trapModalFocus(event) {
  const sheet = $("#modal-sheet");
  const focusable = $$('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])', sheet)
    .filter((node) => node.getClientRects().length > 0);
  if (!focusable.length) {
    event.preventDefault();
    $("#modal-title")?.focus({ preventScroll: true });
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === $("#modal-title"))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function advanceTutorial() {
  if (!state || state.tutorialStep === "done") {
    $("#tutorial-card").hidden = true;
    return;
  }
  if (state.tutorialStep === 0) state.tutorialStep = 1;
  else if (state.tutorialStep === 1) {
    state.tutorialStep = 2;
    $("#tutorial-card").hidden = true;
  } else {
    state.tutorialStep = "done";
    collection.tutorialSeen = true;
    writeJSON(STORAGE.collection, collection);
  }
  saveState();
  showTutorial();
}

function showTutorial() {
  const card = $("#tutorial-card");
  if (!state || state.tutorialStep === "done") {
    card.hidden = true;
    return;
  }
  if (state.tutorialStep === 2 && state.phase !== "resolution") {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  const step = Number(state.tutorialStep);
  $("#tutorial-index").textContent = `${pad(step + 1)} / 03`;
  $("#tutorial-copy").textContent = step === 0 ? t("tutorialStats") : step === 1 ? t("tutorialChoices") : t("tutorialStamps");
  $("#tutorial-next").textContent = step === 2 ? (language === "zh" ? "明白了" : "Got it") : t("understood");
}

function handleStatDescription(event) {
  const key = event.target.closest("[data-stat]")?.dataset.stat;
  if (!key) return;
  $("#stat-description").textContent = STAT_DESCRIPTIONS[language][key];
  showToast(`${t(key)} — ${STAT_DESCRIPTIONS[language][key]}`);
}

function toggleLanguage() {
  language = language === "zh" ? "en" : "zh";
  if (state) {
    state.language = language;
    saveState();
  }
  writeJSON(STORAGE.settings, { language });
  applyLanguage();
  if (!$("#game-shell").hidden && state?.phase !== "ending") renderRound(false);
  if (!$("#ending-screen").hidden && state?.endingId) {
    const ending = endingData.endings.find((item) => item.id === state.endingId);
    renderEnding(ending);
  }
}

function applyLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  applyLanguageToStaticNodes();
}

function applyLanguageToStaticNodes() {
  $$('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (UI[language][key] !== undefined) node.textContent = UI[language][key];
  });
  $$('.lang-button').forEach((button) => { button.textContent = t("languageName"); });
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch (error) {
    console.warn("Fullscreen unavailable", error);
  }
}

function applyStats(effect = {}) {
  for (const key of STATS) {
    state.stats[key] = clamp(Number(state.stats[key] || 0) + Number(effect[key] || 0));
  }
}

function applyRelations(effect = {}) {
  for (const key of ["bond", "memory", "trust"]) {
    state.relationships[key] = clamp(Number(state.relationships[key] || 0) + Number(effect[key] || 0), -10, 20);
  }
}

function addFlags(flags = []) {
  for (const flag of flags || []) if (!state.flags.includes(flag)) state.flags.push(flag);
}

function recordDiscoveredOutcome(eventId, choiceId) {
  const current = new Set(collection.events[eventId] || []);
  current.add(choiceId);
  collection.events[eventId] = [...current];
  writeJSON(STORAGE.collection, collection);
}

function loadCollection() {
  const loaded = readJSON(STORAGE.collection, {});
  return {
    events: loaded.events && typeof loaded.events === "object" ? loaded.events : {},
    endings: Array.isArray(loaded.endings) ? loaded.endings : [],
    runs: Number(loaded.runs || 0),
    lastEnding: loaded.lastEnding || null,
    tutorialSeen: Boolean(loaded.tutorialSeen)
  };
}

function loadSavedState() {
  const loaded = readJSON(STORAGE.save, null) || readJSON(STORAGE.legacySave, null);
  if (!loaded || loaded.phase === "ending") return null;
  if (loaded.version === SAVE_VERSION) return loaded;
  if (loaded.version === 1 || loaded.version === 2 || loaded.stability !== undefined) return migrateLegacySave(loaded);
  return null;
}

function migrateLegacySave(loaded) {
  const selectedStamps = [...config.default_stamps];
  const stampCharges = Object.fromEntries(config.stamps.map((stamp) => [stamp.id, selectedStamps.includes(stamp.id) ? stamp.charges : 0]));
  const migrated = {
    version: SAVE_VERSION,
    seed: Number(loaded.seed || 73191),
    language: loaded.language === "en" ? "en" : "zh",
    round: clamp(Number(loaded.round || 1), 1, config.rounds),
    act: getActForRound(clamp(Number(loaded.round || 1), 1, config.rounds)),
    phase: "event",
    stats: {
      heaven: clamp(Number(loaded.stats?.heaven ?? loaded.heaven ?? config.initial.heaven)),
      hell: clamp(Number(loaded.stats?.hell ?? loaded.hell ?? config.initial.hell)),
      human: clamp(Number(loaded.stats?.human ?? loaded.human ?? loaded.stability ?? config.initial.human)),
      pressure: clamp(Number(loaded.stats?.pressure ?? loaded.pressure ?? config.initial.pressure))
    },
    relationships: { bond: 0, memory: 0, trust: 0 },
    evidence: 0,
    flags: ["migrated_v1"],
    selectedStamps,
    stampCharges,
    sequence: {},
    history: [],
    pending: [],
    callbacksCurrent: [],
    currentResolution: null,
    tutorialStep: "done",
    priorEnding: collection?.lastEnding || null,
    startedAt: new Date().toISOString()
  };
  writeJSON(STORAGE.save, migrated);
  return migrated;
}

function saveState() {
  if (!state || state.phase === "ending") return;
  state.language = language;
  writeJSON(STORAGE.save, state);
}

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn("Storage unavailable", error); }
}

function renderFatalError() {
  $("#landing").hidden = false;
  $(".landing__actions").innerHTML = `
    <div class="spoiler-box"><b>${escapeHTML(t("loadError"))}</b><p>${escapeHTML(t("loadErrorBody"))}</p></div>
  `;
}

function previewHTML(effect = {}) {
  return STATS.filter((key) => Number(effect[key] || 0) !== 0).map((key) => {
    const direction = Number(effect[key]) > 0 ? "up" : "down";
    const arrow = direction === "up" ? "↑" : "↓";
    return `<span class="direction-chip ${direction}">${escapeHTML(t(key))} ${arrow}</span>`;
  }).join("");
}

function effectChipsHTML(effect = {}) {
  return STATS.filter((key) => Number(effect[key] || 0) !== 0).map((key) => {
    const value = Number(effect[key]);
    return `<span class="effect-chip ${key}">${escapeHTML(t(key))} ${value > 0 ? "+" : ""}${value}</span>`;
  }).join("") || `<span class="effect-chip">${language === "zh" ? "数值无变化" : "No numerical change"}</span>`;
}

function priorEndingHTML(endingId) {
  const ending = endingData.endings.find((item) => item.id === endingId);
  if (!ending) return "";
  const copy = language === "zh"
    ? `上一份附录以《${localText(ending, "title")}》结案。它没有成为加成，只在纸边留下一种你已经见过的可能。`
    : `The previous Appendix was filed as “${localText(ending, "title")}.” It grants no bonus; it survives only as a possibility you have already witnessed.`;
  return `<aside class="prior-run-note"><b>${language === "zh" ? "上一周目批注" : "MARGINALIA FROM THE PREVIOUS RUN"}</b>${escapeHTML(copy)}</aside>`;
}

function priorEndingResponse(endingId) {
  const responses = {
    order_rewrite: {
      zh: "旧批注试图把这项选择改成唯一正确的格式；你保留了修订痕迹。",
      en: "The old marginalia tries to correct this into the only proper format. You retain the revision marks."
    },
    chaos_rewrite: {
      zh: "上一份档案建议撕掉页码。你只把页码写得小了一点。",
      en: "The previous record suggests tearing out the page number. You merely write it smaller."
    },
    double_invasion: {
      zh: "蓝墨与朱红同时要求会签。你把两份申请都压在镇纸下面。",
      en: "Blue ink and vermilion both demand countersignature. You put both forms beneath a paperweight."
    },
    human_blank: {
      zh: "空白页提醒你：不替人选择，并不等于没有人需要被听见。",
      en: "A blank page reminds you: refusing to choose for people is not the same as ensuring they are heard."
    },
    appendix_sealed: {
      zh: "上一把钥匙在口袋里轻响；这次，封存不再显得像中立。",
      en: "The previous key rattles in your pocket. This time, sealing no longer resembles neutrality."
    },
    ordinary_miracle: {
      zh: "纸边没有纠正你，只留出足够写下另一个普通决定的位置。",
      en: "The margin does not correct you. It leaves room for another ordinary decision."
    }
  };
  return responses[endingId]?.[language] || "";
}

function paragraphHTML(text) {
  return String(text || "").split(/\n\s*\n/).map((part) => `<p>${escapeHTML(part).replaceAll("\n", "<br>")}</p>`).join("");
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function clamp(value, min = 0, max = 100) { return Math.max(min, Math.min(max, value)); }
function pad(value) { return String(value).padStart(2, "0"); }
function prefersReducedMotion() { return matchMedia("(prefers-reduced-motion: reduce)").matches; }

function installTestHooks() {
  window.render_game_to_text = () => {
    const event = state && state.phase !== "ending" ? getCurrentEvent() : null;
    const payload = {
      coordinate_system: "DOM narrative interface; no spatial movement. Select by visible choice/stamp IDs.",
      mode: state ? state.phase : "landing",
      language,
      round: state?.round ?? null,
      act: state?.act ?? null,
      stats: state ? { ...state.stats } : null,
      relationships: state ? { ...state.relationships } : null,
      evidence: state?.evidence ?? 0,
      event: event ? {
        id: event.id,
        title: localText(event, "title"),
        recap: localText(event, "recap"),
        goal: localText(event, "goal"),
        choices: state.phase === "event" ? event.choices.map((choice, index) => ({
          slot: index + 1,
          id: choice.id,
          label: localText(choice, "label"),
          directions: Object.fromEntries(STATS.filter((key) => Number(choice.effect?.[key] || 0) !== 0).map((key) => [key, Math.sign(choice.effect[key])]))
        })) : []
      } : null,
      resolution: state?.currentResolution ? { ...state.currentResolution } : null,
      followup: event?.followup && state?.phase === "resolution" ? {
        question: localText(event.followup, "question"),
        answered: state.currentResolution?.followupAnswerId || null,
        answers: state.currentResolution?.followupAnswerId ? [] : event.followup.answers.map((answer) => ({ id: answer.id, label: localText(answer, "label") }))
      } : null,
      stamps: state ? state.selectedStamps.map((id) => ({ id, charges: state.stampCharges[id], enabled: state.phase === "resolution" ? isStampEnabled(id) : false })) : [],
      callbacks: state?.callbacksCurrent?.map((item) => ({ id: item.id, sourceRound: item.sourceRound })) || [],
      pending_count: state?.pending?.length || 0,
      ending: state?.endingId || null
    };
    return JSON.stringify(payload);
  };
  window.advanceTime = async (ms) => {
    document.documentElement.style.setProperty("--advanced-time", `${Number(ms) || 0}ms`);
  };
  window.__delayTheEnd = {
    getState: () => structuredClone(state),
    choose: chooseOption,
    answer: answerFollowup,
    stamp: applyStamp,
    continue: completeRound
  };
}
