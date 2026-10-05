import type { GameEvent } from '../../types'

export const financeEvents: GameEvent[] = [
  {
    id: 'finance-2010-worldcup',
    category: 'finance',
    rarity: 'rare',
    year: 2010,
    requires: { minAge: 4 },
    title: '2010 年世界杯',
    text: '夏天，爸爸和叔叔们围着电视，边看球边打赌：谁是冠军？你记得，冠军是……',
    realFact: '2010 年南非世界杯冠军为西班牙，决赛 1:0 胜荷兰，加时赛第 116 分钟西班牙中场破门制胜。',
    choices: [
      {
        text: '大声说“西班牙！”',
        usesMemory: true,
        outcomes: [
          {
            tag: 'success',
            text: '爸爸笑着押了一小注西班牙，结果赢了。他看你的眼神开始不太一样了。',
            effects: { stats: { wealth: 3, influence: 2 }, addFlags: ['parents-trust'] },
          },
          { tag: 'misremember', text: '你记混了，喊成了荷兰。爸爸听了你的，输了一点小钱。', effects: { stats: { wealth: -2, happiness: -3 } } },
        ],
      },
      { text: '假装什么都不知道，安静看球', outcomes: [{ text: '你平静地看完了一场世界杯。', effects: { stats: { happiness: 2 } } }] },
    ],
  },
  {
    id: 'finance-2017-crypto',
    category: 'finance',
    rarity: 'rare',
    year: 2017,
    requires: { minAge: 16 },
    title: '一种叫比特币的东西',
    text: '你在宿舍里听到有人聊起一种叫“比特币”的东西。你知道它未来会涨成什么样。可你只是个学生，手上能动用的钱并不多。',
    realFact: '2017 年比特币从年初约 1000 美元涨到年底接近 20000 美元，之后大幅回落。',
    choices: [
      {
        text: '说服父母拿出积蓄投资',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '父母半信半疑地投了一笔。你默默看着价格一路向上，在高点前把仓位撤回来了。', effects: { stats: { wealth: 500, influence: 3 } } },
          { tag: 'misremember', text: '你记错了时间点，买在了高位，被套了很久。', effects: { stats: { wealth: -80, happiness: -8 } } },
        ],
      },
      {
        text: '用生活费买一点点',
        outcomes: [
          { weight: 2, text: '你用生活费买了一点点，几年后回头看，也算小赚。', effects: { stats: { wealth: 20, happiness: 3 } } },
          { weight: 1, text: '钱不多，你很快也就忘了这件事。', effects: {} },
        ],
      },
      { text: '算了，先好好学习', outcomes: [{ text: '你把心思放回书本上。', effects: { stats: { intelligence: 4 } } }] },
    ],
  },
  {
    id: 'finance-2022-worldcup',
    category: 'finance',
    rarity: 'legendary',
    year: 2022,
    requires: { minAge: 20 },
    title: '2022 年世界杯',
    text: '卡塔尔世界杯开赛。你已经攒了一笔钱，你清楚地记得决赛的比分：阿根廷对法国，3:3，点球大战。你要押多少？',
    realFact: '2022 年卡塔尔世界杯决赛，阿根廷与法国常规与加时 3:3，点球大战 4:2 阿根廷夺冠。',
    choices: [
      {
        text: '全押阿根廷夺冠',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '点球踢进的那一刻你整个人都在抖，这一注让你一夜暴富。', effects: { stats: { wealth: 800, fame: 5, happiness: 10 } } },
          { tag: 'misremember', text: '你把记忆里的另一场比赛弄混了，押错了队，血本无归。', effects: { stats: { wealth: -300, happiness: -15 } } },
        ],
      },
      { text: '小注怡情', outcomes: [{ text: '你小赚一笔，请朋友们吃了顿火锅。', effects: { stats: { wealth: 20, happiness: 5 } } }] },
      { text: '不碰赌博', outcomes: [{ text: '你安静看球，只是为那位阿根廷十号落了一次泪。', effects: { stats: { happiness: 3 } } }] },
    ],
  },
]
