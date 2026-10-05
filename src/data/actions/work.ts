import type { GameAction } from '../../types'

/** 行动：工作。规范见 docs/EVENT_GUIDE.md；写入的标记汇总见 src/data/actions/index.ts。 */
export const workActions: GameAction[] = [
  {
    id: 'act-part-time', group: 'work', text: '找份兼职', hint: '赚点零花钱',
    requires: { minAge: 15, maxAge: 24 },
    outcomes: [
      { weight: 3, text: '发传单、做家教、端盘子……你靠自己赚到了第一桶金。', effects: { stats: { wealth: 1, happiness: 1, charm: 1 }, addFlags: ['side-gig'] } },
      { weight: 1, text: '遇到黑心老板，干了一个月只拿到一半工资。', effects: { stats: { wealth: 0.3, happiness: -3 } } },
    ],
  },
  {
    id: 'act-job-hunt', group: 'work', text: '找一份正式工作', hint: '开启稳定收入',
    requires: { minAge: 21, maxAge: 55, notFlags: ['employed'] },
    outcomes: [
      { weight: 3, text: '你拿到了一份不错的 offer，开始了朝九晚五的生活。', effects: { stats: { wealth: 5, happiness: 2 }, addFlags: ['employed', 'side-gig'] } },
      { weight: 1, text: '投了几十份简历才有回音，勉强落脚在一家小公司。', effects: { stats: { wealth: 3, happiness: -2 }, addFlags: ['employed', 'side-gig'] } },
    ],
  },
  {
    id: 'act-work-hard', group: 'work', text: '拼命工作，争取升职', hint: '赚钱、名望↑，但很累',
    requires: { minAge: 21, maxAge: 62, flags: ['employed'] },
    outcomes: [
      { weight: 2, tag: 'success', text: '你的努力被领导看见了，职位和薪水都往上走了一档。', effects: { stats: { wealth: 15, fame: 2, influence: 2, health: -2, happiness: -1 } } },
      { weight: 1, tag: 'fail', text: '加班加到怀疑人生，功劳却被同事抢了去。', effects: { stats: { wealth: 6, health: -3, happiness: -5 } } },
    ],
  },
  {
    id: 'act-slack-off', group: 'work', text: '佛系上班，准点下班', hint: '赚得少，但过得舒服',
    requires: { minAge: 21, maxAge: 62, flags: ['employed'] },
    outcomes: [
      { text: '你把工作做到不出错就行，剩下的时间都留给自己。', effects: { stats: { wealth: 6, happiness: 4, health: 1 } } },
    ],
  },
  {
    id: 'act-job-hop', group: 'work', text: '跳槽去更好的公司', hint: '有风险，也有惊喜',
    requires: { minAge: 24, maxAge: 52, flags: ['employed'], statMin: { intelligence: 40 } },
    cooldown: 2,
    outcomes: [
      { weight: 2, tag: 'success', text: '新公司给的薪水涨了一大截，你的履历也更漂亮了。', effects: { stats: { wealth: 20, influence: 2, happiness: 3 } } },
      { weight: 1, tag: 'fail', text: '新公司画的饼比实际薪水大得多，你有点后悔。', effects: { stats: { wealth: -2, happiness: -4 } } },
    ],
  },
  {
    id: 'act-side-project', group: 'work', text: '做个人项目（写代码）', hint: '有机会小爆红',
    requires: { minAge: 14, flags: ['skill-coding'] },
    cooldown: 1,
    outcomes: [
      { weight: 4, text: '你在深夜把一个小工具做了出来，朋友们都说好用。', effects: { stats: { intelligence: 3, fame: 1, happiness: 3 } } },
      { weight: 2, text: '小工具被一个论坛转发，意外收获了不少用户和一点打赏。', effects: { stats: { fame: 4, wealth: 5, intelligence: 2 } } },
      { weight: 1, tag: 'success', text: '你的项目突然爆火，投资人主动来找你聊。', effects: { stats: { fame: 8, wealth: 60, influence: 4 } } },
    ],
  },
  {
    id: 'act-startup', group: 'work', text: '辞职/休学，自己创业', hint: '高风险高回报，需要启动资金',
    requires: { minAge: 18, maxAge: 55, statMin: { wealth: 30 }, notFlags: ['has-business'] },
    cooldown: 2,
    outcomes: [
      { weight: 3, tag: 'fail', text: '创业比想象中难得多，你在一年内烧光了启动资金，只留下一身经验。', effects: { stats: { wealth: -30, intelligence: 4, happiness: -6, charm: 1 } } },
      { weight: 2, tag: 'success', text: '你的小公司站稳了脚跟，开始稳定盈利。', effects: { stats: { wealth: 40, fame: 4, influence: 4 }, addFlags: ['has-business'] } },
      { weight: 1, tag: 'success', text: '赶上了好风口，你的公司快速膨胀，成了圈子里的明星创业者。', effects: { stats: { wealth: 200, fame: 12, influence: 10 }, addFlags: ['has-business'], divergence: 3 } },
    ],
  },
  {
    id: 'act-expand-business', group: 'work', text: '扩张生意', hint: '加大投入，翻倍或亏本',
    requires: { flags: ['has-business'], statMin: { wealth: 50 } },
    cooldown: 1,
    outcomes: [
      { weight: 2, tag: 'success', text: '新店、新产品陆续上线，营业额翻了一番。', effects: { stats: { wealth: 100, fame: 3, influence: 3 } } },
      { weight: 1, tag: 'fail', text: '扩张过快，现金流断了，你不得不砍掉一半业务。', effects: { stats: { wealth: -60, happiness: -6 } } },
    ],
  },
  {
    id: 'act-sell-business', group: 'work', text: '把生意卖掉，套现离场', hint: '一次性拿钱，失去生意',
    requires: { flags: ['has-business'], minAge: 25 },
    cooldown: 3,
    outcomes: [
      { weight: 2, text: '买家出了个不错的价钱，你签完字长出了一口气。', effects: { stats: { wealth: 150, happiness: 4 }, removeFlags: ['has-business'] } },
      { weight: 1, text: '价格压得很低，但你实在撑不下去了，只得忍痛出手。', effects: { stats: { wealth: 30, happiness: -3 }, removeFlags: ['has-business'] } },
    ],
  },
]
