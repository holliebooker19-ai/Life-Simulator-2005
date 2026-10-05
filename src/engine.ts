import type {
  Choice, GameAction, Condition, Effects, Ending, EndingDim, GameEvent, GameState, Headline, MemoryCheck, Origin, Outcome, Quiz, QuizHint,
  RelKey, Stats, StatKey, Talent, YearBill,
} from './types'
import { weightedPick, type Rng } from './rng'

export const BIRTH_YEAR = 1998
/** 现实记忆的终点：之后不再有“预知”，进入自行经营世界线阶段 */
export const MEMORY_END_YEAR = 2026
/** 默认寿命上限；科技树（基因工程等）可以通过 state.maxAge 提高 */
export const MAX_AGE = 100
/** 除财富外的属性上限 */
export const STAT_CAP = 100
/** 每年最多触发的固定年份事件数，超出的按稀有度取舍 */
export const MAX_FIXED_PER_YEAR = 4
/** 挤不进固定名额的现实事件转为当年的随机候选，权重乘以这个数 */
export const OVERFLOW_WEIGHT = 4
/** “交给直觉”的成功率折扣（相对旧的掷骰判定） */
export const INTUITION_RATE = 0.7
/** 记忆褪色：10 岁到 2026 年之间，记忆每年下降多少 */
export const MEMORY_FADE = 0.8
/** 父母比主角大多少岁 */
export const PARENT_AGE_GAP = 26

export function newState(): GameState {
  return {
    year: BIRTH_YEAR,
    age: 0,
    alive: true,
    stats: { intelligence: 30, charm: 30, health: 70, happiness: 50, fame: 0, influence: 0, memory: 50, wealth: 0 },
    divergence: 0,
    altered: {},
    flags: new Set(),
    seen: new Set(),
    lastDone: {},
    talents: [],
    origin: null,
    log: [],
    maxAge: MAX_AGE,
    world: {},
    joySum: 0,
    joyYears: 0,
    rel: { parents: 85, parentsLost: 0, partner: 0, childBorn: 0 },
  }
}

export function applyEffects(s: GameState, e?: Effects): void {
  if (!e) return
  if (e.stats) {
    for (const k of Object.keys(e.stats) as StatKey[]) {
      s.stats[k] += e.stats[k] ?? 0
    }
  }
  if (e.alter?.length) {
    for (const a of e.alter) s.altered[a.id] = Math.max(s.altered[a.id] ?? 0, a.scale)
    s.divergence = divergenceOf(s)
  }
  e.addFlags?.forEach((f) => s.flags.add(f))
  e.removeFlags?.forEach((f) => s.flags.delete(f))
  for (const [k, v] of Object.entries(e.world ?? {})) s.world[k] = clamp((s.world[k] ?? 0) + v, -100, 100)
  if (e.maxAge) s.maxAge = Math.max(s.age + 1, s.maxAge + e.maxAge)
  if (e.rel?.parents) s.rel.parents = clamp(s.rel.parents + e.rel.parents, 0, 100)
  // 感情只在有伴侣时有意义：保持在 1 以上，分手/离婚由标记决定，年底归零
  if (e.rel?.partner && s.rel.partner > 0) s.rel.partner = clamp(s.rel.partner + e.rel.partner, 1, 100)
  clampStats(s.stats)
}

/** 读取亲人状态（含派生的父母年龄、孩子年龄；没有孩子时 childAge 为 -1） */
export function relOf(s: GameState, k: RelKey): number {
  if (k === 'parentAge') return s.age + PARENT_AGE_GAP
  if (k === 'childAge') return s.rel.childBorn ? s.year - s.rel.childBorn : -1
  return s.rel[k]
}

/** 读取世界状态变量，未设置视为 0 */
export function worldOf(s: GameState, k: string): number {
  return s.world[k] ?? 0
}

