import type { Choice } from '../types'

/**
 * 通用“自由发挥”选项：引擎会随机挑 2 个追加到每个带选项的事件后面，
 * 让玩家除了作者预设的路线，还能自己找个角度处理。
 * 文案刻意不指向具体事件，写任何事件都说得通。
 */
export const EXTRA_CHOICES: Choice[] = [
  {
    text: '找信得过的人商量商量',
    free: true,
    outcomes: [
      { weight: 3, text: '你听了听别人的看法，心里踏实了不少。', effects: { stats: { happiness: 2, charm: 1 } } },
      { weight: 1, text: '大家七嘴八舌，没聊出结论，倒是聊开心了。', effects: { stats: { happiness: 3 } } },
    ],
  },
  {
    text: '先拖着，观望一阵再说',
    free: true,
    outcomes: [
      { weight: 2, text: '你决定再看看。事情自己有了走向，没出什么岔子。', effects: {} },
      { weight: 1, text: '拖着拖着，机会悄悄溜走了。', effects: { stats: { happiness: -2 } } },
    ],
  },
  {
    text: '凭直觉随便来',
    free: true,
    outcomes: [
      { weight: 1, text: '歪打正着，运气居然站在你这边。', effects: { stats: { happiness: 4, charm: 2 } } },
      { weight: 1, text: '果然还是太随性了，白折腾了一场。', effects: { stats: { happiness: -3 } } },
    ],
  },
  {
    text: '把它记进“未来备忘录”，以后再说',
    free: true,
    requires: { minAge: 6, maxYear: 2026 },
    outcomes: [
      { text: '你把这件事认真写了下来，脑子里的细节清晰了一点。', effects: { stats: { memory: 2 } } },
    ],
  },
  {
    text: '换个思路，自己研究一下',
    free: true,
    requires: { minAge: 8 },
    outcomes: [
      { weight: 2, text: '你自己琢磨了一圈，虽然没解决问题，但长了不少见识。', effects: { stats: { intelligence: 3 } } },
      { weight: 1, text: '你钻了牛角尖，越研究越糊涂。', effects: { stats: { intelligence: 1, happiness: -2 } } },
    ],
  },
  {
    text: '直接问清楚，把话挑明',
    free: true,
    requires: { minAge: 6 },
    outcomes: [
      { weight: 2, text: '你的坦诚让对方有点意外，气氛反而轻松了。', effects: { stats: { charm: 2, influence: 1 } } },
      { weight: 1, text: '话说得太直，场面一度有点尴尬。', effects: { stats: { charm: -1, happiness: -1 } } },
    ],
  },
]
