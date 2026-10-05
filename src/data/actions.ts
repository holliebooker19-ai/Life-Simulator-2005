import type { GameAction } from '../types'

/**
 * 每年可自由选择的行动（玩家主动权的主要来源）。
 * 规范与事件一致：简体中文、不出现真名、财富单位为万元（虚拟）。
 * 本文件写入的标记：
 * - skill-coding：学过编程（解锁个人项目、技术创业）
 * - skill-english：英语很好（解锁出国交流）
 * - fit：坚持锻炼（体质加成）
 * - partner / married / has-child：感情线
 * - has-business：开了自己的小生意（解锁扩张、转让）
 * - side-gig：有稳定的兼职/工作（解锁进阶行动）
 */
export const ALL_ACTIONS: GameAction[] = [
  // ───────────── 学习 ─────────────
  {
    id: 'act-study-hard', group: 'study', text: '埋头苦读', hint: '智力↑，有点累',
    requires: { minAge: 6, maxAge: 30 },
    outcomes: [
      { weight: 3, text: '你啃完了一摞习题，成绩肉眼可见地往上走。', effects: { stats: { intelligence: 4, happiness: -2 } } },
      { weight: 1, text: '学到后半夜，你终于想通了一个卡了很久的难点。', effects: { stats: { intelligence: 6 } } },
      { weight: 1, text: '你对着书发了一下午的呆，什么也没记住。', effects: { stats: { intelligence: 1, happiness: -3 } } },
    ],
  },
  {
    id: 'act-read-widely', group: 'study', text: '泡在图书馆乱翻书', hint: '智力、魅力小幅提升',
    requires: { minAge: 6 },
    outcomes: [
      { weight: 3, text: '你从历史翻到科幻，又从科幻翻到菜谱，脑子里多了许多没用但有趣的东西。', effects: { stats: { intelligence: 2, charm: 1, happiness: 2 } } },
      { weight: 1, text: '你偶然翻到一本冷门好书，被里面的想法击中了。', effects: { stats: { intelligence: 4, happiness: 3 } } },
    ],
  },
  {
    id: 'act-learn-english', group: 'study', text: '认真学英语', hint: '解锁出国交流',
    requires: { minAge: 8, maxAge: 40, notFlags: ['skill-english'] },
    cooldown: 1,
    outcomes: [
      { weight: 2, text: '一年坚持下来，你已经能流利地看懂原版资料。', effects: { stats: { intelligence: 3 }, addFlags: ['skill-english'] } },
      { weight: 1, text: '单词背了又忘，进展缓慢，但总归没有白学。', effects: { stats: { intelligence: 1 } } },
    ],
  },
  {
    id: 'act-learn-coding', group: 'study', text: '自学编程', hint: '解锁个人项目与技术创业',
    requires: { minAge: 10, maxAge: 45, notFlags: ['skill-coding'] },
    cooldown: 1,
    outcomes: [
      { weight: 2, text: '你对着教程敲了一年代码，终于做出了第一个能跑起来的小程序。', effects: { stats: { intelligence: 5, happiness: 3 }, addFlags: ['skill-coding'] } },
      { weight: 1, text: '报错信息比代码还多，你学得头大，但慢慢有了感觉。', effects: { stats: { intelligence: 2, happiness: -1 } } },
    ],
  },
  {
    id: 'act-exam-prep', group: 'study', text: '冲刺一场重要考试', hint: '大概率提升智力与前途',
    requires: { minAge: 15, maxAge: 35 },
    cooldown: 2,
    outcomes: [
      { weight: 3, tag: 'success', text: '你发挥正常，考出了满意的成绩，前面的路宽了一些。', effects: { stats: { intelligence: 4, fame: 2, happiness: 4 } } },
      { weight: 1, tag: 'fail', text: '考场上脑子一片空白，成绩不尽人意。', effects: { stats: { happiness: -6 } } },
    ],
  },
  {
    id: 'act-abroad', group: 'study', text: '出国交流/留学', hint: '花钱，但见世面',
    requires: { minAge: 18, maxAge: 35, flags: ['skill-english'], statMin: { wealth: 20 } },
    cooldown: 4,
    outcomes: [
      { weight: 3, text: '你在异国他乡度过了充实的一年，视野和人脉都开阔了。', effects: { stats: { intelligence: 5, charm: 4, influence: 3, wealth: -15, happiness: 4 } } },
      { weight: 1, text: '水土不服，又想家，这一年过得有点孤独。', effects: { stats: { intelligence: 3, wealth: -15, happiness: -4 } } },
    ],
  },
  {
    id: 'act-notebook', group: 'study', text: '整理“未来备忘录”', hint: '记忆清晰度↑',
    requires: { minAge: 6, maxYear: 2026 },
    cooldown: 1,
    outcomes: [
      { weight: 3, text: '你把能想起来的未来大事一条条写下来，脑子里的细节清晰了不少。', effects: { stats: { memory: 6 } } },
      { weight: 1, text: '写着写着你发现有几条自己也拿不准，只好打上问号。', effects: { stats: { memory: 2, intelligence: 1 } } },
    ],
  },

  // ───────────── 身体 ─────────────
  {
    id: 'act-exercise', group: 'body', text: '坚持锻炼', hint: '体质↑，心情↑',
    requires: { minAge: 5, maxAge: 65 },
    outcomes: [
      { weight: 3, text: '跑步、跳绳、俯卧撑，一年下来你结实了不少。', effects: { stats: { health: 5, happiness: 2 }, addFlags: ['fit'] } },
      { weight: 1, text: '练得太猛，拉伤了腿，躺了几个星期。', effects: { stats: { health: -2, happiness: -2 } } },
    ],
  },
  {
    id: 'act-checkup', group: 'body', text: '去医院做个体检', hint: '体质小幅恢复',
    requires: { minAge: 20 },
    cooldown: 1,
    outcomes: [
      { weight: 3, text: '医生说一切正常，只是让你少熬夜。', effects: { stats: { health: 3, happiness: 1 } } },
      { weight: 1, text: '查出一点小毛病，早发现早治，你松了口气。', effects: { stats: { health: 6 } } },
    ],
  },
  {
    id: 'act-sleep-regular', group: 'body', text: '好好吃饭，规律作息', hint: '体质、心情稳稳上升',
    requires: { minAge: 3 },
    outcomes: [
      { text: '一年过得规律又踏实，精神头明显好了。', effects: { stats: { health: 3, happiness: 3 } } },
    ],
  },
  {
    id: 'act-sports-team', group: 'body', text: '加入一支球队', hint: '体质、魅力↑，也许交到朋友',
    requires: { minAge: 8, maxAge: 40 },
    cooldown: 2,
    outcomes: [
      { weight: 2, text: '你在球场上结识了一群好兄弟，输赢都开心。', effects: { stats: { health: 4, charm: 3, happiness: 4 } } },
      { weight: 1, text: '队里关系一般，踢了一年也没踢出名堂。', effects: { stats: { health: 3 } } },
    ],
  },

  // ───────────── 社交 ─────────────
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

  // ───────────── 工作 ─────────────
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

  // ───────────── 理财 ─────────────
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
      { tag: 'success', text: '你回想起未来的涨幅榜，提前上车，稳稳赚了一笔。', effects: { stats: { wealth: 30, influence: 1 }, divergence: 2 } },
      { tag: 'misremember', text: '你把涨幅榜和别的年份记混了，买到一只后来腰斩的股票。', effects: { stats: { wealth: -15, happiness: -4 } } },
    ],
  },
  {
    id: 'act-stock-memory-big', group: 'money', text: '重仓押注“早就知道的行情”', hint: '预知，赌上更多身家',
    requires: { minAge: 20, minYear: 2006, maxYear: 2026, statMin: { wealth: 200 } },
    usesMemory: true,
    cooldown: 2,
    outcomes: [
      { tag: 'success', text: '行情完全按你的记忆走，账户数字一路飙升。', effects: { stats: { wealth: 400, fame: 3, influence: 3 }, divergence: 5 } },
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

  // ───────────── 探索 ─────────────
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

  // ───────────── 生活 ─────────────
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
      { text: '你有了自己的孩子。熬夜换尿布的日子很累，可她第一次笑的时候，你什么都值了。', effects: { stats: { happiness: 12, wealth: -10, health: -2 }, addFlags: ['has-child'] } },
    ],
  },
  {
    id: 'act-parent-care', group: 'life', text: '接父母来同住，照顾他们', hint: '快乐↑，花点钱',
    requires: { minAge: 30, maxAge: 60 },
    cooldown: 3,
    outcomes: [
      { text: '一家人其乐融融地吃饭，你觉得这样的日子很值得。', effects: { stats: { happiness: 7, wealth: -5 } } },
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