/** 世界线偏离度 = 所有被改写锚点的 scale 之和（上限 100） */
export function divergenceOf(s: GameState): number {
  return clamp(Object.values(s.altered).reduce((a, b) => a + b, 0), 0, 100)
}

function clampStats(st: Stats): void {
  const keys: StatKey[] = ['intelligence', 'charm', 'health', 'happiness', 'fame', 'influence', 'memory']
  for (const k of keys) st[k] = Math.min(STAT_CAP, Math.max(k === 'health' ? -999 : 0, st[k]))
}

export function meets(s: GameState, c?: Condition): boolean {
  if (!c) return true
  if (c.minAge !== undefined && s.age < c.minAge) return false
  if (c.maxAge !== undefined && s.age > c.maxAge) return false
  if (c.minYear !== undefined && s.year < c.minYear) return false
  if (c.maxYear !== undefined && s.year > c.maxYear) return false
  if (c.altered?.some((id) => !(id in s.altered))) return false
  if (c.notAltered?.some((id) => id in s.altered)) return false
  if (c.divergenceMin !== undefined && s.divergence < c.divergenceMin) return false
  if (c.divergenceMax !== undefined && s.divergence > c.divergenceMax) return false
  for (const k of Object.keys(c.statMin ?? {}) as StatKey[]) if (s.stats[k] < (c.statMin![k] ?? 0)) return false
  for (const k of Object.keys(c.statMax ?? {}) as StatKey[]) if (s.stats[k] > (c.statMax![k] ?? 0)) return false
  if (c.flags?.some((f) => !s.flags.has(f))) return false
  if (c.notFlags?.some((f) => s.flags.has(f))) return false
  for (const [k, v] of Object.entries(c.worldMin ?? {})) if (worldOf(s, k) < v) return false
  for (const [k, v] of Object.entries(c.worldMax ?? {})) if (worldOf(s, k) > v) return false
  for (const [k, v] of Object.entries(c.relMin ?? {}) as [RelKey, number][]) if (relOf(s, k) < v) return false
  for (const [k, v] of Object.entries(c.relMax ?? {}) as [RelKey, number][]) if (relOf(s, k) > v) return false
  return true
}

/** 事件依赖的锚点是否已被改写（世界线已偏移） */
export function isShifted(s: GameState, ev: GameEvent): boolean {
  return !!ev.dependsOn?.some((id) => id in s.altered)
}

/** 按世界状态取事件的展示版本：替换标题/正文，并给“已偏移”的事件加提示 */
export function presentEvent(s: GameState, ev: GameEvent): GameEvent {
  const v = ev.variants?.find((x) => meets(s, x.requires))
  const text = v?.text ?? ev.text
  const shifted = isShifted(s, ev)
  return {
    ...ev,
    title: v?.title ?? ev.title,
    text: shifted ? `${text}【世界线已偏移：这件事和你记忆里的不太一样了。】` : text,
  }
}

export function applyTalentOrigin(s: GameState, talents: Talent[], origin: Origin): void {
  s.talents = talents
  s.origin = origin
  applyEffects(s, origin.effects)
  talents.forEach((t) => applyEffects(s, t.effects))
}

/** 选出本年要触发的事件：先固定年份事件，再按权重抽随机事件 */
export function pickEvents(s: GameState, pool: GameEvent[], rng: Rng, maxRandom = 1): GameEvent[] {
  const available = pool.filter((e) => (e.once === false || e.annual || !s.seen.has(e.id)) && meets(s, e.requires))
  // 同一年固定事件太多会让节奏拥挤：按稀有度保留前 MAX_FIXED_PER_YEAR 个（同稀有度随机取舍，每局不同）
  const ranked = available
    .filter((e) => e.year === s.year || e.annual)
    .map((e, i) => ({ e, i, r: rng() }))
    .sort((a, b) => RARITY_RANK[b.e.rarity ?? 'common'] - RARITY_RANK[a.e.rarity ?? 'common'] || a.r - b.r || a.i - b.i)
  const fixed = ranked.slice(0, MAX_FIXED_PER_YEAR).sort((a, b) => a.i - b.i).map((x) => x.e)
  // 挤不进去的现实事件不直接丢掉：转为当年的随机候选，权重加倍
  const overflow = new Set(ranked.slice(MAX_FIXED_PER_YEAR).map((x) => x.e).filter((e) => !e.annual))
  const randoms: GameEvent[] = []
  const candidates = available.filter((e) => (e.year === undefined && !e.annual) || overflow.has(e))
  const weight = (e: GameEvent) => eventWeight(e) * (overflow.has(e) ? OVERFLOW_WEIGHT : 1)
  for (let i = 0; i < maxRandom; i++) {
    const pick = weightedPick(candidates.filter((c) => !randoms.includes(c)), weight, rng)
    if (pick) randoms.push(pick)
  }
  return [...fixed, ...randoms]
}

