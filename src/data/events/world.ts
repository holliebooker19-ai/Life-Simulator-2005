import type { GameEvent } from '../../types'

export const worldEvents: GameEvent[] = [
  {
    id: 'world-ai-lab',
    category: 'world',
    rarity: 'legendary',
    requires: { minAge: 18, statMin: { intelligence: 70, wealth: 1000 } },
    weight: 6,
    title: 'closeai 的邀请',
    text: '你早在 2023 年之前就知道大模型会改变世界。有一家叫 closeai 的公司，正愁没有足够的钱。',
    realFact: '示意：2022 年末起大语言模型应用迅速爆发。涉及真实公司，已改名处理，见 docs/NAMING.md。',
    choices: [
      {
        text: '投资他们，并要求写入“开源”条款',
        outcomes: [{ text: '你成了早期金主之一，世界的 AI 格局因为你的一纸条款发生了偏移。', effects: { stats: { influence: 20, fame: 15, wealth: 2000 }, divergence: 20, addFlags: ['ai-opensource'] } }],
      },
      { text: '跟着赚一笔就走', outcomes: [{ text: '你赚了一笔不小的钱。', effects: { stats: { wealth: 800 }, divergence: 3 } }] },
      { text: '自己创业做竞品', outcomes: [{ text: '你创立了熵派（Entropic），和 closeai 展开了激烈竞争。', effects: { stats: { influence: 15, fame: 10, wealth: -500 }, divergence: 15, addFlags: ['ai-founder'] } }] },
    ],
  },
  {
    id: 'absurd-richest-man',
    category: 'absurd',
    rarity: 'legendary',
    requires: { statMin: { wealth: 100000, influence: 80 }, divergenceMin: 50 },
    weight: 30,
    title: '世界首富的奇怪提案',
    text: '你的财富已经超过了所有人。联合国秘书长私下找到你：能不能把下一届世界杯办在你的私人岛屿上？',
    choices: [
      { text: '答应，并亲自担任名誉裁判', outcomes: [{ text: '全世界都在看，你把足球变成了一场更荒诞的表演。', effects: { stats: { fame: 30, influence: 15, happiness: 10 }, divergence: 15, addFlags: ['world-cup-on-island'] } }] },
      { text: '拒绝，把钱投到教育', outcomes: [{ text: '你捐建了几千所学校，史书给了你一个不太有趣但很体面的评价。', effects: { stats: { fame: 15, influence: 10, wealth: -10000 }, divergence: 5 } }] },
    ],
  },
]
