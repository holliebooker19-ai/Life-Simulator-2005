import { ALL_ACTIONS } from './data/actions'
import { ALL_EVENTS } from './data/events'
import { EXTRA_CHOICES } from './data/extra-choices'
import { ORIGINS, TALENTS } from './data/talents'
import {
  actionPoints, applyEffects, applyTalentOrigin, availableActions, computeEnding, endYear, markAction, meets, newState,
  pickEvents, pushLog, resolveChoice, withExtraChoices,
} from './engine'
import { weightedPick, type Rng } from './rng'
import type { Choice, Ending, GameAction, GameEvent, GameState, Origin, Outcome, Rarity, Talent } from './types'

const RARITY_WEIGHT: Record<Rarity, number> = { common: 70, rare: 25, legendary: 5 }

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
  showOutcome(event: GameEvent, outcome: Outcome, reliable: boolean | undefined, state: GameState): Promise<void>
  onYear(state: GameState): void
}

/** 把行动包装成事件，复用 Host 的结果展示 */
function actionEvent(a: GameAction): GameEvent {
  return { id: a.id, category: 'life', title: a.text, text: a.hint ?? '' }
}

export async function runGame(origin: Origin, talents: Talent[], host: Host, rng: Rng = Math.random): Promise<{ state: GameState; ending: Ending }> {
  const s = newState()
  applyTalentOrigin(s, talents, origin)
  host.onYear(s)

  while (s.alive) {
    const events = pickEvents(s, ALL_EVENTS, rng, s.age < 6 ? 1 : 2)
    for (const ev of events) {
      s.seen.add(ev.id)
      const base = ev.choices?.filter((c) => meets(s, c.requires)) ?? []
      const visible = base.length ? withExtraChoices(s, base, EXTRA_CHOICES, rng) : []
      if (!ev.choices || visible.length === 0) {
        applyEffects(s, ev.effects)
        pushLog(s, ev.title, ev.text, ev.rarity)
        await host.showAuto(ev, s)
      } else {
        const choice = await host.showChoice(ev, visible, s)
        const { outcome, reliable } = resolveChoice(s, choice, rng)
        applyEffects(s, outcome.effects)
        pushLog(s, ev.title, `${choice.text} → ${outcome.text}`, ev.rarity)
        await host.showOutcome(ev, outcome, reliable, s)
      }
      if (s.stats.health <= 0) { s.alive = false; break }
    }
    if (!s.alive) break
    for (let points = actionPoints(s); points > 0; points--) {
      const act = await host.showActions(s, availableActions(s, ALL_ACTIONS), points)
      if (!act) break
      markAction(s, act)
      const { outcome, reliable } = resolveChoice(s, act, rng)
      applyEffects(s, outcome.effects)
      pushLog(s, act.text, outcome.text)
      await host.showOutcome(actionEvent(act), outcome, reliable, s)
      if (s.stats.health <= 0) { s.alive = false; break }
    }
    if (!s.alive) break
    if (!endYear(s)) break
    host.onYear(s)
  }
  return { state: s, ending: computeEnding(s) }
}