const RARITY_RANK = { common: 0, rare: 1, legendary: 2 } as const

function eventWeight(e: GameEvent): number {
  const base = e.weight ?? 10
  return e.rarity === 'legendary' ? base * 0.2 : e.rarity === 'rare' ? base * 0.5 : base
}

/**
 * 各年龄段的节奏。要调快/调慢某个阶段，只改这张表。
 * 0–6 岁是“襁褓期”：只走现实锚点事件，不弹行动菜单、不加自由发挥选项，结果自动继续。
 */
export interface Pacing {
  randomEvents: number // 每年随机事件数
  actionPoints: number // 每年行动点
  extraChoices: number // 事件里追加的自由发挥选项数
  autoAdvance: boolean // 事件结果是否自动继续（不用点“继续”）
}

export function pacing(s: GameState): Pacing {
  if (s.age < 1) return { randomEvents: 0, actionPoints: 0, extraChoices: 0, autoAdvance: true }
  if (s.age < 7) return { randomEvents: 1, actionPoints: 0, extraChoices: 0, autoAdvance: true }
  if (s.age < 18) return { randomEvents: 2, actionPoints: 2, extraChoices: 2, autoAdvance: false }
  return { randomEvents: 2, actionPoints: 3, extraChoices: 2, autoAdvance: false }
}

export function actionPoints(s: GameState): number {
  return pacing(s).actionPoints
}

/** 当前能做的行动：满足条件、未超出“一次性”与冷却限制 */
export function availableActions(s: GameState, pool: GameAction[]): GameAction[] {
  return pool.filter((a) => {
    if (!meets(s, a.requires)) return false
    if (a.once && s.seen.has(a.id)) return false
    const last = s.lastDone[a.id]
    return !(a.cooldown && last !== undefined && s.year - last <= a.cooldown)
  })
}

export function markAction(s: GameState, a: GameAction): void {
  s.seen.add(a.id)
  s.lastDone[a.id] = s.year
}

/** 给带选项的事件追加通用“自由发挥”选项，最多 count 个，让玩家不止被作者预设的路线困住 */
export function withExtraChoices(s: GameState, choices: Choice[], extras: Choice[], rng: Rng, count = 2): Choice[] {
  const pool = extras.filter((c) => meets(s, c.requires))
  const picked: Choice[] = []
  for (let i = 0; i < count; i++) {
    const p = weightedPick(pool.filter((c) => !picked.includes(c)), () => 1, rng)
    if (p) picked.push(p)
  }
  return [...choices, ...picked]
}

/** 预知类选项的“记忆可靠”概率：记忆越清晰、世界线偏离越小越可靠 */
export function memoryReliability(s: GameState): number {
  const base = s.stats.memory / 100
  const penalty = s.divergence / 150
  // 2026 之后现实记忆本就用完，预知无效
  if (s.year > MEMORY_END_YEAR) return 0
  return Math.min(0.98, Math.max(0.05, base - penalty))
}

