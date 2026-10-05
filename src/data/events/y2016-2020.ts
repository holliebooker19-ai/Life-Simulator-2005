import type { GameEvent } from '../../types'

/**
 * 2016–2020（主角 18–22 岁）：高考、大学、毕业。主角已成年，可以用自己的钱参与现实事件。
 *
 * 本文件读取的标记：
 * - y1115-*：见 y2011-2015.ts（比特币、股灾、竞赛）
 * - skill-coding / skill-english / fit / partner / lucky / poker-face / rich-family
 *
 * 本文件写入的标记：
 * - y1620-in-college：上了大学（后续：专业、宿舍、社团、毕业）
 * - y1620-no-college：没上大学，早早工作
 * - y1620-uni-top：考进顶尖名校
 * - y1620-major-cs / y1620-major-fin / y1620-major-med / y1620-major-art：大学专业
 * - y1620-ai-dream：被人机围棋大战触动，立志做 AI（后续：y2126-2022-chatgpd）
 * - y1620-tsla：2020 年买了特丝啦（后续：y2126-2021-tsla-payoff）
 * - y1620-grad-school：读研
 * - employed / partner / skill-coding：与行动共用的标记
 *
 * 改写锚点（Effects.alter）：y1620-2018-p2p / y1620-2020-pandemic。改写版事件放在下一年触发。
 */
