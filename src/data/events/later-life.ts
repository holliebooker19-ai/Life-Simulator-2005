import type { GameEvent } from '../../types'

/**
 * 2027 年之后的自由期与晚年生活（DESIGN_V2 P5）。没有现实历史可依，按世界状态（科技树等）换说法。
 * 写法克制，不写具体的未来年份和真实机构。
 *
 * 本文件读取的标记：employed / retired / has-child / grandchild / best-friend / married / has-foundation
 * 本文件写入的标记：
 * - life-direction：2027 年后选过“剩下的人生”方向
 * - retire-party：退休事件已触发；birthday-80：八十大寿已触发
 * - digital-legacy：留下了数字分身
 */
export const laterLifeEvents: GameEvent[] = [
  {
    id: 'later-crossroads',
    category: 'life',
    annual: true,
    requires: { minYear: 2027, minAge: 29, notFlags: ['life-direction'] },
    title: '没有剧本的第一年',
    text: '没有剧本的日子过了大半年，你发现自己反而不知道该往哪儿走了。老朋友在饭桌上问你：“接下来，你到底想干什么？”',
    choices: [
      {
        text: '继续往上冲，看看能走多高',
        outcomes: [{ text: '你把日程排得比以前更满。这一次，没有人告诉你结局，你却觉得每一步都更踏实。', effects: { stats: { influence: 2, intelligence: 1, health: -1 }, addFlags: ['life-direction'] } }],
      },
      {
        text: '多陪陪家里人',
        outcomes: [{ text: '你推掉了一半的应酬，每周留出两个晚上回家吃饭。家里人说你“好像变了个人”。', effects: { stats: { happiness: 5 }, rel: { parents: 4, partner: 5 }, addFlags: ['life-direction'] } }],
      },
      {
        text: '去做一件一直想做、但不赚钱的事',
        outcomes: [{ text: '你开始在周末教山区的孩子上网课。不赚钱，也不出名，可每次下课你都舍不得关摄像头。', effects: { stats: { happiness: 6, charm: 1 }, addFlags: ['life-direction'] } }],
      },
    ],
  },
  {
    id: 'later-ai-coworker',
    category: 'career',
    weight: 12,
    requires: { minYear: 2028, minAge: 25, flags: ['employed'] },
    title: '新同事',
    text: '公司给每个组配了一个 AI 同事。它不用睡觉，不会请假，周报写得比谁都漂亮。组长在会上说：“大家要学会和它协作。”',
    variants: [{
      requires: { worldMin: { 'tech-ai': 3 } },
      text: '公司给每个组配了一个 AI 同事。它不但写周报，还开始帮老板做决策，已经比你们组长更懂业务了。茶水间里，大家聊得最多的是“下一个会是谁”。',
    }],
    choices: [
      {
        text: '抢先学会用它，当组里的“AI 教练”',
        outcomes: [
          { weight: 2, text: '你成了全组最会用 AI 的人，绩效第一次拿了 A。', effects: { stats: { intelligence: 3, happiness: 2, wealth: 5 } } },
          { weight: 1, text: '你把它调教得太好了，老板觉得你们组可以少招两个人。你保住了位置，却少了两个朋友。', effects: { stats: { intelligence: 2, happiness: -3 } } },
        ],
      },
      {
        text: '主动申请带 AI 落地项目',
        outcomes: [{ text: '项目做成了，你在公司年会上讲了二十分钟，下面坐着好几位高管。', effects: { stats: { influence: 2, fame: 1, wealth: 3 } } }],
      },
      {
        text: '它干它的，我干我的',
        outcomes: [{ text: '你继续用老办法做事。一年下来，你发现自己做的事越来越少，下班越来越早。', effects: { stats: { happiness: 1, intelligence: -1 } } }],
      },
    ],
  },
  {
    id: 'later-robot-layoff',
    category: 'career',
    weight: 15,
    requires: { minYear: 2030, minAge: 25, flags: ['employed'], worldMin: { 'tech-robot': 2 } },
    title: '工位上的机器人',
    text: '人事部约你谈话，说得很客气：你的岗位“已经实现了自动化”。你回头看了一眼，自己的工位上，一台机器人正安安静静地处理着你昨天没做完的表格。',
    choices: [
      {
        text: '拿上赔偿，去学一门机器做不了的手艺',
        outcomes: [{ text: '你学了木工，接一些定制家具的活。收入少了，可每件作品都有人专门来道谢。', effects: { stats: { wealth: 15, happiness: 2, intelligence: 1 }, removeFlags: ['employed'], addFlags: ['side-gig'] } }],
      },
      {
        text: '应聘“机器人训练师”',
        requires: { statMin: { intelligence: 60 } },
        outcomes: [{ text: '你从被替代的人，变成了教机器干活的人。新工位就在那台机器人旁边。', effects: { stats: { intelligence: 2, wealth: 5, happiness: 2 } } }],
      },
      {
        text: '干脆提前退休',
        requires: { minAge: 50 },
        outcomes: [{ text: '你收拾好东西，第一次在工作日的下午走进公园。阳光很好，长椅上都是和你一样的人。', effects: { stats: { happiness: 3, wealth: 10 }, removeFlags: ['employed'], addFlags: ['retired'] } }],
      },
    ],
  },
  {
    id: 'later-retire-party',
    category: 'career',
    annual: true,
    requires: { flags: ['retired'], notFlags: ['retire-party'] },
    title: '退休了',
    text: '最后一天上班，同事们给你订了一个蛋糕，上面写着“光荣退休”。你收拾工位，发现抽屉里还躺着入职那天的工牌。',
    choices: [
      {
        text: '和老同事们好好吃一顿',
        outcomes: [{ text: '大家聊起这些年的糗事，笑到服务员来催打烊。散场时，有人说“常回来看看”。', effects: { stats: { happiness: 6 }, addFlags: ['retire-party'] } }],
      },
      {
        text: '第二天就去报名老年大学',
        outcomes: [{ text: '你报了摄影和书法。班上最年轻的同学，也比你大五岁。', effects: { stats: { happiness: 4, intelligence: 3 }, addFlags: ['retire-party'] } }],
      },
      {
        text: '闲不住，接一点返聘的活',
        outcomes: [{ text: '你每周去两天，带带新人。钱不多，但被人需要的感觉很好。', effects: { stats: { wealth: 5, happiness: 2 }, addFlags: ['retire-party'] } }],
      },
    ],
  },
  {
    id: 'later-retire-life',
    category: 'life',
    weight: 12,
    requires: { minAge: 60, flags: ['retired'] },
    title: '退休生活',
    text: '退休后的第一个春天，你突然有了大把的时间，不知道该怎么花。',
    choices: [
      {
        text: '加入小区的广场舞队',
        outcomes: [{ text: '你从最后一排跳到了领舞的位置。每天晚上七点半，音乐一响，你就是全小区最精神的人。', effects: { stats: { health: 3, happiness: 5, charm: 1 } } }],
      },
      {
        text: '去环游世界',
        requires: { statMin: { wealth: 300 } },
        outcomes: [{ text: '你一口气去了十几个国家，在每个地方都寄一张明信片给自己。', effects: { stats: { wealth: -50, happiness: 10, intelligence: 1 } } }],
      },
      {
        text: '天天带孙辈',
        requires: { flags: ['grandchild'] },
        outcomes: [{ text: '你接送上下学、辅导作业、陪着搭积木。累是累，可每天都被一声“我回来啦”叫醒。', effects: { stats: { happiness: 8, health: -2 } } }],
      },
      {
        text: '去河边钓鱼',
        outcomes: [{ text: '一坐就是一整天，钓上来的鱼不多，想明白的事倒不少。', effects: { stats: { happiness: 4, health: 1 } } }],
      },
    ],
  },
  {
    id: 'later-reunion',
    category: 'life',
    weight: 8,
    requires: { minAge: 47, maxAge: 50 },
    title: '毕业三十年',
    text: '高中班长在群里发起了“毕业三十年”聚会。群里有人晒孙子，有人晒体检报告，还有人发了一张当年的毕业照，问“这个人是谁来着”。',
    choices: [
      {
        text: '去，看看大家都变成了什么样',
        outcomes: [{ text: '当年的学霸在卖保险，当年的捣蛋鬼开了三家公司。大家举杯的时候，都说“还是那时候好”。', effects: { stats: { happiness: 5, charm: 1 } } }],
      },
      {
        text: '去，顺便把当年那句话说完',
        outcomes: [
          { weight: 1, text: '你终于说出了那句憋了三十年的话。对方愣了一下，笑着说：“我早就知道了。”', effects: { stats: { happiness: 6 } } },
          { weight: 1, text: '对方没来。你在角落里坐了一晚，散场时把那句话咽了回去，觉得也挺好。', effects: { stats: { happiness: 1 } } },
        ],
      },
      {
        text: '不去了，在群里发个红包',
        outcomes: [{ text: '红包被抢光了，大家刷了一排“谢谢老同学”。', effects: { stats: { happiness: 1 } } }],
      },
    ],
  },
  {
    id: 'later-hometown',
    category: 'life',
    weight: 8,
    requires: { minAge: 50, minYear: 2035 },
    title: '老街拆了',
    text: '你回了一趟老家。小时候那条老街拆了，变成了一片整整齐齐的新楼。你站在原来小卖部的位置，怎么也想不起它的样子了。',
    choices: [
      {
        text: '去找找还有没有认识的人',
        outcomes: [{ text: '你在新小区门口遇到了当年小卖部的老板。老人家盯着你看了半天：“你是不是那个……小神童？”', effects: { stats: { happiness: 5 } } }],
      },
      {
        text: '出钱给老家修一座图书馆',
        requires: { statMin: { wealth: 1000 } },
        outcomes: [{ text: '图书馆建在老街原来的位置，门口挂着一张老街的照片。开馆那天，来了很多孩子。', effects: { stats: { wealth: -100, fame: 3, influence: 2, happiness: 6 } } }],
      },
      {
        text: '拍几张照片就走',
        outcomes: [{ text: '你拍了几张，回去翻看的时候才发现，每一张都只是陌生的楼。', effects: { stats: { happiness: -2 } } }],
      },
    ],
  },
  {
    id: 'later-old-friend',
    category: 'life',
    weight: 8,
    requires: { minAge: 50, flags: ['best-friend'] },
    title: '老朋友的电话',
    text: '深夜，一个很久没联系的号码打了进来，是你最好的朋友。电话那头沉默了几秒，然后说：“没什么事，就是突然想你了。”',
    choices: [
      {
        text: '第二天就买票去见面',
        outcomes: [{ text: '你们在车站见面，都老了，可一开口还是十几岁时那个腔调。', effects: { stats: { happiness: 8 } } }],
      },
      {
        text: '聊到天亮',
        outcomes: [{ text: '从当年的同桌聊到各自的孩子，再聊到身体。挂电话的时候，天已经亮了。', effects: { stats: { happiness: 6, health: -1 } } }],
      },
    ],
  },
  {
    id: 'later-old-age-care',
    category: 'life',
    weight: 10,
    requires: { minAge: 75, minYear: 2073 },
    title: '养老的问题',
    text: '你爬三楼开始要歇两次了。孩子们开了几次家庭会议，讨论你以后怎么养老。',
    variants: [{
      requires: { worldMin: { 'tech-robot': 3 } },
      text: '你爬三楼开始要歇两次了。社区推荐了一款“机器人护工”：会做饭、会提醒吃药、摔倒了会自动叫救护车，还会陪你下棋——就是总故意输给你。',
    }],
    choices: [
      {
        text: '住进养老院，和老伙计们作伴',
        outcomes: [{ text: '养老院里有棋友、有牌友，还有一位和你同一年出生的老人，天天跟你争论 1998 年那届世界杯。', effects: { stats: { happiness: 4, health: 2, wealth: -10 } } }],
      },
      {
        text: '在家里请人照顾',
        requires: { statMin: { wealth: 100 } },
        outcomes: [{ text: '你在自己熟悉的房子里，过着自己熟悉的日子。窗外那棵树，你看了四十年。', effects: { stats: { health: 3, happiness: 3, wealth: -20 } } }],
      },
      {
        text: '我自己能行',
        outcomes: [{ text: '你坚持自己买菜做饭。有一次在厨房摔了一下，好在没大事，只是从此出门多带了一根拐杖。', effects: { stats: { health: -3, happiness: 1 } } }],
      },
    ],
  },
  {
    id: 'later-memoir',
    category: 'life',
    weight: 6,
    requires: { minAge: 65, minYear: 2063, statMin: { fame: 30 } },
    title: '回忆录',
    text: '一家出版社找上门，想请你写一本回忆录。编辑说：“您这一生，好像总是比别人早一步。”',
    choices: [
      {
        text: '写真话：“我是重生的。”',
        outcomes: [
          { weight: 2, text: '出版社把它当成科幻小说出版了，卖得还不错。书评说：“想象力惊人，细节真实得可怕。”', effects: { stats: { fame: 6, happiness: 4 } } },
          { weight: 1, text: '没人相信，但你写得很痛快。最后一页，你写下了 1998 年那个夏天的比分。', effects: { stats: { happiness: 6 } } },
        ],
      },
      {
        text: '只写一个普通人的一生',
        outcomes: [{ text: '书里没有预言，只有你和家人、朋友的那些小事。很多读者来信说，在里面看到了自己的父母。', effects: { stats: { fame: 3, happiness: 5, charm: 1 } } }],
      },
      {
        text: '婉拒了',
        outcomes: [{ text: '有些事，自己记得就好。', effects: { stats: { happiness: 1 } } }],
      },
    ],
  },
  {
    id: 'later-grandkid-story',
    category: 'family',
    weight: 10,
    requires: { minAge: 55, minYear: 2053, flags: ['grandchild'] },
    title: '“你小时候是什么样的？”',
    text: '小孙辈趴在你腿上，仰着头问：“你小时候是什么样的？那时候有机器人吗？”',
    choices: [
      {
        text: '讲 1998 年那个夏天的世界杯',
        outcomes: [{ text: '你讲得眉飞色舞，小家伙听得一愣一愣的：“你那时候才几个月大，怎么记得这么清楚？”', effects: { stats: { happiness: 6 } } }],
      },
      {
        text: '悄悄说出重生的秘密',
        outcomes: [{ text: '小家伙眼睛亮晶晶的，一本正经地拉钩：“我信！我谁也不告诉。”', effects: { stats: { happiness: 8 } } }],
      },
      {
        text: '讲你犯过的错，让孩子少走弯路',
        outcomes: [{ text: '小家伙听着听着睡着了。你给盖好被子，想着这些话，也许以后用得上。', effects: { stats: { happiness: 4, intelligence: 1 } } }],
      },
    ],
  },
  {
    id: 'later-digital-twin',
    category: 'life',
    weight: 8,
    requires: { minYear: 2032, minAge: 55, worldMin: { 'tech-ai': 2 }, notFlags: ['digital-legacy'] },
    title: '数字分身',
    text: '一家公司推出了“数字分身”服务：录下你的声音、习惯和故事，以后家里人想你了，还能和“你”聊聊天。',
    choices: [
      {
        text: '录下自己的故事，留给家人',
        outcomes: [{ text: '你录了几十个小时，讲了这一生所有你想让后人知道的事——当然，删掉了“重生”的部分。', effects: { stats: { happiness: 4, wealth: -2 }, addFlags: ['digital-legacy'] } }],
      },
      {
        text: '“我可不想被‘复活’。”',
        outcomes: [{ text: '你觉得人这一辈子，有始有终才好。', effects: { stats: { happiness: 2 } } }],
      },
      {
        text: '先让分身替你去开几个会',
        requires: { flags: ['employed'] },
        outcomes: [
          { weight: 1, text: '分身开会比你本人还认真，老板夸它“最近状态很好”。你有点高兴，又有点失落。', effects: { stats: { happiness: 3, wealth: 2 }, addFlags: ['digital-legacy'] } },
          { weight: 1, text: '分身在会上一本正经地讲起了 1998 年的世界杯，全场沉默。你被叫去谈话了。', effects: { stats: { happiness: -2, fame: 1 }, addFlags: ['digital-legacy'] } },
        ],
      },
    ],
  },
  {
    id: 'later-legacy',
    category: 'life',
    weight: 10,
    requires: { minAge: 65, minYear: 2063, statMin: { wealth: 10000 } },
    title: '遗嘱',
    text: '律师把一份遗嘱草稿放在你面前：“您的资产规模比较大，建议早做安排。”你看着那串数字，想起 1998 年那个连话都不会说的自己。',
    choices: [
      {
        text: '大部分留给孩子',
        requires: { flags: ['has-child'] },
        outcomes: [{ text: '你把孩子叫来，把事情都说清楚了。孩子沉默了很久，说：“比起钱，我更想你多活几年。”', effects: { stats: { happiness: 4 } } }],
      },
      {
        text: '成立一个基金会，捐出大半',
        outcomes: [{ text: '基金会以你的名字命名，专门资助那些和你当年一样、想改变命运的孩子。', effects: { stats: { wealth: -3000, fame: 5, influence: 6, happiness: 6 }, addFlags: ['has-foundation'] } }],
      },
      {
        text: '活着的时候花掉它',
        outcomes: [{ text: '你在南半球买了一座小岛，每年冬天去晒太阳。律师说这“不太符合理财原则”，你说你早就不需要原则了。', effects: { stats: { wealth: -1000, happiness: 8 } } }],
      },
    ],
  },
  {
    id: 'later-80-birthday',
    category: 'life',
    rarity: 'rare',
    annual: true,
    requires: { minAge: 80, notFlags: ['birthday-80'] },
    title: '八十岁',
    text: '八十岁生日这天，你吹灭蜡烛，想起这一生其实活了一百多年。你许了个愿，没告诉任何人。',
    variants: [{
      requires: { flags: ['grandchild'] },
      text: '八十岁生日这天，一屋子人挤在一起，孙辈们争着帮你吹蜡烛。你想起这一生其实活了一百多年，许了个愿，没告诉任何人。',
    }],
    choices: [
      {
        text: '愿这世界，比我记得的那个更好',
        outcomes: [{ text: '窗外的天很蓝。你觉得，这个愿望也许已经实现了一点。', effects: { stats: { happiness: 6 }, addFlags: ['birthday-80'] } }],
      },
      {
        text: '愿身边的人都健健康康',
        outcomes: [{ text: '大家举杯说“长命百岁”，你笑着说“已经赚了”。', effects: { stats: { happiness: 6, health: 1 }, addFlags: ['birthday-80'] } }],
      },
    ],
  },
]