/**
 * 记忆给出的提示：记忆 ≥40 排除 1 个错误选项，≥70 排除 2 个（至少留 2 个选项），≥90 “记忆闪回”直接给出答案。
 * 提示永远指向原历史的答案：世界线偏移后它可能是错的。
 */
export function quizHint(s: GameState, quiz: Quiz, rng: Rng, shifted = false): QuizHint {
  const m = s.year > MEMORY_END_YEAR ? 0 : s.stats.memory
  const wrong = quiz.options.map((_, i) => i).filter((i) => i !== quiz.answer)
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[wrong[i], wrong[j]] = [wrong[j], wrong[i]]
  }
  const n = Math.min(m >= 70 ? 2 : m >= 40 ? 1 : 0, wrong.length - 1)
  return {
    eliminated: wrong.slice(0, n).sort((a, b) => a - b),
    flash: m >= 90 ? quiz.answer : undefined,
    intuition: memoryReliability(s) * (shifted ? 0.5 : 1) * INTUITION_RATE,
  }
}

/** 题目当前的正确答案：世界线偏移后可能换成 shiftedAnswer */
export function quizAnswer(quiz: Quiz, shifted = false): number {
  return shifted && quiz.shiftedAnswer !== undefined ? quiz.shiftedAnswer : quiz.answer
}

export interface ResolveOpts {
  /** 事件所依赖的锚点被改写：记忆可靠度减半 */
  shifted?: boolean
  /** 本次判定用的预知题 */
  quiz?: Quiz
  /** 玩家的答案下标；null = 交给直觉；有题目却没作答也按直觉处理 */
  pick?: number | null
}

export function resolveChoice(
  s: GameState,
  choice: Choice,
  rng: Rng,
  opts: ResolveOpts = {},
): { outcome: Outcome; check?: MemoryCheck } {
  const { shifted = false, quiz, pick } = opts
  let pool = choice.outcomes.filter((o) => meets(s, o.requires))
  let check: MemoryCheck | undefined
  if (choice.usesMemory) {
    if (quiz && typeof pick === 'number') {
      // 自己作答：答对就按原历史兑现；偏移后又没有新答案时，答对也只有一半把握
      const ok = pick === quizAnswer(quiz, shifted) && (!shifted || quiz.shiftedAnswer !== undefined || rng() < 0.5)
      check = { reliable: ok, via: 'quiz' }
    } else {
      const rate = memoryReliability(s) * (shifted ? 0.5 : 1) * (quiz ? INTUITION_RATE : 1)
      check = { reliable: rng() < rate, via: quiz ? 'intuition' : 'dice' }
    }
    const reliable = check.reliable
    const wanted = reliable ? 'success' : 'misremember'
    const tagged = pool.filter((o) => o.tag === wanted)
    // 不可靠但没有写 misremember 时，退化为 fail，再退化为全部
    const fallback = pool.filter((o) => o.tag === 'fail')
    pool = tagged.length ? tagged : !reliable && fallback.length ? fallback : pool
  } else {
    pool = pool.filter((o) => o.tag === undefined || o.tag === 'success' || o.tag === 'fail')
  }
  const outcome = weightedPick(pool, (o) => o.weight ?? 1, rng) ?? choice.outcomes[0]
  return { outcome, check }
}

export function pushLog(s: GameState, title: string, text: string, rarity?: GameEvent['rarity']): void {
  s.log.push({ year: s.year, age: s.age, title, text, rarity })
}

/**
 * 年度账单：成年后每年结算收入与开销（单位万元），写入财富。
 * 18 岁前由父母负担；上大学期间只有少量生活费。
 */
