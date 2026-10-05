import { describe, expect, it } from 'vitest'
import { drawStart, runGame, type Host } from '../src/game'

const autoHost: Host = {
  onYear() {},
  async showAuto() {},
  async showChoice(_e, choices) { return choices[choices.length - 1] },
  async showActions(_s, actions) { return actions[Math.floor(Math.random() * actions.length)] ?? null },
  async showOutcome() {},
}

describe('整局模拟', () => {
  it('随机 200 局都能正常结束', async () => {
    for (let i = 0; i < 200; i++) {
      const { origin, talents } = drawStart()
      const { state, ending } = await runGame(origin, talents, autoHost)
      expect(state.alive).toBe(false)
      expect(['S', 'A', 'B', 'C', 'D']).toContain(ending.grade)
    }
  })
})

describe('亲人与晚年（P5）', () => {
  it('里程碑事件一局最多一次；活得够久的人大多会送走父母', async () => {
    const once = /^(family-kid-|family-parent-farewell|family-parents-gone|family-widowed|later-crossroads|later-retire-party|later-80-birthday)/
    let long = 0, lost = 0
    for (let i = 0; i < 80; i++) {
      const { origin, talents } = drawStart()
      const count: Record<string, number> = {}
      const host: Host = {
        ...autoHost,
        async showChoice(e, choices) { count[e.id] = (count[e.id] ?? 0) + 1; return choices[0] },
      }
      const { state } = await runGame(origin, talents, host)
      for (const [id, n] of Object.entries(count)) if (once.test(id)) expect(n, id).toBe(1)
      if (state.age >= 65) { long++; if (state.rel.parentsLost > 0) lost++ }
    }
    expect(lost).toBeGreaterThan(long * 0.8)
  }, 60000)
})

describe('AI 主线默认走向', () => {
  it('玩家不干预时，closeai 先破产，国产模型随后洗牌', async () => {
    const at: Record<string, number[]> = { close: [], cn: [] }
    let n = 0
    for (let i = 0; i < 60; i++) {
      const { origin, talents } = drawStart()
      const year: Record<string, number> = {}
      const host: Host = {
        ...autoHost,
        onYear(s) {
          if (s.seen.has('ai-closeai-bankrupt')) year.close ??= s.year
          if (s.seen.has('ai-cn-shakeout')) year.cn ??= s.year
        },
      }
      const { state } = await runGame(origin, talents, host)
      if (state.year < 2040) continue
      n++
      if (year.close) at.close.push(year.close)
      if (year.cn) at.cn.push(year.cn)
    }
    const median = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]
    expect(at.close.length).toBeGreaterThan(n * 0.8)
    expect(at.cn.length).toBeGreaterThan(n * 0.8)
    expect(median(at.close)).toBeLessThan(median(at.cn))
  }, 60000)
})
