import { describe, expect, it } from 'vitest'
import { actionPoints, applyEffects, endYear, meets, memoryReliability, newState, resolveChoice } from '../src/engine'

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

  it('行动点随年龄增加', () => {
    const s = newState()
    s.age = 3; expect(actionPoints(s)).toBe(1)
    s.age = 10; expect(actionPoints(s)).toBe(2)
    s.age = 25; expect(actionPoints(s)).toBe(3)
  })
})