export function settleYear(s: GameState): YearBill {
  const bill: YearBill = { income: 0, expense: 0, lines: [] }
  const st = s.stats
  const f = s.flags
  const add = (label: string, v: number) => {
    const n = Math.round(v * 10) / 10
    if (!n) return
    if (n > 0) bill.income += n
    else bill.expense -= n
    bill.lines.push(`${label} ${n > 0 ? '+' : ''}${Math.abs(n) < 10 ? `${n}万` : formatWealth(n)}`)
  }
  if (s.age >= 60 && f.has('employed')) {
    f.delete('employed')
    f.add('retired')
  }
  if (s.age >= 18) {
    if (f.has('employed')) add('工资', 5 + st.intelligence * 0.12 + st.influence * 0.05)
    if (f.has('has-business')) add('生意', 8 + st.fame * 0.15 + st.influence * 0.1)
    if (f.has('side-gig') && !f.has('employed')) add('兼职', 1)
    if (f.has('retired')) add('退休金', 4)
    if (st.wealth > 0) add('理财收益', st.wealth * 0.02)
  }
  const student = s.age < 22 && f.has('y1620-in-college')
  const independent = s.age >= 22 || (s.age >= 18 && !student)
  if (student) add('生活费', -1)
  if (independent) {
    add('生活开销', -(3 + (st.wealth > 100 ? st.wealth * 0.01 : 0)))
    if (!f.has('own-house')) add('房租', -2)
    const childAge = relOf(s, 'childAge')
    if (f.has('has-child') && (childAge < 0 || childAge < 22)) add(childAge >= 18 ? '孩子上大学' : '养孩子', childAge >= 18 ? -4 : -3)
    if (s.rel.parentsLost < 2 && relOf(s, 'parentAge') >= 65) add(s.rel.parents < 40 ? '父母医药费' : '赡养父母', s.rel.parents < 40 ? -3 : -1)
    if (s.age >= 60) add('医疗', -(s.age - 55) * 0.2)
  }
  st.wealth += bill.income - bill.expense
  if (st.wealth < 0 && independent) {
    st.happiness -= 3
    bill.lines.push('负债压力 快乐-3')
  }
  return bill
}

/** 快乐的基准值：感情、家庭、住房、工作、健康决定一个人“平常”有多开心 */
export function joyBaseline(s: GameState): number {
  const f = s.flags
  let b = 50
  // 有伴侣的加成取决于感情：感情好 ≈ +12，冷淡时只剩一半
  const love = s.rel.partner || 70
  if (f.has('married')) b += 4 + love * 0.12
  else if (f.has('partner')) b += 2 + love * 0.09
  if (f.has('has-child')) b += 5
  if (f.has('own-house')) b += 4
  if (f.has('best-friend')) b += 4
  if (f.has('employed') || f.has('has-business') || f.has('retired')) b += 3
  if (s.stats.health < 30) b -= 10
  if (s.stats.wealth < 0 && s.age >= 22) b -= 8
  return b
}

/** 年度自然变化：快乐回落到基准、名望与影响力回落、衰老 */
export function yearlyDrift(s: GameState): void {
  const st = s.stats
  if (s.age >= 7) st.happiness += Math.round((joyBaseline(s) - st.happiness) * 0.25)
  if (s.age > 40) st.charm -= 1
  if (s.age > 60) st.intelligence -= 1
  if (s.age > 35) st.health -= (s.age - 35) * 0.12 * (s.flags.has('fit') ? 0.6 : 1)
  // 记忆褪色：越往后越模糊，鼓励早用、敢用；写过“未来备忘录”的人褪得慢一半
  if (s.age >= 10 && s.year <= MEMORY_END_YEAR) st.memory -= MEMORY_FADE * (s.flags.has('future-notebook') ? 0.5 : 1)
  // 名望会被淡忘、影响力需要经营：每年按比例回落，想维持就得持续投入
  st.fame -= st.fame * 0.06
  st.influence += influenceIncome(s) - st.influence * 0.05
  clampStats(st)
  s.joySum += st.happiness
  s.joyYears += 1
}

/**
 * 每年自然获得的影响力：财富量级、名望、公司、基金会、公职。
 * 稳定经营能在 30 岁前后攒到 50 左右，改写历史的门槛因此够得着。
 */
