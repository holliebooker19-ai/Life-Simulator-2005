import { describe, expect, it } from 'vitest'
import { drawStart, runGame, type Host } from '../src/game'

const autoHost: Host = {
  onYear() {},
  async showAuto() {},
  async showChoice(_e, choices) { return choices[choices.length - 1] },
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
