import type { GameAction } from '../../types'

/**
 * 行动：AI 公司经营（“改变世界”组）。主线事件见 src/data/events/ai-mainline.ts。
 * 公司实力是世界变量 ai-player（0-100）；收入由 ai-revenue-* 事件按实力档位发放。
 */
export const aiActions: GameAction[] = [
  {
    id: 'act-ai-startup', group: 'world', text: '筹备 AI 公司', hint: '写计划书、找投资人，之后决定注册地',
    requires: { minAge: 19, minYear: 2017, flags: ['skill-coding'], notFlags: ['ai-company', 'ai-candidate'] },
    outcomes: [
      { requires: { flags: ['y1620-ai-dream'] }, text: '从那场人机大战起，你就在等这一天。计划书一气呵成，几位投资人当场就约了第二次见面。', effects: { stats: { intelligence: 2, influence: 2 }, world: { 'ai-player': 5 }, addFlags: ['ai-candidate'] } },
      { requires: { notFlags: ['y1620-ai-dream'] }, text: '你熬了几个通宵写完了商业计划书，拉到了第一笔天使投资的意向。', effects: { stats: { intelligence: 1, influence: 1 }, addFlags: ['ai-candidate'] } },
    ],
  },
  {
    id: 'act-ai-train', group: 'world', text: '砸钱训练新模型', hint: '公司实力↑，很烧钱',
    requires: { flags: ['ai-company'], statMin: { wealth: 30 } },
    outcomes: [
      { weight: 2, text: '新模型的效果比上一代好了一大截，客户的续约率跟着涨了。', effects: { stats: { wealth: -25, intelligence: 1 }, world: { 'ai-player': 6 } } },
      { weight: 1, text: '训练到一半出了故障，几周的算力白烧了。好在数据还在。', effects: { stats: { wealth: -25, happiness: -3 }, world: { 'ai-player': 2 } } },
    ],
  },
  {
    id: 'act-ai-fundraise', group: 'world', text: '找投资人融资', hint: '实力越强，估值越高',
    requires: { flags: ['ai-company'] },
    cooldown: 2,
    outcomes: [
      { requires: { worldMin: { 'ai-player': 60 } }, text: '顶级基金抢着进场，这一轮的估值让你自己都不敢相信。', effects: { stats: { wealth: 3000, fame: 3, influence: 3 } } },
      { requires: { worldMin: { 'ai-player': 30 }, worldMax: { 'ai-player': 59 } }, text: '你跑了二十几家机构，最后拿到了一笔不错的融资。', effects: { stats: { wealth: 400, influence: 2 } } },
      { requires: { worldMax: { 'ai-player': 29 } }, weight: 2, text: '投资人们听得很认真，最后只有一家给了一笔小钱。', effects: { stats: { wealth: 60, happiness: -1 } } },
      { requires: { worldMax: { 'ai-player': 29 } }, weight: 1, text: '跑了一圈，一分钱都没拿到。有人说：“等你们有收入了再来。”', effects: { stats: { happiness: -4 } } },
    ],
  },
  {
    id: 'act-ai-poach', group: 'world', text: '从对手那里挖人', hint: '你的实力↑，对手↓',
    requires: { flags: ['ai-company'], minYear: 2020, statMin: { wealth: 100 }, worldMin: { 'ai-player': 30 } },
    cooldown: 1,
    outcomes: [
      { weight: 2, text: '你开出了对方拒绝不了的条件，一整个小组跳槽了过来。', effects: { stats: { wealth: -60 }, world: { 'ai-player': 5, 'ai-closeai': -3 } } },
      { weight: 1, text: '人挖来了，却和原团队水土不服，半年后又走了一半。', effects: { stats: { wealth: -60, happiness: -2 }, world: { 'ai-player': 1 } } },
    ],
  },
  {
    id: 'act-ai-pricewar', group: 'world', text: '超高性能 + 低价，抢市场', hint: '烧钱压垮对手的利润，国产模型受冲击最大',
    requires: { flags: ['ai-company'], minYear: 2024, statMin: { wealth: 300 }, worldMin: { 'ai-player': 40 } },
    cooldown: 1,
    outcomes: [
      { text: '你把价格砍到对手的成本线以下，性能却更好。客户成批迁移过来，对手们的财报一个比一个难看。', effects: { stats: { wealth: -200, fame: 2 }, world: { 'ai-player': 5, 'ai-cn': -8, 'ai-closeai': -4 } } },
    ],
  },
  {
    id: 'act-ai-breakthrough', group: 'world', text: '冲刺下一代架构', hint: '推动人工智能科技树',
    requires: { flags: ['ai-company'], minYear: 2027, statMin: { wealth: 1000 }, worldMin: { 'ai-player': 60 }, worldMax: { 'tech-ai': 4 } },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '新架构跑通了。论文发出去的那天，整个行业都在连夜读它。', effects: { stats: { wealth: -800, fame: 4, influence: 3 }, world: { 'tech-ai': 1, 'ai-player': 5 } } },
      { weight: 1, text: '方向走偏了，一年的投入只换来一份“有价值的失败报告”。', effects: { stats: { wealth: -800, happiness: -4 } } },
    ],
  },
  {
    id: 'act-ai-sell', group: 'world', text: '把公司卖掉', hint: '套现离场，退出 AI 竞赛',
    requires: { flags: ['ai-company'], worldMin: { 'ai-player': 15 } },
    once: true,
    outcomes: [
      { requires: { worldMin: { 'ai-player': 70 } }, text: '一家巨头开出了天价。签完字，你成了全世界最有钱的人之一，也成了一个没有公司的人。', effects: { stats: { wealth: 30000, happiness: 3 }, world: { 'ai-player': -100 }, removeFlags: ['ai-company', 'has-business'] } },
      { requires: { worldMax: { 'ai-player': 69 } }, text: '你把公司卖给了一家大厂，价钱公道。团队保住了，你也终于能睡个好觉了。', effects: { stats: { wealth: 1500, happiness: 5 }, world: { 'ai-player': -100 }, removeFlags: ['ai-company', 'has-business'] } },
    ],
  },
]