export function influenceIncome(s: GameState): number {
  if (s.age < 16) return 0
  const f = s.flags
  const wealthTier = Math.max(0, Math.log10(Math.max(1, s.stats.wealth)) - 2) * 1.2 // 100 万起算，1 亿 ≈ 2.4
  return wealthTier + s.stats.fame * 0.03 + (f.has('has-business') ? 2 : 0) + (f.has('has-foundation') ? 3 : 0) +
    (f.has('y2126-civil-servant') ? 1 : 0)
}

/** 当年死亡概率：随年龄指数上升，体质越差越高 */
export function mortality(age: number, health: number): number {
  const hf = health >= 80 ? 0.6 : health >= 60 ? 0.9 : health >= 40 ? 1.4 : health >= 20 ? 2.5 : 5
  return Math.min(1, 0.0008 * Math.exp(0.085 * (age - 30)) * hf)
}

/**
 * 亲人的年度变化：父母老去（离世时写入 parent-lost / parents-gone 标记，由事件接住），
 * 感情不经营会慢慢变淡，伴侣也会老去（离世时写入 partner-lost），记录孩子的出生年份。
 */
export function relationsDrift(s: GameState, rng: Rng): void {
  const r = s.rel
  const f = s.flags
  const pa = relOf(s, 'parentAge')
  if (r.parentsLost < 2) {
    if (pa > 55) r.parents = clamp(r.parents - (pa - 55) * 0.12, 0, 100)
    const alive = 2 - r.parentsLost
    for (let i = 0; i < alive; i++) {
      if (rng() >= mortality(pa, r.parents)) continue
      r.parentsLost += 1
      f.add(r.parentsLost === 1 ? 'parent-lost' : 'parents-gone')
    }
  }
  if (!f.has('partner') && !f.has('married')) r.partner = 0
  else if (r.partner <= 0) r.partner = 70
  else {
    // 不经营就会变淡：每年 -2，过得开心少掉一点，过得很糟掉得更快
    const h = s.stats.happiness
    r.partner = clamp(r.partner - 2 + (h >= 75 ? 1 : 0) - (h < 35 ? 2 : 0), 1, 100)
  }
  // 伴侣与主角同龄，按同样的死亡率老去
  if (f.has('married') && !f.has('partner-lost') && s.age >= 50 && rng() < mortality(s.age, 70)) f.add('partner-lost')
  if (f.has('has-child') && !r.childBorn) r.childBorn = s.year
}

/** 年度结算：自然变化、亲人、长一岁、死亡判定。返回 true 表示继续 */
export function endYear(s: GameState, rng: Rng = Math.random): boolean {
  yearlyDrift(s)
  relationsDrift(s, rng)
  s.age += 1
  s.year += 1
  if (s.stats.health <= 0 || s.age >= s.maxAge || rng() < mortality(s.age, s.stats.health)) {
    s.alive = false
    return false
  }
  return true
}

/** 结局六维评分（0-100），总分加权 */
export function endingDims(s: GameState): Record<EndingDim, number> {
  const f = s.flags
  const love = s.rel.partner || 70
  const family =
    (f.has('married') ? 10 + love * 0.25 : f.has('partner') ? 15 : 0) + (f.has('has-child') ? 25 : 0) +
    (f.has('best-friend') ? 15 : 0) + (f.has('parents-trust') ? 10 : 0) + (f.has('own-house') ? 10 : 0) +
    (f.has('filial') ? 10 : 0) + (f.has('grandchild') ? 10 : 0)
  return {
    wealth: clamp(Math.log10(Math.max(1, s.stats.wealth)) * 12.5, 0, 100),
    influence: clamp(s.stats.influence, 0, 100),
    world: clamp(s.divergence, 0, 100),
    family: clamp(family, 0, 100),
    joy: clamp(s.joyYears ? s.joySum / s.joyYears : s.stats.happiness, 0, 100),
    longevity: clamp((s.age - 50) * 2, 0, 100),
  }
}

