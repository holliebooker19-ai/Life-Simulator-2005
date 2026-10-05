import type { GameEvent } from '../../types'

/**
 * 2011–2015（主角 13–17 岁）：初中到高中。2013 年（15 岁）前的现实事件仍以父母代理为主，
 * 之后主角可以用自己的零花钱/压岁钱参与。
 *
 * 本文件读取的标记：
 * - parents-trust / family-has-money：父母代理资格
 * - fit / best-friend / lucky / poker-face / skill-english：开局天赋或行动写入的标记
 *
 * 本文件写入的标记：
 * - skill-coding：学过编程（解锁行动“做个人项目”）
 * - skill-english：英语很好
 * - y1115-btc-hodl：2013 年用零花钱买了一点比特币并一直拿着（后续：y1620-2017-btc-payoff、y2126-2021-btc-peak）
 * - y1115-btc-family：2013 年家里买了一笔比特币（后续同上）
 * - y1115-ali-hold：家里在 2014 年买了阿狸爸爸的美股（后续：y1115-life-ali-payoff）
 * - y1115-in-bull：2014 年底家里进场 A 股（后续：y1115-2015-crash）
 * - y1115-exited-2015 / y1115-trapped-2015：2015 年股灾前离场 / 被套（后续：y1620-2016-circuit-breaker）
 * - y1115-key-high-school：考上重点高中
 * - y1115-olympiad：学科竞赛拿奖（后续：y1620-2016-gaokao 保送选项）
 * - y1115-science / y1115-arts：文理分科
 *
 * 改写锚点（Effects.alter）：y1115-2013-bitcoin / y1115-2015-crash。改写版事件放在下一年触发。
 */
