import type { GameAction } from '../../types'

/** 行动：身体。规范见 docs/EVENT_GUIDE.md；写入的标记汇总见 src/data/actions/index.ts。 */
export const bodyActions: GameAction[] = [
  {
    id: 'act-exercise', group: 'body', text: '坚持锻炼', hint: '体质↑，心情↑',
    requires: { minAge: 5, maxAge: 65 },
    outcomes: [
      { weight: 3, text: '跑步、跳绳、俯卧撑，一年下来你结实了不少。', effects: { stats: { health: 5, happiness: 2 }, addFlags: ['fit'] } },
      { weight: 1, text: '练得太猛，拉伤了腿，躺了几个星期。', effects: { stats: { health: -2, happiness: -2 } } },
    ],
  },
  {
    id: 'act-checkup', group: 'body', text: '去医院做个体检', hint: '体质小幅恢复',
    requires: { minAge: 20 },
    cooldown: 1,
    outcomes: [
      { weight: 3, text: '医生说一切正常，只是让你少熬夜。', effects: { stats: { health: 3, happiness: 1 } } },
      { weight: 1, text: '查出一点小毛病，早发现早治，你松了口气。', effects: { stats: { health: 6 } } },
    ],
  },
  {
    id: 'act-sleep-regular', group: 'body', text: '好好吃饭，规律作息', hint: '体质、心情稳稳上升',
    requires: { minAge: 3 },
    outcomes: [
      { text: '一年过得规律又踏实，精神头明显好了。', effects: { stats: { health: 3, happiness: 3 } } },
    ],
  },
  {
    id: 'act-sports-team', group: 'body', text: '加入一支球队', hint: '体质、魅力↑，也许交到朋友',
    requires: { minAge: 8, maxAge: 40 },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '你在球场上结识了一群好兄弟，输赢都开心。', effects: { stats: { health: 4, charm: 3, happiness: 4 } } },
      { weight: 1, text: '队里关系一般，踢了一年也没踢出名堂。', effects: { stats: { health: 3 } } },
    ],
  },
]