const DIM_WEIGHT: Record<EndingDim, number> = { wealth: 0.25, influence: 0.2, world: 0.15, family: 0.15, joy: 0.15, longevity: 0.1 }

/** 某一年的新闻：已改写的锚点显示玩家世界线的版本 */
export function headlinesFor(s: GameState, pool: Headline[], year = s.year): { text: string; altered: boolean }[] {
  return pool
    .filter((h) => h.year === year && meets(s, h.requires))
    .map((h) => {
      const altered = !!h.anchor && h.anchor in s.altered && !!h.altered
      return { text: altered ? h.altered! : h.real, altered }
    })
}

/**
 * 世界线对比：已经过去的锚点新闻“原历史 vs 你的世界”。
 * 当年还没过完的锚点不显示（免得剧透预知题），已经被改写的除外。
 */
export function worldlineDiff(s: GameState, pool: Headline[]): { year: number; real: string; mine?: string }[] {
  return pool
    .filter((h) => h.anchor && (h.year < s.year || (h.year === s.year && h.anchor in s.altered)))
    .map((h) => ({ year: h.year, real: h.real, mine: h.anchor! in s.altered ? h.altered : undefined }))
}

export function computeEnding(s: GameState, headlines: Headline[] = []): Ending {
  const w = s.stats.wealth
  const dims = endingDims(s)
  const score = Math.round((Object.keys(dims) as EndingDim[]).reduce((a, k) => a + dims[k] * DIM_WEIGHT[k], 0))
  let grade: Ending['grade'] = 'D'
  if (score >= 70) grade = 'S'
  else if (score >= 58) grade = 'A'
  else if (score >= 45) grade = 'B'
  else if (score >= 32) grade = 'C'

  const f = s.flags
  const lonely = !f.has('married') && !f.has('partner') && !f.has('best-friend')
  const common = s.origin?.rarity === 'common'
  // 称号按优先级取第一个满足的
  const titles: [boolean, string][] = [
    [s.divergence >= 60 && s.stats.influence >= 60, '改写历史的人'],
    [f.has('ai-agi-mine') || (f.has('ai-company') && worldOf(s, 'ai-player') >= 90), 'AI 时代的缔造者'],
    [w >= 100000, '首富之路'],
    [s.divergence >= 30 && s.stats.fame < 30, '隐形的推手'],
    [s.age < 30, '重生又重逝'],
    [s.stats.fame >= 80, '一代传奇'],
    [w >= 10000 && common, '白手起家'],
    [w >= 10000, '富甲一方'],
    [s.age >= 100, '百岁人瑞'],
    [w < 0, '负债人生'],
    [s.age < 50, '英年早逝'],
    [(f.has('grandchild') && dims.joy >= 55) || (f.has('married') && f.has('has-child') && dims.joy >= 60), '儿孙满堂'],
    [lonely && s.stats.fame >= 30, '孤独的先知'],
    [dims.joy >= 72, '知足常乐'],
    [w >= 500, '小富即安'],
  ]
  const title = titles.find(([ok]) => ok)?.[1] ?? '平凡但真实的一生'
  const summary = `享年 ${s.age} 岁（${BIRTH_YEAR}—${s.year}）。财富 ${formatWealth(w)}，世界线偏离度 ${Math.round(s.divergence)}%。`
  const changed = worldlineDiff(s, headlines).filter((d) => d.mine).map((d) => `${d.year}：${d.mine}`)
  const newspaper = changed.length ? changed.slice(-5) : ['世界照常运转。史书上没有你的名字，但你认真地活过了这一生。']
  return { grade, title, summary, dims, score, newspaper }
}

export function formatWealth(wan: number): string {
  const abs = Math.abs(wan)
  const sign = wan < 0 ? '-' : ''
  if (abs >= 100000000) return `${sign}${(abs / 100000000).toFixed(1)}万亿`
  if (abs >= 10000) return `${sign}${(abs / 10000).toFixed(1)}亿`
  return `${sign}${Math.round(abs)}万`
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}
