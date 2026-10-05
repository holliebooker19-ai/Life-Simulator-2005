import { ALL_ACTIONS } from './data/actions'
import { ALL_EVENTS } from './data/events'
import { EXTRA_CHOICES } from './data/extra-choices'
import { HEADLINES } from './data/headlines'
import { QUIZZES } from './data/quizzes'
import { ORIGINS, TALENTS } from './data/talents'
import {
  applyEffects, applyTalentOrigin, availableActions, computeEnding, endYear, formatWealth, headlinesFor, isShifted, markAction,
  meets, newState, pacing, pickEvents, presentEvent, pushLog, quizHint, resolveChoice, settleYear, withExtraChoices,
} from './engine'
import { weightedPick, type Rng } from './rng'
import type {
  Choice, Ending, GameAction, GameEvent, GameState, MemoryCheck, Origin, Outcome, Quiz, QuizHint, Rarity, StatDelta, Talent,
} from './types'

const RARITY_WEIGHT: Record<Rarity, number> = { common: 70, rare: 25, legendary: 5 }

export const ALLOC_STATS = ['intelligence', 'charm', 'health', 'happiness', 'memory'] as const
/** 开局可自由分配的点数：抽卡模式给得多，手动挑选模式给得少，两者总体平衡 */
export const START_POINTS = { draw: 20, pick: 8 }
export const START_REROLLS = 5
/** 单项属性最多分配多少点 */
export const ALLOC_MAX = 15

export function drawOrigin(rng: Rng = Math.random): Origin {
  return weightedPick(ORIGINS, (o) => RARITY_WEIGHT[o.rarity], rng)!
}

export function drawTalent(exclude: Talent[], rng: Rng = Math.random): Talent {
  return weightedPick(TALENTS.filter((t) => !exclude.includes(t)), (x) => RARITY_WEIGHT[x.rarity], rng)!
}

export function drawStart(rng: Rng = Math.random): { origin: Origin; talents: Talent[] } {
  const origin = weightedPick(ORIGINS, (o) => RARITY_WEIGHT[o.rarity], rng)!
  const pool = [...TALENTS]
  const talents: Talent[] = []
  for (let i = 0; i < 3 && pool.length; i++) {
    const t = weightedPick(pool, (x) => RARITY_WEIGHT[x.rarity], rng)!
    talents.push(t)
    pool.splice(pool.indexOf(t), 1)
  }
  return { origin, talents }
}

/** UI 需要实现的交互接口，引擎本身不依赖 DOM，便于测试 */
export interface Host {
  showAuto(event: GameEvent, state: GameState): Promise<void>
  showChoice(event: GameEvent, choices: Choice[], state: GameState): Promise<Choice>
  /** 年度自由行动：返回 null 表示“顺其自然”，跳过本年剩余行动点 */
  showActions(state: GameState, actions: GameAction[], points: number): Promise<GameAction | null>
  /**
   * 预知题：返回选项下标，或 null 表示“交给直觉”。不实现时一律交给直觉（测试、模拟用）。
   */
  showQuiz?(event: GameEvent, choice: Choice, quiz: Quiz, hint: QuizHint, state: GameState): Promise<number | null>
  /** check 是预知选项的判定结果；auto 为 true 时不需要玩家点“继续”（襁褓期提速） */
  showOutcome(event: GameEvent, outcome: Outcome, check: MemoryCheck | undefined, state: GameState, auto?: boolean): Promise<void>
  onYear(state: GameState): void
}

/** 把行动包装成事件，复用 Host 的结果展示 */
function actionEvent(a: GameAction): GameEvent {
  return { id: a.id, category: 'life', title: a.text, text: a.hint ?? '' }
}

/**
 * 跑完一整局。传入 resume 时从存档的年初继续（忽略 origin/talents/bonus）。
 */
export async function runGame(
  origin: Origin, talents: Talent[], host: Host, rng: Rng = Math.random, bonus: StatDelta = {}, resume?: GameState,
): Promise<{ state: GameState; ending: Ending }> {
  const s = resume ?? newState()
  if (!resume) {
    applyTalentOrigin(s, talents, origin)
    applyEffects(s, { stats: bonus })
  }
  host.onYear(s)

  while (s.alive) {
    const pace = pacing(s)
    const events = pickEvents(s, ALL_EVENTS, rng, pace.randomEvents)
    for (const raw of events) {
      s.seen.add(raw.id)
      const ev = presentEvent(s, raw)
      const shifted = isShifted(s, raw)
      const base = ev.choices?.filter((c) => meets(s, c.requires)) ?? []
      const visible = base.length ? withExtraChoices(s, base, EXTRA_CHOICES, rng, pace.extraChoices) : []
      if (!ev.choices || visible.length === 0) {
        applyEffects(s, ev.effects)
        pushLog(s, ev.title, ev.text, ev.rarity)
        await host.showAuto(ev, s)
      } else {
        const choice = await host.showChoice(ev, visible, s)
        const quiz = choice.usesMemory ? choice.quiz ?? raw.quiz ?? QUIZZES[raw.id] : undefined
        let pick: number | null = null
        if (quiz && host.showQuiz) pick = await host.showQuiz(ev, choice, quiz, quizHint(s, quiz, rng, shifted), s)
        const { outcome, check } = resolveChoice(s, choice, rng, { shifted, quiz, pick })
        applyEffects(s, outcome.effects)
        pushLog(s, ev.title, `${choice.text} → ${outcome.text}`, ev.rarity)
        await host.showOutcome(ev, outcome, check, s, pace.autoAdvance)
      }
      if (s.stats.health <= 0) { s.alive = false; break }
    }
    if (!s.alive) break
    for (let points = pace.actionPoints; points > 0; points--) {
      const act = await host.showActions(s, availableActions(s, ALL_ACTIONS), points)
      if (!act) break
      markAction(s, act)
      const { outcome, check } = resolveChoice(s, act, rng)
      applyEffects(s, outcome.effects)
      pushLog(s, act.text, outcome.text)
      await host.showOutcome(actionEvent(act), outcome, check, s)
      if (s.stats.health <= 0) { s.alive = false; break }
    }
    if (!s.alive) break
    // 年终新闻回顾：放在年底，避免年初就把当年的比分、走势剧透给预知题；当年改写的锚点会立刻显示新版本
    const news = headlinesFor(s, HEADLINES)
    if (news.length) {
      const text = news.map((n) => (n.altered ? `【你的世界线】${n.text}` : n.text)).join('；')
      await host.showAuto({ id: 'year-news', category: 'world', rarity: news.some((n) => n.altered) ? 'rare' : undefined, title: '年度新闻', text }, s)
    }
    const bill = settleYear(s)
    if (bill.lines.length) {
      const net = bill.income - bill.expense
      const text = `${bill.lines.join('，')}。净${net >= 0 ? '收入' : '支出'} ${formatWealth(Math.abs(net))}。`
      pushLog(s, '年度账单', text)
      await host.showAuto({ id: 'year-bill', category: 'life', title: '年度账单', text }, s)
    }
    if (!endYear(s, rng)) break
    host.onYear(s)
  }
  return { state: s, ending: computeEnding(s, HEADLINES) }
}
