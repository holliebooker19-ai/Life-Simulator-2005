import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ALL_ACTIONS } from '../src/data/actions'
import { ALL_EVENTS } from '../src/data/events'
import { EXTRA_CHOICES } from '../src/data/extra-choices'
import { HEADLINES } from '../src/data/headlines'
import { QUIZZES } from '../src/data/quizzes'
import { WORLD_VARS } from '../src/data/world'
import type { Choice, Condition } from '../src/types'
import { availableActions, markAction, newState, withExtraChoices } from '../src/engine'

// 真实人名/公司名黑名单：出现即说明没有按 docs/NAMING.md 改名
const FORBIDDEN = ['马斯克', 'Musk', 'OpenAI', 'Anthropic', 'Twitter', '推特', 'ChatGPT', 'Claude', '特朗普', 'Trump', '习近平', '普京', '拜登', '奥巴马', 'Putin', 'Biden', 'Obama', '梅西', '伊涅斯塔', 'C罗']

/** 从改名表（docs/NAMING.md 与 docs/naming/*.md）自动提取“现实”列，作为额外黑名单 */
function namingForbidden(): string[] {
  const files = ['docs/NAMING.md']
  try { for (const f of readdirSync('docs/naming')) if (f.endsWith('.md')) files.push(`docs/naming/${f}`) } catch { /* 目录可选 */ }
  const words: string[] = []
  for (const f of files) {
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^\|([^|]+)\|[^|]+\|/)
      if (!m || /^[\s-]+$/.test(m[1]) || m[1].trim() === '现实') continue
      m[1].replace(/（[^）]*）|\([^)]*\)/g, '').split('/').map((w) => w.trim()).filter((w) => w.length >= 2).forEach((w) => words.push(w))
    }
  }
  return words
}

