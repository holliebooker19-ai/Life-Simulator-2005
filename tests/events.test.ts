import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ALL_ACTIONS } from '../src/data/actions'
import { ALL_EVENTS } from '../src/data/events'
import { EXTRA_CHOICES } from '../src/data/extra-choices'
import { availableActions, markAction, newState, withExtraChoices } from '../src/engine'

// 真实人名/公司名黑名单：出现即说明没有按 docs/NAMING.md 改名
const FORBIDDEN = ['马斯克', 'Musk', 'OpenAI', 'Anthropic', 'Twitter', '推特', 'ChatGPT', 'Claude', '特朗普', 'Trump', '习近平', '普京', '拜登', '奥巴马', 'Putin', 'Biden', 'Obama']

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
