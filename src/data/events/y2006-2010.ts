import type { GameEvent } from '../../types'

/**
 * 2006–2010（主角 8–12 岁）：父母代理参与现实事件。
 *
 * 本文件读取的标记：
 * - parents-trust / family-has-money：父母代理资格（见 early-years.ts）
 * - family-stock-2005：2005 年在底部入市（来自 early-years.ts）
 *
 * 本文件写入的标记：
 * - y0610-in-bull：2006 年家里在牛市里持仓
 * - y0610-exited-peak：2007 年高点前离场（后续：y0610-life-dad-recoup）
 * - y0610-trapped-2007：2007/2008 年被套（后续：y0610-life-dad-trapped）
 * - y0610-bought-bottom：2008 年底部抄底
 * - y0610-house-2009：2009 年家里买了房
 *
 * 改写锚点（Effects.alter）：y0610-2007-bull-peak / y0610-2008-crisis / y0610-2009-housing。
 * 引擎每年只在年初挑一次固定年份事件，所以“改写版”事件放在被改写的下一年触发。
 */
export const y2006to2010Events: GameEvent[] = [
  // ───────────── 现实锚点：2006 ─────────────
  {
    id: 'y0610-2006-bull-start',
    category: 'finance',
    rarity: 'rare',
    year: 2006,
    requires: { minAge: 8 },
    title: '股市红了',
    text: '2006 年，股市像被点着了一样，一路往上冲。爸爸单位里重新有人聊股票，菜市场的大妈也在问“买哪只”。你知道，这只是一场大牛市的开头。',
    realFact: '上证综指 2006 年从约 1160 点涨到约 2680 点，全年涨幅超过一倍，是 2005 年底部之后大牛市的第一年；股权分置改革同期推进。依据：上海证券交易所指数历史数据。',
    choices: [
      {
        text: '拉着爸妈说：“买了就别动，一直拿到明年。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈拿出一小笔钱建了仓，账户一个月比一个月红。爸爸开始管你叫“小军师”。', effects: { stats: { wealth: 4, influence: 2 }, addFlags: ['y0610-in-bull'] } },
          { tag: 'misremember', text: '你把牛市开始的月份记错了，爸妈买进去先被洗了一轮，吓得差点清仓。', effects: { stats: { wealth: -2, happiness: -2 } } },
        ],
      },
      {
        text: '撺掇爸爸把生意上的闲钱分一大块进场',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸半信半疑地加了仓。年底一算，赚的钱够换一辆新车，饭局上人人都想听他“选股心得”。', effects: { stats: { wealth: 25, influence: 3 }, addFlags: ['y0610-in-bull'] } },
          { tag: 'misremember', text: '你把板块记串了，爸爸买的几只票涨得比别人慢一大截，他怀疑你只是“碰巧说中过”。', effects: { stats: { wealth: -8, happiness: -3 } } },
        ],
      },
      {
        text: '对爸妈说：“前年买的别卖，还没到时候。”',
        requires: { flags: ['family-stock-2005'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈第一次忍住了没卖，看着账户一路飘红。妈妈说：“你小时候说的‘忘了它’，原来是这个意思。”', effects: { stats: { wealth: 12, influence: 3, happiness: 3 }, addFlags: ['y0610-in-bull'] } },
          { tag: 'misremember', text: '你话说得太含糊，爸妈涨了一点就落袋为安，后面的大涨一分钱也没吃到。', effects: { stats: { wealth: 2, happiness: -4 } } },
        ],
      },
      { text: '趴在茶几上写作业，听大人们聊股票', outcomes: [{ text: '你把“K线”“涨停”两个词记进了作文里，被老师批了个“少儿不宜”。', effects: { stats: { intelligence: 1, happiness: 1 } } }] },
    ],
  },
  {
    id: 'y0610-2006-worldcup',
    category: 'finance',
    rarity: 'rare',
    year: 2006,
    requires: { minAge: 8 },
    title: '德国世界杯',
    text: '夏天，德国世界杯。爸爸和叔叔们每晚围着电视喝啤酒，决赛前夜，大家又在赌谁能夺冠。你记得，那场决赛一直踢到了点球。',
    realFact: '2006 年德国世界杯决赛于 7 月 9 日在柏林举行，意大利与法国 1:1 战平，点球大战 5:3 取胜，夺得队史第四次世界杯冠军。依据：国际足联官方赛果记录。',
    choices: [
      {
        text: '小声说：“意大利，点球赢。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸押了意大利。点球大战的每一脚他都攥着拳头，最后赢了叔叔们一顿烧烤。', effects: { stats: { wealth: 0.3, influence: 2, happiness: 4 } } },
          { tag: 'misremember', text: '你把这一届和下一届的决赛记混了，爸爸押错了队，请客的变成了他。', effects: { stats: { wealth: -0.3, happiness: -2 } } },
        ],
      },
      {
        text: '让爸爸在生意伙伴的赌局里坐庄，专收“看好别家”的注',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '一圈人押的热门全没夺冠，意大利点球捧杯。爸爸收钱收到手软，从此多了个“球神”的外号。', effects: { stats: { wealth: 12, influence: 3 } } },
          { tag: 'misremember', text: '你记岔了决赛的对阵，爸爸庄家当得一塌糊涂，赔了一笔不小的钱。', effects: { stats: { wealth: -6, happiness: -3 } } },
        ],
      },
      { text: '陪爸爸看球，困了就睡', outcomes: [{ text: '你在沙发上睡着了，醒来只听见大人们在吵“那一下是不是犯规”。', effects: { stats: { happiness: 2 } } }] },
    ],
  },

  // ───────────── 现实锚点：2007 ─────────────
  {
    id: 'y0610-2007-bull-peak',
    category: 'finance',
    rarity: 'rare',
    year: 2007,
    requires: { minAge: 9, notAltered: ['y0610-2007-bull-peak'] },
    title: '六千点',
    text: '2007 年秋天，股市冲上了六千点，连楼下修自行车的大爷都在炒股。爸妈把房子抵押了一部分，准备“再加一把”。你知道，这里就是山顶，山下是整整一年的雪崩。',
    realFact: '上证综指于 2007 年 10 月 16 日创下约 6124 点的历史高点，随后大幅下跌，2008 年 10 月最低跌至约 1664 点，最大跌幅约七成。依据：上海证券交易所指数历史数据。',
    choices: [
      {
        text: '一本正经地说：“十月以前，全卖了。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈被你的严肃劲儿吓住，国庆前把仓位清得干干净净。后来同事们一个个哀嚎，爸爸只是笑而不语。', effects: { stats: { wealth: 6, influence: 3 }, addFlags: ['y0610-exited-peak'] } },
          { tag: 'misremember', text: '你把见顶的月份记晚了一个季度，爸妈照你说的“再拿一阵”，结果全家的账户在半山腰被套牢。', effects: { stats: { wealth: -8, happiness: -5 }, addFlags: ['y0610-trapped-2007'] } },
        ],
      },
      {
        text: '拦住爸爸：“别抵押房子，马上清仓。”',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸脸色变了几变，最后还是撤了。后来圈子里亏掉半副身家的人不在少数，他在饭局上一句话也没多说。', effects: { stats: { wealth: 35, influence: 3 }, addFlags: ['y0610-exited-peak'] } },
          { tag: 'misremember', text: '你喊早了半个月，爸爸卖完眼看着又涨了一截，忍不住追回去，正好追在最高点。', effects: { stats: { wealth: -30, happiness: -6 }, addFlags: ['y0610-trapped-2007'] } },
        ],
      },
      {
        text: '拉着爸爸的投资小圈子一起撤退：“信我，别再加了。”',
        requires: { flags: ['family-has-money'], statMin: { influence: 25 } },
        outcomes: [
          { text: '你在饭桌上把话说得又准又狠，一桌老板居然真的听进去了，当月整体减仓。你成了圈子里公认的“小神仙”，只是有人开始琢磨你是不是知道什么内幕。', effects: { stats: { wealth: 20, influence: 3, fame: 3 }, alter: [{ id: 'y0610-2007-bull-peak', scale: 3 }], addFlags: ['y0610-exited-peak'] } },
        ],
      },
      {
        text: '把心思放在作业上，大人的事让大人决定',
        outcomes: [
          { weight: 2, text: '爸妈商量了几个晚上，只把一小部分钱放了进去，后来也没怎么提这事。', effects: { stats: { wealth: -1 } } },
          { weight: 1, text: '爸妈咬牙又加了仓，那一晚爸爸的烟灰缸堆得老高。', effects: { stats: { wealth: -6, happiness: -3 }, addFlags: ['y0610-trapped-2007'] } },
        ],
      },
    ],
  },
  {
    id: 'y0610-2007-touchphone',
    category: 'world',
    year: 2007,
    requires: { minAge: 9 },
    title: '一块全是屏幕的手机',
    text: '爸爸的朋友从国外回来，掏出一块没有按键、全是屏幕的手机——平果公司刚出的爱疯。满屋大人都围着它划来划去，惊叹声此起彼伏。你手里还攥着诺鸡亚的按键机在玩贪吃蛇，心里清楚，这块屏幕要改变一个时代。',
    realFact: '2007 年 1 月某美国科技公司发布第一代触屏智能手机，6 月在美国开售；当时国内没有官方销售渠道，主要通过水货等渠道流入。依据：该公司当年发布会与通行科技史料。',
    choices: [
      {
        text: '缠着爸爸托朋友也给家里带一台',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸托人搞到了一台。你们家成了小区里第一个有触屏手机的，邻居孩子排着队来摸一下屏幕。', effects: { stats: { wealth: -1.5, fame: 3, happiness: 5 } } },
          { tag: 'misremember', text: '你记错了该找哪个渠道，爸爸买回来的是一台外壳一模一样的“山寨触屏”，用了三天就死机。', effects: { stats: { wealth: -0.8, happiness: -3 } } },
        ],
      },
      {
        text: '告诉爸爸：“以后手机都是这样的，别给我买按键机了。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸笑你小孩子异想天开，却也把给你换新手机的计划往后推了一年。后来他自己先换了触屏机，嘴上还不承认是听了你的。', effects: { stats: { wealth: 0.3, influence: 2 } } },
          { tag: 'misremember', text: '你把触屏机普及的年份说早了，爸爸等了又等，才发现还得再等好几年。', effects: { stats: { happiness: -2 } } },
        ],
      },
      { text: '继续在按键机上玩贪吃蛇', outcomes: [{ text: '你破了自己的纪录，也算是给这个时代的按键手机送了一程。', effects: { stats: { happiness: 3 } } }] },
    ],
  },

  // ───────────── 现实锚点：2008 ─────────────
  {
    id: 'y0610-2008-crisis',
    category: 'finance',
    rarity: 'rare',
    year: 2008,
    requires: { minAge: 10, notAltered: ['y0610-2008-crisis'] },
    title: '雷蔓兄弟倒了',
    text: '电视里反复播着一条新闻：美国的雷蔓兄弟申请破产，全球股市一起跳水。国内的股市也从去年的山顶滑了一整年，爸爸每天对着绿色的账户发呆。你知道，最冷的那几天就快到了，之后还有一轮回暖。',
    realFact: '2008 年 9 月 15 日，某大型美国投资银行申请破产保护，同期另一大投行被收购、一家保险巨头获政府救助，全球金融危机全面爆发，各国股市大幅下跌；上证综指 2008 年全年下跌六成多，10 月 28 日前后触及约 1664 点的低点。依据：通行财经史料与上海证券交易所指数历史数据。',
    choices: [
      {
        text: '对爸妈说：“十月底最低，别割肉，也别急着买。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈忍到了十月底才出手，抄在了地板价上。别人还在恐慌，你家的账户已经悄悄回了血。', effects: { stats: { wealth: 4, influence: 3 }, addFlags: ['y0610-bought-bottom'] } },
          { tag: 'misremember', text: '你把最低点记成了夏天，爸妈抄早了，之后又被腰斩了一次。他们没说什么，只是不再追问“后面怎么走”。', effects: { stats: { wealth: -3, happiness: -4 } } },
        ],
      },
      {
        text: '让爸爸把周转的现金全部压到十月底再入场',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸踩着最低点重仓买入。别人割肉的时候，他在饭局上反常地沉默，只是偶尔笑一下。', effects: { stats: { wealth: 30, influence: 3 }, addFlags: ['y0610-bought-bottom'] } },
          { tag: 'misremember', text: '你记错了月份，爸爸抄底抄在了半山腰，眼睁睁看着又跌了三成。', effects: { stats: { wealth: -20, happiness: -5 }, addFlags: ['y0610-trapped-2007'] } },
        ],
      },
      {
        text: '拉着爸爸牵线的境外朋友，把话递到那家投行的董事会',
        requires: { flags: ['family-has-money'], statMin: { influence: 50 } },
        outcomes: [
          { text: '你的话经层层转手，居然真让那家投行拿到了一笔救命钱。倒闭的日子被往后拖了一年，你也为此搭进去不少家底。', effects: { stats: { wealth: -10, influence: 4, fame: 3 }, alter: [{ id: 'y0610-2008-crisis', scale: 10 }], world: { economy: 5 } } },
        ],
      },
      {
        text: '陪爸爸看新闻，帮他倒杯热水',
        outcomes: [{ text: '爸爸叹了口气：“这世道。”你递过去的水杯，他双手捧了很久。', effects: { stats: { charm: 1, happiness: -1 } } }],
      },
    ],
  },
  {
    id: 'y0610-2008-olympics',
    category: 'world',
    rarity: 'rare',
    year: 2008,
    requires: { minAge: 10 },
    title: '北京奥运会',
    text: '八月八号晚上八点，全国人民守在电视机前看开幕式。爸爸单位组织了金牌榜竞猜：中国能拿多少块金牌？美国是不是第一？你记得，这届奥运会，中国是榜首。',
    realFact: '2008 年北京奥运会于 8 月 8 日开幕、24 日闭幕，中国代表团获得 51 枚金牌，位列金牌榜第一，是中国首次登顶奥运金牌榜。依据：国际奥委会官方奖牌榜。',
    choices: [
      {
        text: '大声说：“中国第一！金牌过五十！”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸照着填了竞猜单，全单位只有他猜中了第一。奖品是一台电饭煲，他乐得像拿了金牌。', effects: { stats: { wealth: 0.1, influence: 2, happiness: 5 } } },
          { tag: 'misremember', text: '你把四年后伦敦的金牌数当成了这一届，爸爸填的数字差得离谱，被同事笑了好几天。', effects: { stats: { happiness: -2 } } },
        ],
      },
      {
        text: '劝爸爸在开幕前囤一批奥运纪念品和旗帜',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '纪念品在奥运期间被抢购一空，爸爸转手赚了一笔，还有人专程来问“下一批什么时候到”。', effects: { stats: { wealth: 8, influence: 2 } } },
          { tag: 'misremember', text: '你记错了热销的品类，库房里堆满了没人要的小国旗，亲戚朋友被硬塞了一人一面。', effects: { stats: { wealth: -3, happiness: -2 } } },
        ],
      },
      { text: '跟着全家挤在电视前看开幕式', outcomes: [{ text: '焰火打到天上的那一刻，整栋楼的窗户都亮着。你忽然觉得，这个夏天值得记很久。', effects: { stats: { happiness: 5 } } }] },
    ],
  },
  {
    id: 'y0610-2008-quake',
    category: 'world',
    year: 2008,
    requires: { minAge: 10 },
    title: '五月十二日',
    text: '五月十二日下午，电视里滚动播出着四川汶川发生特大地震的消息。往后一周，全国默哀，学校组织捐款，你把存钱罐里攒了很久的零钱，一枚不剩地放进了捐款箱。',
    realFact: '2008 年 5 月 12 日 14 时 28 分，四川汶川发生 8.0 级地震，造成重大人员伤亡；国务院宣布 5 月 19 日至 21 日为全国哀悼日。依据：国务院公告与通行新闻报道。',
    effects: { stats: { happiness: -3, charm: 2, wealth: -0.005 } },
  },
  {
    id: 'y0610-2008-bull-peak-altered',
    category: 'finance',
    year: 2008,
    requires: { minAge: 10, altered: ['y0610-2007-bull-peak'] },
    title: '圈内的“小神仙”',
    text: '去年你让爸爸的圈子提前撤了仓，如今他们个个躲过一劫，逢人就提起你。有人提着礼盒上门，想听听“下一步怎么走”；也有人背后嘀咕，这孩子是不是有什么门路。',
    realFact: '本事件为玩家改写世界线后的分支，非真实历史；真实历史见 y0610-2007-bull-peak：2007 年 10 月上证综指见顶后大幅下跌。依据：上海证券交易所指数历史数据。',
    choices: [
      { text: '笑着摆手：“就是运气好。”', outcomes: [{ text: '你把礼盒原样推了回去，爸爸看你的眼神里多了几分欣赏，也多了几分警惕。', effects: { stats: { charm: 2, influence: 1 } } }] },
      {
        text: '收下人情，给几位叔叔指一指“明年的方向”',
        outcomes: [
          { weight: 1, text: '他们照着做了，赚了点小钱，还在饭局上帮你爸挣足了面子。', effects: { stats: { wealth: 6, influence: 2, fame: 2 } } },
          { weight: 1, text: '你说得太满，有位叔叔亏了钱，转头就在背后说你爸“教子无方”。', effects: { stats: { wealth: -2, charm: -3, happiness: -3 } } },
        ],
      },
    ],
  },

  // ───────────── 现实锚点：2009 ─────────────
  {
    id: 'y0610-2009-housing',
    dependsOn: ['y0610-2008-crisis'],
    category: 'finance',
    rarity: 'rare',
    year: 2009,
    requires: { minAge: 11, notAltered: ['y0610-2009-housing'] },
    title: '售楼处排起了队',
    text: '2009 年，路过售楼处的时候你发现门口竟然排起了队，有人通宵守着等开盘。爸爸感叹：“去年还没人要，今年就抢疯了。”你知道，这一轮房价才刚刚热起来。',
    realFact: '2008 年底以后信贷明显放松，2009 年全国多数城市商品房成交与价格较快回升；2009 年底起中央开始强调遏制房价过快上涨。涨幅因城市差异很大，本事件不写具体数字。依据：国务院与住建部当年政策文件、通行财经史料。',
    choices: [
      {
        text: '拽着爸妈的手：“今年一定要把房子买下来。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈咬牙凑了首付，在涨起来之前拿下一套。月供压得全家紧巴巴，但你知道这笔账很值。', effects: { stats: { wealth: 3, happiness: -2, influence: 2 }, addFlags: ['y0610-house-2009'] } },
          { tag: 'misremember', text: '你把热点城区记反了，爸妈买下的这一片，往后很多年都冷冷清清。', effects: { stats: { wealth: -5, happiness: -3 } } },
        ],
      },
      {
        text: '撺掇爸爸用生意的钱，一口气拿下两套',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸笑你“人小鬼大”，还是一口气买了两套。没过多久，邻居们看他的眼神都变了。', effects: { stats: { wealth: 18, influence: 3 }, addFlags: ['y0610-house-2009'] } },
          { tag: 'misremember', text: '你把楼盘和邻市的一个烂尾项目弄混了，爸爸交了定金才发现手续不全，钱追了好几个月。', effects: { stats: { wealth: -12, happiness: -5 } } },
        ],
      },
      {
        text: '联合爸爸的业主圈，出面接盘一个快要烂尾的楼盘',
        requires: { flags: ['family-has-money'], statMin: { influence: 30 } },
        outcomes: [
          { text: '你拉着爸爸的朋友们凑了一笔钱，把差点烂尾的楼盘接了下来，整片小区因此被救活。买房人对你爸千恩万谢，你家也垫进去不少。', effects: { stats: { wealth: -6, influence: 3, fame: 2 }, alter: [{ id: 'y0610-2009-housing', scale: 2 }], addFlags: ['y0610-house-2009'] } },
        ],
      },
      { text: '从售楼处顺走一个气球就跑', outcomes: [{ text: '售楼小姐笑着又给了你一个。你抱着两个气球回家，爸爸还在叹气。', effects: { stats: { happiness: 3 } } }] },
    ],
  },

  // ───────────── 现实锚点：2010 ─────────────
  {
    id: 'y0610-2009-crisis-delayed',
    category: 'finance',
    year: 2009,
    requires: { minAge: 11, altered: ['y0610-2008-crisis'] },
    title: '晚了一年的雷',
    text: '你去年想办法让雷蔓兄弟多撑了一年，可新闻里的气氛并没有好转：这颗雷只是被推迟了，眼看就要在今年炸开。爸爸新认识的境外朋友对你格外客气，每次吃饭都想多问你两句。',
    realFact: '本事件为玩家改写世界线后的分支，非真实历史；真实历史见 y0610-2008-crisis：2008 年 9 月某大型美国投行破产。依据：通行财经史料。',
    choices: [
      { text: '只埋头吃饭，不多说话', outcomes: [{ text: '大人们话里话外都在试探，你却一句有用的都没漏。爸爸事后说：“你比我沉得住气。”', effects: { stats: { charm: 2, influence: 1 } } }] },
      {
        text: '索性把话说透：“它一定会倒，早做准备。”',
        outcomes: [
          { weight: 1, text: '有人听进去了，提前做了对冲，事后专程来感谢你。', effects: { stats: { wealth: 10, influence: 4, fame: 2 } } },
          { weight: 1, text: '没人当真，反而有人觉得你在制造恐慌，爸爸被叫去“喝茶”解释了一整个下午。', effects: { stats: { influence: -2, happiness: -3 } } },
        ],
      },
    ],
  },
  {
    id: 'y0610-2010-expo',
    category: 'world',
    rarity: 'rare',
    year: 2010,
    requires: { minAge: 12 },
    title: '上海世博会',
    text: '2010 年，上海世博会开幕，同学们的暑假作业里多了一项“参观世博园”。听说每天都有几万人排队，有的场馆要排四五个小时。你记得，这届世博会参观人数多得吓人。',
    realFact: '2010 年上海世博会于 5 月 1 日开幕、10 月 31 日闭幕，主题为“城市，让生活更美好”，累计参观人数超过七千万；开园初期客流偏少，暑期和十月是高峰，10 月 16 日单日参观人数超过 100 万，创下单日纪录。依据：上海世博会官方统计与通行新闻报道。',
    choices: [
      {
        text: '劝爸妈：“别挑暑假和十月，五月刚开园的时候人最少。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '一家人赶在五月开园不久就去了，不到半小时就进了几个热门场馆。同学们暑假排了五个小时队，听了直羡慕。', effects: { stats: { happiness: 6, influence: 2, intelligence: 1 } } },
          { tag: 'misremember', text: '你把开园和闭幕前的人潮记反了，全家拖到十月才去，正赶上单日上百万人的高峰，什么展馆也没进去。', effects: { stats: { happiness: -4, health: -2 } } },
        ],
      },
      {
        text: '让爸爸在园区外开个摊，卖“世博同款”小纪念品',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '纪念品被一抢而空，爸爸大赚一笔，还被工商局的人拉去聊了半小时“经营资质”。', effects: { stats: { wealth: 10, influence: 2 } } },
          { tag: 'misremember', text: '你记错了什么是官方特许，爸爸进的货全被当成仿冒品，一件都没卖出去。', effects: { stats: { wealth: -5, happiness: -3 } } },
        ],
      },
      { text: '跟着爷爷奶奶去，顺便排几小时队', outcomes: [{ text: '你在炎热的队伍里排了四个小时，只进了一个馆。但爷爷奶奶笑得合不拢嘴，你也跟着开心。', effects: { stats: { happiness: 4, health: -2, charm: 1 } } }] },
    ],
  },
  {
    id: 'y0610-2010-housing-altered',
    category: 'family',
    year: 2010,
    requires: { minAge: 12, altered: ['y0610-2009-housing'] },
    title: '没烂尾的楼',
    text: '去年你带着爸爸的朋友们接盘的那个楼盘，今年终于交房了。业主们敲锣打鼓，横幅上还写了你爸的名字。路过的人说，这在整个片区都是个新鲜事。',
    realFact: '本事件为玩家改写世界线后的分支，非真实历史；真实历史见 y0610-2009-housing：2009 年多数城市房价回升，2009 年底起中央开始强调遏制房价过快上涨。依据：国务院与住建部当年政策文件。',
    choices: [
      { text: '站在人群后面，看着爸爸被簇拥着合影', outcomes: [{ text: '爸爸回头看见你，冲你用力挥了挥手。那一刻，你觉得这世的功劳簿里，也该有你一笔。', effects: { stats: { happiness: 6, fame: 1 } } }] },
      {
        text: '要几套给自己留着',
        outcomes: [
          { weight: 2, text: '开发商爽快地给了你家团购价。你拿着钥匙，觉得这钱花得值。', effects: { stats: { wealth: 5, influence: 1 } } },
          { weight: 1, text: '有人嚼舌根说你们“拿了内部价”，事情传到街坊耳朵里，爸爸被念叨了好几天。', effects: { stats: { wealth: 3, charm: -2, happiness: -2 } } },
        ],
      },
    ],
  },

  // ───────────── 纯随机生活事件 ─────────────
  {
    id: 'y0610-school-seat-swap',
    category: 'school',
    requires: { minAge: 7, maxAge: 9 },
    weight: 14,
    title: '新同桌',
    text: '开学第一天，老师把你的座位换了。新同桌是班里出了名的“小霸王”，据说上学期有人因为借橡皮没还，被他追着跑了半个操场。他看了你一眼，推过来半条三八线。',
    choices: [
      { text: '主动把橡皮推过去：“借你用。”', outcomes: [{ text: '“小霸王”愣了一下，居然红着脸说了句谢谢。从此你俩成了铁哥们，没人敢欺负你。', effects: { stats: { charm: 3, happiness: 3 } } }] },
      {
        text: '寸步不让，把三八线推回去',
        outcomes: [
          { weight: 1, text: '你的气势震住了他，他讪讪地把手收了回去，之后再没越过那条线。', effects: { stats: { charm: 2, happiness: 2 } } },
          { weight: 1, text: '你们俩吵了一节课，被老师双双罚站，放学后还各自写了检讨。', effects: { stats: { happiness: -3, charm: -1 } } },
        ],
      },
      { text: '找老师申请换座位', outcomes: [{ text: '老师把你换到了好学生旁边。你觉得耳根子清净了，也多了几分孤单。', effects: { stats: { intelligence: 2, happiness: -1 } } }] },
    ],
  },
  {
    id: 'y0610-life-first-allowance',
    category: 'life',
    requires: { minAge: 7, maxAge: 9 },
    weight: 14,
    title: '十块钱的自由',
    text: '妈妈第一次给了你十块钱，让你自己去小卖部买东西，余下的“随便花”。你捏着那张皱巴巴的纸币站在柜台前，看着满墙的零食和玩具，二十八岁的灵魂居然有点手抖。',
    choices: [
      { text: '全买零食，吃到撑', outcomes: [{ text: '你吃得满嘴都是辣条，回家被妈妈念了一晚上。但嘴里的味道，真是久违了。', effects: { stats: { happiness: 6, health: -2 } } }] },
      { text: '买一小包，剩下的攒起来', outcomes: [{ text: '你把剩下的钱藏进铁盒子，一块一块地数了好几遍。这是你这一世的“第一桶金”。', effects: { stats: { wealth: 0.003, intelligence: 1, happiness: 2 } } }] },
      { text: '请同桌吃雪糕', outcomes: [{ text: '同桌感动得不行，以后每天都主动给你分零食。你发现请客真是门划算的投资。', effects: { stats: { charm: 3, happiness: 3, wealth: -0.002 } } }] },
    ],
  },
  {
    id: 'y0610-life-internet-cafe',
    category: 'life',
    rarity: 'rare',
    requires: { minAge: 10, maxAge: 12, minYear: 2006 },
    weight: 12,
    title: '表哥的网吧',
    text: '暑假，表哥偷偷带你去了镇上的网吧。烟雾缭绕的屋子里，几十台机器一起响，键盘敲得噼里啪啦。他压低声音说：“别告诉你爸妈，我请你玩两个小时。”',
    choices: [
      { text: '趴在表哥背后，看他打游戏', outcomes: [{ text: '你看着他从青铜打到白银，居然看出了点门道，还给他提了几条战术建议。表哥大呼“神了”。', effects: { stats: { intelligence: 1, happiness: 4, fame: 1 } } }] },
      {
        text: '抢过鼠标，查点“正经东西”',
        outcomes: [
          { weight: 1, text: '你查了不少资料，还顺手建了个邮箱。表哥看你的眼神像看外星人。', effects: { stats: { intelligence: 3, memory: 2, happiness: 2 } } },
          { weight: 1, text: '正在兴头上，网吧老板被你爸一个电话叫了出去。你被当场拎回家，被爸爸打了屁股。', effects: { stats: { happiness: -4, health: -1 } } },
        ],
      },
      { text: '“我怕被抓，咱们走吧。”', outcomes: [{ text: '表哥嫌你扫兴，但你们俩在路边买了两根冰棍，晃晃悠悠地走回了家。', effects: { stats: { happiness: 2, charm: 1 } } }] },
    ],
  },
  {
    id: 'y0610-life-arcade',
    category: 'life',
    requires: { minAge: 9, maxAge: 12, minYear: 2006 },
    weight: 12,
    title: '游戏厅的硬币',
    text: '放学路上，你发现街角新开了一家街机厅，里面叮叮咚咚地响。一块钱能换三个币，几个高年级的同学正围着一台格斗机叫好。你兜里刚好揣着一块钱。',
    choices: [
      {
        text: '换三个币，上去打一把',
        outcomes: [
          { weight: 1, text: '你凭着二十多年的手感，一路连赢，围观的人群越聚越多。', effects: { stats: { fame: 3, happiness: 5 } } },
          { weight: 2, text: '你被一个高年级学长三招秒杀，灰溜溜地让出了位置。', effects: { stats: { happiness: -2, charm: -1 } } },
        ],
      },
      { text: '站在一旁看高手打', outcomes: [{ text: '你站了一个小时，学会了好几套连招。回家路上，你还在空气里比划。', effects: { stats: { intelligence: 1, happiness: 3 } } }] },
      { text: '把硬币攒起来，放学后卖给同学', outcomes: [{ text: '你零售了几个币，赚了点小钱，被老板发现后赶了出去，但整条街都知道了“那个小孩”。', effects: { stats: { wealth: 0.002, fame: 1, charm: -1 } } }] },
    ],
  },
  {
    id: 'y0610-school-class-monitor',
    category: 'school',
    rarity: 'rare',
    requires: { minAge: 9, maxAge: 12 },
    weight: 12,
    title: '班干部竞选',
    text: '班主任宣布：这学期的班干部要竞选。讲台上，一个个同学在背稿子，说得慷慨激昂。轮到你的时候，你忽然想起，上辈子这位班主任最吃哪一套。',
    choices: [
      {
        text: '用她最爱听的“集体荣誉”做开场白',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '班主任听得连连点头，你高票当选班长。从此你多了一项“管同学”的差事，也多了一份威信。', effects: { stats: { charm: 3, influence: 2, fame: 2 } } },
          { tag: 'misremember', text: '你把班主任和上一任的口味搞混了，说到一半就见她皱眉，最后只拿了个“劳动委员”。', effects: { stats: { happiness: -2, charm: 1 } } },
        ],
      },
      { text: '实话实说：“我想让大家少写点作业。”', outcomes: [{ text: '全班哄堂大笑，班主任黑了脸。你没当上班干部，但整个年级都记住了你。', effects: { stats: { fame: 3, charm: 2, intelligence: -1 } } }] },
      { text: '不参选，坐在台下看热闹', outcomes: [{ text: '你看着同学们为一个“小组长”争得面红耳赤，心里觉得这世界还是很可爱。', effects: { stats: { happiness: 2 } } }] },
    ],
  },
  {
    id: 'y0610-friend-transfer',
    category: 'school',
    requires: { minAge: 10, maxAge: 12 },
    weight: 12,
    title: '最好的朋友要转学了',
    text: '你的同桌——这一世的第一个好朋友——告诉你，他爸爸工作调动，下个月要转去外地的学校。你们俩躲在操场的角落，谁都不知道该说什么。',
    choices: [
      { text: '写下家里的地址和电话，约好以后写信', outcomes: [{ text: '信写了几封，后来渐渐少了。但那张皱巴巴的纸条，你一直留着。', effects: { stats: { charm: 2, happiness: 2 } } }] },
      { text: '陪他在学校里把想去的地方都走一遍', outcomes: [{ text: '你们爬了树，翻了围墙，在小卖部赊了一包辣条。临走那天，他哭得比你还凶。', effects: { stats: { happiness: 5, charm: 3, health: -1 } } }] },
      { text: '装作无所谓，转头就走', outcomes: [{ text: '你背对着他，走了很远才敢回头。教室里那个空位，空了很久。', effects: { stats: { happiness: -5, charm: -1 } } }] },
    ],
  },
  {
    id: 'y0610-family-grandpa-chess',
    category: 'family',
    requires: { minAge: 8, maxAge: 12 },
    weight: 12,
    title: '爷爷的象棋',
    text: '周末去爷爷家，他又摆开了那副磨得发亮的象棋，非要拉着你杀两盘。他一边落子一边念叨：“你小子最近有点不一样，下棋怎么像个大人？”',
    choices: [
      { text: '认认真真跟他杀一盘', outcomes: [{ text: '你们一人一步杀得难解难分，最后你险胜半子。爷爷笑得胡子直抖，说你“是块料”。', effects: { stats: { intelligence: 2, happiness: 5 } } }] },
      { text: '故意输给他，哄他开心', outcomes: [{ text: '爷爷赢了三盘，高兴得连晚饭都多吃了一碗。临走时往你兜里塞了块压岁钱。', effects: { stats: { happiness: 4, charm: 2, wealth: 0.002 } } }] },
      { text: '趁他不注意，偷偷把“车”藏进袖子', outcomes: [{ text: '爷爷找了半天没找着，最后拍着桌子大笑，罚你把他的茶杯倒满。', effects: { stats: { happiness: 3, charm: 1 } } }] },
    ],
  },
  {
    id: 'y0610-life-snack-business',
    category: 'life',
    rarity: 'rare',
    requires: { minAge: 10, maxAge: 12 },
    weight: 10,
    title: '倒腾辣条',
    text: '你发现学校门口小卖部的辣条一包卖五毛，而批发市场里一包只要两毛。你盯着那个差价看了很久，脑子里冒出一个念头：这不就是第一笔生意吗？',
    choices: [
      {
        text: '偷偷批发一箱，带到学校卖',
        outcomes: [
          { weight: 2, text: '你的辣条在同学间卖得飞快，一周下来赚了小一百块，还落了个“辣条大王”的外号。', effects: { stats: { wealth: 0.01, fame: 2, charm: 1 } } },
          { weight: 1, text: '正卖得起劲，被老师抓了个正着，辣条全部没收，你还被叫了家长。', effects: { stats: { wealth: -0.004, happiness: -4, charm: -2 } } },
        ],
      },
      { text: '把想法告诉爸爸，请他当“合伙人”', outcomes: [{ text: '爸爸听完笑了，说“这是合法的，但是别让老师知道”。他给你垫了本钱，也给你上了第一堂生意课。', effects: { stats: { intelligence: 2, influence: 1, wealth: 0.002 } } }] },
      { text: '算了，还是好好当学生', outcomes: [{ text: '你把这个念头压了回去。毕竟上辈子，你的第一桶金也不是靠辣条挣的。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'y0610-life-dad-recoup',
    category: 'family',
    requires: { minAge: 10, maxAge: 12, minYear: 2008, flags: ['y0610-exited-peak'] },
    weight: 25,
    title: '爸爸的“学费”',
    text: '那阵子别人家的爸爸都愁眉苦脸，你家爸爸却哼着歌回家。他买了一台新电脑，说是“给你的学费”，还请全家下了馆子。饭桌上，他举起杯子冲你笑了一下。',
    choices: [
      { text: '谢谢爸爸，认认真真吃完这顿饭', outcomes: [{ text: '你们一家三口吃了很久，爸爸多喝了两杯，絮絮叨叨地说了很多你没听过的往事。', effects: { stats: { happiness: 6, charm: 1 } } }] },
      { text: '“电脑可以用来写作业，也可以用来查股票。”', outcomes: [{ text: '爸爸愣了一下，大笑着说你“鬼灵精”，后来真的教你认了第一只股票代码。', effects: { stats: { intelligence: 2, wealth: 0.5, influence: 1 } } }] },
    ],
  },
  {
    id: 'y0610-life-dad-trapped',
    category: 'family',
    requires: { minAge: 10, maxAge: 12, minYear: 2008, flags: ['y0610-trapped-2007'] },
    weight: 25,
    title: '爸爸又在阳台抽烟',
    text: '家里的气氛很久没轻松过了。爸爸每天晚饭后都蹲在阳台抽烟，一声不吭，妈妈在厨房里把碗洗得叮当响。你知道他们在为那笔被套的钱发愁。',
    choices: [
      { text: '默默走过去，给他递一杯水', outcomes: [{ text: '爸爸愣了愣，掐灭了烟，摸了摸你的头：“没事，爸爸扛得住。”', effects: { stats: { happiness: 2, charm: 2 } } }] },
      {
        text: '悄悄说：“别怕，后面会涨回来的。”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸半信半疑，但这句话像一根稻草。他没有割肉，咬着牙熬了过去，后来果然回了本。', effects: { stats: { happiness: 4, wealth: 2, influence: 1 }, removeFlags: ['y0610-trapped-2007'] } },
          { tag: 'misremember', text: '你把回暖的时间记得太早，爸爸等了几个月，没等到，反而更焦虑了。', effects: { stats: { happiness: -3 } } },
        ],
      },
      { text: '假装没看见，回屋做作业', outcomes: [{ text: '你写了一晚上作业，隔着墙，听见阳台上的咳嗽声断断续续。', effects: { stats: { intelligence: 1, happiness: -2 } } }] },
    ],
  },
]
