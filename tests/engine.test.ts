import { describe, expect, it } from 'vitest'
import {
  actionPoints, pacing, applyEffects, computeEnding, endYear, headlinesFor, influenceIncome, isShifted, joyBaseline, meets,
  memoryReliability, mortality, newState, pickEvents, presentEvent, resolveChoice, settleYear, worldlineDiff, yearlyDrift,
} from '../src/engine'
import { deserialize, serialize } from '../src/save'

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

describe('写实人生（P1）', () => {
  it('属性上限 100，财富不设上限', () => {
    const s = newState()
    applyEffects(s, { stats: { charm: 500, wealth: 999999 } })
    expect(s.stats.charm).toBe(100)
    expect(s.stats.wealth).toBe(999999)
  })

  it('快乐每年向基准值回落', () => {
    const s = newState(); s.age = 20; s.stats.happiness = 100
    yearlyDrift(s)
    expect(s.stats.happiness).toBeLessThan(100)
    expect(s.stats.happiness).toBeGreaterThan(joyBaseline(s))
    const sad = newState(); sad.age = 20; sad.stats.happiness = 0
    yearlyDrift(sad)
    expect(sad.stats.happiness).toBeGreaterThan(0)
  })

  it('死亡概率随年龄上升、体质越差越高', () => {
    expect(mortality(80, 70)).toBeGreaterThan(mortality(40, 70))
    expect(mortality(70, 10)).toBeGreaterThan(mortality(70, 90))
  })

  it('寿命上限由 maxAge 决定，可被科技树提高', () => {
    const s = newState(); s.age = 99; s.year = 2097; s.stats.health = 100
    expect(endYear(s, () => 1)).toBe(false)
    const t = newState(); t.age = 99; t.year = 2097; t.stats.health = 100; t.maxAge = 150
    expect(endYear(t, () => 1)).toBe(true)
  })

  it('年度账单：成年后结算工资与开销，未成年不结算', () => {
    const kid = newState(); kid.age = 10
    expect(settleYear(kid).lines).toHaveLength(0)
    const s = newState(); s.age = 25; s.flags.add('employed')
    const w = s.stats.wealth
    const bill = settleYear(s)
    expect(bill.income).toBeGreaterThan(0)
    expect(bill.expense).toBeGreaterThan(0)
    expect(s.stats.wealth).toBeCloseTo(w + bill.income - bill.expense)
  })

  it('60 岁退休：工作换成退休金', () => {
    const s = newState(); s.age = 60; s.flags.add('employed')
    settleYear(s)
    expect(s.flags.has('employed')).toBe(false)
    expect(s.flags.has('retired')).toBe(true)
  })

  it('同一年固定事件最多 4 个，优先保留稀有的', () => {
    const s = newState(); s.year = 2016; s.age = 18
    const mk = (id: string, rarity?: 'rare' | 'legendary') => ({ id, category: 'world' as const, year: 2016, rarity, title: id, text: id })
    const pool = [mk('a'), mk('b'), mk('c'), mk('d', 'rare'), mk('e', 'legendary'), mk('f')]
    const ids = pickEvents(s, pool, () => 0.5, 0).map((e) => e.id)
    expect(ids).toEqual(['a', 'b', 'd', 'e'])
  })

  it('结局：六维评分，乱玩不该轻易拿 S', () => {
    const s = newState(); s.age = 70; s.year = 2068
    const e = computeEnding(s)
    expect(Object.keys(e.dims)).toHaveLength(6)
    expect(e.grade).not.toBe('S')
  })
})

describe('存档', () => {
  it('序列化后能还原 Set 字段', () => {
    const s = newState(); s.flags.add('employed'); s.seen.add('x'); s.altered.a = 3
    const back = deserialize(serialize(s))!
    expect(back.flags.has('employed')).toBe(true)
    expect(back.seen.has('x')).toBe(true)
    expect(back.altered).toEqual({ a: 3 })
    expect(deserialize('not json')).toBeNull()
  })
})

describe('世界状态与科技树（P3）', () => {
  it('Effects.world 累加并限制在 -100~100，Condition.worldMin/worldMax 读取它，未设置视为 0', () => {
    const s = newState()
    expect(meets(s, { worldMax: { 'tech-gene': 0 } })).toBe(true)
    applyEffects(s, { world: { 'tech-gene': 2, absurd: 500 } })
    expect(s.world['tech-gene']).toBe(2)
    expect(s.world.absurd).toBe(100)
    expect(meets(s, { worldMin: { 'tech-gene': 2 } })).toBe(true)
    expect(meets(s, { worldMin: { 'tech-gene': 3 } })).toBe(false)
  })

  it('Effects.maxAge 提高寿命上限（科技树延寿）', () => {
    const s = newState()
    applyEffects(s, { maxAge: 20 })
    expect(s.maxAge).toBe(120)
  })

  it('variants 按世界状态替换正文；dependsOn 的锚点被改写时标注偏移并让预知可靠度减半', () => {
    const s = newState(); s.year = 2010; s.stats.memory = 100
    const ev = {
      id: 'e', category: 'world' as const, title: 't', text: '原文', dependsOn: ['a'],
      variants: [{ requires: { altered: ['a'] }, text: '改写后' }],
    }
    expect(presentEvent(s, ev).text).toBe('原文')
    applyEffects(s, { alter: [{ id: 'a', scale: 1 }] })
    expect(presentEvent(s, ev).text).toContain('改写后')
    expect(presentEvent(s, ev).text).toContain('世界线已偏移')
    expect(isShifted(s, ev)).toBe(true)
    const choice = { text: 'c', usesMemory: true, outcomes: [{ tag: 'success' as const, text: 'ok' }, { tag: 'misremember' as const, text: 'bad' }] }
    // 可靠度约 0.97：不偏移时 0.6 判定成功，偏移后（减半）判定失败
    expect(resolveChoice(s, choice, () => 0.6).outcome.text).toBe('ok')
    expect(resolveChoice(s, choice, () => 0.6, true).outcome.text).toBe('bad')
  })

  it('新闻与世界线对比：改写后显示你的版本', () => {
    const pool = [{ year: 2008, anchor: 'x', real: '原', altered: '新' }, { year: 2008, real: '普通' }]
    const s = newState(); s.year = 2008
    expect(headlinesFor(s, pool).map((h) => h.text)).toEqual(['原', '普通'])
    applyEffects(s, { alter: [{ id: 'x', scale: 5 }] })
    expect(headlinesFor(s, pool)[0]).toEqual({ text: '新', altered: true })
    expect(worldlineDiff(s, pool)).toEqual([{ year: 2008, real: '原', mine: '新' }])
    expect(computeEnding(s, pool).newspaper[0]).toContain('新')
  })

  it('影响力：财富、名望、公司、基金会每年带来影响力', () => {
    const s = newState(); s.age = 30
    const base = influenceIncome(s)
    s.stats.wealth = 10000; s.flags.add('has-business'); s.flags.add('has-foundation')
    expect(influenceIncome(s)).toBeGreaterThan(base + 5)
  })
})
