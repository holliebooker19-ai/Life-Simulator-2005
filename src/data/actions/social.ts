import type { GameAction } from '../../types'

/** 行动：社交。规范见 docs/EVENT_GUIDE.md；写入的标记汇总见 src/data/actions/index.ts。 */
export const socialActions: GameAction[] = [
  {
    id: 'act-make-friends', group: 'social', text: '多交朋友', hint: '魅力↑，快乐↑',
    requires: { minAge: 3 },
    outcomes: [
      { weight: 3, text: '你认识了不少新朋友，周末总有人叫你出去玩。', effects: { stats: { charm: 3, happiness: 3 } } },
      { weight: 1, text: '遇到一个特别投缘的朋友，你们成了无话不谈的搭子。', effects: { stats: { charm: 2, happiness: 6 }, addFlags: ['best-friend'] } },
    ],
  },
  {
    id: 'act-class-leader', group: 'social', text: '竞选班干部/学生会', hint: '名望、影响力↑，有可能落选',
    requires: { minAge: 8, maxAge: 24 },
    cooldown: 2,
    outcomes: [
      { weight: 2, tag: 'success', text: '你当选了！从此多了一份责任，也多了一份威信。', effects: { stats: { fame: 3, influence: 3, charm: 2 } } },
      { weight: 1, tag: 'fail', text: '落选了，你笑着跟当选的人握了手，回家才有点失落。', effects: { stats: { happiness: -3, charm: 1 } } },
    ],
  },
  {
    id: 'act-networking', group: 'social', text: '参加聚会，拓展人脉', hint: '影响力↑，可能花点钱',
    requires: { minAge: 18 },
    outcomes: [
      { weight: 2, text: '你在饭局上认识了几个有分量的人，名片换了一沓。', effects: { stats: { influence: 3, charm: 2, wealth: -1 } } },
      { weight: 1, text: '全程尬聊，你默默吃了一晚上的小点心。', effects: { stats: { wealth: -1, happiness: -1 } } },
    ],
  },
  {
    id: 'act-family-time', group: 'social', text: '多陪陪家人', hint: '快乐↑，亲情稳固',
    requires: { minAge: 3 },
    outcomes: [
      { text: '你陪家人吃饭、散步、聊天，平淡的日子格外有滋味。', effects: { stats: { happiness: 5, health: 1 } } },
    ],
  },
  {
    id: 'act-volunteer', group: 'social', text: '做公益/志愿者', hint: '名望↑，快乐↑',
    requires: { minAge: 14 },
    cooldown: 1,
    outcomes: [
      { weight: 2, text: '你的付出被很多人看在眼里，朋友圈里多了不少赞。', effects: { stats: { fame: 3, happiness: 4, influence: 1 } } },
      { weight: 1, text: '活动很累，但你收获了一份踏实的满足感。', effects: { stats: { happiness: 5, health: -1 } } },
    ],
  },
]
