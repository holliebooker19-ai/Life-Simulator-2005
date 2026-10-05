import type { GameAction } from '../../types'

/** 行动：生活。规范见 docs/EVENT_GUIDE.md；写入的标记汇总见 src/data/actions/index.ts。 */
export const lifeActions: GameAction[] = [
  {
    id: 'act-rest', group: 'life', text: '什么也不做，躺平一年', hint: '回血',
    outcomes: [
      { text: '你难得地给自己放了一年假，没有计划，没有焦虑。', effects: { stats: { health: 3, happiness: 4 } } },
    ],
  },
  {
    id: 'act-fall-in-love', group: 'life', text: '谈一场恋爱', hint: '魅力和快乐↑',
    requires: { minAge: 17, maxAge: 45, notFlags: ['partner', 'married'] },
    outcomes: [
      { weight: 3, tag: 'success', text: '你遇到了一个很合拍的人，每天的生活都有了期待。', effects: { stats: { happiness: 8, charm: 2 }, addFlags: ['partner'] } },
      { weight: 1, tag: 'fail', text: '你鼓起勇气表白，被礼貌地拒绝了。', effects: { stats: { happiness: -5 } } },
    ],
  },
  {
    id: 'act-propose', group: 'life', text: '求婚/结婚', hint: '组建家庭',
    requires: { minAge: 22, flags: ['partner'], notFlags: ['married'] },
    once: true,
    outcomes: [
      { weight: 4, tag: 'success', text: '你们办了一场简单温馨的婚礼，亲友们都来祝福。', effects: { stats: { happiness: 12, wealth: -5 }, addFlags: ['married'], removeFlags: ['partner'] } },
      { weight: 1, tag: 'fail', text: '你们聊着聊着发现价值观并不一致，最终和平分手。', effects: { stats: { happiness: -8 }, removeFlags: ['partner'] } },
    ],
  },
  {
    id: 'act-have-child', group: 'life', text: '要个孩子', hint: '开销大，但很治愈',
    requires: { minAge: 24, maxAge: 45, flags: ['married'], notFlags: ['has-child'] },
    once: true,
    outcomes: [
      { text: '你有了自己的孩子。熬夜换尿布的日子很累，可孩子第一次冲你笑的时候，你觉得什么都值了。', effects: { stats: { happiness: 12, wealth: -10, health: -2 }, addFlags: ['has-child'] } },
    ],
  },
  {
    id: 'act-parent-care', group: 'life', text: '接父母来同住，照顾他们', hint: '快乐↑，花点钱',
    requires: { minAge: 30, maxAge: 60, relMax: { parentsLost: 1 } },
    cooldown: 3,
    outcomes: [
      { text: '一家人其乐融融地吃饭，你觉得这样的日子很值得。', effects: { stats: { happiness: 7, wealth: -5 }, rel: { parents: 5 } } },
    ],
  },
  {
    id: 'act-pet', group: 'life', text: '养一只宠物', hint: '快乐↑',
    requires: { minAge: 8 },
    once: true,
    outcomes: [
      { text: '一只小家伙跟着你回了家，从此你有了随时能抱一抱的理由。', effects: { stats: { happiness: 6 } } },
    ],
  },
  {
    id: 'act-therapy', group: 'life', text: '找人倾诉，调整心态', hint: '快乐明显回升',
    requires: { minAge: 15, statMax: { happiness: 60 } },
    cooldown: 1,
    outcomes: [
      { text: '把心里话说出来之后，你感觉轻松了很多。', effects: { stats: { happiness: 8 } } },
    ],
  },
]
