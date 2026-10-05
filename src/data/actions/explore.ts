import type { GameAction } from '../../types'

/** 行动：探索。规范见 docs/EVENT_GUIDE.md；写入的标记汇总见 src/data/actions/index.ts。 */
export const exploreActions: GameAction[] = [
  {
    id: 'act-play', group: 'explore', text: '到处疯玩', hint: '快乐↑',
    requires: { maxAge: 17 },
    outcomes: [
      { weight: 3, text: '你和小伙伴爬树、捉虫、满头大汗地野了一整年。', effects: { stats: { happiness: 5, health: 2 } } },
      { weight: 1, text: '玩得太疯摔了个跟头，膝盖上多了一道疤。', effects: { stats: { happiness: 3, health: -1 } } },
    ],
  },
  {
    id: 'act-hobby', group: 'explore', text: '培养一个爱好', hint: '画画、乐器、摄影……',
    requires: { minAge: 5 },
    cooldown: 1,
    outcomes: [
      { weight: 3, text: '你认认真真练了一年，渐渐有了自己的风格。', effects: { stats: { charm: 3, happiness: 4, intelligence: 1 } } },
      { weight: 1, text: '你的作品被邻居看到，居然有人想出钱买。', effects: { stats: { charm: 3, happiness: 5, wealth: 1, fame: 1 } } },
    ],
  },
  {
    id: 'act-travel', group: 'explore', text: '出门旅行', hint: '花钱买见识和快乐',
    requires: { minAge: 12, statMin: { wealth: 3 } },
    outcomes: [
      { weight: 3, text: '你背上包走了很多地方，看到的比书上写的更辽阔。', effects: { stats: { happiness: 6, charm: 2, intelligence: 1, wealth: -3 } } },
      { weight: 1, text: '遇上了糟糕的天气和坑人的民宿，但回头想起来也算故事。', effects: { stats: { happiness: 2, wealth: -3 } } },
    ],
  },
  {
    id: 'act-world-trip', group: 'explore', text: '环游世界', hint: '大把花钱的壮举',
    requires: { minAge: 22, statMin: { wealth: 100 } },
    cooldown: 5,
    outcomes: [
      { text: '你用一整年走遍了几十个国家，回来时像换了一个人。', effects: { stats: { happiness: 12, charm: 5, intelligence: 3, wealth: -50, fame: 2 } } },
    ],
  },
  {
    id: 'act-video-creator', group: 'explore', text: '做自媒体/拍视频', hint: '可能爆红，也可能没人看',
    requires: { minAge: 14, minYear: 2012, maxAge: 50 },
    cooldown: 1,
    outcomes: [
      { weight: 4, text: '你的视频只有几十个播放量，大部分是亲友点的。', effects: { stats: { charm: 1, happiness: -1 } } },
      { weight: 2, text: '一条视频小火了一把，涨了几千个粉丝。', effects: { stats: { fame: 5, charm: 2, wealth: 2, happiness: 4 } } },
      { weight: 1, text: '你踩中了流行梗，一夜爆红，广告商排着队找上门。', effects: { stats: { fame: 15, charm: 4, wealth: 40, happiness: 6 } } },
    ],
  },
  {
    id: 'act-use-memory-fame', group: 'explore', text: '“预言”一件即将发生的事', hint: '用记忆换名声，偏离度↑',
    requires: { minAge: 12, maxYear: 2026 },
    usesMemory: true,
    cooldown: 2,
    outcomes: [
      { tag: 'success', text: '你随口说中了接下来发生的事，周围的人看你的眼神变了。', effects: { stats: { fame: 4, influence: 2, happiness: 2 }, divergence: 3 } },
      { tag: 'misremember', text: '你记混了细节，预言错得离谱，成了大家的笑柄。', effects: { stats: { fame: -2, happiness: -4, charm: -1 } } },
    ],
  },
  {
    id: 'act-change-world', group: 'explore', text: '悄悄改变一件历史小事', hint: '大胆干预，世界线偏离度大幅↑',
    requires: { minAge: 18, maxYear: 2026, statMin: { influence: 20, memory: 40 } },
    usesMemory: true,
    cooldown: 3,
    outcomes: [
      { tag: 'success', text: '你的一个小小的举动，让一件本来该发生的事没有发生。世界线微妙地偏了一下。', effects: { stats: { influence: 5, fame: 3 }, divergence: 10 } },
      { tag: 'misremember', text: '你记错了关键的节点，反而帮了倒忙，事情变得更糟。', effects: { stats: { happiness: -6, influence: -2 }, divergence: 6 } },
    ],
  },
]
