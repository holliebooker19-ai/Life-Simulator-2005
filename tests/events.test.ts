import { describe, expect, it } from 'vitest'
import { ALL_EVENTS } from '../src/data/events'

// 真实人名/公司名黑名单：出现即说明没有按 docs/NAMING.md 改名
const FORBIDDEN = ['马斯克', 'Musk', 'OpenAI', 'Anthropic', 'Twitter', '推特', 'ChatGPT', 'Claude', '特朗普', 'Trump']

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
    for (const w of FORBIDDEN) expect(blob.includes(w), `出现未改名的词：${w}`).toBe(false)
  })
})