export const y2011to2015Events: GameEvent[] = [
  // ───────────── 现实锚点：2011 ─────────────
  {
    id: 'y1115-2011-salt-panic',
    category: 'family',
    year: 2011,
    requires: { minAge: 13 },
    title: '抢盐风波',
    text: '三月，日本发生大地震，核电站出了事故。没过几天，小区里传开了“吃碘盐防辐射”“以后海盐都不能吃了”。妈妈拎着购物袋就要出门，超市门口已经排起了长队。',
    realFact: '2011 年 3 月 11 日日本东北部海域发生 9.0 级地震并引发福岛第一核电站事故；3 月中旬国内多地出现抢购食盐风波，相关部门辟谣并保障供应后数日内平息。依据：当年主流媒体报道。',
    choices: [
      {
        text: '拦住妈妈：“过几天就没人抢了，家里的盐够吃。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '妈妈将信将疑地放下了袋子。一周后，隔壁阿姨家囤的几十斤盐堆在阳台上，吃到你高中毕业。', effects: { stats: { influence: 2, happiness: 2 } } },
          { tag: 'misremember', text: '你把“抢盐”记成了“抢醋”，说得头头是道，妈妈听完更慌了，扛回来两箱醋。', effects: { stats: { wealth: -0.1, happiness: -1 } } },
        ],
      },
      {
        text: '劝爸爸把店里的盐按原价卖，不许涨价',
        requires: { flags: ['family-has-money'] },
        outcomes: [
          { text: '别家都在涨价，你家门口挂着“原价供应、每人限购”。风波过后，街坊们都记住了这家店。', effects: { stats: { fame: 3, influence: 2, wealth: 0.5 } } },
        ],
      },
      { text: '跟着全家去超市看热闹', outcomes: [{ text: '你在队伍里背完了两篇课文，顺便见识了什么叫“人间真实”。', effects: { stats: { happiness: 2, intelligence: 1 } } }] },
    ],
  },
  {
    id: 'y1115-2011-smartphone',
    category: 'world',
    year: 2011,
    requires: { minAge: 13 },
    title: '手机里的新世界',
    text: '同学们开始用一款叫“薇信”的聊天软件发语音，一家叫“小咪”的公司发布了第一款手机，卖一千九百九十九元。你知道，接下来十年，人们的生活都会被装进这块屏幕里。',
    realFact: '2011 年 1 月某互联网公司推出即时通讯 App，当年迅速普及；同年 8 月某国产手机品牌发布首款手机，定价 1999 元，开启国产智能手机性价比时代。依据：通行科技史料。名称已按 docs/naming/y2011-2026.md 改名。',
    choices: [
      {
        text: '劝爸爸开一家手机配件和贴膜的小店',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '店开在学校门口，手机壳、贴膜、充电宝卖到断货。爸爸说这是他这辈子最轻松的生意。', effects: { stats: { wealth: 15, influence: 2 } } },
          { tag: 'misremember', text: '你记错了火起来的时间，店里进了一堆按键机的配件，最后只能论斤卖。', effects: { stats: { wealth: -5, happiness: -3 } } },
        ],
      },
      {
        text: '给全家装上薇信，建一个家庭群',
        requires: { flags: ['parents-trust'] },
        outcomes: [
          { text: '奶奶学会了发语音，每天早上六点准时在群里发“早上好”的动图。全家第一次觉得离得这么近。', effects: { stats: { happiness: 4, influence: 1 } } },
        ],
      },
      { text: '继续用老手机，先把期中考试考好', outcomes: [{ text: '你忍住了没换手机，成绩倒是往前挪了几名。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },

  // ───────────── 现实锚点：2012 ─────────────
  {
    id: 'y1115-2012-euro',
    category: 'finance',
    year: 2012,
    requires: { minAge: 14 },
    title: '欧洲杯之夜',
    text: '夏天，欧洲杯决赛。爸爸和他的朋友们约好凌晨看球，顺便赌一顿夜宵。你记得那场决赛，比分悬殊得离谱。',
    realFact: '2012 年欧洲杯决赛于 7 月 1 日在基辅举行，西班牙 4:0 战胜意大利，成功卫冕。依据：欧足联官方赛果。',
    choices: [
      {
        text: '悄悄告诉爸爸：“西班牙，赢四个。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '比分和你说的一模一样。爸爸愣了半天，回头看你的眼神像看一只会说话的猫。', effects: { stats: { wealth: 0.5, influence: 3, happiness: 3 } } },
          { tag: 'misremember', text: '你记成了意大利赢。夜宵是爸爸请的，他还被朋友笑了一整年。', effects: { stats: { wealth: -0.2, happiness: -2 } } },
        ],
      },
      { text: '早早睡觉，明天还要上课', outcomes: [{ text: '你睡得很香，第二天在班里听了一上午的比赛复盘。', effects: { stats: { health: 2 } } }] },
    ],
  },
  {
    id: 'y1115-2012-london',
    category: 'world',
    year: 2012,
    requires: { minAge: 14 },
    title: '伦敦奥运会',
    text: '暑假，伦敦奥运会开幕。电视里每天都在升国旗，楼下的小孩学着运动员冲线的样子满院子跑。你看着赛场，突然很想做点什么。',
    realFact: '2012 年第 30 届夏季奥运会于 7 月 27 日至 8 月 12 日在英国伦敦举行。依据：国际奥委会官方资料。',
    choices: [
      {
        text: '报名学校田径队，跟着训练一个暑假',
        outcomes: [
          { weight: 2, text: '你晒黑了两个色号，百米成绩快了一秒多，教练说你是块料。', effects: { stats: { health: 5, charm: 2 }, addFlags: ['fit'] } },
          { weight: 1, requires: { flags: ['fit'] }, text: '本来就底子好，练了一个暑假直接被选进了市里的集训队。', effects: { stats: { health: 6, fame: 3, charm: 2 } } },
        ],
      },
      { text: '每天熬夜看直播', outcomes: [{ text: '你记住了好多运动员的名字，也记住了熬夜第二天有多困。', effects: { stats: { happiness: 4, health: -2 } } }] },
    ],
  },
  {
    id: 'y1115-2012-doomsday',
    category: 'absurd',
    year: 2012,
    requires: { minAge: 14 },
    title: '世界末日',
    text: '年底，全班都在传“玛雅预言”：12 月 21 日世界末日。有人写了遗书，有人把零花钱全买了零食，还有人在班上卖“诺亚方舟船票”。只有你知道，那天会平平无奇地过去。',
    realFact: '所谓“玛雅历法 2012 年 12 月 21 日世界末日”是当年流行的网络传言，当天并无异常发生。依据：当年主流媒体报道。',
    choices: [
      {
        text: '跟全班打赌：“明天照常上课。”',
        outcomes: [
          { weight: 3, text: '第二天太阳照常升起，你收了一抽屉的辣条，被封为“末日终结者”。', effects: { stats: { fame: 2, happiness: 4, charm: 1 } } },
          { weight: 1, text: '大家说话不算数，赖账赖得理直气壮。你只赢到了一句“算你狠”。', effects: { stats: { happiness: 1 } } },
        ],
      },
      {
        text: '一本正经地开一场“末日后生存讲座”',
        requires: { statMin: { charm: 70 } },
        outcomes: [
          { text: '你讲得太有画面感，连隔壁班都跑来听。末日没来，你倒成了年级名人。', effects: { stats: { fame: 4, charm: 3, influence: 1 } } },
        ],
      },
      { text: '照常写作业', outcomes: [{ text: '末日没来，期末考试来了。你是少数没有慌的人。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },

  // ───────────── 现实锚点：2013 ─────────────
  {
    id: 'y1115-2013-yuebao',
    category: 'finance',
    year: 2013,
    requires: { minAge: 15 },
    title: '余额饱',
    text: '一个叫“余额饱”的东西突然火了：钱放进去，每天都能看到几块钱的收益，比银行活期高出一大截。妈妈对着手机研究了半天，还是不敢把钱挪出去。',
    realFact: '2013 年 6 月某互联网平台推出与货币基金对接的余额理财产品，年化收益一度明显高于银行活期存款，掀起“互联网理财”热潮。依据：通行财经史料。名称已改名。',
    choices: [
      {
        text: '帮妈妈把活期存款挪进去',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '妈妈每天早上打开手机看收益，比看天气预报还准时。一年下来多赚了一笔买菜钱。', effects: { stats: { wealth: 1, influence: 1, happiness: 2 } } },
          { tag: 'misremember', text: '你把它和后来出事的那些“高收益理财”记混了，吓得妈妈又全取了出来，白折腾一场。', effects: { stats: { happiness: -1 } } },
        ],
      },
      { text: '把自己的压岁钱放进去，每天看着涨几分钱', outcomes: [{ text: '收益少得可怜，但你第一次搞懂了什么叫“复利”。', effects: { stats: { wealth: 0.05, intelligence: 2 } } }] },
    ],
  },
  {
    id: 'y1115-2013-gold-dama',
    category: 'finance',
    year: 2013,
    requires: { minAge: 15 },
    title: '大妈抄底黄金',
    text: '四月，金价一天之内暴跌。第二天，金店门口挤满了阿姨们，妈妈也被小姐妹拉着去“抄底”，说这是几十年一遇的机会。',
    realFact: '2013 年 4 月 15 日国际金价单日大跌约 9%，为数十年来最大单日跌幅之一；国内出现“中国大妈”排队抢购金饰的现象，但金价当年整体仍下跌约三成。依据：通行财经史料。',
    choices: [
      {
        text: '拉住妈妈：“还会跌，别急着买。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '妈妈只买了一对耳环意思意思。到年底金价又跌了一大截，她的小姐妹们集体沉默。', effects: { stats: { wealth: 1, influence: 2 } } },
          { tag: 'misremember', text: '你把这轮下跌和很多年以后的大涨记串了，催着妈妈多买点。结果一套就是好几年。', effects: { stats: { wealth: -1.5, happiness: -2 } } },
        ],
      },
      { text: '跟着去金店看热闹', outcomes: [{ text: '你在人堆里被挤掉了一只鞋，回家写进了周记，被语文老师当范文念。', effects: { stats: { happiness: 2, charm: 1 } } }] },
    ],
  },
  {
    id: 'y1115-2013-bitcoin',
    category: 'finance',
    rarity: 'rare',
    year: 2013,
    requires: { minAge: 15, notAltered: ['y1115-2013-bitcoin'] },
    title: '一千美元的数字',
    text: '年底，你在论坛上看到一条帖子：比特币第一次涨过了一千美元。帖子底下一半人在喊“泡沫”，一半人在晒收益。你知道它后来会走多远，也知道中间要经历多少次腰斩。',
    realFact: '2013 年 11 月底比特币价格首次突破 1000 美元；12 月初国内相关部门发文提示风险并限制金融机构参与，价格随即大幅回落。依据：通行加密货币市场史料。',
    choices: [
      {
        text: '用压岁钱买一点，然后假装忘了它',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你把一千块压岁钱换成了一小串字符，抄在本子最后一页。之后价格怎么跌，你都没再打开看。', effects: { stats: { wealth: -0.1, memory: 1 }, addFlags: ['y1115-btc-hodl'] } },
          { tag: 'misremember', text: '你记错了买点，买完一个月就跌掉一大半。你没忍住，割肉离场，心疼了一个寒假。', effects: { stats: { wealth: -0.06, happiness: -3 } } },
        ],
      },
      {
        text: '说服爸妈拿出一笔钱，并且“十年内不许卖”',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸犹豫了三天，还是买了。他把密码抄成三份藏在不同的地方，嘴上说“就当捐了”。', effects: { stats: { wealth: -5, influence: 2 }, addFlags: ['y1115-btc-family'] } },
          { tag: 'misremember', text: '你记岔了监管出手的时间，爸爸刚买进就碰上大跌，一气之下全卖了。', effects: { stats: { wealth: -3, happiness: -3 } } },
        ],
      },
      {
        text: '在各大论坛写长帖“布道”，把它讲成全民话题',
        requires: { statMin: { influence: 25 } },
        outcomes: [
          { text: '你的帖子被转疯了，一个初中生讲清楚了大人们都没讲清楚的东西。比特币比原本的历史更早地“出圈”了。', effects: { stats: { fame: 6, influence: 3 }, alter: [{ id: 'y1115-2013-bitcoin', scale: 5 }], world: { crypto: 15 }, addFlags: ['y1115-btc-hodl'] } },
        ],
      },
      { text: '看看就好，这不是中学生该碰的东西', outcomes: [{ text: '你关掉网页去做数学卷子，心里默念：以后再说。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },

  // ───────────── 现实锚点：2014 ─────────────
  {
    id: 'y1115-2014-btc-altered',
    category: 'world',
    rarity: 'rare',
    year: 2014,
    requires: { minAge: 16, altered: ['y1115-2013-bitcoin'] },
    title: '提前出圈的“币”',
    text: '因为你去年的那些帖子，比特币比原本更早地成了饭桌话题。连班主任都私下问你“现在还能不能买”。世界线在你手里拐了个小弯，你脑子里的那张价格表，也开始有点对不上了。',
    realFact: '改写版：真实历史中，比特币在 2014 年初某海外交易平台倒闭后长期低迷，大众关注度直到 2017 年才明显上升。本事件为玩家改写锚点 y1115-2013-bitcoin 后的分支。',
    choices: [
      { text: '趁热度做一个“币圈科普”专栏', outcomes: [{ text: '专栏涨粉很快，你第一次靠写字收到了稿费，也第一次收到了骂你“割韭菜”的私信。', effects: { stats: { fame: 4, wealth: 0.5, charm: 1 } } }] },
      { text: '低调点，不再公开谈论它', outcomes: [{ text: '你删掉了大部分帖子。热度慢慢散了，但这个世界已经和你记忆里的不太一样。', effects: { stats: { happiness: -1, memory: 1 } } }] },
    ],
  },
  {
    id: 'y1115-2014-worldcup',
    category: 'finance',
    rarity: 'rare',
    year: 2014,
    requires: { minAge: 16 },
    title: '巴西世界杯',
    text: '巴西世界杯，宿舍熄灯后大家偷偷用手机看直播。半决赛前，有人赌东道主巴西必胜。你清楚地记得那一晚的比分，离谱到解说都说不出话。',
    realFact: '2014 年巴西世界杯半决赛，德国 7:1 大胜东道主巴西；7 月 13 日决赛德国加时 1:0 战胜阿根廷夺冠。依据：国际足联官方赛果。',
    choices: [
      {
        text: '在宿舍放话：“德国会赢七个。”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '比分打到 5:0 时，宿舍里已经没人说话了；终场 7:1，你被室友们抬起来绕了一圈。“七比一预言家”的外号跟了你三年。', effects: { stats: { fame: 4, charm: 2, happiness: 5 } } },
          { tag: 'misremember', text: '你脱口而出“巴西赢七个”，被全宿舍记了一辈子，每次聚会都要拿出来笑一遍。', effects: { stats: { fame: 1, happiness: -3 } } },
        ],
      },
      {
        text: '让爸爸押德国夺冠',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '决赛加时赛那一脚进球时，爸爸在客厅里跳了起来。这一注够全家出去玩一趟了。', effects: { stats: { wealth: 8, influence: 2, happiness: 3 } } },
          { tag: 'misremember', text: '你记成了阿根廷，爸爸押错了队，输掉了一笔不小的钱。', effects: { stats: { wealth: -4, happiness: -3 } } },
        ],
      },
      { text: '蒙着被子偷偷看球', outcomes: [{ text: '你被宿管抓了个正着，写了一份检讨。值了。', effects: { stats: { happiness: 3, health: -1 } } }] },
    ],
  },
  {
    id: 'y1115-2014-ipo',
    category: 'finance',
    year: 2014,
    requires: { minAge: 16 },
    title: '阿狸爸爸敲钟',
    text: '九月，开掏宝的那家公司阿狸爸爸在美国上市，创下当时全球最大的首次公开募股纪录。新闻里，创始人站在交易所里笑得很灿烂。你在想：家里能不能搭上这趟车？',
    realFact: '2014 年 9 月 19 日某国内电商集团在纽约证券交易所上市，募资规模约 250 亿美元，为当时全球最大规模 IPO。依据：通行财经史料。名称已改名。',
    choices: [
      {
        text: '劝爸爸开个美股账户，买一点长期拿着',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸买了一点，第二年股价跌了一截，他天天念叨。你只说了一句：“再等等。”', effects: { stats: { wealth: -3, influence: 1 }, addFlags: ['y1115-ali-hold'] } },
          { tag: 'misremember', text: '你以为它上市就会一路涨，爸爸追在了高点，没多久就跌掉一半，他咬牙割了。', effects: { stats: { wealth: -5, happiness: -3 } } },
        ],
      },
      {
        text: '劝妈妈在掏宝上开个小店，卖老家的土特产',
        requires: { flags: ['parents-trust'] },
        outcomes: [
          { weight: 2, text: '妈妈的小店卖腊肉和笋干，评价全是“和小时候一个味道”。家里多了一份稳定的收入。', effects: { stats: { wealth: 3, happiness: 3 } } },
          { weight: 1, text: '开店比想象中难，客服、物流、差评把妈妈折腾得够呛，半年后关了门。', effects: { stats: { wealth: -0.5, happiness: -2 } } },
        ],
      },
      { text: '刷了一晚上新闻，第二天上课打瞌睡', outcomes: [{ text: '你把敲钟仪式看了三遍，被老师点名起来回答问题时，一脸茫然。', effects: { stats: { happiness: 1, intelligence: -1 } } }] },
    ],
  },
  {
    id: 'y1115-2014-bull-start',
    category: 'finance',
    rarity: 'rare',
    year: 2014,
    requires: { minAge: 16 },
    title: '牛市又来了',
    text: '年底，股市突然热了起来，“沪港通”开通的新闻天天上头条。爸爸单位里又有人开始聊股票。你知道，这轮行情会疯到明年六月，然后是一场踩踏。',
    realFact: '2014 年 11 月 17 日沪港通正式开通；上证综指 2014 年全年上涨约五成，下半年起成交明显放大，开启 2014–2015 年的大牛市。依据：上海证券交易所数据与通行财经史料。',
    choices: [
      {
        text: '劝爸妈年底进场：“明年六月前一定要走。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈拿出一笔钱建了仓，账户一天比一天红。你在日历的六月那一页画了一个大大的红圈。', effects: { stats: { wealth: 3, influence: 1 }, addFlags: ['y1115-in-bull'] } },
          { tag: 'misremember', text: '你把进场时间记早了，买在了一轮小回调前，爸妈被吓得先割了一半。', effects: { stats: { wealth: -1, happiness: -2 } } },
        ],
      },
      {
        text: '让爸爸把生意上的闲钱分一块进场',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸进场的时机几乎踩在起点上，过年的时候，他给全家每个人都包了一个厚厚的红包。', effects: { stats: { wealth: 20, influence: 2 }, addFlags: ['y1115-in-bull'] } },
          { tag: 'misremember', text: '你记错了板块，爸爸买的股票在牛市里几乎没怎么涨，他开始怀疑你的“神通”。', effects: { stats: { wealth: -3, happiness: -2 } } },
        ],
      },
      { text: '高二了，专心学习', outcomes: [{ text: '你把行情抛在脑后，期末考进了年级前列。', effects: { stats: { intelligence: 3 } } }] },
    ],
  },
  {
    id: 'y1115-2014-ride-hailing',
    category: 'world',
    year: 2014,
    requires: { minAge: 16 },
    title: '打车不要钱',
    text: '两家打车软件打起了补贴战：坐一次车，平台倒贴你十几块。街上的出租车司机都在手机上“抢单”，同学们周末打车去吃饭，比坐公交还便宜。',
    realFact: '2014 年初两家打车软件为争夺市场展开大规模补贴战，乘客和司机均可获得高额补贴，次年两家合并。依据：通行科技史料。',
    choices: [
      {
        text: '研究补贴规则，带同学们一起“薅羊毛”',
        requires: { statMin: { intelligence: 50 } },
        outcomes: [
          { text: '你做了一张“最省钱打车攻略”在班上传阅，周末出行几乎零成本。大家都说你脑子好使。', effects: { stats: { wealth: 0.1, charm: 2, fame: 1 } } },
        ],
      },
      { text: '还是坐公交，顺便背单词', outcomes: [{ text: '你在公交车上背完了一整本单词书。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },

  // ───────────── 现实锚点：2015 ─────────────
  {
    id: 'y1115-2015-crash',
    category: 'finance',
    rarity: 'rare',
    year: 2015,
    requires: { minAge: 17, notAltered: ['y1115-2015-crash'] },
    title: '五千点',
    text: '六月，股市冲上五千点，满大街都在聊“配资”“杠杆”，连你同桌的爸爸都把房子抵押了。你知道，接下来的两个多月，会有很多人一夜回到解放前。',
    realFact: '上证综指于 2015 年 6 月 12 日盘中触及约 5178 点后开始暴跌，至 8 月下旬跌至约 2850 点，两个多月跌幅超过四成，期间场外配资被集中清理，多次出现“千股跌停”。依据：上海证券交易所数据与通行财经史料。',
    choices: [
      {
        text: '盯着爸妈：“六月中旬之前，全卖了！”',
        requires: { flags: ['y1115-in-bull'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈在最高点前一周清了仓。之后的每个跌停日，爸爸都要给你夹一块排骨。', effects: { stats: { wealth: 15, influence: 3, happiness: 4 }, addFlags: ['y1115-exited-2015'] } },
          { tag: 'misremember', text: '你把见顶日记晚了一个月，等爸妈想卖时，账户已经连着跌停卖不出去了。', effects: { stats: { wealth: -10, happiness: -6 }, addFlags: ['y1115-trapped-2015'] } },
        ],
      },
      {
        text: '拦住爸爸：“千万别加杠杆，别配资。”',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸本来已经签好了配资合同，被你闹得撕了。后来他听说，那个介绍配资的朋友连车都卖了。', effects: { stats: { wealth: 10, influence: 2 }, addFlags: ['y1115-exited-2015'] } },
          { tag: 'misremember', text: '你说得太晚，爸爸已经加了杠杆，暴跌第一周就被强制平仓。', effects: { stats: { wealth: -40, happiness: -8 }, addFlags: ['y1115-trapped-2015'] } },
        ],
      },
      {
        text: '在网上连发长文，公开预警杠杆风险',
        requires: { statMin: { influence: 40, fame: 20 } },
        outcomes: [
          { text: '一个高中生的“股市风险分析”在网上被疯转，监管部门提前收紧了配资。这一次，暴跌被拉成了一段温和的回调——世界线因你而偏转。', effects: { stats: { fame: 10, influence: 6 }, alter: [{ id: 'y1115-2015-crash', scale: 8 }], world: { economy: 5 } } },
        ],
      },
      { text: '高考倒计时，别管这些了', outcomes: [{ text: '你戴上耳机刷题，窗外的哀嚎与你无关。', effects: { stats: { intelligence: 3, happiness: -1 } } }] },
    ],
  },
  {
    id: 'y1115-2015-fx',
    category: 'finance',
    year: 2015,
    requires: { minAge: 17 },
    title: '汇率变了',
    text: '八月的一个早上，新闻说人民币兑美元中间价一天下调了将近 2%。爸爸的朋友在饭桌上说：“早知道就该换点美元。”你心里想：早知道，我是知道的。',
    realFact: '2015 年 8 月 11 日人民银行完善人民币兑美元中间价报价机制，当日中间价下调约 1.9%，此后数日人民币明显贬值，史称“8·11 汇改”。依据：人民银行公告与通行财经史料。',
    choices: [
      {
        text: '早在七月就劝爸爸换一部分美元',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸换了一部分美元，汇率一动，账面上平白多出一笔钱。他开始认真考虑送你出国读书。', effects: { stats: { wealth: 5, influence: 2 } } },
          { tag: 'misremember', text: '你把时间记早了一年，换完之后汇率纹丝不动，手续费倒交了不少。', effects: { stats: { wealth: -1, happiness: -1 } } },
        ],
      },
      { text: '查资料搞懂什么是“汇率”', outcomes: [{ text: '你在政治课上把汇率讲得清清楚楚，老师让你去给全班讲了十分钟。', effects: { stats: { intelligence: 2, charm: 1 } } }] },
    ],
  },
  {
    id: 'y1115-2016-slowbull-altered',
    category: 'world',
    rarity: 'rare',
    year: 2016,
    requires: { minAge: 18, altered: ['y1115-2015-crash'] },
    title: '没有发生的股灾',
    text: '因为你去年的那几篇文章，杠杆被提前清理，股市没有在夏天崩塌，而是慢慢回落。新年第一周，原本该出现的“熔断”也没了下文。你脑子里的行情表，从这里开始缺了一页。',
    realFact: '改写版：真实历史中，2015 年 6 月至 8 月 A 股暴跌，2016 年 1 月新推出的指数熔断机制在 4 个交易日内两次触发后暂停。本事件为玩家改写锚点 y1115-2015-crash 后的分支。',
    choices: [
      { text: '接受一家财经媒体的专访', outcomes: [{ text: '“最年轻的风险预警者”上了财经版。有人夸你，也有人说你只是运气好。', effects: { stats: { fame: 6, influence: 3, charm: 2 } } }] },
      { text: '保持沉默，专心准备高考', outcomes: [{ text: '你拒绝了所有采访。少了一场股灾，你的未来记忆也少了一块可以依赖的地方。', effects: { stats: { intelligence: 3, memory: -2 } } }] },
    ],
  },

  // ───────────── 少年生活（13–17 岁，无现实对应） ─────────────
  {
    id: 'y1115-school-qq-space',
    category: 'school',
    requires: { minAge: 13, maxAge: 15, minYear: 2011 },
    title: '非主流时期',
    text: '班上流行在扣扣空间里发火星文、大头贴和忧伤的歌词。你那一世的黑历史就是这么来的——这一次，要不要再来一遍？',
    choices: [
      { text: '入乡随俗，发一张四十五度角仰望天空的自拍', outcomes: [{ text: '点赞二十多个，评论区全是“好帅/好美”。十年后你会想删掉它，但现在很快乐。', effects: { stats: { charm: 2, happiness: 4 } } }] },
      { text: '用空间写“未来科技畅想”，假装是科幻小说', outcomes: [{ text: '你写了“以后手机能刷脸付款”，同学们说你脑洞太大。这篇日志在很多年后被人翻出来，转发了好几万次。', effects: { stats: { intelligence: 2, fame: 2, memory: 1 } } }] },
    ],
  },
  {
    id: 'y1115-school-crush',
    category: 'school',
    requires: { minAge: 13, maxAge: 16 },
    title: '后排的那个人',
    text: '你发现自己上课总忍不住往某个方向看。下课时，对方借了你一块橡皮，还冲你笑了一下。你一个心理年龄快三十岁的人，居然脸红了。',
    choices: [
      {
        text: '写一张纸条，夹在借来的书里还回去',
        outcomes: [
          { weight: 1, requires: { statMin: { charm: 70 } }, text: '第二天书里多了一张回信，上面画着一个笑脸。你们开始一起放学回家。', effects: { stats: { happiness: 8, charm: 2 } } },
          { weight: 1, text: '纸条被同桌截胡，当众念了出来。全班起哄，你恨不得钻进课桌里。', effects: { stats: { happiness: -4, fame: 1 } } },
        ],
      },
      { text: '把喜欢藏起来，好好学习', outcomes: [{ text: '你把心思压进了练习册里。很多年后同学聚会，对方说：“其实那时候我也……”', effects: { stats: { intelligence: 3, happiness: -1 } } }] },
    ],
  },
  {
    id: 'y1115-life-netbar-overnight',
    category: 'life',
    requires: { minAge: 13, maxAge: 17, minYear: 2011 },
    title: '通宵',
    text: '周五晚上，几个同学约你去网吧包夜，说是“开黑到天亮”。你上一世在这家网吧里度过了半个青春。',
    choices: [
      { text: '去！青春就该这么过', outcomes: [
        { weight: 2, text: '你们打到天亮，吃了一碗泡面，走出网吧时阳光刺眼。累，但很爽。', effects: { stats: { happiness: 5, health: -3, charm: 1 } } },
        { weight: 1, text: '半夜被班主任堵在网吧门口，全员请家长。', effects: { stats: { happiness: -3, health: -1 } } },
      ] },
      { text: '借网吧的电脑查资料，研究“以后会火的东西”', outcomes: [{ text: '同学们打游戏，你在旁边记了满满一页笔记。他们说你是网吧里唯一的学霸。', effects: { stats: { intelligence: 2, memory: 1, health: -1 } } }] },
      { text: '不去，回家睡觉', outcomes: [{ text: '你睡了一个好觉，周一听同学吹了一上午的“五杀”。', effects: { stats: { health: 2 } } }] },
    ],
  },
  {
    id: 'y1115-school-zhongkao',
    category: 'school',
    rarity: 'rare',
    requires: { minAge: 15, maxAge: 16, minYear: 2013, maxYear: 2014 },
    title: '中考',
    text: '中考到了。考场外家长们撑着伞站成一排，妈妈塞给你一瓶水和两颗巧克力。你重活一世，这张卷子能考成什么样，全看这些年攒下的底子。',
    choices: [
      {
        text: '正常发挥',
        outcomes: [
          { requires: { statMin: { intelligence: 65 } }, text: '你考进了市里最好的高中，录取通知书贴在了家门口的公告栏上。', effects: { stats: { intelligence: 4, happiness: 6, fame: 1 }, addFlags: ['y1115-key-high-school'] } },
          { requires: { statMin: { intelligence: 45 }, statMax: { intelligence: 64 } }, text: '成绩不上不下，进了一所普通高中。爸妈说“够用了”。', effects: { stats: { intelligence: 2, happiness: 2 } } },
          { requires: { statMax: { intelligence: 44 } }, text: '你考砸了，只够上一所很一般的学校。爸妈叹了口气，没说什么。', effects: { stats: { happiness: -5 } } },
        ],
      },
      {
        text: '凭记忆押作文题',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '作文题和你记得的一模一样，你写得行云流水，分数比平时高出一截，挤进了重点高中。', effects: { stats: { intelligence: 3, happiness: 6 }, addFlags: ['y1115-key-high-school'] } },
          { tag: 'misremember', text: '你押的是别的省的题，看到卷子时脑子一片空白，最后勉强写完。', effects: { stats: { happiness: -4 } } },
        ],
      },
    ],
  },
  {
    id: 'y1115-school-coding-club',
    category: 'school',
    requires: { minAge: 13, maxAge: 17, minYear: 2011, notFlags: ['skill-coding'] },
    title: '计算机兴趣小组',
    text: '信息课老师在招计算机兴趣小组，教大家写程序。教室里只有几台老电脑，报名的人不多。你知道，十年后会写代码的人有多吃香。',
    choices: [
      {
        text: '报名，认真学',
        outcomes: [
          { weight: 2, requires: { statMin: { intelligence: 50 } }, text: '你很快就上手了，写出了第一个会动的小游戏。老师说你是这批学生里最有灵性的。', effects: { stats: { intelligence: 5, happiness: 3 }, addFlags: ['skill-coding'] } },
          { weight: 1, text: '刚开始一头雾水，但你硬啃下来了，至少能写点简单的小程序。', effects: { stats: { intelligence: 3, happiness: -1 }, addFlags: ['skill-coding'] } },
        ],
      },
      { text: '没兴趣，去打球', outcomes: [{ text: '你在球场上挥汗如雨，暂时没把写代码放在心上。', effects: { stats: { health: 3, happiness: 2 } } }] },
    ],
  },
  {
    id: 'y1115-school-english-contest',
    category: 'school',
    requires: { minAge: 13, maxAge: 17, notFlags: ['skill-english'] },
    title: '英语演讲比赛',
    text: '学校要选人参加市里的英语演讲比赛。英语老师看着你：“要不要试试？”',
    choices: [
      {
        text: '报名，每天早起练口语',
        outcomes: [
          { requires: { statMin: { charm: 60 } }, text: '你站在台上一点也不怯场，拿了市里的二等奖。从此你的英语成了“看家本领”。', effects: { stats: { charm: 3, fame: 2, intelligence: 2 }, addFlags: ['skill-english'] } },
          { requires: { statMax: { charm: 59 } }, text: '你一上台就忘词了，但这一个月的练习让你的口语进步了一大截。', effects: { stats: { intelligence: 3, happiness: -2 }, addFlags: ['skill-english'] } },
        ],
      },
      { text: '算了，不出这个风头', outcomes: [{ text: '你在台下当观众，鼓掌鼓得很真诚。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y1115-school-olympiad',
    category: 'school',
    rarity: 'rare',
    requires: { minAge: 14, maxAge: 17, statMin: { intelligence: 55 } },
    title: '竞赛班',
    text: '数学老师把你叫到办公室：学校要组织学科竞赛班，周末和寒暑假都要上课，拿了奖可能有保送的机会。',
    choices: [
      {
        text: '进竞赛班，拼一把',
        outcomes: [
          { requires: { statMin: { intelligence: 70 } }, text: '你在省赛里拿了一等奖，名字挂上了学校门口的光荣榜。名校的招生老师开始给你打电话。', effects: { stats: { intelligence: 6, fame: 4, happiness: 3, health: -2 }, addFlags: ['y1115-olympiad'] } },
          { requires: { statMax: { intelligence: 69 } }, text: '你学得很吃力，最后只拿了个鼓励奖，但脑子确实被练活了。', effects: { stats: { intelligence: 5, happiness: -2, health: -2 } } },
        ],
      },
      { text: '不去，周末还想睡个懒觉', outcomes: [{ text: '你婉拒了老师。周末的阳光很好。', effects: { stats: { happiness: 3, health: 1 } } }] },
    ],
  },
  {
    id: 'y1115-family-quarrel',
    category: 'family',
    requires: { minAge: 13, maxAge: 17 },
    title: '叛逆期',
    text: '因为一件小事，你和爸妈吵了起来。门被摔得很响。你知道自己说了重话，也知道上一世他们老了以后，你有多后悔这些年没好好说话。',
    choices: [
      { text: '晚饭时先开口道歉', outcomes: [{ text: '妈妈愣了一下，往你碗里夹了一块肉。爸爸咳嗽一声，说“吃饭吃饭”。', effects: { stats: { happiness: 4, charm: 1 }, addFlags: ['parents-trust'] } }] },
      { text: '冷战，谁也不理谁', outcomes: [{ text: '家里安静了一个星期。最后是妈妈先绷不住，敲了你的房门。', effects: { stats: { happiness: -4 } } }] },
    ],
  },
  {
    id: 'y1115-school-wenli',
    category: 'school',
    requires: { minAge: 15, maxAge: 16, minYear: 2013, notFlags: ['y1115-science', 'y1115-arts'] },
    title: '文理分科',
    text: '高一下学期，班主任发下了文理分科意向表。爸妈说学理科“好找工作”，你心里也有自己的盘算。',
    choices: [
      { text: '选理科', outcomes: [{ text: '你进了理科班，物理老师讲课像说相声，你学得很带劲。', effects: { stats: { intelligence: 3 }, addFlags: ['y1115-science'] } }] },
      { text: '选文科', outcomes: [{ text: '你进了文科班，历史课上你总比老师多知道一点“以后的事”。', effects: { stats: { intelligence: 2, charm: 2 }, addFlags: ['y1115-arts'] } }] },
    ],
  },
  {
    id: 'y1115-school-phone-confiscated',
    category: 'school',
    requires: { minAge: 13, maxAge: 17, minYear: 2011 },
    title: '手机被没收',
    text: '上课偷偷看手机，被班主任抓了个正着。她把手机锁进了抽屉，说期末才还。',
    choices: [
      { text: '老老实实写检讨', outcomes: [{ text: '你写了一份感人肺腑的检讨，班主任看完提前一个月把手机还给了你。', effects: { stats: { charm: 1, intelligence: 1 } } }] },
      {
        text: '用“扑克脸”跟班主任谈判',
        requires: { flags: ['poker-face'] },
        outcomes: [{ text: '你面不改色地讲了十分钟“手机是学习工具”，班主任居然被说服了，当场把手机还给你。', effects: { stats: { charm: 3, influence: 1, happiness: 3 } } }],
      },
      { text: '算了，正好戒掉', outcomes: [{ text: '没有手机的一个学期，你的成绩肉眼可见地好了起来。', effects: { stats: { intelligence: 3, happiness: -2 } } }] },
    ],
  },
  {
    id: 'y1115-school-basketball',
    category: 'school',
    requires: { minAge: 13, maxAge: 17 },
    title: '班级篮球赛',
    text: '年级篮球赛，你们班差一个人。体育委员拍着你的肩膀：“就你了。”',
    choices: [
      {
        text: '上场',
        outcomes: [
          { requires: { flags: ['fit'] }, text: '你在最后一秒投进了绝杀球，全班冲进场把你压在地上。那天你是全年级最靓的仔。', effects: { stats: { fame: 3, charm: 3, happiness: 6 } } },
          { requires: { notFlags: ['fit'] }, weight: 2, text: '你跑了半场就喘不上气，但大家说你“精神可嘉”。', effects: { stats: { health: 2, happiness: 2 } } },
          { requires: { notFlags: ['fit'] }, weight: 1, text: '你被撞倒崴了脚，拄了两个星期拐。', effects: { stats: { health: -3, happiness: -2 } } },
        ],
      },
      { text: '当啦啦队，在场边喊加油', outcomes: [{ text: '你嗓子喊哑了，班级输了，但大家很团结。', effects: { stats: { happiness: 2, charm: 1 } } }] },
    ],
  },
  {
    id: 'y1115-school-singer',
    category: 'school',
    requires: { minAge: 14, maxAge: 17 },
    title: '校园十佳歌手',
    text: '校园十佳歌手比赛开始报名。你脑子里存着好几首“还没被写出来”的歌——当然，你不会唱别人的歌说是自己写的。',
    choices: [
      {
        text: '报名，唱一首老歌',
        outcomes: [
          { requires: { statMin: { charm: 75 } }, text: '你一开口，台下就安静了。你拿了第一名，第二天课桌里塞满了小纸条。', effects: { stats: { fame: 5, charm: 3, happiness: 6 } } },
          { requires: { statMax: { charm: 74 } }, text: '你唱跑了两个音，不过台下的同学很给面子，掌声挺热烈。', effects: { stats: { charm: 2, happiness: 2 } } },
        ],
      },
      { text: '去给朋友当和声', outcomes: [{ text: '朋友拿了奖，非要分你一半奖品。', effects: { stats: { happiness: 3, charm: 1 } } }] },
    ],
  },
  {
    id: 'y1115-life-web-novel',
    category: 'life',
    requires: { minAge: 13, maxAge: 17, minYear: 2011 },
    title: '写网文',
    text: '你在课本底下偷偷写小说，发到网上，居然有人追更。书名叫《重生之我在 1998》——好像有点太真实了。',
    choices: [
      {
        text: '每天更新，认真经营',
        outcomes: [
          { weight: 1, text: '读者越来越多，网站给你签了约。你领到了人生第一笔稿费。', effects: { stats: { fame: 4, wealth: 0.3, charm: 1, intelligence: 1 } } },
          { weight: 2, text: '写了三十万字，点击量始终不温不火。但你的作文分数涨了不少。', effects: { stats: { intelligence: 3, happiness: 1 } } },
        ],
      },
      { text: '太累了，太监了吧', outcomes: [{ text: '你停更了。评论区里有人骂了你整整一个月。', effects: { stats: { happiness: -1 } } }] },
    ],
  },
  {
    id: 'y1115-life-homework-business',
    category: 'life',
    requires: { minAge: 13, maxAge: 16 },
    title: '作业生意',
    text: '你发现班上很多人周一早上都在抄作业。一个念头冒了出来：要不要做个“作业辅导”的小生意？',
    choices: [
      {
        text: '开个“讲题角”，收一包辣条一道题',
        requires: { statMin: { intelligence: 50 } },
        outcomes: [
          { text: '你讲题比老师还耐心，生意好到要排队。期末大家的成绩都涨了，班主任反而表扬了你。', effects: { stats: { charm: 3, fame: 2, influence: 1, wealth: 0.02 } } },
        ],
      },
      {
        text: '直接卖答案',
        outcomes: [
          { weight: 2, text: '你赚了一些零花钱，可很快就被老师发现，叫了家长。', effects: { stats: { wealth: 0.03, happiness: -4, charm: -1 } } },
          { weight: 1, text: '你小赚了一笔，没被发现，但心里总有点不踏实。', effects: { stats: { wealth: 0.05, happiness: -1 } } },
        ],
      },
      { text: '算了，别人的作业关我什么事', outcomes: [{ text: '你安安心心写完了自己的作业。', effects: { stats: { intelligence: 1 } } }] },
    ],
  },
  {
    id: 'y1115-family-parents-aging',
    category: 'family',
    requires: { minAge: 15, maxAge: 17 },
    title: '爸爸的白头发',
    text: '某天吃饭时，你突然发现爸爸鬓角全白了，妈妈弯腰捡东西时会扶一下腰。上一世，你是很多年后才注意到这些的。',
    choices: [
      { text: '周末带爸妈去做个体检', outcomes: [{ text: '检查出妈妈有点轻微的毛病，好在发现得早。妈妈嘴上嫌你多事，转头跟邻居炫耀了一下午。', effects: { stats: { happiness: 4, wealth: -0.1 }, addFlags: ['parents-trust'] } }] },
      { text: '多帮家里干点活', outcomes: [{ text: '你开始主动洗碗、拖地。爸妈什么也没说，但饭桌上的菜变多了。', effects: { stats: { happiness: 3, health: 1 } } }] },
    ],
  },
  {
    id: 'y1115-school-best-friend-fight',
    category: 'school',
    requires: { minAge: 13, maxAge: 17, flags: ['best-friend'] },
    title: '和挚友闹翻',
    text: '你最好的朋友因为一件误会不理你了。两个人在走廊上擦肩而过，谁都没开口。',
    choices: [
      { text: '找对方把话说开', outcomes: [{ text: '你们在操场边吵了一架，然后一起笑了出来。这段友谊比以前更结实了。', effects: { stats: { happiness: 6, charm: 2 } } }] },
      { text: '等对方先低头', outcomes: [
        { weight: 1, text: '一个月后，对方塞给你一瓶汽水。你们默契地谁也不提这件事。', effects: { stats: { happiness: 2 } } },
        { weight: 1, text: '你们就这样慢慢疏远了。很多年后，你偶尔还会想起这个人。', effects: { stats: { happiness: -5 }, removeFlags: ['best-friend'] } },
      ] },
    ],
  },
  {
    id: 'y1115-life-lucky-wallet',
    category: 'life',
    rarity: 'rare',
    requires: { minAge: 13, maxAge: 17, flags: ['lucky'] },
    title: '锦鲤附体',
    text: '放学路上，你捡到一个鼓鼓的钱包，里面有身份证、几张银行卡和一沓现金。',
    choices: [
      { text: '按身份证上的地址送回去', outcomes: [{ text: '失主是一位做生意的老板，非要请你全家吃饭，还说“以后有事尽管找我”。后来他真的帮了你家大忙。', effects: { stats: { influence: 4, happiness: 4, fame: 2 }, addFlags: ['parents-trust'] } }] },
      { text: '交给派出所', outcomes: [{ text: '警察叔叔给学校送了一面锦旗，你在升旗仪式上被点名表扬。', effects: { stats: { fame: 3, charm: 2 } } }] },
    ],
  },
  {
    id: 'y1115-life-ali-payoff',
    category: 'finance',
    requires: { minAge: 19, maxAge: 22, minYear: 2017, maxYear: 2020, flags: ['y1115-ali-hold'] },
    title: '爸爸的美股',
    text: '爸爸当年在你劝说下买的那点美股，熬过了下跌，这几年一路涨了上去。他打电话来问：“现在能卖了吧？”',
    choices: [
      {
        text: '“卖掉一半，剩下的再拿拿。”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '这一卖几乎卖在了高位附近，爸爸开心得在家族群里连发了三个红包。', effects: { stats: { wealth: 12, influence: 2, happiness: 3 }, removeFlags: ['y1115-ali-hold'] } },
          { tag: 'misremember', text: '你记错了高点，让爸爸多等了一阵，结果回落了不少。好在还是赚的。', effects: { stats: { wealth: 4, happiness: -1 }, removeFlags: ['y1115-ali-hold'] } },
        ],
      },
      { text: '“你自己决定吧。”', outcomes: [{ text: '爸爸犹豫了半年，最后小赚一笔离场，说“见好就收”。', effects: { stats: { wealth: 5 }, removeFlags: ['y1115-ali-hold'] } }] },
    ],
  },
]
