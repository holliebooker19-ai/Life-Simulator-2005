import type {
  Choice, GameAction, Condition, Effects, Ending, GameEvent, GameState, Origin, Outcome, Stats, StatKey, Talent,
} from './types'
import { weightedPick, type Rng } from './rng'

export const BIRTH_YEAR = 1998
/** 现实记忆的终点：之后不再有“预知”，进入自行经营世界线阶段 */
export const MEMORY_END_YEAR = 2026
export const MAX_AGE = 70

export function newState(): GameState {
  return {
    year: BIRTH_YEAR,
    age: 0,
    alive: true,
    stats: { intelligence: 30, charm: 30, health: 70, happiness: 50, fame: 0, influence: 0, memory: 50, wealth: 0 },
    divergence: 0,
    flags: new Set(),
    seen: new Set(),
    lastDone: {},
    talents: [],
    origin: null,
    log: [],
  }
}

export function applyEffects(s: GameState, e?: Effects): void {
  if (!e) return
  if (e.stats) {
    for (const k of Object.keys(e.stats) as StatKey[]) {
      s.stats[k] += e.stats[k] ?? 0
    }
  }
  if (e.divergence) s.divergence = clamp(s.divergence + e.divergence, 0, 100)
  e.addFlags?.forEach((f) => s.flags.add(f))
  e.removeFlags?.forEach((f) => s.flags.delete(f))
  clampStats(s.stats)
}

function clampStats(st: Stats): void {
  const keys: StatKey[] = ['intelligence', 'charm', 'health', 'happiness', 'fame', 'influence', 'memory']
  for (const k of keys) st[k] = Math.min(150, Math.max(k === 'health' ? -999 : 0, st[k]))
}

export function meets(s: GameState, c?: Condition): boolean {
  if (!c) return true
  if (c.minAge !== undefined && s.age < c.minAge) return false
  if (c.maxAge !== undefined && s.age > c.maxAge) return false
  if (c.minYear !== undefined && s.year < c.minYear) return false
  if (c.maxYear !== undefined && s.year > c.maxYear) return false
  if (c.divergenceMin !== undefined && s.divergence < c.divergenceMin) return false
  if (c.divergenceMax !== undefined && s.divergence > c.divergenceMax) return false
  for (const k of Object.keys(c.statMin ?? {}) as StatKey[]) if (s.stats[k] < (c.statMin![k] ?? 0)) return false
  for (const k of Object.keys(c.statMax ?? {}) as StatKey[]) if (s.stats[k] > (c.statMax![k] ?? 0)) return false
  if (c.flags?.some((f) => !s.flags.has(f))) return false
  if (c.notFlags?.some((f) => s.flags.has(f))) return false
  return true
}

export function applyTalentOrigin(s: GameState, talents: Talent[], origin: Origin): void {
  s.talents = talents
  s.origin = origin
  applyEffects(s, origin.effects)
  talents.forEach((t) => applyEffects(s, t.effects))
}

/** 选出本年要触发的事件：先固定年份事件，再按权重抽随机事件 */
export function pickEvents(s: GameState, pool: GameEvent[], rng: Rng, maxRandom = 1): GameEvent[] {
  const available = pool.filter((e) => (e.once === false || !s.seen.has(e.id)) && meets(s, e.requires))
  const fixed = available.filter((e) => e.year === s.year)
  const randoms: GameEvent[] = []
  const candidates = available.filter((e) => e.year === undefined && s.age >= 0)
  for (let i = 0; i < maxRandom; i++) {
    const pick = weightedPick(candidates.filter((c) => !randoms.includes(c)), eventWeight, rng)
    if (pick) randoms.push(pick)
  }
  return [...fixed, ...randoms]
}

function eventWeight(e: GameEvent): number {
  const base = e.weight ?? 10
  return e.rarity === 'legendary' ? base * 0.2 : e.rarity === 'rare' ? base * 0.5 : base
}

/** 每年可用的行动点数：小时候少，成年后多 */
export function actionPoints(s: GameState): number {
  return s.age < 6 ? 1 : s.age < 18 ? 2 : 3
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

export function resolveChoice(
  s: GameState,
  choice: Choice,
  rng: Rng,
): { outcome: Outcome; reliable?: boolean } {
  let pool = choice.outcomes.filter((o) => meets(s, o.requires))
  let reliable: boolean | undefined
  if (choice.usesMemory) {
    reliable = rng() < memoryReliability(s)
    const wanted = reliable ? 'success' : 'misremember'
    const tagged = pool.filter((o) => o.tag === wanted)
    // 不可靠但没有写 misremember 时，退化为 fail，再退化为全部
    const fallback = pool.filter((o) => o.tag === 'fail')
    pool = tagged.length ? tagged : !reliable && fallback.length ? fallback : pool
  } else {
    pool = pool.filter((o) => o.tag === undefined || o.tag === 'success' || o.tag === 'fail')
  }
  const outcome = weightedPick(pool, (o) => o.weight ?? 1, rng) ?? choice.outcomes[0]
  return { outcome, reliable }
}

export function pushLog(s: GameState, title: string, text: string, rarity?: GameEvent['rarity']): void {
  s.log.push({ year: s.year, age: s.age, title, text, rarity })
}

/** 年度结算：自然变化、死亡判定。返回 true 表示继续 */
export function endYear(s: GameState): boolean {
  s.age += 1
  s.year += 1
  // 年龄带来的自然健康衰减
  if (s.age > 45) s.stats.health -= Math.floor((s.age - 40) / 8)
  if (s.stats.health <= 0 || s.age >= MAX_AGE) {
    s.alive = false
    return false
  }
  return true
}

export function computeEnding(s: GameState): Ending {
  const w = s.stats.wealth
  const score =
    Math.log10(Math.max(1, w)) * 12 + s.stats.fame * 0.6 + s.stats.influence * 0.9 + s.divergence * 0.3 + s.stats.happiness * 0.3
  const worldChanged = s.divergence >= 60 && s.stats.influence >= 60
  let grade: Ending['grade'] = 'D'
  if (score >= 140) grade = 'S'
  else if (score >= 100) grade = 'A'
  else if (score >= 65) grade = 'B'
  else if (score >= 35) grade = 'C'

  let title = '平凡但真实的一生'
  if (worldChanged) title = '改写历史的人'
  else if (w >= 100000) title = '首富之路'
  else if (s.stats.health <= 0 && s.age < 30) title = '重生又重逝'
  else if (s.stats.happiness >= 90) title = '知足常乐'
  else if (w < 0) title = '负债人生'

  const summary = `享年 ${s.age} 岁（${BIRTH_YEAR}—${s.year}）。财富 ${formatWealth(w)}，世界线偏离度 ${Math.round(s.divergence)}%。`
  return { grade, title, summary }
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
