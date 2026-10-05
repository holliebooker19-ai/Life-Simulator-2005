import type { GameAction } from '../../types'

/**
 * 行动：家人（DESIGN_V2 P5，显示在“生活”分组）。亲人状态见 types.Relations：
 * 父母的身体会随年龄下降，感情不经营会慢慢变淡，这些行动用来“经营”它们。
 * 写入的标记汇总见 src/data/actions/index.ts。
 */
export const familyActions: GameAction[] = [
  {
    id: 'act-visit-parents', group: 'life', text: '回家看看爸妈', hint: '父母身体↑，快乐↑',
    requires: { minAge: 18, relMax: { parentsLost: 1 } },
    cooldown: 1,
    outcomes: [
      { weight: 2, text: '妈妈做了一桌子菜，爸爸假装不在意，却把你爱吃的那盘一直往你这边推。', effects: { stats: { happiness: 4, wealth: -0.5 }, rel: { parents: 4 } } },
      { weight: 1, text: '你帮家里修好了漏水的水龙头，又教会了他们用手机视频。临走时，老人往你包里塞满了吃的。', effects: { stats: { happiness: 5, wealth: -0.5 }, rel: { parents: 5 } } },
    ],
  },
  {
    id: 'act-parents-checkup', group: 'life', text: '带爸妈做一次全面体检', hint: '父母身体明显↑，花点钱',
    requires: { minAge: 22, relMin: { parentAge: 55 }, relMax: { parentsLost: 1 }, statMin: { wealth: 5 } },
    cooldown: 3,
    outcomes: [
      { weight: 3, text: '各项指标都还行，医生叮嘱了几句。老人嘴上嫌你“瞎花钱”，回家却把报告收得好好的。', effects: { stats: { wealth: -2, happiness: 2 }, rel: { parents: 8 } } },
      { weight: 1, text: '查出了一个早期的小问题，及时治好了。医生说：“幸亏来得早。”', effects: { stats: { wealth: -5, happiness: 3 }, rel: { parents: 15 } } },
    ],
  },
  {
    id: 'act-date-partner', group: 'life', text: '陪另一半过个周末', hint: '感情↑，快乐↑',
    requires: { minAge: 17, relMin: { partner: 1 } },
    outcomes: [
      { text: '你们关掉手机，去看了一场电影，又在河边走了很久。好像很久没有这样慢慢说话了。', effects: { stats: { happiness: 3, wealth: -0.3 }, rel: { partner: 8 } } },
    ],
  },
  {
    id: 'act-kid-time', group: 'life', text: '陪孩子玩一整天', hint: '亲子关系↑，快乐↑',
    requires: { flags: ['has-child'], relMin: { childAge: 1 }, relMax: { childAge: 17 } },
    outcomes: [
      { text: '你们搭了一下午的积木，又去公园喂了鸽子。晚上孩子睡着前，拉着你的手说“明天还要玩”。', effects: { stats: { happiness: 4, health: -1 }, addFlags: ['kid-close'] } },
    ],
  },
  {
    id: 'act-family-trip', group: 'life', text: '全家出去旅行', hint: '感情↑，快乐↑',
    requires: { minAge: 25, flags: ['has-child'], statMin: { wealth: 20 } },
    cooldown: 2,
    outcomes: [
      { weight: 3, text: '你们在海边住了一个星期，拍了几百张照片。孩子晒黑了一圈，回来逢人就讲。', effects: { stats: { happiness: 7, wealth: -3 }, rel: { partner: 5 }, addFlags: ['kid-close'] } },
      { weight: 1, text: '出发第一天就堵在高速上，孩子吐了，大人吵了。可多年以后，这是全家人最爱讲的一次旅行。', effects: { stats: { happiness: 4, wealth: -3 }, rel: { partner: 2 } } },
    ],
  },
]
