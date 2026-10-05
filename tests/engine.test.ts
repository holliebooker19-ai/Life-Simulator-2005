import { describe, expect, it } from 'vitest'
import { actionPoints, pacing, applyEffects, endYear, meets, memoryReliability, newState, resolveChoice } from '../src/engine'

describe('engine', () => {
  it('偏离度越高，记忆越不可靠', () => {
    const a = newState(); a.year = 2015; a.stats.memory = 80
    const b = newState(); b.year = 2015; b.stats.memory = 80; b.divergence = 60
    expect(memoryReliability(a)).toBeGreaterThan(memoryReliability(b))
  })

  it('2026 年之后预知失效', () => {
    const s = newState(); s.year = 2030; s.stats.memory = 100
    expect(memoryReliability(s)).toBe(0)
  })

  it('usesMemory 选项按可靠度选取 success / misremember', () => {
    const s = newState(); s.year = 2010; s.stats.memory = 100
    const choice = {
      text: 't', usesMemory: true,
      outcomes: [
        { tag: 'success' as const, text: 'ok' },
        { tag: 'misremember' as const, text: 'bad' },
      ],
    }
    expect(resolveChoice(s, choice, () => 0).outcome.text).toBe('ok')
    expect(resolveChoice(s, choice, () => 0.999).outcome.text).toBe('bad')
  })

  it('健康归零则死亡', () => {
    const s = newState()
    applyEffects(s, { stats: { health: -999 } })
    expect(endYear(s)).toBe(false)
    expect(s.alive).toBe(false)
  })
})

describe('年份条件与行动点', () => {
  it('minYear / maxYear 限制可用年份', () => {
    const s = newState(); s.year = 2010
    expect(meets(s, { minYear: 2006, maxYear: 2026 })).toBe(true)
    expect(meets(s, { minYear: 2012 })).toBe(false)
    expect(meets(s, { maxYear: 2005 })).toBe(false)
  })

  it('襁褓期（<7 岁）没有行动，之后行动点随年龄增加', () => {
    const s = newState()
    s.age = 3; expect(actionPoints(s)).toBe(0)
    s.age = 7; expect(actionPoints(s)).toBe(2)
    s.age = 10; expect(actionPoints(s)).toBe(2)
    s.age = 25; expect(actionPoints(s)).toBe(3)
  })
})

describe('节奏 pacing', () => {
  it('襁褓期自动继续、无自由发挥选项；之后恢复', () => {
    const s = newState()
    s.age = 2
    expect(pacing(s)).toMatchObject({ randomEvents: 0, extraChoices: 0, autoAdvance: true })
    s.age = 5
    expect(pacing(s)).toMatchObject({ actionPoints: 0, extraChoices: 0, autoAdvance: true })
    s.age = 8
    expect(pacing(s)).toMatchObject({ actionPoints: 2, extraChoices: 2, autoAdvance: false })
  })
})

describe('世界线：只有改写锚点才产生偏离', () => {
  it('个人收益不改变偏离度，也不降低记忆可靠度', () => {
    const s = newState(); s.year = 2010; s.stats.memory = 80
    const before = memoryReliability(s)
    applyEffects(s, { stats: { wealth: 500, fame: 10, influence: 5 } })
    expect(s.divergence).toBe(0)
    expect(memoryReliability(s)).toBe(before)
  })

  it('alter 记录被改写的锚点，偏离度为 scale 之和，重复改写取较大值', () => {
    const s = newState()
    applyEffects(s, { alter: [{ id: 'a', scale: 10 }] })
    applyEffects(s, { alter: [{ id: 'b', scale: 15 }, { id: 'a', scale: 5 }] })
    expect(s.altered).toEqual({ a: 10, b: 15 })
    expect(s.divergence).toBe(25)
    applyEffects(s, { alter: [{ id: 'c', scale: 99 }] })
    expect(s.divergence).toBe(100)
  })

  it('altered / notAltered 条件区分“改写后”与“真实”版本', () => {
    const s = newState()
    expect(meets(s, { notAltered: ['a'] })).toBe(true)
    expect(meets(s, { altered: ['a'] })).toBe(false)
    applyEffects(s, { alter: [{ id: 'a', scale: 3 }] })
    expect(meets(s, { notAltered: ['a'] })).toBe(false)
    expect(meets(s, { altered: ['a'] })).toBe(true)
  })
})
