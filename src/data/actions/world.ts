import type { GameAction } from '../../types'

/**
 * 行动：改变世界（经营影响力、点科技树）。规范见 docs/EVENT_GUIDE.md、docs/DESIGN_V2.md。
 * 科技树等级 0-5（0 = 真实 2026 年的水平）；2026 年之前资助研究不推动科技树，以免和真实历史冲突。
 */
export const worldActions: GameAction[] = [
  {
    id: 'act-media-interview', group: 'world', text: '接受媒体专访', hint: '名望换影响力',
    requires: { minAge: 18, statMin: { fame: 25 } },
    cooldown: 1,
    outcomes: [
      { weight: 3, text: '专访播出后，你的观点被很多人转发，开始有人请你去行业会议上发言。', effects: { stats: { influence: 4, fame: 2 } } },
      { weight: 1, text: '记者断章取义，你被骂上了热搜。好在黑红也是红。', effects: { stats: { influence: 2, fame: 3, happiness: -4 } } },
    ],
  },
  {
    id: 'act-elite-circle', group: 'world', text: '混进上层圈子', hint: '花钱结交有分量的人',
    requires: { minAge: 22, statMin: { wealth: 300 } },
    outcomes: [
      { weight: 2, text: '你在一场私人晚宴上和几位大人物相谈甚欢，交换了私人号码。', effects: { stats: { influence: 5, wealth: -10, charm: 1 } } },
      { weight: 1, text: '圈子里的人客客气气，但没人真把你当自己人。', effects: { stats: { influence: 1, wealth: -10, happiness: -2 } } },
    ],
  },
  {
    id: 'act-think-tank', group: 'world', text: '发表行业观点/政策建议', hint: '用见识换话语权',
    requires: { minAge: 22, statMin: { influence: 25, intelligence: 60 } },
    cooldown: 1,
    outcomes: [
      { weight: 2, text: '你的报告被几家智库引用，有人在内部会议上提到了你的名字。', effects: { stats: { influence: 5, fame: 2, intelligence: 1 } } },
      { weight: 1, text: '报告石沉大海。不过你把思路理清楚了。', effects: { stats: { intelligence: 2 } } },
    ],
  },
  {
    id: 'act-foundation', group: 'world', text: '成立基金会', hint: '一次性大额投入，此后每年稳定增加影响力',
    requires: { minAge: 25, statMin: { wealth: 2000 }, notFlags: ['has-foundation'] },
    once: true,
    outcomes: [
      { text: '你的基金会正式成立，第一批项目是乡村学校和罕见病研究。你的名字开始出现在一些很重要的名单上。', effects: { stats: { wealth: -1000, fame: 6, influence: 6, happiness: 5 }, addFlags: ['has-foundation'] } },
    ],
  },
  {
    id: 'act-fund-gene', group: 'world', text: '资助基因工程研究', hint: '延寿疗法、治愈遗传病……也可能打开潘多拉魔盒',
    requires: { minAge: 25, minYear: 2027, statMin: { wealth: 3000 }, worldMax: { 'tech-gene': 4 } },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '你砸下重金组建了顶尖团队，基因工程迎来了一次实实在在的突破。科技树向前点亮了一格。', effects: { stats: { wealth: -2000, influence: 4, fame: 3 }, world: { 'tech-gene': 1, absurd: 5 } } },
      { weight: 1, text: '钱花出去了，实验却一次次失败。团队说“再给我们两年”。', effects: { stats: { wealth: -2000, happiness: -3, influence: 1 } } },
    ],
  },
  {
    id: 'act-fund-brain', group: 'world', text: '资助脑机接口研究', hint: '意识上传、记忆备份',
    requires: { minAge: 25, minYear: 2027, statMin: { wealth: 3000 }, worldMax: { 'tech-brain': 4 } },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '你砸下重金组建了顶尖团队，脑机接口迎来了一次实实在在的突破。科技树向前点亮了一格。', effects: { stats: { wealth: -2000, influence: 4, fame: 3 }, world: { 'tech-brain': 1 } } },
      { weight: 1, text: '钱花出去了，实验却一次次失败。团队说“再给我们两年”。', effects: { stats: { wealth: -2000, happiness: -3, influence: 1 } } },
    ],
  },
  {
    id: 'act-fund-energy', group: 'world', text: '资助能源研究', hint: '可控核聚变，廉价到“几乎免费”的电',
    requires: { minAge: 25, minYear: 2027, statMin: { wealth: 3000 }, worldMax: { 'tech-energy': 4 } },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '你砸下重金组建了顶尖团队，能源迎来了一次实实在在的突破。科技树向前点亮了一格。', effects: { stats: { wealth: -2000, influence: 4, fame: 3 }, world: { 'tech-energy': 1 } } },
      { weight: 1, text: '钱花出去了，实验却一次次失败。团队说“再给我们两年”。', effects: { stats: { wealth: -2000, happiness: -3, influence: 1 } } },
    ],
  },
  {
    id: 'act-fund-space', group: 'world', text: '资助航天研究', hint: '月球基地、火星移民',
    requires: { minAge: 25, minYear: 2027, statMin: { wealth: 3000 }, worldMax: { 'tech-space': 4 } },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '你砸下重金组建了顶尖团队，航天迎来了一次实实在在的突破。科技树向前点亮了一格。', effects: { stats: { wealth: -2000, influence: 4, fame: 3 }, world: { 'tech-space': 1 } } },
      { weight: 1, text: '钱花出去了，实验却一次次失败。团队说“再给我们两年”。', effects: { stats: { wealth: -2000, happiness: -3, influence: 1 } } },
    ],
  },
  {
    id: 'act-fund-robot', group: 'world', text: '资助机器人研究', hint: '人形机器人走进工厂和家庭',
    requires: { minAge: 25, minYear: 2027, statMin: { wealth: 3000 }, worldMax: { 'tech-robot': 4 } },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '你砸下重金组建了顶尖团队，机器人迎来了一次实实在在的突破。科技树向前点亮了一格。', effects: { stats: { wealth: -2000, influence: 4, fame: 3 }, world: { 'tech-robot': 1 } } },
      { weight: 1, text: '钱花出去了，实验却一次次失败。团队说“再给我们两年”。', effects: { stats: { wealth: -2000, happiness: -3, influence: 1 } } },
    ],
  },
  {
    id: 'act-fund-ai', group: 'world', text: '资助人工智能研究', hint: '通往通用人工智能',
    requires: { minAge: 25, minYear: 2027, statMin: { wealth: 3000 }, worldMax: { 'tech-ai': 4 } },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '你砸下重金组建了顶尖团队，人工智能迎来了一次实实在在的突破。科技树向前点亮了一格。', effects: { stats: { wealth: -2000, influence: 4, fame: 3 }, world: { 'tech-ai': 1 } } },
      { weight: 1, text: '钱花出去了，实验却一次次失败。团队说“再给我们两年”。', effects: { stats: { wealth: -2000, happiness: -3, influence: 1 } } },
    ],
  },
]
