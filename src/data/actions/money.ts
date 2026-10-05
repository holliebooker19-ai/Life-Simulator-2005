import type { GameAction } from '../../types'

/** 行动：理财。规范见 docs/EVENT_GUIDE.md；写入的标记汇总见 src/data/actions/index.ts。 */
export const moneyActions: GameAction[] = [
  {
    id: 'act-save-pocket', group: 'money', text: '存零花钱，精打细算', hint: '一点一点攒钱',
    requires: { minAge: 6, maxAge: 17 },
    outcomes: [
      { text: '你把压岁钱和零花钱一分一分攒进存钱罐。', effects: { stats: { wealth: 0.2, intelligence: 1 } } },
    ],
  },
  {
    id: 'act-saving', group: 'money', text: '攒钱理财，稳健为主', hint: '稳赚不赔的小钱',
    requires: { minAge: 22, statMin: { wealth: 5 } },
    outcomes: [
      { text: '你把闲钱放进稳健的理财里，收益不多，但睡得踏实。', effects: { stats: { wealth: 3, happiness: 1 } } },
    ],
  },
  {
    id: 'act-stock-small', group: 'money', text: '小额炒股', hint: '看运气，也看判断',
    requires: { minAge: 18, statMin: { wealth: 5 } },
    outcomes: [
      { weight: 2, text: '你跟着行情做了几笔，小赚一点。', effects: { stats: { wealth: 4, intelligence: 1 } } },
      { weight: 2, text: '追涨杀跌，被割了一茬。', effects: { stats: { wealth: -3, happiness: -2 } } },
      { weight: 1, text: '碰上一只妖股，你小赚了一笔大的。', effects: { stats: { wealth: 15, happiness: 3 } } },
    ],
  },
  {
    id: 'act-stock-memory', group: 'money', text: '凭未来记忆买入“会涨的”', hint: '预知，记忆越清晰越准',
    requires: { minAge: 18, minYear: 2006, maxYear: 2026, statMin: { wealth: 10 } },
    usesMemory: true,
    cooldown: 1,
    outcomes: [
      { tag: 'success', text: '你回想起未来的涨幅榜，提前上车，稳稳赚了一笔。', effects: { stats: { wealth: 30, influence: 1 } } },
      { tag: 'misremember', text: '你把涨幅榜和别的年份记混了，买到一只后来腰斩的股票。', effects: { stats: { wealth: -15, happiness: -4 } } },
    ],
  },
  {
    id: 'act-stock-memory-big', group: 'money', text: '重仓押注“早就知道的行情”', hint: '预知，赌上更多身家',
    requires: { minAge: 20, minYear: 2006, maxYear: 2026, statMin: { wealth: 200 } },
    usesMemory: true,
    cooldown: 2,
    outcomes: [
      { tag: 'success', text: '行情完全按你的记忆走，账户数字一路飙升。', effects: { stats: { wealth: 400, fame: 3, influence: 3 } } },
      { tag: 'misremember', text: '你记错了拐点，满仓被套，亏掉一大截身家。', effects: { stats: { wealth: -200, happiness: -10 } } },
    ],
  },
  {
    id: 'act-buy-house', group: 'money', text: '买房置业', hint: '财产稳固，但花钱不少',
    requires: { minAge: 25, statMin: { wealth: 80 }, notFlags: ['own-house'] },
    once: true,
    outcomes: [
      { weight: 3, text: '你在合适的地段买下了一套房，终于有了自己的窝。', effects: { stats: { wealth: -60, happiness: 8 }, addFlags: ['own-house'] } },
      { weight: 1, text: '没多久房价涨了不少，你偷偷笑出了声。', effects: { stats: { wealth: -30, happiness: 10 }, addFlags: ['own-house'] } },
    ],
  },
  {
    id: 'act-gamble', group: 'money', text: '去赌一把（虚拟游戏币）', hint: '纯看运气，容易上头',
    requires: { minAge: 18, statMin: { wealth: 5 } },
    outcomes: [
      { weight: 3, text: '你输光了带来的筹码，扭头就走。', effects: { stats: { wealth: -5, happiness: -4 } } },
      { weight: 1, text: '手气爆棚，你小赢了一笔。', effects: { stats: { wealth: 10, happiness: 5 } } },
    ],
  },
  {
    id: 'act-donate', group: 'money', text: '捐款做慈善', hint: '花钱换名望',
    requires: { minAge: 22, statMin: { wealth: 100 } },
    cooldown: 1,
    outcomes: [
      { text: '你捐出一笔钱，受助的人给你写来了感谢信，媒体也报道了。', effects: { stats: { wealth: -30, fame: 6, influence: 2, happiness: 5 } } },
    ],
  },
]