describe('events', () => {
  it('id 全局唯一', () => {
    const ids = ALL_EVENTS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('字段完整', () => {
    for (const e of ALL_EVENTS) {
      expect(e.title, e.id).toBeTruthy()
      expect(e.text, e.id).toBeTruthy()
      for (const c of e.choices ?? []) {
        expect(c.outcomes.length, `${e.id}: 选项缺少 outcomes`).toBeGreaterThan(0)
      }
    }
  })

  it('带选项的事件至少有一个无条件选项，避免卡死', () => {
    for (const e of ALL_EVENTS) {
      if (e.choices) expect(e.choices.some((c) => !c.requires), e.id).toBe(true)
    }
  })

  it('usesMemory 的选项必须有 success 与 misremember/fail 结果', () => {
    for (const e of ALL_EVENTS) {
      for (const c of e.choices ?? []) {
        if (!c.usesMemory) continue
        expect(c.outcomes.some((o) => o.tag === 'success'), `${e.id}: 缺少 success`).toBe(true)
        expect(c.outcomes.some((o) => o.tag === 'misremember' || o.tag === 'fail'), `${e.id}: 缺少 misremember/fail`).toBe(true)
      }
    }
  })

  it('没有 year 的随机事件，正文提到具体年份时必须限定 minYear（避免现实内容出现在错误年份）', () => {
    for (const e of ALL_EVENTS) {
      if (e.year !== undefined) continue
      if (/(19|20)\d\d\s*年/.test(`${e.text}${JSON.stringify(e.choices ?? [])}`)) {
        expect(e.requires?.minYear, `${e.id}: 随机事件提到了具体年份，请改成固定年份事件或加 minYear`).toBeDefined()
      }
    }
  })

  it('alter 必须指向存在的事件 id', () => {
    const ids = new Set(ALL_EVENTS.map((e) => e.id))
    for (const e of ALL_EVENTS) {
      for (const c of e.choices ?? []) for (const o of c.outcomes) for (const a of o.effects?.alter ?? []) {
        expect(ids.has(a.id), `${e.id}: alter 的锚点 ${a.id} 不存在`).toBe(true)
        expect(a.scale, e.id).toBeGreaterThan(0)
        expect(a.scale, e.id).toBeLessThanOrEqual(25)
      }
    }
  })

  it('涉及现实年份的事件必须有 realFact', () => {
    for (const e of ALL_EVENTS) if (e.year !== undefined) expect(e.realFact, e.id).toBeTruthy()
  })

  it('不含真实人名/公司名', () => {
    const blob = JSON.stringify(ALL_EVENTS)
    for (const w of [...FORBIDDEN, ...namingForbidden()]) expect(blob.includes(w), `出现未改名的词：${w}`).toBe(false)
  })
})

describe('actions', () => {
  const ids = ALL_ACTIONS.map((a) => a.id)

  it('id 全局唯一，且不与事件重名', () => {
    expect(new Set(ids).size).toBe(ids.length)
    const evIds = new Set(ALL_EVENTS.map((e) => e.id))
    for (const id of ids) expect(evIds.has(id), id).toBe(false)
  })

  it('字段完整，预知行动有 success 与 misremember/fail', () => {
    for (const a of ALL_ACTIONS) {
      expect(a.text, a.id).toBeTruthy()
      expect(a.outcomes.length, a.id).toBeGreaterThan(0)
      if (a.usesMemory) {
        expect(a.outcomes.some((o) => o.tag === 'success'), `${a.id}: 缺少 success`).toBe(true)
        expect(a.outcomes.some((o) => o.tag === 'misremember' || o.tag === 'fail'), `${a.id}: 缺少 misremember/fail`).toBe(true)
      }
    }
  })

  it('不含真实人名/公司名', () => {
    const blob = JSON.stringify([ALL_ACTIONS, EXTRA_CHOICES])
    for (const w of [...FORBIDDEN, ...namingForbidden()]) expect(blob.includes(w), `出现未改名的词：${w}`).toBe(false)
  })

  it('任何年龄的新角色都有足够多的行动可选', () => {
    for (let age = 0; age <= 70; age++) {
      const s = newState()
      s.age = age
      s.year = 1998 + age
      expect(availableActions(s, ALL_ACTIONS).length, `${age} 岁`).toBeGreaterThanOrEqual(age < 3 ? 2 : 4)
    }
  })

  it('一次性与冷却限制生效', () => {
    const s = newState()
    s.age = 30; s.year = 2028
    const once = ALL_ACTIONS.find((a) => a.once && !a.requires?.flags)!
    s.stats.wealth = 1000
    expect(availableActions(s, [once])).toHaveLength(1)
    markAction(s, once)
    expect(availableActions(s, [once])).toHaveLength(0)
    const cd = { ...ALL_ACTIONS[0], id: 'cd-test', once: false, cooldown: 2, requires: undefined }
    markAction(s, cd)
    expect(availableActions(s, [cd])).toHaveLength(0)
    s.year += 3
    expect(availableActions(s, [cd])).toHaveLength(1)
  })

  it('事件会追加自由发挥选项，且保留原选项', () => {
    const s = newState(); s.age = 20
    const base = [{ text: 'a', outcomes: [{ text: 'x' }] }]
    const out = withExtraChoices(s, base, EXTRA_CHOICES, () => 0.5)
    expect(out[0]).toBe(base[0])
    expect(out.length).toBe(3)
    expect(out.slice(1).every((c) => c.free)).toBe(true)
  })
})

describe('世界线与科技树', () => {
  const known = new Set(WORLD_VARS.map((v) => v.id))
  const conds = (c?: Condition): string[] => [...Object.keys(c?.worldMin ?? {}), ...Object.keys(c?.worldMax ?? {})]
  const choiceKeys = (c: Choice): string[] => [
    ...conds(c.requires),
    ...c.outcomes.flatMap((o) => [...conds(o.requires), ...Object.keys(o.effects?.world ?? {})]),
  ]

  it('事件和行动里用到的世界变量都已登记（src/data/world.ts）', () => {
    const used = [
      ...ALL_EVENTS.flatMap((e) => [
        ...conds(e.requires), ...Object.keys(e.effects?.world ?? {}), ...(e.choices ?? []).flatMap(choiceKeys),
        ...(e.variants ?? []).flatMap((v) => conds(v.requires)),
      ]),
      ...ALL_ACTIONS.flatMap(choiceKeys),
    ]
    for (const k of used) expect(known.has(k), `未登记的世界变量：${k}`).toBe(true)
  })

  it('dependsOn 指向存在的事件', () => {
    const ids = new Set(ALL_EVENTS.map((e) => e.id))
    for (const e of ALL_EVENTS) for (const d of e.dependsOn ?? []) expect(ids.has(d), `${e.id}: dependsOn ${d} 不存在`).toBe(true)
  })

  it('新闻的锚点存在且年份一致；2026 年前每个可改写的锚点都有“改写版”新闻', () => {
    const byId = new Map(ALL_EVENTS.map((e) => [e.id, e]))
    for (const h of HEADLINES) {
      if (!h.anchor) continue
      const ev = byId.get(h.anchor)
      expect(ev, `新闻锚点不存在：${h.anchor}`).toBeDefined()
      if (ev?.year !== undefined) expect(ev.year, h.anchor).toBe(h.year)
      expect(h.altered, `${h.anchor}: 缺少 altered`).toBeTruthy()
    }
    const anchored = new Set(HEADLINES.map((h) => h.anchor))
    const altered = ALL_EVENTS.flatMap((e) => (e.choices ?? []).flatMap((c) => c.outcomes.flatMap((o) => o.effects?.alter ?? [])))
    for (const a of altered) {
      const ev = byId.get(a.id)
      if (ev?.year !== undefined && ev.year <= 2026) expect(anchored.has(a.id), `可改写锚点缺少新闻：${a.id}`).toBe(true)
    }
  })

  it('新闻不含真实人名/公司名', () => {
    const blob = JSON.stringify(HEADLINES)
    for (const w of [...FORBIDDEN, ...namingForbidden()]) expect(blob.includes(w), `出现未改名的词：${w}`).toBe(false)
  })
})

describe('预知题库（P2）', () => {
  const byId = new Map(ALL_EVENTS.map((e) => [e.id, e]))
  /** 没法出确凿题目的现实事件（如高考作文题因省份而异），保留旧的掷骰判定 */
  const NO_QUIZ = ['y1620-2016-gaokao']

  it('题目指向存在的事件，且事件有利用记忆的选项；选项和答案合法', () => {
    for (const [id, q] of Object.entries(QUIZZES)) {
      const ev = byId.get(id)
      expect(ev, `题库里的 ${id} 不存在`).toBeDefined()
      expect(ev!.choices?.some((c) => c.usesMemory), `${id}: 没有利用记忆的选项`).toBe(true)
      expect(q.options.length, id).toBeGreaterThanOrEqual(3)
      expect(new Set(q.options).size, `${id}: 选项重复`).toBe(q.options.length)
      expect(q.answer, id).toBeGreaterThanOrEqual(0)
      expect(q.answer, id).toBeLessThan(q.options.length)
      if (q.shiftedAnswer !== undefined) expect(ev!.dependsOn?.length, `${id}: shiftedAnswer 需要 dependsOn`).toBeGreaterThan(0)
    }
  })

  it('2026 年前每个现实事件里的预知选项都有题目', () => {
    for (const e of ALL_EVENTS) {
      if (e.year === undefined || e.year > 2026 || NO_QUIZ.includes(e.id)) continue
      if (!e.choices?.some((c) => c.usesMemory)) continue
      expect(!!(e.quiz || QUIZZES[e.id] || e.choices.every((c) => !c.usesMemory || c.quiz)), `${e.id}: 缺少预知题`).toBe(true)
    }
  })

  it('题库里没有真名', () => {
    const blob = JSON.stringify(QUIZZES)
    for (const w of [...FORBIDDEN, ...namingForbidden()]) expect(blob.includes(w), `出现未改名的词：${w}`).toBe(false)
  })
})