export const y2016to2020Events: GameEvent[] = [
  // ───────────── 现实锚点：2016 ─────────────
  {
    id: 'y1620-2016-circuit-breaker',
    category: 'finance',
    year: 2016,
    requires: { minAge: 18, notAltered: ['y1115-2015-crash'] },
    title: '熔断',
    text: '新年第一个交易日，股市推出了“熔断机制”，结果开盘没多久就跌到触发，全天提前收工。爸爸在电话里问你：“这次又要跌多久？”',
    realFact: '2016 年 1 月 1 日起 A 股实施指数熔断机制，1 月 4 日与 1 月 7 日两次触发全天停止交易，1 月 8 日起暂停实施。依据：交易所公告与通行财经史料。',
    choices: [
      {
        text: '“别动，这周过去就会停。剩下的钱先别进场。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '第四天，熔断机制就被叫停了。爸爸感慨：“你这孩子，比电视上的专家还靠谱。”', effects: { stats: { influence: 2, wealth: 2 } } },
          { tag: 'misremember', text: '你把时间说反了，让爸爸“赶紧抄底”，结果第二次熔断又来了。', effects: { stats: { wealth: -3, happiness: -2 } } },
        ],
      },
      {
        text: '安慰被套的爸妈：“去年那笔，慢慢会回来一部分的。”',
        requires: { flags: ['y1115-trapped-2015'] },
        outcomes: [{ text: '爸爸沉默了很久，说：“去年要是听你的就好了。”从那以后，家里的大事都会先问问你。', effects: { stats: { influence: 2, happiness: -1 }, addFlags: ['parents-trust'] } }],
      },
      { text: '高考要紧，关掉行情软件', outcomes: [{ text: '你把手机交给了妈妈保管，安心冲刺最后半年。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },
  {
    id: 'y1620-2016-gaokao',
    category: 'school',
    rarity: 'rare',
    year: 2016,
    requires: { minAge: 18 },
    title: '高考',
    text: '六月七日，高考。考场外的梧桐树下站满了家长，有人穿着旗袍图个“旗开得胜”。你走进考场，这一次，你想把上一世的遗憾都补回来。',
    realFact: '全国普通高考每年 6 月 7 日起举行；2016 年报名人数九百多万。依据：教育部公开数据。具体分数线因省份而异，游戏中不涉及。',
    choices: [
      {
        text: '正常发挥',
        outcomes: [
          { requires: { statMin: { intelligence: 75 } }, text: '你考出了全市前几名的成绩，被一所顶尖名校录取。家门口放了一挂鞭炮，亲戚们轮番打电话来道喜。', effects: { stats: { intelligence: 5, fame: 4, happiness: 8, influence: 2 }, addFlags: ['y1620-in-college', 'y1620-uni-top'] } },
          { requires: { statMin: { intelligence: 58 }, statMax: { intelligence: 74 } }, text: '成绩不错，你上了一所不错的重点大学。爸妈请全家吃了一顿饭。', effects: { stats: { intelligence: 3, happiness: 5, influence: 1 }, addFlags: ['y1620-in-college'] } },
          { requires: { statMin: { intelligence: 42 }, statMax: { intelligence: 57 } }, text: '分数中规中矩，你去了一所普通的本科院校。也好，大学是另一个起点。', effects: { stats: { intelligence: 2, happiness: 2 }, addFlags: ['y1620-in-college'] } },
          { requires: { statMax: { intelligence: 41 } }, text: '你没考好，分数只够读专科。你想了很久，决定不上了，先出去闯一闯。', effects: { stats: { happiness: -6, health: 2 }, addFlags: ['y1620-no-college'] } },
        ],
      },
      {
        text: '凭记忆押作文题和数学大题',
        usesMemory: true,
        outcomes: [
          { tag: 'success', requires: { statMin: { intelligence: 55 } }, text: '押中了！你答得行云流水，最后被一所顶尖名校录取。没人知道你在考场上差点笑出声。', effects: { stats: { intelligence: 4, fame: 4, happiness: 8, influence: 2 }, addFlags: ['y1620-in-college', 'y1620-uni-top'] } },
          { tag: 'success', requires: { statMax: { intelligence: 54 } }, text: '题目押中了一半，你的分数比平时高了一大截，上了一所不错的重点大学。', effects: { stats: { intelligence: 3, happiness: 6 }, addFlags: ['y1620-in-college'] } },
          { tag: 'misremember', requires: { statMin: { intelligence: 50 } }, text: '你押的全是别的省的卷子。好在底子还在，最后上了一所普通本科。', effects: { stats: { happiness: -3 }, addFlags: ['y1620-in-college'] } },
          { tag: 'misremember', requires: { statMax: { intelligence: 49 } }, text: '押题全军覆没，心态也崩了。你决定不复读，先出去闯一闯。', effects: { stats: { happiness: -8 }, addFlags: ['y1620-no-college'] } },
        ],
      },
      {
        text: '拿竞赛成绩申请保送',
        requires: { flags: ['y1115-olympiad'] },
        outcomes: [{ text: '你早早拿到了名校的保送资格，看着同学们进考场，你在家打了一个月游戏。', effects: { stats: { intelligence: 3, fame: 3, happiness: 10, influence: 2 }, addFlags: ['y1620-in-college', 'y1620-uni-top'] } }],
      },
    ],
  },
  {
    id: 'y1620-2016-alphago',
    category: 'world',
    rarity: 'rare',
    year: 2016,
    requires: { minAge: 18 },
    title: '人机大战',
    text: '三月，谷哥公司的围棋程序“阿尔法狗”挑战人类顶尖棋手石九段。赛前，几乎所有围棋界的人都认为人类会赢。你知道，这一天是人工智能时代的发令枪。',
    realFact: '2016 年 3 月，某科技公司开发的围棋 AI 与韩国顶尖棋手进行五番棋对决，最终 AI 以 4:1 获胜，人类棋手赢下的是第四局。依据：通行科技史料。人名、公司名已改名。',
    choices: [
      {
        text: '在班上跟人打赌：“机器赢四盘。”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '四比一，分毫不差。全班都觉得你是不是偷偷学过围棋，你只是笑笑。', effects: { stats: { fame: 2, charm: 1, happiness: 3, wealth: 0.05 } } },
          { tag: 'misremember', text: '你说成了“机器全胜”，结果人类扳回了一盘。你请全班喝了奶茶。', effects: { stats: { wealth: -0.05, happiness: -1 } } },
        ],
      },
      {
        text: '暗暗决定：以后要做人工智能',
        outcomes: [{ text: '你把“人工智能”写进了志愿草稿的第一行，开始自学线性代数。', effects: { stats: { intelligence: 4 }, addFlags: ['y1620-ai-dream'] } }],
      },
      { text: '不懂围棋，没兴趣', outcomes: [{ text: '你只记住了“阿尔法狗”这个好笑的名字。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y1620-2016-euro',
    category: 'finance',
    year: 2016,
    requires: { minAge: 18 },
    title: '法国欧洲杯',
    text: '高考后的暑假，欧洲杯决赛：东道主法国对葡萄牙。葡萄牙的头号球星开场没多久就伤退了，大家都觉得法国稳了。你知道，结局在加时赛里。',
    realFact: '2016 年欧洲杯决赛于 7 月 10 日在法国圣但尼举行，葡萄牙在主力球星伤退的情况下，加时赛 1:0 战胜东道主法国，首次夺得欧洲杯冠军。依据：欧足联官方赛果。',
    choices: [
      {
        text: '用打工攒的钱押葡萄牙（虚拟竞猜）',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '加时赛那脚远射进网，你在烧烤摊上跳了起来。赔率不低，这个暑假的生活费有了。', effects: { stats: { wealth: 0.5, happiness: 5 } } },
          { tag: 'misremember', text: '你被“主力伤退”带偏了，临时改押法国。哭着撸完了串。', effects: { stats: { wealth: -0.2, happiness: -3 } } },
        ],
      },
      { text: '约同学通宵看球，庆祝毕业', outcomes: [{ text: '一群人在大排档喊到嗓子哑，这是你们高中时代最后一个夏天。', effects: { stats: { happiness: 5, charm: 1 } } }] },
    ],
  },
  {
    id: 'y1620-2016-brexit',
    category: 'finance',
    year: 2016,
    requires: { minAge: 18 },
    title: '英国要走了',
    text: '六月，英国举行脱欧公投。民调说留欧派会赢，外汇论坛上一片平静。你记得，那一夜英镑会像坐过山车一样掉下去。',
    realFact: '2016 年 6 月 23 日英国举行脱欧公投，“脱欧”以约 51.9% 的得票胜出，结果公布后英镑兑美元一度大跌超过 10%，创三十多年来低位。依据：英国选举委员会公布结果与通行财经史料。',
    choices: [
      {
        text: '在外汇模拟账户里重仓做空英镑',
        requires: { flags: ['skill-english'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '开票那晚，英镑一路狂泻。你截图发到论坛，标题是“一个高中毕业生的第一单”，被转了几千次。', effects: { stats: { fame: 4, intelligence: 2, wealth: 1 } } },
          { tag: 'misremember', text: '你把公投日期记错了一周，提前进场被来回打脸，最后爆仓离场。', effects: { stats: { wealth: -0.5, happiness: -3 } } },
        ],
      },
      {
        text: '劝爸爸把准备给你出国用的英镑晚点再换',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '公投后英镑大跌，爸爸换汇时省下了一大笔，笑着说“这是你给自己挣的学费”。', effects: { stats: { wealth: 6, influence: 2 } } },
          { tag: 'misremember', text: '你记反了方向，让爸爸赶紧换，结果白白多花了一笔。', effects: { stats: { wealth: -3, happiness: -2 } } },
        ],
      },
      { text: '这和我有什么关系？', outcomes: [{ text: '你关掉新闻，继续享受高考后的暑假。', effects: { stats: { happiness: 2 } } }] },
    ],
  },
  {
    id: 'y1620-2016-us-election',
    category: 'world',
    year: 2016,
    requires: { minAge: 18 },
    title: '川建国当选',
    text: '十一月，美国大选。宿舍里的室友们都在看直播，几乎所有媒体都预测另一位候选人会赢。你躺在床上淡定地说：“地产商会赢。”',
    realFact: '2016 年 11 月 8 日美国总统选举，共和党候选人在多数民调不被看好的情况下赢得选举人票多数当选。依据：美国联邦选举结果。政治人物按 docs/NAMING.md 使用外号。',
    choices: [
      {
        text: '和室友赌一个月的早饭',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '开票到凌晨，形势逆转。室友们看着你，像看一个算命先生。这个月你的早饭顿顿有鸡蛋。', effects: { stats: { fame: 2, happiness: 4, wealth: 0.03 } } },
          { tag: 'misremember', text: '你脑子一抽说成了另一位候选人赢，被室友笑到毕业。', effects: { stats: { happiness: -2, wealth: -0.03 } } },
        ],
      },
      { text: '不关心，去图书馆', outcomes: [{ text: '图书馆里人很少，你看完了一本很厚的书。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },

  // ───────────── 现实锚点：2017 ─────────────
  {
    id: 'y1620-2017-btc-payoff',
    dependsOn: ['y1115-2013-bitcoin'],
    category: 'finance',
    rarity: 'rare',
    year: 2017,
    requires: { minAge: 19 },
    title: '本子最后一页',
    text: '比特币一路涨到了一万多美元，宿舍里人人都在谈“币圈”。你翻开初中时的本子，最后一页那串抄下来的字符还在。',
    realFact: '2017 年比特币价格从年初约 1000 美元涨至 12 月中旬接近 20000 美元，随后大幅回落。依据：通行加密货币市场史料。',
    choices: [
      {
        text: '在年底最高点附近卖掉',
        requires: { flags: ['y1115-btc-hodl'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在接近两万美元时卖掉了。当年一千块的压岁钱，变成了一笔够你读完大学的钱。', effects: { stats: { wealth: 2, happiness: 6, influence: 1 }, removeFlags: ['y1115-btc-hodl'] } },
          { tag: 'misremember', text: '你记错了高点的日子，等你想卖时已经跌了三成。不过比起当年，还是翻了很多倍。', effects: { stats: { wealth: 1, happiness: 2 }, removeFlags: ['y1115-btc-hodl'] } },
        ],
      },
      {
        text: '打电话给爸爸：“那串密码，现在可以用了。”',
        requires: { flags: ['y1115-btc-family'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸翻遍了三个藏密码的地方，在年底前全卖了。他挂了电话后，在阳台上站了很久。', effects: { stats: { wealth: 80, influence: 4, happiness: 6 }, addFlags: ['family-has-money'], removeFlags: ['y1115-btc-family'] } },
          { tag: 'misremember', text: '你喊卖喊晚了，爸爸卖在了半山腰。不过当年的那笔钱，也已经翻了十几倍。', effects: { stats: { wealth: 40, influence: 2 }, addFlags: ['family-has-money'], removeFlags: ['y1115-btc-family'] } },
        ],
      },
      {
        text: '什么都没有，看着别人发财',
        outcomes: [
          { weight: 2, text: '你劝室友别在顶部追高，他没听。春节后他每天都在宿舍唉声叹气。', effects: { stats: { charm: 1, intelligence: 1 } } },
          { weight: 1, text: '你忍住了没有追，心里有点酸，但知道这是对的。', effects: { stats: { happiness: -1, intelligence: 1 } } },
        ],
      },
    ],
  },
  {
    id: 'y1620-2017-ico-ban',
    dependsOn: ['y1115-2013-bitcoin'],
    category: 'finance',
    year: 2017,
    requires: { minAge: 19 },
    title: '空气币',
    text: '这一年，到处都是“发币”项目：一份白皮书，几个人，就能募到几千万。学长拉你加入一个项目团队，说“毕业前财务自由”。你记得，九月会有一纸禁令。',
    realFact: '2017 年 9 月 4 日，国内多部门联合发布公告，将代币发行融资（ICO）定性为未经批准的非法公开融资行为并全面叫停。依据：相关部门公开公告。',
    choices: [
      {
        text: '劝学长：“九月之前收手，把钱退给大家。”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '学长将信将疑地停了项目。禁令出来那天，他给你发了一条很长的消息，最后一句是“谢谢”。', effects: { stats: { influence: 3, charm: 2 } } },
          { tag: 'misremember', text: '你把时间记成了年底，学长又多募了一轮，最后退款退得焦头烂额，还埋怨你。', effects: { stats: { happiness: -3, charm: -1 } } },
        ],
      },
      {
        text: '在校园论坛写一篇《空气币十问》',
        requires: { statMin: { intelligence: 55 } },
        outcomes: [{ text: '文章被转到了好几个高校的论坛，很多同学因此没有掏钱。禁令出来后，有人专门来找你道谢。', effects: { stats: { fame: 4, influence: 2, intelligence: 1 } } }],
      },
      { text: '不掺和，上课去', outcomes: [{ text: '你继续当一个普通的大学生，期末绩点还不错。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },
  {
    id: 'y1620-2017-bike-sharing',
    category: 'world',
    year: 2017,
    requires: { minAge: 19 },
    title: '彩虹单车',
    text: '校门口一夜之间停满了各种颜色的共享单车，扫码就能骑。各家公司拼命补贴、拼命投车。你记得，很多家撑不过这一年，用户的押金也成了麻烦。',
    realFact: '2016–2017 年国内共享单车行业爆发式增长，数十家企业涌入；2017 年下半年起多家企业相继倒闭，用户押金难退成为社会问题。依据：通行科技与财经史料。',
    choices: [
      {
        text: '提醒全宿舍：押金能退的赶紧退',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '大家退完押金没多久，好几家单车公司就关门了。室友们请你吃了一顿火锅。', effects: { stats: { charm: 2, happiness: 3, wealth: 0.01 } } },
          { tag: 'misremember', text: '你把会倒闭的那家记错了，大家退了最稳的那家，留着的那家却跑路了。', effects: { stats: { charm: -1, happiness: -2 } } },
        ],
      },
      {
        text: '去单车公司做校园运营兼职',
        outcomes: [
          { weight: 2, text: '你每天把乱停的车搬回原位，赚了点钱，也看清了“烧钱换市场”是怎么回事。', effects: { stats: { wealth: 0.3, intelligence: 2, health: 1 } } },
          { weight: 1, text: '干了两个月，公司突然没了，最后一个月的工资也没拿到。', effects: { stats: { happiness: -3 } } },
        ],
      },
      { text: '骑车去郊外兜风', outcomes: [{ text: '你骑了二十公里，在河边坐了一下午。', effects: { stats: { health: 2, happiness: 3 } } }] },
    ],
  },

  // ───────────── 现实锚点：2018 ─────────────
  {
    id: 'y1620-2018-worldcup',
    category: 'finance',
    rarity: 'rare',
    year: 2018,
    requires: { minAge: 20 },
    title: '俄罗斯世界杯',
    text: '俄罗斯世界杯，宿舍楼里每晚都有人尖叫。决赛是法国对克罗地亚，很多人被克罗地亚的童话打动，想押冷门。你记得那场决赛进了很多球。',
    realFact: '2018 年俄罗斯世界杯决赛于 7 月 15 日在莫斯科举行，法国 4:2 战胜克罗地亚，夺得队史第二座世界杯冠军。依据：国际足联官方赛果。',
    choices: [
      {
        text: '押法国，而且押“总进球数大于 5”（虚拟竞猜）',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '4:2，六个球。你拿着截图在宿舍里转圈，这一注的赔率让你下个学期的生活费都有了。', effects: { stats: { wealth: 1.5, happiness: 6 } } },
          { tag: 'misremember', text: '你把这一届和上一届的冠军记串了，押了个寂寞。', effects: { stats: { wealth: -0.5, happiness: -3 } } },
        ],
      },
      { text: '纯粹看球，为童话鼓掌', outcomes: [{ text: '克罗地亚输了，但你记住了他们拼到最后一秒的样子。', effects: { stats: { happiness: 3 } } }] },
    ],
  },
  {
    id: 'y1620-2018-trade-war',
    category: 'finance',
    year: 2018,
    requires: { minAge: 20 },
    title: '关税',
    text: '七月，美国开始对一批中国商品加征关税，“贸易战”三个字天天上新闻。爸爸做外贸的朋友愁得睡不着，股市也一路往下走。',
    realFact: '2018 年 7 月 6 日美国对约 340 亿美元中国输美商品加征 25% 关税，中方随即反制，中美贸易摩擦升级；上证综指 2018 年全年下跌约四分之一。依据：通行财经史料与交易所数据。',
    choices: [
      {
        text: '提醒家里和做外贸的叔叔提前减仓、分散客户',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '叔叔把一部分订单转去了别的市场，熬过了最难的那两年。逢年过节，他总要给你带两条好烟——虽然你不抽。', effects: { stats: { influence: 3, wealth: 2 } } },
          { tag: 'misremember', text: '你把关税的时间和范围记得乱七八糟，叔叔按你说的调整，反而错过了几笔好单子。', effects: { stats: { influence: -1, happiness: -2 } } },
        ],
      },
      { text: '写一篇课程论文分析贸易战', outcomes: [{ text: '你的论文被老师推荐到了学院的刊物上。', effects: { stats: { intelligence: 3, fame: 1 } } }] },
    ],
  },
  {
    id: 'y1620-2018-p2p',
    category: 'finance',
    rarity: 'rare',
    year: 2018,
    requires: { minAge: 20, notAltered: ['y1620-2018-p2p'] },
    title: 'P2P 暴雷',
    text: '妈妈说她把一部分积蓄放进了一个“年化 12%”的网贷平台，是小姐妹介绍的，“每个月都按时到账”。你记得，今年夏天，这类平台会成片地倒下。',
    realFact: '2018 年 6 月至 7 月起国内 P2P 网贷平台集中出现逾期、停业、跑路，被称为“暴雷潮”，大量出借人蒙受损失，此后行业被逐步清退。依据：通行财经史料与监管部门公开信息。',
    choices: [
      {
        text: '“妈，马上把钱提出来，一分都别留。”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '妈妈嘟囔着提了现。一个月后平台跑路，她那几个小姐妹哭着到处维权。妈妈抱着你半天没说话。', effects: { stats: { wealth: 5, influence: 3, happiness: 2 }, addFlags: ['parents-trust'] } },
          { tag: 'misremember', text: '你记错了是哪一家先出事，让妈妈把钱转到了另一家“更稳的”，结果那家先倒了。', effects: { stats: { wealth: -5, happiness: -6 } } },
        ],
      },
      {
        text: '在网上公开起底这类平台的资金池模式',
        requires: { statMin: { influence: 30, fame: 15 } },
        outcomes: [{ text: '你的调查长文引发了大讨论，很多人赶在暴雷前撤出了资金，监管也提前出手。这一次，暴雷潮的规模比原本的历史小了很多。', effects: { stats: { fame: 8, influence: 5 }, alter: [{ id: 'y1620-2018-p2p', scale: 4 }], world: { media: 10, economy: 2 }, addFlags: ['parents-trust'] } }],
      },
      {
        text: '不好说什么，随妈妈去吧',
        outcomes: [
          { weight: 2, text: '夏天，平台跑路了。妈妈的钱只追回来一小部分，她半年都没缓过来。', effects: { stats: { wealth: -4, happiness: -5 } } },
          { weight: 1, text: '妈妈自己觉得不对劲，提前提了一部分，损失不算太大。', effects: { stats: { wealth: -1, happiness: -2 } } },
        ],
      },
    ],
  },
  {
    id: 'y1620-2019-p2p-altered',
    category: 'world',
    year: 2019,
    requires: { minAge: 21, altered: ['y1620-2018-p2p'] },
    title: '少了很多眼泪',
    text: '因为你那篇长文，去年的“暴雷潮”比原本小了很多。有个阿姨在网上找到你，说她的养老钱保住了。你第一次真切地感觉到：自己真的改变了一点什么。',
    realFact: '改写版：真实历史中，2018 年 P2P 暴雷潮波及大量出借人，行业此后数年被逐步清退。本事件为玩家改写锚点 y1620-2018-p2p 后的分支。',
    choices: [
      { text: '成立一个公益的“理财防骗”账号', outcomes: [{ text: '账号越做越大，你成了很多人心中的“防骗课代表”。', effects: { stats: { fame: 5, influence: 3, happiness: 4 } } }] },
      { text: '回一句“不客气”，继续生活', outcomes: [{ text: '你把那条留言截图存了起来，难过的时候会翻出来看看。', effects: { stats: { happiness: 5 } } }] },
    ],
  },

  // ───────────── 现实锚点：2019 ─────────────
  {
    id: 'y1620-2019-star-market',
    category: 'finance',
    year: 2019,
    requires: { minAge: 21 },
    title: '科创板开市',
    text: '七月，科创板开市，首批二十多只新股第一天平均涨了一倍多。打新群里的人都在晒“中签截图”。',
    realFact: '2019 年 7 月 22 日上海证券交易所科创板正式开市，首批 25 家公司上市，首日平均涨幅约 140%。依据：上海证券交易所公开数据。',
    choices: [
      {
        text: '拿积蓄开户打新',
        requires: { statMin: { wealth: 3 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你中了一签，第一天就卖掉了，赚到的钱够买一台新电脑。', effects: { stats: { wealth: 2, happiness: 4 } } },
          { tag: 'misremember', text: '你没卖在首日，以为还会涨，结果一路回落，最后只小赚一点。', effects: { stats: { wealth: 0.3, happiness: -1 } } },
        ],
      },
      { text: '研究一下什么是“注册制”', outcomes: [{ text: '你在金融课上的展示拿了满分。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },
  {
    id: 'y1620-2019-pork',
    category: 'family',
    year: 2019,
    requires: { minAge: 21 },
    title: '猪肉自由',
    text: '这一年，猪肉价格一路飙升，食堂的红烧肉越来越小块，网上开始流行“实现猪肉自由”。老家的二舅正犹豫要不要把猪卖了。',
    realFact: '2018 年 8 月起国内发生非洲猪瘟疫情，生猪存栏大幅下降，2019 年下半年猪肉价格大幅上涨，部分时段同比涨幅超过一倍。依据：国家统计局与农业农村部公开数据。',
    choices: [
      {
        text: '打电话给二舅：“先别卖，年底价格更高。”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '二舅等到年底才出栏，卖了个好价钱，过年给你包了一个大红包，外加二十斤腊肉。', effects: { stats: { wealth: 0.5, happiness: 4, influence: 1 } } },
          { tag: 'misremember', text: '你说得太笃定，二舅一直压着不卖，结果有几头猪病了，亏了一笔。', effects: { stats: { happiness: -3 } } },
        ],
      },
      { text: '在宿舍组织一场“猪肉自由”火锅局', outcomes: [{ text: '大家凑钱买了两斤五花肉，吃出了满汉全席的仪式感。', effects: { stats: { happiness: 4, charm: 1 } } }] },
    ],
  },
  {
    id: 'y1620-2019-year-end',
    category: 'family',
    year: 2019,
    requires: { minAge: 21 },
    title: '年底的那条新闻',
    text: '十二月底，新闻里出现了一条关于“不明原因肺炎”的简短消息，很多人只是扫了一眼。你盯着那行字，手有点发凉。',
    realFact: '2019 年 12 月底，湖北武汉通报发现多例不明原因肺炎病例，此后确认为新型冠状病毒感染。依据：当地卫生部门与世界卫生组织公开通报。本事件写法克制，不做娱乐化处理。',
    choices: [
      {
        text: '提醒家里：备好口罩和常用药，过年少走动',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈嘴上说你大惊小怪，还是照做了。一个月后，家里是整栋楼少数不用出门抢口罩的人家。', effects: { stats: { health: 3, happiness: 2, influence: 2 }, addFlags: ['parents-trust'] } },
          { tag: 'misremember', text: '你说得语焉不详，爸妈没放在心上。你心里很不安，只能自己多准备一些。', effects: { stats: { happiness: -2 } } },
        ],
      },
      { text: '告诉自己：先过好这个寒假', outcomes: [{ text: '你回了家，陪爸妈好好吃了几顿饭。', effects: { stats: { happiness: 2 } } }] },
    ],
  },

  // ───────────── 现实锚点：2020 ─────────────
  {
    id: 'y1620-2020-pandemic',
    category: 'world',
    rarity: 'legendary',
    year: 2020,
    requires: { minAge: 22, notAltered: ['y1620-2020-pandemic'] },
    title: '漫长的春节',
    text: '一月下旬，武汉宣布“封城”。春节被无限延长，街上空空荡荡，口罩成了最紧俏的东西。你记得接下来几年的大致走向，但记得，并不等于做得了什么。',
    realFact: '2020 年 1 月 23 日武汉实施离汉通道管控；3 月 11 日世界卫生组织宣布新冠肺炎疫情构成全球大流行。依据：官方公告与世界卫生组织公开信息。本事件写法克制，不做娱乐化处理。',
    choices: [
      {
        text: '组织同学给医院和社区捐物资',
        requires: { statMin: { wealth: 5 } },
        outcomes: [{ text: '你们凑钱从各处找来了几批口罩和防护用品，送到了最缺的地方。没有人知道你的名字，你也不需要。', effects: { stats: { wealth: -3, happiness: 4, influence: 2 } } }],
      },
      {
        text: '动用你积累的一切影响力，推动更早、更透明的预警与物资储备',
        requires: { statMin: { influence: 70, fame: 40 } },
        outcomes: [{ text: '你在上一年就开始奔走，把资源和声音都押了上去。预警来得更早，物资准备得更足。这场灾难没有消失，但世界确实少走了一些弯路。', effects: { stats: { influence: 8, fame: 6, wealth: -50 }, alter: [{ id: 'y1620-2020-pandemic', scale: 20 }], world: { health: 30, economy: 10 } } }],
      },
      {
        text: '待在家里，照顾好家人',
        outcomes: [{ text: '你每天陪爸妈做饭、看新闻、给远方的亲戚打电话。这是你们一家人在一起最久的一个春天。', effects: { stats: { happiness: 2, health: 1 } } }],
      },
    ],
  },
  {
    id: 'y1620-2021-pandemic-altered',
    category: 'world',
    rarity: 'rare',
    year: 2021,
    requires: { minAge: 23, altered: ['y1620-2020-pandemic'] },
    title: '另一条时间线',
    text: '你翻看新闻，发现很多事情和你记忆里的已经不一样了。一些本该发生的坏消息没有发生，一些你熟悉的“未来”也悄悄消失了。从这一刻开始，你记得的东西，越来越不可靠。',
    realFact: '改写版：真实历史中，新冠疫情自 2020 年起在全球持续数年。本事件为玩家改写锚点 y1620-2020-pandemic 后的分支，不描述具体的疫情数据。',
    choices: [
      { text: '把这份运气还给世界，投身公共卫生公益', outcomes: [{ text: '你资助了几个基层医疗项目。有人叫你“幕后的人”，你只是笑笑。', effects: { stats: { fame: 4, influence: 4, happiness: 5, wealth: -20 } } }] },
      { text: '默默接受：从此要靠自己判断了', outcomes: [{ text: '你在本子上写下：“不能再只靠记忆了。”', effects: { stats: { intelligence: 3, memory: -3 } } }] },
    ],
  },
  {
    id: 'y1620-2020-meltdown',
    dependsOn: ['y1620-2020-pandemic'],
    category: 'finance',
    rarity: 'rare',
    year: 2020,
    requires: { minAge: 22 },
    title: '十天四次熔断',
    text: '三月，美股在十天里四次触发熔断，连炒了几十年股的老股民都说“活久见”。全世界都在恐慌。你记得，各国随后会开闸放水，资产价格会在这之后疯涨。',
    realFact: '2020 年 3 月 9 日、12 日、16 日、18 日美股四次触发市场熔断；美联储随后将利率降至接近零并推出大规模资产购买计划，美股于当年下半年创出新高。依据：通行财经史料。',
    choices: [
      {
        text: '用全部积蓄在低点抄底美股指数',
        requires: { statMin: { wealth: 10 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在三月下旬买入，到年底账户涨了六七成。你第一次体会到“危机就是机会”这句话的分量。', effects: { stats: { wealth: 15, intelligence: 2, influence: 1 } } },
          { tag: 'misremember', text: '你抄底抄在了半山腰，又被吓得割了一次。好在后来又追了回去，算下来小亏。', effects: { stats: { wealth: -3, happiness: -3 } } },
        ],
      },
      {
        text: '买入马丝氪的特丝啦，并且拿住',
        requires: { statMin: { wealth: 5 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在低位买入了特丝啦。到年底，它涨了好几倍，你的室友开始叫你“马丝氪的远房亲戚”。', effects: { stats: { wealth: 20, happiness: 5 }, addFlags: ['y1620-tsla'] } },
          { tag: 'misremember', text: '你记成了明年才开始涨，买得太晚，只吃到了尾巴。', effects: { stats: { wealth: 2, happiness: -1 } } },
        ],
      },
      { text: '我没钱，看看热闹', outcomes: [{ text: '你盯着屏幕上一片红色——美股里红色代表跌——觉得这个世界有点魔幻。', effects: { stats: { happiness: 1, intelligence: 1 } } }] },
    ],
  },
  {
    id: 'y1620-2020-gold',
    dependsOn: ['y1620-2020-pandemic'],
    category: 'finance',
    year: 2020,
    requires: { minAge: 22 },
    title: '金价新高',
    text: '全球放水，金价一路往上冲。妈妈的小姐妹们又在群里聊“买金条”。你记得，八月会冲到一个高点，然后回落好一阵。',
    realFact: '2020 年 8 月国际金价首次突破每盎司 2000 美元，创下当时的历史新高，此后回落并在较长时间内震荡。依据：通行贵金属市场史料。',
    choices: [
      {
        text: '劝妈妈春天买、八月卖',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '妈妈照做了，赚了一笔，还请小姐妹们吃了顿饭——当然，没说是你教的。', effects: { stats: { wealth: 3, influence: 1 } } },
          { tag: 'misremember', text: '你记错了高点的月份，妈妈卖早了，后面的涨幅一分没吃到。', effects: { stats: { wealth: 0.5, happiness: -1 } } },
        ],
      },
      { text: '不碰，黄金离我太远', outcomes: [{ text: '你把时间花在了毕业论文上。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },
  {
    id: 'y1620-2020-graduation',
    category: 'career',
    rarity: 'rare',
    year: 2020,
    requires: { minAge: 22, flags: ['y1620-in-college'] },
    variants: [{ requires: { altered: ['y1620-2020-pandemic'] }, title: '毕业季', text: '因为疫情被提前控制住，毕业典礼照常在礼堂举行，你穿着学士服和室友们拍了一堆傻照。招聘会也照常开，但经济还是受了些冲击，好岗位并不好抢。你站在人生的岔路口。' }],
    title: '云毕业',
    text: '毕业典礼改成了线上，学位证是快递寄来的。招聘会也搬到了网上，很多公司缩招。你站在人生的岔路口。',
    realFact: '2020 年受疫情影响，全国高校普遍采用线上毕业典礼、线上招聘；当年高校毕业生规模约 870 万人。依据：教育部公开数据。',
    choices: [
      {
        text: '进互联网大厂',
        requires: { statMin: { intelligence: 60 } },
        outcomes: [
          { requires: { flags: ['skill-coding'] }, text: '你写代码的底子派上了用场，拿到了一家大厂的核心岗位，起薪让同学们羡慕。', effects: { stats: { wealth: 15, influence: 2, happiness: 4 }, addFlags: ['employed'] } },
          { requires: { notFlags: ['skill-coding'] }, text: '你进了一家大厂做运营，工作很累，但薪水不错。', effects: { stats: { wealth: 10, happiness: 1 }, addFlags: ['employed'] } },
        ],
      },
      {
        text: '考研/读研，再等两年',
        outcomes: [
          { requires: { statMin: { intelligence: 55 } }, text: '你一战上岸，继续读研。实验室的灯，以后要陪你很多个夜晚。', effects: { stats: { intelligence: 5, happiness: 2 }, addFlags: ['y1620-grad-school'] } },
          { requires: { statMax: { intelligence: 54 } }, text: '你差了几分，只好先找了一份工作，打算边工作边准备。', effects: { stats: { intelligence: 2, wealth: 3, happiness: -3 }, addFlags: ['employed'] } },
        ],
      },
      {
        text: '考公务员，求稳',
        outcomes: [
          { weight: 1, text: '你考上了家乡的一个岗位，朝九晚五，爸妈逢人就夸。', effects: { stats: { wealth: 5, happiness: 4, influence: 2 }, addFlags: ['employed'] } },
          { weight: 1, text: '竞争太激烈，你没考上，只好先找了份普通工作。', effects: { stats: { wealth: 3, happiness: -2 }, addFlags: ['employed'] } },
        ],
      },
      { text: '先回家休息一阵，想清楚再说', outcomes: [{ text: '你在家待了半年，读了很多书，也陪了爸妈很久。', effects: { stats: { happiness: 4, intelligence: 2 } } }] },
    ],
  },

  // ───────────── 青年生活（18–22 岁，无现实对应） ─────────────
  {
    id: 'y1620-college-major',
    category: 'school',
    requires: { minAge: 18, maxAge: 20, minYear: 2016, flags: ['y1620-in-college'], notFlags: ['y1620-major-cs', 'y1620-major-fin', 'y1620-major-med', 'y1620-major-art'] },
    title: '选方向',
    text: '大一快结束了，学校允许转专业或者选主修方向。你知道接下来十年哪些行业会起飞、哪些会落地。',
    choices: [
      { text: '计算机', outcomes: [{ text: '你转进了计算机系，第一次熬夜调试代码时，觉得自己选对了。', effects: { stats: { intelligence: 4 }, addFlags: ['y1620-major-cs', 'skill-coding'] } }] },
      { text: '金融', outcomes: [{ text: '你学了金融。课本上的每一次危机，你都比老师多知道一点“后来”。', effects: { stats: { intelligence: 3, influence: 1 }, addFlags: ['y1620-major-fin'] } }] },
      { text: '医学', outcomes: [{ text: '你学了医，课多得像永远上不完。但你知道，有一天这会很重要。', effects: { stats: { intelligence: 4, health: 2, happiness: -2 }, addFlags: ['y1620-major-med'] } }] },
      { text: '艺术设计', outcomes: [{ text: '你学了设计，每天泡在画室里，衣服上总沾着颜料。', effects: { stats: { charm: 4, happiness: 3 }, addFlags: ['y1620-major-art'] } }] },
    ],
  },
  {
    id: 'y1620-college-dorm',
    category: 'school',
    requires: { minAge: 18, maxAge: 22, flags: ['y1620-in-college'] },
    title: '四人间',
    text: '宿舍里四个人，一个打呼噜、一个通宵打游戏、一个每天早上六点起来背单词。你是第四个。',
    choices: [
      { text: '主动组织宿舍聚餐，拉近关系', outcomes: [{ text: '一顿烧烤之后，你们成了“铁四角”。毕业很多年后，这个群还在。', effects: { stats: { charm: 3, happiness: 4 }, addFlags: ['best-friend'] } }] },
      { text: '戴上耳塞，各过各的', outcomes: [{ text: '相安无事地过了四年，毕业时大家客客气气地道别。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },
  {
    id: 'y1620-college-loan',
    category: 'life',
    requires: { minAge: 18, maxAge: 20, minYear: 2016, maxYear: 2017 },
    title: '校园贷',
    text: '宿舍楼下贴着小广告：“凭学生证，三分钟放款，零门槛。”隔壁宿舍有人已经借了好几家，用来买新手机。',
    choices: [
      { text: '把小广告撕了，提醒同学别碰', outcomes: [{ text: '你在年级群里发了一篇长文。后来有人因为借贷出了事，有人私信你说“幸好听了你的”。', effects: { stats: { influence: 2, charm: 1, fame: 1 } } }] },
      { text: '借一点买台新电脑，反正以后能还', outcomes: [
        { weight: 1, text: '利滚利，你很快就还不上了。最后是爸妈帮你还清的，那是你见过爸爸最沉默的一次。', effects: { stats: { wealth: -2, happiness: -8 } } },
        { weight: 1, text: '你咬着牙用兼职的钱按时还完了，发誓再也不碰这东西。', effects: { stats: { wealth: -0.5, happiness: -3 } } },
      ] },
    ],
  },
  {
    id: 'y1620-college-club',
    category: 'school',
    requires: { minAge: 18, maxAge: 21, flags: ['y1620-in-college'] },
    title: '百团大战',
    text: '开学季，操场上摆满了社团招新的摊位：辩论队、街舞社、创业协会、登山社……',
    choices: [
      {
        text: '辩论队',
        outcomes: [
          { requires: { statMin: { charm: 70 } }, text: '你在新生赛上一战成名，学长学姐都说你是“天生的四辩”。', effects: { stats: { charm: 3, fame: 3, intelligence: 2 } } },
          { requires: { statMax: { charm: 69 } }, text: '你在台上紧张得结巴，但练了一年，嘴皮子利索了不少。', effects: { stats: { charm: 3, intelligence: 1 } } },
        ],
      },
      { text: '创业协会', outcomes: [{ text: '你认识了一群想“改变世界”的人，也见识了很多只会画饼的人。', effects: { stats: { influence: 2, intelligence: 1, charm: 1 } } }] },
      { text: '登山社', outcomes: [{ text: '你爬了好几座山，站在山顶时，觉得重生这件事也没那么沉重了。', effects: { stats: { health: 4, happiness: 4 }, addFlags: ['fit'] } }] },
    ],
  },
  {
    id: 'y1620-college-fail-exam',
    category: 'school',
    requires: { minAge: 18, maxAge: 21, flags: ['y1620-in-college'], statMax: { intelligence: 60 } },
    title: '挂科',
    text: '期末成绩出来了，高数挂了。辅导员让你下学期补考，还要通知家长。',
    choices: [
      { text: '寒假闭关，补考必过', outcomes: [{ text: '你在图书馆过了半个寒假，补考考了八十多分。', effects: { stats: { intelligence: 4, happiness: -2 } } }] },
      { text: '找学霸补课', outcomes: [{ text: '学霸讲得很清楚，你补考过了，还请人家吃了顿饭——后来你们成了好朋友。', effects: { stats: { intelligence: 2, charm: 2, happiness: 1 } } }] },
    ],
  },
  {
    id: 'y1620-college-love',
    category: 'life',
    requires: { minAge: 18, maxAge: 22, notFlags: ['partner', 'married'] },
    title: '图书馆的偶遇',
    text: '图书馆里，你和一个人同时伸手去拿同一本书。对方抬头笑了一下：“你先？”',
    choices: [
      {
        text: '“一起看吧。”',
        outcomes: [
          { requires: { statMin: { charm: 65 } }, text: '你们从那本书聊到了晚饭，又从晚饭聊到了宿舍门禁。没过多久，你们在一起了。', effects: { stats: { happiness: 8, charm: 2 }, addFlags: ['partner'] } },
          { requires: { statMax: { charm: 64 } }, text: '你一紧张，说的话有点奇怪。对方礼貌地笑了笑，拿着另一本书走了。', effects: { stats: { happiness: -2, charm: 1 } } },
        ],
      },
      { text: '把书让给对方', outcomes: [{ text: '对方说了声谢谢。你们之后在图书馆又碰见过几次，但都只是点头之交。', effects: { stats: { charm: 1 } } }] },
    ],
  },
  {
    id: 'y1620-life-internship',
    category: 'career',
    requires: { minAge: 20, maxAge: 22, minYear: 2018, flags: ['y1620-in-college'] },
    title: '第一份实习',
    text: '大三暑假，你拿到了一家公司的实习机会。工位在角落，每天的工作是复印、订会议室、整理表格。',
    choices: [
      { text: '把每件小事做到最好', outcomes: [
        { weight: 2, text: '你的表格整理得清清楚楚，带你的前辈说：“毕业了直接来吧。”', effects: { stats: { influence: 2, intelligence: 2, wealth: 0.3 } } },
        { weight: 1, text: '你做得很好，但公司不缺人，实习结束时只拿到一封客气的推荐信。', effects: { stats: { intelligence: 2, wealth: 0.3 } } },
      ] },
      {
        text: '用你的“记忆”给老板提一个行业建议',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你建议公司提前布局短视频。老板将信将疑地试了试，一年后这成了公司增长最快的业务。他记住了你的名字。', effects: { stats: { influence: 4, fame: 2, wealth: 1 } } },
          { tag: 'misremember', text: '你把行业风口的时间记早了几年，老板听完摇摇头：“年轻人，想法挺多。”', effects: { stats: { happiness: -2 } } },
        ],
      },
    ],
  },
  {
    id: 'y1620-life-livestream',
    category: 'career',
    requires: { minAge: 19, maxAge: 24, minYear: 2019 },
    title: '直播带货',
    text: '朋友拉你一起做直播带货：“现在谁都能当主播，卖点家乡的水果，说不定就火了。”',
    choices: [
      {
        text: '试试，自己出镜',
        outcomes: [
          { requires: { statMin: { charm: 85 } }, weight: 1, text: '你天生有镜头感，一场直播卖空了整个果园。乡亲们把你当成了“带货一哥”。', effects: { stats: { fame: 8, wealth: 15, charm: 2, influence: 2 } } },
          { weight: 2, text: '直播间里常年只有十几个人，大部分是亲戚。你卖出了三箱橙子。', effects: { stats: { charm: 1, wealth: 0.1, happiness: -1 } } },
        ],
      },
      { text: '算了，我不适合抛头露面', outcomes: [{ text: '朋友后来自己做起来了，偶尔会送你一箱水果。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y1620-life-dropout-startup',
    category: 'career',
    rarity: 'rare',
    requires: { minAge: 19, maxAge: 22, flags: ['skill-coding', 'y1620-in-college'], notFlags: ['has-business'] },
    title: '要不要休学创业',
    text: '你写的一个校园小程序意外火了，全校一半的人都在用。有个投资人约你喝咖啡，开口就是“我们投你一百万”。',
    choices: [
      {
        text: '休学，全职做',
        outcomes: [
          { weight: 1, text: '你拿到了投资，小程序从一个学校扩展到了几十个学校。你成了媒体口中的“学生创业明星”。', effects: { stats: { wealth: 30, fame: 6, influence: 4 }, addFlags: ['has-business'] } },
          { weight: 2, text: '扩张比想象中难得多，一年后钱烧完了。你回学校复了学，身上多了一些别人没有的东西。', effects: { stats: { intelligence: 4, happiness: -4, charm: 2 } } },
        ],
      },
      { text: '先毕业，把项目当副业', outcomes: [{ text: '你一边上课一边维护项目，毕业时把它卖给了一家公司，赚了一笔。', effects: { stats: { wealth: 8, intelligence: 2 } } }] },
    ],
  },
  {
    id: 'y1620-life-noncollege-work',
    category: 'career',
    requires: { minAge: 18, maxAge: 22, flags: ['y1620-no-college'], notFlags: ['employed'] },
    title: '早出社会',
    text: '同龄人都在上大学，你已经在城市里找活干了。工地、工厂、餐馆，你一个个问过去。',
    choices: [
      { text: '学一门手艺：修车/装修/做菜', outcomes: [{ text: '你跟着师傅学了两年，手艺越来越好，开始有熟客专门点你的名。', effects: { stats: { wealth: 5, health: 2, intelligence: 2 }, addFlags: ['employed'] } }] },
      {
        text: '去跑外卖，多劳多得',
        outcomes: [{ text: '你每天风里来雨里去，收入不低，也认识了这座城市的每一条小巷。', effects: { stats: { wealth: 6, health: -2, charm: 1 }, addFlags: ['employed'] } }],
      },
      {
        text: '用“记忆”找一个会起飞的小行业',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在别人还没注意的时候开起了一家奶茶小店。几年后，这条街上排队最长的就是你家。', effects: { stats: { wealth: 20, fame: 2, influence: 2 }, addFlags: ['has-business'] } },
          { tag: 'misremember', text: '你押错了品类，小店开了半年就关了，赔光了攒的钱。', effects: { stats: { wealth: -3, happiness: -4 } } },
        ],
      },
    ],
  },
  {
    id: 'y1620-life-mobile-game',
    category: 'life',
    requires: { minAge: 18, maxAge: 22, minYear: 2017 },
    title: '王者农药',
    text: '全宿舍、全班、全校都在玩一款叫“王者农药”的手游，连食堂阿姨都会问你“几星了”。室友喊你：“就差一个，快来！”',
    choices: [
      {
        text: '上号！',
        outcomes: [
          { weight: 2, text: '你们五连胜，宿舍里吼声震天。你承认，这游戏确实上头。', effects: { stats: { happiness: 4, charm: 1, health: -1 } } },
          { weight: 1, requires: { statMin: { intelligence: 60 } }, text: '你打得太好，被学校电竞社拉去打校赛，拿了个冠军。', effects: { stats: { fame: 3, happiness: 5, charm: 2 } } },
        ],
      },
      { text: '“我在学习。”（其实在睡觉）', outcomes: [{ text: '你睡了一个好觉，醒来发现室友已经掉了三颗星。', effects: { stats: { health: 2, happiness: 1 } } }] },
    ],
  },
  {
    id: 'y1620-family-dad-hospital',
    category: 'family',
    requires: { minAge: 19, maxAge: 24, minYear: 2017 },
    title: '一个电话',
    text: '凌晨，妈妈打来电话，声音发抖：爸爸在单位晕倒了，送进了医院。',
    choices: [
      {
        text: '连夜赶回去',
        outcomes: [
          { weight: 3, text: '是突发的小毛病，好在送医及时。你在病床边守了三天，爸爸醒来第一句话是“耽误你上课了吧”。', effects: { stats: { happiness: -2, wealth: -1 }, addFlags: ['parents-trust'] } },
          { weight: 1, requires: { flags: ['y1620-major-med'] }, text: '你一眼看出了问题所在，和医生沟通得很顺畅。爸爸出院后逢人就说：“我家孩子是学医的。”', effects: { stats: { happiness: 2, influence: 2, wealth: -0.5 }, addFlags: ['parents-trust'] } },
        ],
      },
      { text: '打钱回去，电话里安慰', outcomes: [{ text: '爸爸没什么大事，但你挂了电话后，在走廊里站了很久。', effects: { stats: { wealth: -1, happiness: -3 } } }] },
    ],
  },
]
