import type { GameEvent } from '../../types'

/**
 * 2021–2026（主角 23–28 岁）：工作、成家、AI 浪潮，直到现实记忆的终点。
 * 2025–2026 年只写确定的大方向；2026 年世界杯等结果在主角记忆之外，不能用“预知”。
 *
 * 本文件读取的标记：
 * - y1115-btc-hodl / y1115-btc-family / y1620-tsla / y1620-ai-dream / y1620-major-*：见前两个批次
 * - employed / partner / married / has-child / own-house / has-business / best-friend / fit / lucky / poker-face / rich-family / skill-coding
 *
 * 本文件写入的标记：
 * - y2126-ai-early：第一时间上手对话式大模型（后续：y2126-life-ai-anxiety、y2126-2025-ai-shock）
 * - y2126-gpu-hold：2023 年买入英伟哒（后续：y2126-2024-gpu-payoff、y2126-2025-ai-shock）
 * - y2126-civil-servant：考上公务员
 * - employed / partner / married / has-business：与行动共用的标记
 *
 * 改写锚点（Effects.alter）：y2126-2022-ftx。改写版事件放在下一年触发。
 */
export const y2021to2026Events: GameEvent[] = [
  // ───────────── 现实锚点：2021 ─────────────
  {
    id: 'y2126-2021-btc-peak',
    dependsOn: ['y1115-2013-bitcoin'],
    category: 'finance',
    rarity: 'rare',
    year: 2021,
    requires: { minAge: 23 },
    title: '六万九',
    text: '比特币冲到了六万多美元，币圈的人都在喊“十万不是梦”。你记得十一月会有一个高点，然后是整整一年的寒冬。',
    realFact: '比特币价格于 2021 年 11 月创下约 69000 美元的历史高点，2022 年全年大幅下跌至 16000 美元附近；同年 9 月国内相关部门明确虚拟货币相关业务活动属于非法金融活动。依据：通行加密货币市场史料与相关部门公开通知。',
    choices: [
      {
        text: '把初中那串密码里剩下的币，在高点前卖掉',
        requires: { flags: ['y1115-btc-hodl'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '八年前的一千块压岁钱，在六万多美元的高点前翻了几十倍。钱不算多，但你在出租屋里坐了一整晚——这是你和那个十五岁的自己一起赚的。', effects: { stats: { wealth: 7, happiness: 8, influence: 1 }, removeFlags: ['y1115-btc-hodl'] } },
          { tag: 'misremember', text: '你记错了高点的月份，卖的时候已经回落了不少。但它依然是你这辈子收益率最高的一笔投资。', effects: { stats: { wealth: 4, happiness: 4 }, removeFlags: ['y1115-btc-hodl'] } },
        ],
      },
      {
        text: '告诉爸爸：“剩下的，十一月前全部卖掉。”',
        requires: { flags: ['y1115-btc-family'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸照做了。那笔当年“就当捐了”的钱，翻了六十多倍。他第一次在你面前哭了。', effects: { stats: { wealth: 300, influence: 6, happiness: 10 }, removeFlags: ['y1115-btc-family'], addFlags: ['family-has-money'] } },
          { tag: 'misremember', text: '你喊晚了，爸爸卖在了下跌途中。可就算这样，也是当年的几十倍。', effects: { stats: { wealth: 150, influence: 3, happiness: 5 }, removeFlags: ['y1115-btc-family'] } },
        ],
      },
      {
        text: '用积蓄年初进场、十一月前离场',
        requires: { statMin: { wealth: 10 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你踩准了节奏，账户翻了一倍。你没有贪，卖完就卸载了所有交易软件。', effects: { stats: { wealth: 15, happiness: 4 } } },
          { tag: 'misremember', text: '你把年中那次暴跌当成了顶，割在了低点，又在真正的高点追了回去。', effects: { stats: { wealth: -8, happiness: -6 } } },
        ],
      },
      { text: '不碰，这钱不是我该赚的', outcomes: [{ text: '你把注意力放回了工作上。', effects: { stats: { intelligence: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2021-tsla-payoff',
    category: 'finance',
    year: 2021,
    requires: { minAge: 23, flags: ['y1620-tsla'] },
    title: '马丝氪成了首富',
    text: '你去年买的特丝啦还在涨，马丝氪的身家一度冲到了世界第一。朋友们都劝你“拿到天荒地老”。',
    realFact: '2021 年某美国电动车公司市值一度突破 1 万亿美元，其创始人一度成为全球首富。依据：通行财经史料。人名、公司名已按 docs/NAMING.md 改名。',
    choices: [
      {
        text: '年底高点附近卖掉',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在高点附近卖了。没过多久，它开始了一轮漫长的下跌。', effects: { stats: { wealth: 30, happiness: 5 }, removeFlags: ['y1620-tsla'] } },
          { tag: 'misremember', text: '你卖早了半年，后面还有一大截涨幅。不过也翻了好几倍，你说服自己“够了”。', effects: { stats: { wealth: 15, happiness: 1 }, removeFlags: ['y1620-tsla'] } },
        ],
      },
      { text: '继续拿着，相信长期', outcomes: [{ text: '接下来的一年，它跌掉了一大半。你看着账户，学会了平常心。', effects: { stats: { wealth: 5, happiness: -3, intelligence: 1 }, removeFlags: ['y1620-tsla'] } }] },
    ],
  },
  {
    id: 'y2126-2021-double-reduction',
    category: 'world',
    year: 2021,
    requires: { minAge: 23 },
    title: '双减',
    text: '七月，校外培训行业迎来了一纸重磅文件。你的高中同学在一家教培机构当老师，刚签了三年合同，还打算贷款买房。',
    realFact: '2021 年 7 月，国家发布关于进一步减轻义务教育阶段学生作业负担和校外培训负担的意见（“双减”），学科类校外培训行业随后大幅收缩。依据：官方公开文件。',
    choices: [
      {
        text: '提前劝同学：“今年上半年就准备转行。”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '同学半信半疑地考了教师编制，在政策出来前上了岸。很多年后他说：“你那句话救了我。”', effects: { stats: { influence: 2, happiness: 3 }, addFlags: ['best-friend'] } },
          { tag: 'misremember', text: '你记成了“明年”，同学没当回事。政策来得猝不及防，他失业了三个月。', effects: { stats: { happiness: -3 } } },
        ],
      },
      {
        text: '你自己的小生意本来想做培训，赶紧掉头',
        requires: { flags: ['has-business'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你把培训项目砍掉，转做了素质教育和托管。同行们一片哀嚎时，你的生意稳稳地活了下来。', effects: { stats: { wealth: 20, influence: 2 } } },
          { tag: 'misremember', text: '你转向转得太晚，前期投入打了水漂。', effects: { stats: { wealth: -20, happiness: -5 } } },
        ],
      },
      { text: '感慨一下，继续上班', outcomes: [{ text: '你在朋友圈看到很多人在找工作，默默点了几个赞。', effects: { stats: { happiness: -1 } } }] },
    ],
  },
  {
    id: 'y2126-2021-euro',
    category: 'finance',
    year: 2021,
    requires: { minAge: 23 },
    title: '推迟一年的欧洲杯',
    text: '因为疫情推迟了一年的欧洲杯终于开打。决赛在伦敦，英格兰人唱着“足球回家”。你记得，这场决赛要踢到点球。',
    realFact: '2020 年欧洲杯因疫情推迟至 2021 年举行，7 月 11 日决赛在伦敦温布利球场，意大利与英格兰 1:1 战平，点球大战 3:2 获胜夺冠。依据：欧足联官方赛果。',
    choices: [
      {
        text: '押意大利点球获胜（虚拟竞猜）',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '点球大战最后一球被扑出，你在出租屋里喊得邻居来敲门。这一注赚了小半年的房租。', effects: { stats: { wealth: 4, happiness: 5 } } },
          { tag: 'misremember', text: '你被“足球回家”的气氛带跑了，押了英格兰。', effects: { stats: { wealth: -2, happiness: -3 } } },
        ],
      },
      { text: '下班太累，看个集锦就好', outcomes: [{ text: '你在地铁上看完了集锦，到站差点坐过头。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2021-metaverse',
    category: 'world',
    year: 2021,
    requires: { minAge: 23 },
    title: '元宇宙',
    text: '一家社交巨头宣布改名，全面押注“元宇宙”。一夜之间，所有公司都在讲元宇宙，虚拟土地卖出了天价。老板让你写一份“公司元宇宙战略”。',
    realFact: '2021 年 10 月某美国社交网络公司宣布更名，全面转向“元宇宙”，相关概念在全球资本市场迅速升温，次年热度明显退潮。依据：通行科技与财经史料。',
    choices: [
      {
        text: '在报告里委婉地劝老板：小步试水，别 all in',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '老板听了，只投了一个小项目。第二年概念退潮，别的公司都在裁撤部门，你的老板请你吃了顿饭。', effects: { stats: { influence: 3, wealth: 3 } } },
          { tag: 'misremember', text: '你把退潮的时间记早了，老板觉得你保守，项目交给了别人。', effects: { stats: { happiness: -2, influence: -1 } } },
        ],
      },
      { text: '高价买一块虚拟土地，赌一把', outcomes: [
        { weight: 3, text: '第二年，那块“地”的价格只剩零头。你把截图设成了手机壁纸，提醒自己别再冲动。', effects: { stats: { wealth: -5, happiness: -3 } } },
        { weight: 1, text: '你在热度最高时转手卖掉，小赚了一笔。纯属运气。', effects: { stats: { wealth: 3, happiness: 2 } } },
      ] },
      { text: '照着网上的模板写一份交差', outcomes: [{ text: '报告写得天花乱坠，没人真看。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2021-property',
    category: 'finance',
    rarity: 'rare',
    year: 2021,
    requires: { minAge: 23 },
    title: '楼市的拐点',
    text: '一家头部房企的债务问题上了新闻，很多楼盘停工。爸妈打电话来，说想在老家再买一套房“留给你结婚用”。',
    realFact: '2021 年下半年起，国内多家大型房地产企业相继出现债务违约，部分项目停工；此后数年全国商品房销售与房价总体走弱。依据：通行财经史料与国家统计局数据。',
    choices: [
      {
        text: '劝爸妈：“别买了，手里多的那套也趁早卖。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈犹豫了半年，最后在价格松动前卖掉了一套。几年后再看，他们说你“比算命的还准”。', effects: { stats: { wealth: 30, influence: 3 } } },
          { tag: 'misremember', text: '你把拐点说得太早，爸妈卖完后房价又涨了一小段，他们埋怨了你好几个月。', effects: { stats: { wealth: -5, happiness: -3 } } },
        ],
      },
      {
        text: '用积蓄付首付，自己先买一套',
        requires: { statMin: { wealth: 80 }, notFlags: ['own-house'] },
        outcomes: [
          { weight: 1, text: '你有了自己的房子，但接下来的几年，房价一直在往下走。至少，住着舒服。', effects: { stats: { wealth: -40, happiness: 6 }, addFlags: ['own-house'] } },
          { weight: 1, text: '你挑了一个配套好的老小区，价格坚挺，住得也安心。', effects: { stats: { wealth: -20, happiness: 8 }, addFlags: ['own-house'] } },
        ],
      },
      { text: '“这事你们自己定。”', outcomes: [{ text: '爸妈最后没买，说“等你有对象了再说”。', effects: { stats: { happiness: 1 } } }] },
    ],
  },

  // ───────────── 现实锚点：2022 ─────────────
  {
    id: 'y2126-2022-winter-olympics',
    category: 'world',
    year: 2022,
    requires: { minAge: 24 },
    title: '一墩难求',
    text: '北京冬奥会开幕，吉祥物冰敦敦火到全网抢购，官方店门口排起了长队。同事们都在群里问：“谁能抢到一个？”',
    realFact: '第 24 届冬季奥林匹克运动会于 2022 年 2 月 4 日至 20 日在北京及张家口举办，北京成为首个同时举办过夏季与冬季奥运会的城市；其吉祥物周边一度供不应求。依据：国际奥委会官方资料与当年媒体报道。名称已改名。',
    choices: [
      { text: '凌晨蹲守抢购', outcomes: [
        { weight: 1, requires: { flags: ['lucky'] }, text: '你一下就抢到了三个，送了两个给同事，在部门里人缘暴涨。', effects: { stats: { charm: 3, happiness: 5 } } },
        { weight: 2, text: '手速不够，你只抢到了一个钥匙扣。也算是参与了。', effects: { stats: { happiness: 2 } } },
      ] },
      {
        text: '去学滑雪',
        outcomes: [{ text: '你摔了无数个跟头，终于能从初级道上滑下来了。冬天突然变得有意思起来。', effects: { stats: { health: 4, happiness: 4 }, addFlags: ['fit'] } }],
      },
      { text: '在家看比赛', outcomes: [{ text: '你被一位年轻运动员的空中转体惊到，回放看了五遍。', effects: { stats: { happiness: 3 } } }] },
    ],
  },
  {
    id: 'y2126-2022-war',
    category: 'world',
    year: 2022,
    requires: { minAge: 24 },
    title: '远方的战火',
    text: '二月底，俄乌冲突爆发。新闻里的画面让人难受，油价、粮价跟着波动。你知道这件事会持续很久，而你能做的很少。',
    realFact: '2022 年 2 月 24 日俄乌冲突全面爆发，随后国际能源与粮食价格大幅波动。依据：通行国际新闻报道。本事件写法克制，不做娱乐化处理。',
    choices: [
      { text: '向人道主义救援机构捐一笔钱', requires: { statMin: { wealth: 5 } }, outcomes: [{ text: '你捐了一笔钱，没有告诉任何人。', effects: { stats: { wealth: -2, happiness: 2 } } }] },
      { text: '关掉新闻，过好自己的日子', outcomes: [{ text: '你关掉手机，给爸妈打了个电话，聊了些家长里短。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2022-rate-hike',
    category: 'finance',
    year: 2022,
    requires: { minAge: 24 },
    title: '加息',
    text: '美联储开始大幅加息，全球的高风险资产集体跳水：美股科技股、加密货币、各种“概念”，一个接一个地塌了。',
    realFact: '2022 年美联储累计加息 425 个基点，为数十年来最快的加息节奏之一；美股科技股指数全年大幅下跌，加密货币市场经历多起平台倒闭。依据：美联储公告与通行财经史料。',
    choices: [
      {
        text: '年初就把高风险资产清掉，换成稳健理财',
        requires: { statMin: { wealth: 20 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在一月就完成了调仓，这一年别人亏得惨不忍睹，你的账户纹丝不动，还多了一点利息。', effects: { stats: { wealth: 10, influence: 1 } } },
          { tag: 'misremember', text: '你调仓调晚了几个月，还是挨了一刀。', effects: { stats: { wealth: -8, happiness: -3 } } },
        ],
      },
      { text: '反正没什么钱，不慌', outcomes: [{ text: '你的全部资产是一张工资卡，这一年它很安全。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2022-ftx',
    category: 'finance',
    rarity: 'rare',
    year: 2022,
    requires: { minAge: 24, notAltered: ['y2126-2022-ftx'] },
    title: '交易所跑路',
    text: '十一月，一家全球头部的加密货币交易所在几天之内轰然倒塌，挪用客户资产的丑闻震惊全球。你的一个朋友把全部积蓄都放在上面。',
    realFact: '2022 年 11 月，某全球大型加密货币交易所因流动性危机与挪用客户资产问题在数日内崩盘并申请破产，比特币价格跌至 16000 美元附近。依据：通行财经史料与美国破产法院公开文件。',
    choices: [
      {
        text: '提前一个月劝朋友把钱提出来',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '朋友提完钱没几天，交易所就停止了提现。对方给你发了一个巨大的红包，你没收。', effects: { stats: { influence: 2, charm: 2, happiness: 3 }, addFlags: ['best-friend'] } },
          { tag: 'misremember', text: '你把出事的交易所记成了另一家，朋友把钱从“安全的那家”转进了出事的这家。', effects: { stats: { happiness: -6, charm: -2 } } },
        ],
      },
      {
        text: '公开发长文质疑它的储备金，号召大家提币',
        requires: { statMin: { influence: 50, fame: 30 } },
        outcomes: [{ text: '你的长文引发了挤兑式的提前提币，丑闻提前半年暴露。很多普通人的钱因此保住了，币圈的历史也被你改写了一页。', effects: { stats: { fame: 8, influence: 5 }, alter: [{ id: 'y2126-2022-ftx', scale: 6 }], world: { crypto: 5, media: 5 } } }],
      },
      { text: '我又没放钱在那儿', outcomes: [{ text: '你安慰了朋友一整晚，请他吃了一顿烧烤。', effects: { stats: { charm: 1, happiness: -1 } } }] },
    ],
  },
  {
    id: 'y2126-2023-ftx-altered',
    category: 'world',
    year: 2023,
    requires: { minAge: 25, altered: ['y2126-2022-ftx'] },
    title: '提前引爆的雷',
    text: '因为你去年的那篇长文，交易所的丑闻提前暴露，崩盘的损失小了很多。有家媒体把你评为“年度吹哨人”。币圈的价格走势，从这里开始和你记得的有些对不上了。',
    realFact: '改写版：真实历史中，该交易所于 2022 年 11 月突然崩盘，大量用户资产无法取回。本事件为玩家改写锚点 y2126-2022-ftx 后的分支。',
    choices: [
      { text: '接受采访，呼吁加强监管', outcomes: [{ text: '你上了好几个访谈节目，成了“币圈良心”。也有人恨你恨得牙痒痒。', effects: { stats: { fame: 5, influence: 4 } } }] },
      { text: '保持低调', outcomes: [{ text: '你拒绝了所有采访，只在心里记下：记忆，越来越不能全信了。', effects: { stats: { memory: -2, intelligence: 2 } } }] },
    ],
  },
  {
    id: 'y2126-2022-chatgpd',
    category: 'world',
    rarity: 'rare',
    year: 2022,
    requires: { minAge: 24 },
    title: 'ChatGPD 上线',
    text: '十一月底，closeai 发布了一个叫 ChatGPD 的聊天机器人，五天用户破百万。朋友圈里有人让它写诗，有人让它写代码。你知道，这是一个新时代的开头。',
    realFact: '2022 年 11 月 30 日某美国人工智能公司发布对话式大语言模型应用，上线约 5 天用户突破 100 万，两个月月活用户约 1 亿。依据：该公司公开信息与通行科技史料。名称已按 docs/NAMING.md 改名。',
    choices: [
      {
        text: '第一时间上手，研究怎么把它用进工作',
        outcomes: [{ text: '你成了公司里第一个用 AI 写周报、做表格的人，效率高得让领导起疑。', effects: { stats: { intelligence: 3, influence: 1 }, addFlags: ['y2126-ai-early'] } }],
      },
      {
        text: '辞职，全身心投入大模型应用创业',
        requires: { flags: ['skill-coding'] },
        outcomes: [
          { weight: 1, requires: { flags: ['y1620-ai-dream'] }, text: '你从 2016 年那场人机大战起就在准备这一天。你的团队做出了第一批爆款应用，投资人追着你跑。', effects: { stats: { wealth: 100, fame: 8, influence: 6 }, addFlags: ['has-business', 'y2126-ai-early', 'ai-candidate'] } },
          { weight: 2, text: '你和两个朋友做了一个 AI 写作工具，起步很快，但竞争也来得很快。至少，你站在了浪潮里。', effects: { stats: { wealth: 10, fame: 3, influence: 2, intelligence: 2 }, addFlags: ['has-business', 'y2126-ai-early', 'ai-candidate'] } },
        ],
      },
      { text: '“又是一个噱头。”', outcomes: [{ text: '你试了两句，觉得它“也就那样”，关掉了网页。', effects: { stats: { happiness: 1 } } }] },
    ],
  },

  // ───────────── 现实锚点：2023 ─────────────
  {
    id: 'y2126-2023-zibo',
    category: 'life',
    year: 2023,
    requires: { minAge: 25 },
    title: '进淄赶烤',
    text: '春天，一座北方小城的烧烤突然火遍全网，大学生们坐着高铁去“赶烤”。你的朋友约你周末来一场“特种兵旅游”。',
    realFact: '2023 年 3 月起山东淄博烧烤在社交媒体走红，大量游客前往，当地推出专列与专线，“特种兵旅游”成为年度流行语。依据：当年主流媒体报道。',
    choices: [
      { text: '去！两天打卡五个景点', outcomes: [{ text: '你们凌晨出发、深夜返回，在小饼卷烤肉的香气里，觉得这才叫年轻。', effects: { stats: { happiness: 6, health: -2, charm: 1 } } }] },
      {
        text: '趁热开一家烧烤店，火一阵就转手',
        requires: { statMin: { wealth: 10 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你开业正赶上热度，排队排到街角。秋天热度退下去之前，你把店转了出去。', effects: { stats: { wealth: 8, happiness: 3 } } },
          { tag: 'misremember', text: '你开业时热度已经过了，店里冷冷清清，半年后关门。', effects: { stats: { wealth: -8, happiness: -4 } } },
        ],
      },
      { text: '在家点外卖烧烤', outcomes: [{ text: '外卖小哥迟到了二十分钟，烤串有点凉了。但还是挺香。', effects: { stats: { happiness: 2 } } }] },
    ],
  },
  {
    id: 'y2126-2023-svb',
    category: 'finance',
    year: 2023,
    requires: { minAge: 25 },
    title: '银行挤兑',
    text: '三月，美国一家专门服务科技创业公司的银行在两天内被挤兑倒闭。你认识的一个创业者，公司的钱全在那里。',
    realFact: '2023 年 3 月 10 日，某美国区域性银行因储户挤兑被监管机构关闭，为 2008 年以来美国最大规模的银行倒闭之一，随后监管部门宣布全额保障其储户存款。依据：美国联邦存款保险公司公开公告。名称已改名（矽谷银行）。',
    choices: [
      {
        text: '提前提醒对方把钱分散到几家银行',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '对方照做了。倒闭那天，他的同行们焦头烂额，他却在给员工照常发工资。后来他把你拉进了他的投资圈。', effects: { stats: { influence: 4, wealth: 3 } } },
          { tag: 'misremember', text: '你记错了是哪家银行，对方转了一圈，钱又转回了矽谷银行。好在最后存款得到了保障，只是虚惊一场。', effects: { stats: { happiness: -2 } } },
        ],
      },
      { text: '看个热闹', outcomes: [{ text: '你在新闻里第一次听说“挤兑”这个词还能这么快。', effects: { stats: { intelligence: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2023-gpu',
    dependsOn: ['world-ai-lab'],
    category: 'finance',
    rarity: 'rare',
    year: 2023,
    requires: { minAge: 25 },
    title: '卖铲子的人',
    text: '大模型热潮里，所有公司都在抢一种叫“显卡”的东西。做显卡的英伟哒市值突破了一万亿美元。所有人都说“太贵了”。你知道，它还远没到头。',
    realFact: '2023 年 5 月 30 日某美国芯片公司市值盘中首次突破 1 万亿美元，2024 年 6 月一度成为全球市值最高的公司。依据：通行财经史料。名称已改名。',
    choices: [
      {
        text: '把积蓄的一大半买进去，拿住',
        requires: { statMin: { wealth: 20 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你买在了大家都说“太贵了”的时候。你在手机上设了一个提醒：“别看，明年再说。”', effects: { stats: { wealth: -5, intelligence: 1 }, addFlags: ['y2126-gpu-hold'] } },
          { tag: 'misremember', text: '你把它和另一家芯片公司记混了，买错了票，一年下来没涨多少。', effects: { stats: { wealth: -3, happiness: -2 } } },
        ],
      },
      { text: '太贵了，不追', outcomes: [{ text: '你和所有人一样觉得“太贵了”，然后看着它继续涨。', effects: { stats: { happiness: -1 } } }] },
    ],
  },
  {
    id: 'y2126-2023-asian-games',
    category: 'world',
    year: 2023,
    requires: { minAge: 25 },
    title: '杭州亚运会',
    text: '因故推迟一年的杭州亚运会终于开幕。开幕式上，数字火炬手和真人一起点燃了主火炬。',
    realFact: '第 19 届亚运会原定 2022 年举行，推迟至 2023 年 9 月 23 日至 10 月 8 日在杭州举办，开幕式采用数字人与现场火炬手共同点火。依据：亚奥理事会与主办方公开资料。',
    choices: [
      { text: '报名当城市志愿者', outcomes: [{ text: '你穿着志愿者马甲给游客指路，被外国运动员拉着合了影。', effects: { stats: { charm: 2, happiness: 4, fame: 1 } } }] },
      { text: '在家看比赛', outcomes: [{ text: '你看了一整天的电竞和游泳比赛，觉得这届亚运会挺有意思。', effects: { stats: { happiness: 3 } } }] },
    ],
  },

  // ───────────── 现实锚点：2024 ─────────────
  {
    id: 'y2126-2024-gpu-payoff',
    category: 'finance',
    year: 2024,
    requires: { minAge: 26, flags: ['y2126-gpu-hold'] },
    title: '世界第一',
    text: '六月，英伟哒一度成为全球市值最高的公司。你打开那条“明年再说”的提醒，账户上的数字翻了好几倍。',
    realFact: '2024 年 6 月某美国芯片公司市值一度超过 3 万亿美元，短暂成为全球市值最高的公司。依据：通行财经史料。名称已改名。',
    choices: [
      {
        text: '卖掉大部分，落袋为安',
        outcomes: [{ text: '你卖掉了大部分。这是你靠自己（和一点点记忆）赚到的第一笔大钱。', effects: { stats: { wealth: 60, happiness: 6, influence: 2 }, removeFlags: ['y2126-gpu-hold'] } }],
      },
      { text: '继续拿着', outcomes: [{ text: '你决定再拿一阵。账户的波动让你开始失眠。', effects: { stats: { wealth: 20, happiness: -2 } } }] },
    ],
  },
  {
    id: 'y2126-2024-btc-etf',
    dependsOn: ['y1115-2013-bitcoin', 'y2126-2022-ftx'],
    category: 'finance',
    year: 2024,
    requires: { minAge: 26 },
    title: '十万美元',
    text: '一月，美国批准了比特币现货 ETF，华尔街正式入场。你记得，到年底它会站上一个整数关口。',
    realFact: '2024 年 1 月 10 日美国证券交易委员会批准比特币现货 ETF；同年 12 月 5 日前后比特币价格首次突破 100000 美元。依据：美国证券交易委员会公告与通行加密货币市场史料。',
    choices: [
      {
        text: '年初买入，年底卖出',
        requires: { statMin: { wealth: 20 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在四万多美元时买入，在十万美元的新闻出来那天卖掉。整整一年，你只看了两次行情。', effects: { stats: { wealth: 25, happiness: 4 } } },
          { tag: 'misremember', text: '你记成了“年初就冲十万”，追在了三月的高点，之后被来回折腾了大半年。', effects: { stats: { wealth: -5, happiness: -4 } } },
        ],
      },
      { text: '不碰币圈了', outcomes: [{ text: '你把精力放在了本职工作上。', effects: { stats: { intelligence: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2024-a-share',
    category: 'finance',
    rarity: 'rare',
    year: 2024,
    requires: { minAge: 26 },
    title: '国庆前的狂欢',
    text: '九月底，一场新闻发布会推出了一揽子刺激政策，A 股在短短几个交易日里暴涨，开户的人排起了长队。你的同事问你：“国庆后还能买吗？”',
    realFact: '2024 年 9 月 24 日金融管理部门推出降准、降息等一揽子政策，A 股随后连续大涨；国庆节后首个交易日（10 月 8 日）沪深两市成交额创历史纪录，股指高开后回落。依据：官方发布会信息与交易所数据。',
    choices: [
      {
        text: '九月二十四日进场，节后开盘就走',
        requires: { statMin: { wealth: 10 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你踩在了起点上，又在节后开盘的那一刻离场。同事们在高位追进去时，你已经在算这笔钱该怎么花了。', effects: { stats: { wealth: 12, happiness: 5, influence: 1 } } },
          { tag: 'misremember', text: '你记反了，节前不敢买，节后追了进去，正好接在了最高点。', effects: { stats: { wealth: -6, happiness: -4 } } },
        ],
      },
      { text: '提醒同事：“节后别追。”', outcomes: [
        { weight: 1, text: '同事听了你的，躲过了一劫，非要请你喝奶茶。', effects: { stats: { charm: 2, influence: 1 } } },
        { weight: 1, text: '同事没听，追了进去。之后好几个月，他见你就绕着走。', effects: { stats: { happiness: -1 } } },
      ] },
    ],
  },
  {
    id: 'y2126-2024-euro',
    category: 'finance',
    year: 2024,
    requires: { minAge: 26 },
    title: '德国欧洲杯',
    text: '欧洲杯在德国举行，西班牙的年轻人们踢得飞快。决赛对手是英格兰，又一次“足球回家”的口号响了起来。',
    realFact: '2024 年欧洲杯决赛于 7 月 14 日在柏林举行，西班牙 2:1 战胜英格兰，第四次夺得欧洲杯冠军。依据：欧足联官方赛果。',
    choices: [
      {
        text: '押西班牙（虚拟竞猜）',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '终场哨响，你在酒吧里和一群陌生人抱在一起。这一注赚的钱，够你下个月的房贷。', effects: { stats: { wealth: 3, happiness: 5 } } },
          { tag: 'misremember', text: '你想起了三年前的那场决赛，脑子一乱，押了英格兰。', effects: { stats: { wealth: -2, happiness: -3 } } },
        ],
      },
      { text: '不赌了，纯看球', outcomes: [{ text: '你看到了一个十几岁少年的惊世进球，觉得足球真好看。', effects: { stats: { happiness: 3 } } }] },
    ],
  },
  {
    id: 'y2126-2024-olympics',
    category: 'world',
    year: 2024,
    requires: { minAge: 26 },
    title: '巴黎奥运会',
    text: '巴黎奥运会开幕式在塞纳河上举行。中国代表团的金牌数和美国并列第一，最后一天的女篮决赛前，奖牌榜还在拉锯。',
    realFact: '2024 年第 33 届夏季奥运会于 7 月 26 日至 8 月 11 日在法国巴黎举行，中国与美国均获得 40 枚金牌，美国以银牌数优势位列奖牌榜第一。依据：国际奥委会官方奖牌榜。',
    choices: [
      { text: '每天熬夜看直播', outcomes: [{ text: '你记住了好多年轻运动员的名字，也记住了熬夜之后上班有多困。', effects: { stats: { happiness: 4, health: -2 } } }] },
      { text: '受到激励，开始每天运动', outcomes: [{ text: '你办了一张健身卡，而且真的去了。', effects: { stats: { health: 4, happiness: 2 }, addFlags: ['fit'] } }] },
    ],
  },
  {
    id: 'y2126-2024-wukong',
    category: 'life',
    year: 2024,
    requires: { minAge: 26 },
    title: '天命人',
    text: '八月，一款国产西游题材的单机大作《黑话：悟空》上线，首周销量破千万。办公室里一半的人请了假，另一半在偷偷看攻略。',
    realFact: '2024 年 8 月 20 日某国产西游题材动作游戏发售，上线数日全平台销量突破千万份，成为国产单机游戏的里程碑。依据：开发商与发行平台公开信息。名称已改名。',
    choices: [
      { text: '请两天假，通关再说', outcomes: [{ text: '你被一个精英怪打了一百多遍，终于过去的时候，在凌晨三点吼了一嗓子。', effects: { stats: { happiness: 6, health: -1 } } }] },
      {
        text: '借这波热度，做一期“西游文化”视频',
        outcomes: [
          { requires: { statMin: { charm: 80 } }, text: '你讲的取经路线和古建筑故事火了，涨了几十万粉丝。', effects: { stats: { fame: 6, wealth: 3, charm: 2 } } },
          { requires: { statMax: { charm: 79 } }, text: '视频做得很用心，但播放量平平。评论区有人说：“讲得挺好，就是没人看。”', effects: { stats: { intelligence: 2, happiness: -1 } } },
        ],
      },
      { text: '不玩游戏，看看新闻就好', outcomes: [{ text: '你在新闻里看到了国外玩家为这款游戏去中国旅游，觉得挺骄傲。', effects: { stats: { happiness: 2 } } }] },
    ],
  },

  // ───────────── 现实锚点：2025 ─────────────
  {
    id: 'y2126-2025-ai-shock',
    dependsOn: ['world-ai-lab'],
    category: 'finance',
    rarity: 'rare',
    year: 2025,
    requires: { minAge: 27 },
    title: '春节前的地震',
    text: '一月底，一家国内 AI 公司“深度摸索”发布了开源推理模型，成本低得惊人、效果却直追顶尖模型。消息传开，英伟哒一天之内跌掉了五六千亿美元市值。',
    realFact: '2025 年 1 月某国内人工智能公司发布开源推理大模型，以较低训练成本取得接近顶尖模型的效果；1 月 27 日某美国芯片公司股价单日下跌约 17%，市值蒸发约 5900 亿美元，创美股单日市值损失纪录。依据：通行科技与财经史料。名称已改名。',
    choices: [
      {
        text: '年前把显卡股减掉一大半',
        requires: { flags: ['y2126-gpu-hold'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在那根大阴线之前卖掉了大部分。之后它慢慢涨了回来，但你已经很满足了。', effects: { stats: { wealth: 60, happiness: 4 }, removeFlags: ['y2126-gpu-hold'] } },
          { tag: 'misremember', text: '你卖晚了一天，吃了一个跌停般的大跌。好在之前涨得够多。', effects: { stats: { wealth: 30, happiness: -2 }, removeFlags: ['y2126-gpu-hold'] } },
        ],
      },
      {
        text: '用开源模型做一个产品',
        requires: { flags: ['skill-coding'] },
        outcomes: [
          { weight: 1, requires: { flags: ['y2126-ai-early'] }, text: '你早就熟悉大模型，第一时间把开源模型接进了产品，成本降了九成，订单翻了几倍。', effects: { stats: { wealth: 50, fame: 4, influence: 3 } } },
          { weight: 2, text: '你做了一个小工具，用的人不少，算是在这场浪潮里分到了一杯羹。', effects: { stats: { wealth: 8, intelligence: 2 } } },
        ],
      },
      { text: '下载下来，和它聊了一晚上', outcomes: [{ text: '你问了它很多关于未来的问题。它回答得头头是道，你却觉得它也不知道。', effects: { stats: { intelligence: 1, happiness: 2 } } }] },
    ],
  },
  {
    id: 'y2126-2025-movie',
    category: 'life',
    year: 2025,
    requires: { minAge: 27 },
    title: '春节档',
    text: '春节档，一部国产神话动画电影续作票房一路狂飙，刷新了全球动画电影的票房纪录。你家亲戚组团去看了三遍。',
    realFact: '2025 年春节档上映的一部国产神话题材动画电影续作，票房超过百亿元人民币，成为全球票房最高的动画电影。依据：票务平台公开数据与当年媒体报道。',
    choices: [
      { text: '陪爸妈去电影院', outcomes: [{ text: '爸爸看得比你还投入，散场后跟你讨论了一路剧情。你突然觉得，陪他们看电影的机会其实没多少。', effects: { stats: { happiness: 5 }, addFlags: ['parents-trust'] } }] },
      { text: '在家刷了一晚上的影评', outcomes: [{ text: '你在影评区和人吵了三百楼，最后发现对方是个初中生。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2025-tariff',
    category: 'finance',
    year: 2025,
    requires: { minAge: 27 },
    title: '对等关税',
    text: '四月初，美国宣布对全球征收所谓“对等关税”，全球股市连续暴跌。一周后，又宣布对多数国家暂缓执行九十天，市场又暴涨。你记得这段过山车。',
    realFact: '2025 年 4 月 2 日美国宣布对贸易伙伴加征所谓“对等关税”，全球股市随即大幅下跌；4 月 9 日宣布对多数国家暂缓执行 90 天，美股当日大幅反弹。依据：通行财经史料与当年新闻报道。',
    choices: [
      {
        text: '在暴跌中分批抄底',
        requires: { statMin: { wealth: 20 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你在恐慌最重的那几天买入，暂缓的消息一出，账户一天就红了一大片。', effects: { stats: { wealth: 15, happiness: 4 } } },
          { tag: 'misremember', text: '你记错了暂缓的日子，没等到反弹就被吓得卖了。', effects: { stats: { wealth: -6, happiness: -3 } } },
        ],
      },
      { text: '外贸行业的朋友有点慌，去陪他喝一杯', outcomes: [{ text: '你们聊到半夜。你没法告诉他未来，只能告诉他“会过去的”。', effects: { stats: { charm: 1, happiness: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2025-gold',
    category: 'finance',
    year: 2025,
    requires: { minAge: 27 },
    title: '三千美元的黄金',
    text: '三月，金价第一次站上每盎司三千美元。妈妈翻出了 2013 年那对耳环，说：“当年要是多买点就好了。”',
    realFact: '2025 年 3 月国际金价首次突破每盎司 3000 美元，并在当年继续走高、多次刷新历史纪录。依据：通行贵金属市场史料。',
    choices: [
      {
        text: '年初就劝家里换一部分金条',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈在年初买了一些金条，到年底涨得让小姐妹们眼红。妈妈说：“这回总算听你的了。”', effects: { stats: { wealth: 8, influence: 1, happiness: 3 } } },
          { tag: 'misremember', text: '你把涨势和多年前的下跌记混了，劝家里卖掉了手上的金饰。', effects: { stats: { wealth: -3, happiness: -2 } } },
        ],
      },
      { text: '黄金太贵了，看看就好', outcomes: [{ text: '你把金价截图发到家族群，引发了一场“当年谁该买金”的大讨论。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y2126-2025-robots',
    category: 'world',
    year: 2025,
    requires: { minAge: 27 },
    title: '扭秧歌的机器人',
    text: '春晚舞台上，一排人形机器人穿着花袄扭起了秧歌，转手绢的动作比人还利索。机器人公司一夜之间成了香饽饽。',
    realFact: '2025 年春节联欢晚会上，国产人形机器人与演员合作表演秧歌节目，此后人形机器人概念受到广泛关注。依据：当年春晚节目与主流媒体报道。',
    choices: [
      {
        text: '跳槽去机器人公司',
        requires: { flags: ['skill-coding'] },
        outcomes: [{ text: '你加入了一家机器人初创公司。每天调教机器人走路，比带孩子还操心。', effects: { stats: { intelligence: 3, wealth: 5, influence: 2 }, addFlags: ['employed'] } }],
      },
      { text: '给爸妈打电话：“你们看见那个机器人了吗？”', outcomes: [{ text: '爸爸说他还以为是人穿着机器人衣服。你们在电话里笑了很久。', effects: { stats: { happiness: 3 } } }] },
    ],
  },

  // ───────────── 现实锚点：2026（记忆的终点） ─────────────
  {
    id: 'y2126-2026-worldcup',
    category: 'finance',
    rarity: 'rare',
    year: 2026,
    requires: { minAge: 28 },
    title: '记不起的世界杯',
    text: '美加墨世界杯开打了，第一次有 48 支球队参赛。朋友们照例问你：“这次谁赢？”你张了张嘴——脑子里一片空白。你的记忆，停在了这届比赛开始之前。',
    realFact: '2026 年世界杯由美国、加拿大、墨西哥联合举办，首次扩军至 48 支球队，赛期为 6 月 11 日至 7 月 19 日。依据：国际足联官方资料。本游戏不涉及本届比赛结果。',
    choices: [
      {
        text: '凭感觉押一个热门（虚拟竞猜）',
        outcomes: [
          { weight: 1, requires: { flags: ['lucky'] }, text: '没有记忆，只有运气——而你的运气一向离谱。你押中了。', effects: { stats: { wealth: 10, happiness: 6 } } },
          { weight: 2, text: '你第一次像个普通人一样押注，然后像个普通人一样输了。奇怪的是，你笑得很开心。', effects: { stats: { wealth: -3, happiness: 3 } } },
          { weight: 1, text: '你押中了，但这次是真的蒙的。你第一次享受到了“不知道结局”的快乐。', effects: { stats: { wealth: 5, happiness: 6 } } },
        ],
      },
      { text: '不赌了，好好看一届不知道结局的世界杯', outcomes: [{ text: '每一个进球都让你跳起来。原来，不知道结局的比赛这么好看。', effects: { stats: { happiness: 8 } } }] },
    ],
  },
  {
    id: 'y2126-2026-memory-end',
    category: 'absurd',
    rarity: 'legendary',
    year: 2026,
    requires: { minAge: 28 },
    title: '记忆的终点',
    text: '某个夜里，你突然意识到：你已经活到了“上一世”重生之前的那一天。从明天起，再也没有剧本了。你回头看了看这二十八年——那些押对的、押错的、改写的、错过的。',
    realFact: '游戏机制节点：主角的现实记忆截止于 2026 年，此后不再有“预知”选项，世界线由玩家自己书写。本事件不涉及具体史实。',
    choices: [
      {
        text: '把那本写满“未来”的笔记本烧掉',
        outcomes: [{ text: '火光里，那些日期和数字一点点卷曲、变黑。你觉得前所未有的轻松。', effects: { stats: { happiness: 10, memory: -10 } } }],
      },
      {
        text: '把它锁进保险柜，留给以后的自己',
        outcomes: [{ text: '你在扉页写下：“剩下的路，靠你自己了。”', effects: { stats: { intelligence: 3, happiness: 4 } } }],
      },
      {
        text: '用你这些年积累的影响力，给世界写一封公开信',
        requires: { statMin: { influence: 60 } },
        outcomes: [{ text: '你没有提重生，只是讲了你对未来的担忧和期待。信被转发了上亿次，很多人第一次认真想了想“以后”。', effects: { stats: { fame: 10, influence: 6, happiness: 4 } } }],
      },
    ],
  },

  // ───────────── 成年生活（23–28 岁，无现实对应） ─────────────
  {
    id: 'y2126-work-996',
    category: 'career',
    requires: { minAge: 23, maxAge: 28, minYear: 2021, flags: ['employed'] },
    title: '福报',
    text: '公司开始推行“大小周”，晚上十点下班成了常态。领导在周会上说：“年轻人要多奋斗。”你看着窗外的夜色，想起了上一世猝倒在工位上的同事。',
    choices: [
      { text: '咬牙扛着，争取年底晋升', outcomes: [
        { weight: 2, text: '你升职了，工资涨了一截，但体检报告上多了几个箭头。', effects: { stats: { wealth: 12, influence: 2, health: -5, happiness: -3 } } },
        { weight: 1, text: '你拼了一年，晋升名额给了领导的亲信。', effects: { stats: { wealth: 4, health: -5, happiness: -6 } } },
      ] },
      { text: '准点下班，被说“没有狼性”也无所谓', outcomes: [{ text: '你的绩效一般，但每天都能在天黑前到家，睡得很好。', effects: { stats: { health: 3, happiness: 4, wealth: 2 } } }] },
      { text: '辞职，换一家正常点的公司', requires: { statMin: { intelligence: 55 } }, outcomes: [{ text: '你跳到了一家不那么卷的公司，薪水差不多，生活好了很多。', effects: { stats: { happiness: 5, health: 2, wealth: 3 } } }] },
    ],
  },
  {
    id: 'y2126-work-layoff',
    category: 'career',
    requires: { minAge: 24, maxAge: 28, minYear: 2022, flags: ['employed'] },
    title: '“毕业”',
    text: '周五下午，HR 把你叫进小会议室，桌上放着一份文件和一盒纸巾。“公司业务调整，你被优化了。”',
    choices: [
      {
        text: '面不改色地谈补偿',
        requires: { flags: ['poker-face'] },
        outcomes: [{ text: '你一条条摆出法条，语气平静得让 HR 发毛。最后你拿到的补偿比同批人多了一倍。', effects: { stats: { wealth: 10, influence: 1, happiness: 1 }, removeFlags: ['employed'] } }],
      },
      { text: '签字，拿 N+1 走人', outcomes: [{ text: '你拿着补偿金，在家睡了一个星期，然后开始投简历。', effects: { stats: { wealth: 4, happiness: -4 }, removeFlags: ['employed'] } }] },
      {
        text: '用补偿金，干脆自己干',
        requires: { statMin: { wealth: 20 } },
        outcomes: [
          { weight: 1, text: '你把这当成一个机会，开了一家小工作室，第一年就接到了前公司的外包。', effects: { stats: { wealth: 10, influence: 2, happiness: 3 }, addFlags: ['has-business'], removeFlags: ['employed'] } },
          { weight: 1, text: '创业比打工难多了。你撑了半年，又回去找了份工作。', effects: { stats: { wealth: -10, happiness: -4, intelligence: 2 } } },
        ],
      },
    ],
  },
  {
    id: 'y2126-life-blind-date',
    category: 'life',
    requires: { minAge: 24, maxAge: 28, minYear: 2022, notFlags: ['partner', 'married'] },
    title: '相亲',
    text: '过年回家，七大姑八大姨轮番上阵：“你看你都多大了！”妈妈已经替你约好了一场相亲，在县城最好的那家咖啡馆。',
    choices: [
      {
        text: '去就去，认真聊聊',
        outcomes: [
          { requires: { statMin: { charm: 75 } }, text: '你们聊得出乎意料地投机，从咖啡馆聊到了夜市，加了联系方式，回去后每天都聊到很晚。', effects: { stats: { happiness: 8 }, addFlags: ['partner'] } },
          { requires: { statMax: { charm: 74 } }, text: '对方一开口就问你的收入和房子，你们尴尬地喝完了咖啡。', effects: { stats: { happiness: -3 } } },
        ],
      },
      { text: '提前跟对方串通好，演一场“不合适”', outcomes: [{ text: '你们俩配合默契，双方家长都无话可说。散场后你们成了好朋友。', effects: { stats: { charm: 2, happiness: 3 } } }] },
      { text: '“妈，我的事我自己做主。”', outcomes: [{ text: '妈妈生了一晚上气，第二天还是给你包了饺子。', effects: { stats: { happiness: -1 } } }] },
    ],
  },
  {
    id: 'y2126-life-civil-exam',
    category: 'career',
    requires: { minAge: 23, maxAge: 27, minYear: 2021, notFlags: ['y2126-civil-servant'] },
    title: '考公热',
    text: '身边的朋友一个接一个地开始备考公务员，热门岗位几千人抢一个位置。朋友问你：“一起吗？”',
    choices: [
      {
        text: '辞职全职备考',
        outcomes: [
          { requires: { statMin: { intelligence: 70 } }, text: '你笔试第一，面试也稳稳拿下。家里的亲戚都说你“终于端上了铁饭碗”。', effects: { stats: { happiness: 6, influence: 3, wealth: 3 }, addFlags: ['employed', 'y2126-civil-servant'] } },
          { requires: { statMax: { intelligence: 69 } }, text: '你差了几分，进了面试却没上岸。一年的积蓄也花得差不多了。', effects: { stats: { happiness: -5, wealth: -3, intelligence: 2 } } },
        ],
      },
      { text: '不考，我想看看外面的世界', outcomes: [{ text: '你祝朋友上岸，自己继续往前走。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y2126-life-lying-flat',
    category: 'life',
    requires: { minAge: 23, maxAge: 28, minYear: 2021 },
    title: '躺平还是内卷',
    text: '网上吵得很凶：一边说“躺平”，一边说“不卷就会被淘汰”。你看着通讯录里那些朋友，有人卷成了总监，有人辞职去了大理。',
    choices: [
      { text: '卷！趁年轻多攒钱', outcomes: [{ text: '你报了三个课程、接了两个副业，每天睡五个小时。账户在涨，你的头发在掉。', effects: { stats: { wealth: 6, intelligence: 2, health: -4, happiness: -3 } } }] },
      { text: '躺！人生又不是只有赚钱', outcomes: [{ text: '你开始周末去爬山、学做饭、养花。日子慢了下来，你也舒展开了。', effects: { stats: { happiness: 6, health: 3 } } }] },
      { text: '“45 度人生”：卷不动，也躺不平', outcomes: [{ text: '你在两种生活之间反复横跳，最后发现，大多数人都是这样。', effects: { stats: { happiness: 1, charm: 1 } } }] },
    ],
  },
  {
    id: 'y2126-life-class-reunion',
    category: 'life',
    requires: { minAge: 24, maxAge: 28, minYear: 2022 },
    title: '十年同学会',
    text: '高中毕业快十年了，班长组织了一场同学会。有人开着豪车来，有人刚刚失业，有人已经抱着孩子。大家都在悄悄地打量彼此。',
    choices: [
      {
        text: '低调地坐在角落，听大家聊',
        outcomes: [
          { requires: { statMin: { wealth: 500 } }, text: '你什么都没说，最后悄悄把整桌的账结了。第二天，班级群里炸了锅。', effects: { stats: { fame: 3, charm: 3, wealth: -1, happiness: 4 } } },
          { requires: { statMax: { wealth: 499 } }, text: '你吃得很开心，听了一晚上的八卦，发现每个人都有自己的难处。', effects: { stats: { happiness: 3 } } },
        ],
      },
      { text: '主动去找当年那个人说说话', outcomes: [{ text: '你们聊起了当年的事，都笑了。原来那些小心翼翼的心事，对方也都记得。', effects: { stats: { happiness: 5, charm: 1 } } }] },
    ],
  },
  {
    id: 'y2126-life-side-hustle',
    category: 'career',
    requires: { minAge: 23, maxAge: 28, minYear: 2021 },
    title: '副业刚需',
    text: '“工资只够活着，副业才能生活。”你的社交软件首页全是“副业月入过万”的帖子。',
    choices: [
      {
        text: '接写代码的外包',
        requires: { flags: ['skill-coding'] },
        outcomes: [{ text: '你每周接一两个小单子，副业收入渐渐赶上了主业的一半。', effects: { stats: { wealth: 8, intelligence: 1, health: -1 } } }],
      },
      {
        text: '做知识博主，分享你的“投资心得”',
        outcomes: [
          { requires: { statMin: { charm: 80 } }, text: '你讲得通俗又好笑，粉丝涨得飞快。品牌方开始找你接广告。', effects: { stats: { fame: 5, wealth: 6, charm: 1 } } },
          { requires: { statMax: { charm: 79 } }, text: '你发了二十期，粉丝两百个。有人留言：“讲得挺对，就是太干了。”', effects: { stats: { intelligence: 1, happiness: -1 } } },
        ],
      },
      { text: '交了几千块学费，跟着“导师”学做副业', outcomes: [{ text: '所谓的“导师”唯一的副业，就是收你们的学费。', effects: { stats: { wealth: -0.5, happiness: -3, intelligence: 1 } } }] },
    ],
  },
  {
    id: 'y2126-family-parents-checkup',
    category: 'family',
    requires: { minAge: 25, maxAge: 28, minYear: 2023 },
    title: '爸妈的体检单',
    text: '妈妈把体检单拍照发给你，说“没什么大事”。你放大看了看，有几项指标后面跟着箭头。',
    choices: [
      { text: '请假回家，陪他们去复查', outcomes: [{ text: '查出来是早期的小问题，及时处理了。回城的高铁上，你给自己定了个规矩：每年都要回来陪他们体检。', effects: { stats: { happiness: 3, wealth: -1 }, addFlags: ['parents-trust'] } }] },
      { text: '打钱回去，让他们自己去看', outcomes:[{ text: '爸妈说“没事没事”，钱也没舍得花。你心里一直挂着这件事。', effects: { stats: { happiness: -3, wealth: -0.5 } } }] },
    ],
  },
  {
    id: 'y2126-life-wedding',
    category: 'life',
    requires: { minAge: 24, maxAge: 28, minYear: 2021, flags: ['partner'], notFlags: ['married'] },
    title: '见家长',
    text: '交往了一段时间，你们决定见家长。饭桌上，双方父母从“彩礼”“房子”“婚礼办在哪”一路聊到了“孩子跟谁姓”。',
    choices: [
      {
        text: '你们俩站出来，说好一切从简',
        outcomes: [
          { weight: 3, text: '两家人最后都笑了。你们办了一场小小的婚礼，只请了最亲近的人。', effects: { stats: { happiness: 12, wealth: -3 }, addFlags: ['married'], removeFlags: ['partner'] } },
          { weight: 1, text: '双方父母谈崩了，你们也在争吵中渐渐走散。', effects: { stats: { happiness: -10 }, removeFlags: ['partner'] } },
        ],
      },
      {
        text: '风风光光大办一场',
        requires: { statMin: { wealth: 50 } },
        outcomes: [{ text: '婚礼办得很体面，亲戚们都夸。你们累得半死，但看着彼此还是笑了。', effects: { stats: { happiness: 10, wealth: -30, fame: 1 }, addFlags: ['married'], removeFlags: ['partner'] } }],
      },
      { text: '“再等等吧。”', outcomes: [{ text: '你们决定再谈一段时间。对方有点失落，但表示理解。', effects: { stats: { happiness: -2 } } }] },
    ],
  },
  {
    id: 'y2126-life-ai-anxiety',
    category: 'career',
    requires: { minAge: 25, maxAge: 28, minYear: 2023, flags: ['employed'] },
    title: '会被替代吗',
    text: '部门开会，领导宣布要用 AI 工具“提效”，暗示明年会“优化结构”。午饭时，同事们都没什么胃口。',
    choices: [
      {
        text: '主动请缨，负责部门的 AI 转型',
        requires: { flags: ['y2126-ai-early'] },
        outcomes: [{ text: '你早就用顺手了，三个月搭好了一套工作流。你从“可能被优化的人”变成了“负责优化的人”。', effects: { stats: { influence: 4, wealth: 10, fame: 2 } } }],
      },
      { text: '下班后报个课，学着用 AI', outcomes: [{ text: '你学得不算快，但总算跟上了。年底的优化名单里没有你。', effects: { stats: { intelligence: 3, happiness: -1 } } }] },
      { text: '“等它真来了再说。”', outcomes: [
        { weight: 1, text: '它真来了。你的岗位被合并，拿着补偿离开了公司。', effects: { stats: { wealth: 3, happiness: -6 }, removeFlags: ['employed'] } },
        { weight: 1, text: '这一年风平浪静，你松了口气。', effects: { stats: { happiness: 1 } } },
      ] },
    ],
  },
  {
    id: 'y2126-life-friend-startup',
    category: 'career',
    requires: { minAge: 24, maxAge: 28, minYear: 2021, flags: ['best-friend'] },
    title: '挚友的创业',
    text: '你最好的朋友辞职创业，做的是一个你“记忆里没见过”的项目。对方找到你：“能不能投一点？哪怕只是表个态。”',
    choices: [
      {
        text: '投！我信你，不信记忆',
        requires: { statMin: { wealth: 20 } },
        outcomes: [
          { weight: 1, text: '项目慢慢做起来了。几年后，在公司的发布会上，对方第一个感谢的人就是你。', effects: { stats: { wealth: 30, influence: 3, happiness: 6 } } },
          { weight: 2, text: '项目最后还是失败了，钱打了水漂。但对方说：“谢谢你在我最难的时候信我。”', effects: { stats: { wealth: -15, happiness: 2 } } },
        ],
      },
      { text: '不投钱，但帮他拉资源、改方案', outcomes: [{ text: '你陪他熬了好几个通宵。不管结果如何，这份情谊更深了。', effects: { stats: { charm: 2, influence: 2, happiness: 3 } } }] },
    ],
  },
  {
    id: 'y2126-life-mortgage',
    category: 'finance',
    requires: { minAge: 24, maxAge: 28, minYear: 2022, flags: ['own-house'] },
    title: '房贷',
    text: '房价在跌，房贷还在。每个月发工资那天，钱在卡里停留不到一个小时，就被银行划走了一大半。',
    choices: [
      { text: '咬牙提前还一部分', requires: { statMin: { wealth: 30 } }, outcomes: [{ text: '你提前还了一笔，月供少了，心里也轻松了。', effects: { stats: { wealth: -20, happiness: 5 } } }] },
      { text: '想开点，房子是用来住的', outcomes: [{ text: '你把房子收拾得很温馨。至少，下班回家有一盏属于自己的灯。', effects: { stats: { happiness: 3 } } }] },
    ],
  },
  {
    id: 'y2126-life-new-parent',
    category: 'family',
    requires: { minAge: 24, maxAge: 28, minYear: 2021, flags: ['has-child'] },
    title: '新手爸妈',
    text: '孩子半夜哭醒第三次，你迷迷糊糊地抱起来哄。手机上，育儿群里在讨论“要不要报早教班”“几岁开始学英语”。',
    choices: [
      { text: '报！不能输在起跑线上', outcomes: [{ text: '你报了一堆课，钱包瘪了，孩子在早教班里玩得挺开心——虽然你也说不清学到了什么。', effects: { stats: { wealth: -5, happiness: 1 } } }] },
      { text: '不报，多陪陪孩子就好', outcomes: [{ text: '你每天下班陪孩子搭积木、讲故事。你上一世没有体会过的东西，这一世补上了。', effects: { stats: { happiness: 7, health: -1 } } }] },
    ],
  },
  {
    id: 'y2126-life-family-business',
    category: 'career',
    rarity: 'rare',
    requires: { minAge: 23, maxAge: 28, minYear: 2021, flags: ['rich-family'], notFlags: ['has-business'] },
    title: '接班',
    text: '爸爸把你叫进书房，推过来一份文件：“家里的生意，你想不想接？”',
    choices: [
      { text: '接，用我知道的“未来”改造它', usesMemory: true, outcomes: [
        { tag: 'success', text: '你砍掉了几个注定要衰落的业务，押中了两个新方向。三年后，公司的规模翻了一倍。', effects: { stats: { wealth: 2000, influence: 8, fame: 5 }, addFlags: ['has-business'] } },
        { tag: 'misremember', text: '你押错了方向，老员工们怨声载道，爸爸只好重新出山收拾局面。', effects: { stats: { wealth: -500, happiness: -6, influence: -2 } } },
      ] },
      { text: '不接，我想走自己的路', outcomes: [{ text: '爸爸沉默了很久，最后说：“那你就去吧，家里永远是你的后路。”', effects: { stats: { happiness: 4, charm: 1 } } }] },
    ],
  },
  {
    id: 'y2126-life-marathon',
    category: 'life',
    requires: { minAge: 23, maxAge: 28, minYear: 2021, flags: ['fit'] },
    title: '第一个全马',
    text: '城市马拉松开始报名，你中签了。四十二公里，你从来没跑过这么远。',
    choices: [
      { text: '认真训练三个月，冲刺完赛', outcomes: [
        { weight: 3, text: '跑到三十五公里时你差点放弃，但最后还是冲过了终点线。挂上奖牌的那一刻，你哭了。', effects: { stats: { health: 5, happiness: 8, charm: 1 } } },
        { weight: 1, text: '你在三十公里处抽筋退赛了。没关系，明年再来。', effects: { stats: { health: 2, happiness: -2 } } },
      ] },
      { text: '报个半马，量力而行', outcomes: [{ text: '你轻松跑完了半程，在终点吃了一根香蕉，觉得人生很美好。', effects: { stats: { health: 3, happiness: 4 } } }] },
    ],
  },
]
