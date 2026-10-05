import type { GameEvent } from '../../types'

/**
 * 1998–2005：童年与家庭（主角 0–7 岁）。
 * 现实节点通过“父母代理”参与：事件本身用 minAge 约束，预知选项用 parents-trust / family-has-money 解锁。
 *
 * 本文件写入的标记：
 * - parents-trust：家里丢存折被你找到 / 向妈妈坦白备忘录（解锁本文件所有父母代理选项）
 * - family-stock-trapped：2001 年高点被套（后续：family-dad-stock-trapped、finance-2005-bottom）
 * - family-bought-house / family-two-houses：2003 年买房（后续：family-move-new-house）
 * - weird-kid：被邻里亲戚当成“神童”（后续：absurd-relatives-lottery）
 * - future-notebook：写下“未来备忘录”（后续：family-notebook-found）
 * - family-stock-2005：2005 年在底部入市（留给 2006–2007 牛市批次使用）
 */
export const earlyYearsEvents: GameEvent[] = [
  // ───────────── 现实历史节点（父母代理） ─────────────
  {
    id: 'finance-1998-worldcup',
    category: 'finance',
    year: 1998,
    title: '1998 年世界杯',
    text: '你还裹在襁褓里，爸爸半夜抱着你看世界杯决赛：法国对巴西。工友们打电话来起哄，要赌一条烟。你说不出话，但你知道答案。',
    realFact: '1998 年法国世界杯决赛于 7 月 12 日举行，东道主法国 3:0 战胜巴西，首次夺得世界杯冠军。依据：国际足联官方赛果记录。',
    choices: [
      {
        text: '冲着电视上的蓝色球衣咯咯直笑',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸乐了：“儿子押法国！”还真跟着押了。第二天他拎回一条烟，逢人就夸你有眼光。', effects: { stats: { wealth: 0.02, happiness: 3 } } },
          { tag: 'misremember', text: '你记混了球衣颜色，冲着黄衣服的巴西乱挥手。爸爸押了巴西，输了一条烟。', effects: { stats: { wealth: -0.02 } } },
        ],
      },
      { text: '老老实实睡觉', outcomes: [{ text: '你在爸爸怀里睡得很香，错过了一场 3:0。', effects: { stats: { health: 2 } } }] },
    ],
  },
  {
    id: 'finance-2000-dotcom',
    category: 'finance',
    year: 2000,
    requires: { minAge: 2 },
    title: '“点com”热',
    text: '满大街都在说“上网”。爸爸的老同学来家里吃饭，拍着胸脯说要办网站，拉爸爸入股：“现在不上车，以后就晚了！”你在饭桌底下玩积木，心里清楚接下来会发生什么。',
    realFact: '2000 年 3 月，美国以科技股为主的综合指数在 5000 点上方见顶，随后暴跌，至 2002 年 10 月累计跌去近八成，大批互联网公司倒闭，即“互联网泡沫”破裂；国内同期也有网络概念股炒作和大量网站关停。依据：美股指数历史数据与通行财经史料。',
    choices: [
      {
        text: '抱住爸爸的腿大哭：“不要！不要！”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸被你哭得心软，婉拒了老同学。没过多久那个网站就关了门，入股的人血本无归。爸爸摸着你的头说：“福星。”', effects: { stats: { wealth: 2, influence: 2 } } },
          { tag: 'misremember', text: '你把十年后互联网的辉煌和眼下的泡沫记串了，反而拍手喊“要！”。爸爸投了一笔，很快就打了水漂。', effects: { stats: { wealth: -3, happiness: -3 } } },
        ],
      },
      {
        text: '缠着爸妈把家里跟风买的网络股卖掉',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你天天念叨“卖掉卖掉”，爸妈被念烦了，索性清了仓。后来网络股一路暴跌，他们越想越后怕。', effects: { stats: { wealth: 10, influence: 2 } } },
          { tag: 'misremember', text: '你记错了泡沫破裂的时间，催得太早。爸妈卖完它又涨了一大截，后悔了好一阵。', effects: { stats: { wealth: -2, happiness: -2 } } },
        ],
      },
      {
        text: '继续玩积木，大人的事让大人决定',
        outcomes: [
          { weight: 2, text: '爸爸犹豫了几天，最后还是没投。', effects: {} },
          { weight: 1, text: '爸爸碍于面子投了一小笔，后来再也没听老同学提起那个网站。', effects: { stats: { wealth: -2 } } },
        ],
      },
    ],
  },
  {
    id: 'finance-2001-stock-peak',
    category: 'finance',
    rarity: 'rare',
    year: 2001,
    requires: { minAge: 3 },
    title: '全民炒股的夏天',
    text: '2001 年夏天，股市火得发烫，爸爸单位里人人都在聊股票。爸妈晚上关起门商量，要不要把存款取出来“搏一把”。三岁的你趴在门缝边，记得这里正是山顶。',
    realFact: '上证综指于 2001 年 6 月创下 2245 点的高点，随后进入约四年的熊市，2005 年 6 月跌至 998 点。依据：上海证券交易所指数历史数据。',
    choices: [
      {
        text: '推门进去，一本正经地说：“股市要跌四年。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈被你的严肃吓了一跳，最后真没进场。之后股市一路阴跌，同事们几乎个个被套，只有你家毫发无伤。', effects: { stats: { wealth: 3, influence: 3 } } },
          { tag: 'misremember', text: '你把几年后的大牛市记串了年份，反而催他们“快买”。全家的存款就这样站在了山顶上。', effects: { stats: { wealth: -6, happiness: -5 }, addFlags: ['family-stock-trapped'] } },
        ],
      },
      {
        text: '缠着爸妈把放在股市里的闲钱撤出来',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈拗不过你，半开玩笑地清了仓。几个月后周围的人都在割肉，你家却多出一笔能周转的现金。', effects: { stats: { wealth: 12, influence: 3 } } },
          { tag: 'misremember', text: '你记错了月份，喊得太早。爸妈卖完眼看着又涨了一段，忍不住追了回去，正好追在最高点。', effects: { stats: { wealth: -10, happiness: -5 }, addFlags: ['family-stock-trapped'] } },
        ],
      },
      {
        text: '你才三岁，回去睡觉',
        outcomes: [
          { weight: 2, text: '爸妈商量到半夜，最后还是觉得存银行踏实。', effects: {} },
          { weight: 1, text: '第二天，爸妈把一部分存款搬进了股市。你看着他们兴奋的脸，没敢吭声。', effects: { stats: { wealth: -4, happiness: -2 }, addFlags: ['family-stock-trapped'] } },
        ],
      },
    ],
  },
  {
    id: 'world-2001-football-qualify',
    category: 'world',
    year: 2001,
    requires: { minAge: 3 },
    title: '国足出线之夜',
    text: '秋天，全家挤在电视机前看十强赛。爸爸和楼下邻居打了赌：国足这回到底能不能打进世界杯？你记得，这一次他们真的做到了。',
    realFact: '2001 年 10 月 7 日，中国男足在沈阳五里河体育场 1:0 战胜阿曼，提前锁定 2002 年世界杯参赛资格，这是中国男足首次打进世界杯决赛圈。依据：通行体育史料与当年新闻报道。',
    choices: [
      {
        text: '拍着小板凳喊：“能！一比零！”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '国足真的 1:0 赢了。爸爸赢了邻居一顿酒，抱着你在楼道里转圈。', effects: { stats: { wealth: 0.02, happiness: 6, influence: 1 } } },
          { tag: 'misremember', text: '你把这一届和后来几届的失利记混了，喊了句“不能”。爸爸押了反方，输了一顿酒，还被邻居笑了半年。', effects: { stats: { wealth: -0.02, happiness: -2 } } },
        ],
      },
      { text: '跟着大人一起喊“国足加油”', outcomes: [{ text: '终场哨响，整栋楼都在欢呼。你忽然觉得，这个年代热闹得让人想哭。', effects: { stats: { happiness: 5 } } }] },
    ],
  },
  {
    id: 'finance-2002-worldcup',
    category: 'finance',
    rarity: 'rare',
    year: 2002,
    requires: { minAge: 4 },
    title: '2002 年世界杯',
    text: '韩日世界杯开幕，国足第一次站上世界杯的舞台。爸爸单位搞了个竞猜：国足能进几个球？冠军是谁？爸爸拿着竞猜单，回头看了你一眼。',
    realFact: '2002 年韩日世界杯，巴西在决赛中 2:0 战胜德国夺冠；中国队首次参赛，小组赛 0:2 负哥斯达黎加、0:4 负巴西、0:3 负土耳其，三战全负未进一球。依据：国际足联官方赛果记录。',
    choices: [
      {
        text: '奶声奶气地说：“国足不进球，巴西拿冠军。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸照着填了，同事们笑他扫兴。一个月后，他成了全单位唯一猜中的人，捧回了奖品和一点奖金。', effects: { stats: { wealth: 1, influence: 2, fame: 1 } } },
          { tag: 'misremember', text: '你把决赛记成了另一届，说冠军是德国。爸爸的竞猜单作废，还被同事调侃“听孩子的”。', effects: { stats: { happiness: -2 } } },
        ],
      },
      {
        text: '让爸爸和生意伙伴赌一把巴西夺冠',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸半信半疑地押了巴西。决赛巴西 2:0 胜德国，那几个生意伙伴从此对你家刮目相看。', effects: { stats: { wealth: 8, influence: 3 } } },
          { tag: 'misremember', text: '你记错了巴西走到哪一轮，让爸爸押了别的队。输掉的钱够买一台大彩电。', effects: { stats: { wealth: -6, happiness: -3 } } },
        ],
      },
      { text: '陪爸爸看国足的比赛', outcomes: [{ text: '三场全败，一球未进。爸爸看完最后一场，默默关了电视。', effects: { stats: { happiness: -2 } } }] },
    ],
  },
  {
    id: 'family-2003-sars',
    category: 'family',
    year: 2003,
    requires: { minAge: 5 },
    title: '非典那年',
    text: '2003 年春天，“非典”来了。电视里天天在报疫情，有的地方幼儿园停了课，大人们四处抢购板蓝根和白醋。你记得，这场风波会在夏天过去。',
    realFact: '2003 年春季，非典（SARS）疫情在国内多地暴发，部分地区出现抢购板蓝根、白醋、口罩等现象，多地学校和幼儿园停课；2003 年 7 月，世界卫生组织宣布全球 SARS 疫情得到控制。依据：当年新闻报道与世界卫生组织公告。',
    choices: [
      {
        text: '劝爸妈：“勤洗手、少出门，别去抢。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈没跟风囤货，全家规规矩矩地洗手通风。夏天一到风波果然过去，家里没多花一分冤枉钱。', effects: { stats: { health: 5, influence: 2 } } },
          { tag: 'misremember', text: '你记不清哪里最严重、什么时候结束，说着说着自己先慌了。爸妈被你吓得囤了一屋子白醋。', effects: { stats: { wealth: -0.5, happiness: -3 } } },
        ],
      },
      {
        text: '撺掇爸妈提前囤一批白醋和口罩，等涨价再卖',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你家赶在涨价前进了货，转手赚了一笔。可街坊们都知道是你家在卖高价货，背后没少说闲话。', effects: { stats: { wealth: 6, charm: -5, happiness: -2 } } },
          { tag: 'misremember', text: '你记错了时间，货进得太晚，价格早已回落，一屋子白醋和口罩砸在了手里。', effects: { stats: { wealth: -4, happiness: -2 } } },
        ],
      },
      { text: '乖乖在家待着', outcomes: [{ text: '你在家憋了好几个月，天天看动画片重播。无聊，但安全。', effects: { stats: { health: 3, happiness: -2 } } }] },
    ],
  },
  {
    id: 'finance-2003-house',
    category: 'finance',
    rarity: 'rare',
    year: 2003,
    requires: { minAge: 5 },
    title: '样板间',
    text: '城郊开了个新楼盘，爸妈周末带你去看样板间。售楼员说得天花乱坠，爸爸却嫌首付太贵，想再等等。你知道，“再等等”是这个年代最贵的三个字。',
    realFact: '1998 年起城镇住房停止实物分配、逐步实行货币化分配；2003 年 8 月国务院发布《关于促进房地产市场持续健康发展的通知》（通称“18 号文”），明确房地产业已成为国民经济的支柱产业。此后多年大中城市房价普遍上涨，但各地涨幅差异极大，本事件不写具体数字。依据：1998 年国务院住房制度改革通知、2003 年国务院 18 号文。',
    choices: [
      {
        text: '赖在样板间的小床上不肯走',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈拗不过你，咬牙交了首付。房贷压得全家紧巴巴的，但你知道，这是这一世家里最划算的一笔账。', effects: { stats: { wealth: -3, happiness: -2, influence: 2 }, addFlags: ['family-bought-house'] } },
          { tag: 'misremember', text: '你记错了这座城市往哪边发展，闹着买下的这片新区，往后很多年都没什么起色。', effects: { stats: { wealth: -6, happiness: -3 } } },
        ],
      },
      {
        text: '撺掇爸妈“顺便”再买一套',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈笑你人小鬼大，还是一口气买了两套。首付掏空了家底，亲戚们都说他们疯了。', effects: { stats: { wealth: -8, happiness: -3, influence: 3 }, addFlags: ['family-bought-house', 'family-two-houses'] } },
          { tag: 'misremember', text: '你把这座城市和上辈子住过的城市弄混了，两套房都买在了冷清的地段，月供压得爸爸天天叹气。', effects: { stats: { wealth: -15, happiness: -6 } } },
        ],
      },
      {
        text: '这是大人的事，你只管在样板间里跑',
        outcomes: [
          { weight: 2, text: '爸妈商量了一路，最后决定“明年再说”。', effects: {} },
          { weight: 1, text: '爸妈一时冲动交了定金，回家又后悔，定金退不回来了。', effects: { stats: { wealth: -1 } } },
        ],
      },
    ],
  },
  {
    id: 'finance-2004-euro',
    category: 'finance',
    rarity: 'rare',
    year: 2004,
    requires: { minAge: 6 },
    title: '2004 年欧洲杯',
    text: '夏天，爸爸天天熬夜看欧洲杯。大人们打赌谁能夺冠，热门是东道主葡萄牙和几支传统强队，没人看得上希腊。你记得，这是一届大冷门。',
    realFact: '2004 年葡萄牙欧洲杯，赛前不被看好的希腊队一路晋级，决赛 1:0 击败东道主葡萄牙夺冠，被普遍视为大赛史上最大的冷门之一。依据：欧足联官方赛果记录与当年报道。',
    choices: [
      {
        text: '缠着爸爸押希腊',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '决赛希腊 1:0 爆冷击败葡萄牙，赔率高得吓人。爸爸赢了一大笔“零花钱”，第二天给你买了个新书包。', effects: { stats: { wealth: 4, influence: 3, fame: 1, happiness: 3 } } },
          { tag: 'misremember', text: '你把冠军和亚军记反了，让爸爸押了葡萄牙。终场哨响时，爸爸的脸比葡萄牙球迷还难看。', effects: { stats: { wealth: -2, happiness: -2 } } },
        ],
      },
      {
        text: '让爸爸在生意圈子里坐庄，专收押葡萄牙的注',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '一圈老板全押了葡萄牙，结果希腊捧杯。爸爸收钱收到手软，从此在圈子里多了个“神算”的外号。', effects: { stats: { wealth: 15, influence: 4 } } },
          { tag: 'misremember', text: '你记岔了决赛的结果，爸爸庄家当得一塌糊涂，赔得肉疼。', effects: { stats: { wealth: -8, happiness: -4 } } },
        ],
      },
      { text: '跟着爸爸给葡萄牙加油', outcomes: [{ text: '葡萄牙输了，爸爸长吁短叹。你在心里默默说：早知道……', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'finance-2005-bottom',
    category: 'finance',
    rarity: 'rare',
    year: 2005,
    requires: { minAge: 7 },
    title: '一千点以下',
    text: '2005 年，股市跌破了一千点，报纸上有人说“股市已死”，爸爸单位里没人再提“股票”两个字。你知道，这里就是地板，一场大牛市正在路上。',
    realFact: '上证综指于 2005 年 6 月跌至 998 点，为 2001 年以来熊市的低点；同年启动股权分置改革，随后 2006–2007 年出现大牛市，2007 年 10 月最高超过 6100 点。依据：上海证券交易所指数历史数据。',
    choices: [
      {
        text: '认真地对爸妈说：“现在买，放着别动。”',
        requires: { flags: ['parents-trust'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈拿出一小笔钱买了几只股票，然后照你说的“忘了它”。到了年底，账户已经悄悄翻红。', effects: { stats: { wealth: 3, influence: 3 }, addFlags: ['family-stock-2005'] } },
          { tag: 'misremember', text: '你记错了见底的月份，让爸妈抄底抄早了，结果又跌了一截。他们开始怀疑你只是运气好。', effects: { stats: { wealth: -2, happiness: -2 } } },
        ],
      },
      {
        text: '让爸妈把生意上的闲钱分一部分进股市',
        requires: { flags: ['family-has-money'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸妈在一片哀嚎声里悄悄建了仓。年底一算，已经小赚一笔，而你知道这只是开始。', effects: { stats: { wealth: 10, influence: 3 }, addFlags: ['family-stock-2005'] } },
          { tag: 'misremember', text: '你把板块记错了，爸妈买进的几只股票在别人都回暖时还在往下掉。', effects: { stats: { wealth: -6, happiness: -3 } } },
        ],
      },
      {
        text: '对还被套着的爸爸说：“千万别割肉，再坚持一下。”',
        requires: { flags: ['family-stock-trapped'] },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸咬着牙没割肉。到了年底行情开始回暖，他第一次觉得那几年没白熬。', effects: { stats: { wealth: 3, happiness: 5 }, removeFlags: ['family-stock-trapped'], addFlags: ['family-stock-2005'] } },
          { tag: 'misremember', text: '你话说得颠三倒四，爸爸以为你是让他“赶紧走”，在最低点割了肉。后来说起这事，他总是一脸苦笑。', effects: { stats: { wealth: -4, happiness: -4 }, removeFlags: ['family-stock-trapped'] } },
        ],
      },
      { text: '你沉迷于新买的溜溜球', outcomes: [{ text: '大人们聊股票的时候，你在院子里把溜溜球甩得飞起。', effects: { stats: { happiness: 2 } } }] },
    ],
  },

  // ───────────── 纯随机生活事件 ─────────────
  {
    id: 'family-lost-passbook',
    category: 'family',
    requires: { minAge: 2, maxAge: 5 },
    weight: 12,
    title: '存折不见了',
    text: '家里的存折不见了，妈妈急得翻箱倒柜，爸爸怀疑是被小偷摸走了。你忽然想起，上辈子这本存折过了好几年，才在旧大衣柜的夹层里被翻出来。',
    choices: [
      {
        text: '摇摇晃晃走到大衣柜前，拍了拍夹层',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '妈妈将信将疑地伸手一摸，存折真的在里面！爸妈对视了一眼，从此开始认真听你说的“胡话”。', effects: { stats: { influence: 3, happiness: 3 }, addFlags: ['parents-trust'] } },
          { tag: 'misremember', text: '你拍错了柜子。爸妈把那个柜子翻了个底朝天，什么也没找到，还碰碎了一面镜子。', effects: { stats: { happiness: -2, wealth: -0.05 } } },
        ],
      },
      {
        text: '不出声，看大人们忙活',
        outcomes: [
          { weight: 2, text: '折腾了几天，爸妈只好去银行挂失补办，白跑了好几趟。', effects: { stats: { happiness: -1 } } },
          { weight: 1, text: '妈妈换季收衣服时自己找到了存折，全家虚惊一场。', effects: { stats: { happiness: 2 } } },
        ],
      },
    ],
  },
  {
    id: 'family-weird-kid',
    category: 'family',
    requires: { minAge: 3, maxAge: 5 },
    weight: 10,
    title: '“这孩子成精了”',
    text: '你一不留神，在饭桌上说出了“按揭”“通货膨胀”这种词。来串门的阿姨筷子都掉了：“这孩子是不是成精了？”',
    choices: [
      { text: '索性继续“语出惊人”', outcomes: [{ text: '没几天，整栋楼都知道你家出了个“小神童”。有人羡慕，也有人背后嘀咕“邪门”。', effects: { stats: { intelligence: 2, fame: 3, happiness: -1 }, addFlags: ['weird-kid'] } }] },
      { text: '赶紧装傻：“阿姨，啥是按揭呀？”', outcomes: [{ text: '大人们哄堂大笑，只当你在学电视里的话。你决定以后说话前先过一遍脑子。', effects: { stats: { charm: 3 } } }] },
    ],
  },
  {
    id: 'life-kindergarten-first-day',
    category: 'life',
    requires: { minAge: 3, maxAge: 4 },
    weight: 15,
    title: '幼儿园第一天',
    text: '上幼儿园的第一天，满屋子小朋友哭成一片。你一个二十八岁的灵魂坐在小板凳上，手里攥着一块饼干，不知道该不该也哭两声。',
    choices: [
      { text: '跟着哭两声，融入集体', outcomes: [{ text: '老师抱了抱你，还多给了你一块饼干。你发现装小孩也是门技术活。', effects: { stats: { charm: 3, happiness: 2 } } }] },
      { text: '帮老师哄其他小朋友', outcomes: [{ text: '你三言两语就把同桌哄得破涕为笑。老师惊呆了，当天就让你当了“小班长”。', effects: { stats: { fame: 2, charm: 2, intelligence: 1 } } }] },
      { text: '趴在桌上补觉', outcomes: [{ text: '你睡得昏天黑地，醒来发现老师在本子上给你记了一笔“不合群”。', effects: { stats: { health: 2, happiness: 1, charm: -1 } } }] },
    ],
  },
  {
    id: 'life-chickenpox',
    category: 'life',
    requires: { minAge: 3, maxAge: 7 },
    weight: 10,
    title: '出水痘',
    text: '你出水痘了，浑身起满小红疙瘩，痒得钻心。妈妈一边给你抹药水，一边念叨“千万别挠，挠了要留疤”。',
    choices: [
      { text: '用成年人的意志力硬忍', outcomes: [{ text: '你咬着被角忍了一个星期，水痘退得干干净净，连医生都夸你懂事。', effects: { stats: { health: -3, happiness: -2, charm: 1 } } }] },
      {
        text: '实在忍不住，挠吧',
        outcomes: [
          { weight: 2, text: '挠得很爽，额头上留下了一个小小的疤，好在刘海能遮住。', effects: { stats: { health: -3, charm: -2 } } },
          { weight: 1, text: '挠破的地方发了炎，又多打了好几天针。', effects: { stats: { health: -6, happiness: -3 } } },
        ],
      },
    ],
  },
  {
    id: 'life-toy-store',
    category: 'life',
    requires: { minAge: 3, maxAge: 7 },
    weight: 12,
    title: '玩具柜台',
    text: '逛商场时，你看见柜台里摆着一排四驱车，别的小孩正趴在玻璃上流口水。妈妈问你：“想要什么？今天给你买一样。”',
    choices: [
      { text: '要一辆四驱车，重温童年', outcomes: [{ text: '你和楼下的小孩比了一整个暑假。这一世的快乐，来得简单又直接。', effects: { stats: { happiness: 6 } } }] },
      { text: '要一套少儿百科全书', outcomes: [{ text: '妈妈又惊又喜，逢人就说你爱学习。你翻着书，顺便把小学知识复习了一遍。', effects: { stats: { intelligence: 4, charm: 1 } } }] },
      { text: '摇摇头：“我什么都不缺。”', outcomes: [{ text: '妈妈愣了一下，眼圈有点红。回家的路上，她把你的手攥得特别紧。', effects: { stats: { charm: 2, happiness: -1 } } }] },
    ],
  },
  {
    id: 'family-grandma-village',
    category: 'family',
    requires: { minAge: 3, maxAge: 7 },
    weight: 12,
    title: '奶奶家的暑假',
    text: '暑假，你被送回乡下奶奶家。院子里有鸡有狗，晚上能看见满天星星。奶奶把攒了很久的鸡蛋全煮给你吃，你却想起上一世，很多年后才后悔没多陪陪她。',
    choices: [
      {
        text: '跟着堂哥下河摸鱼',
        outcomes: [
          { weight: 3, text: '你们摸了一下午，晚上奶奶炖了一锅鱼汤。', effects: { stats: { health: 4, happiness: 5 } } },
          { weight: 1, text: '你脚下一滑掉进河里，被堂哥拽了上来，回家发了两天烧。', effects: { stats: { health: -5, happiness: -2 } } },
        ],
      },
      { text: '整天黏着奶奶，听她讲过去的事', outcomes: [{ text: '奶奶讲了很多你上辈子从没听过的故事。临走时，她偷偷往你兜里塞了五十块钱。', effects: { stats: { happiness: 6, charm: 2, wealth: 0.005 } } }] },
      {
        text: '缠着爸妈带奶奶去城里做个体检',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你记得奶奶后来查出的那场病。体检果然发现了苗头，好在发现得早，医生说能治。', effects: { stats: { happiness: 5, influence: 1, wealth: -0.5 } } },
          { tag: 'misremember', text: '你把奶奶和外婆的病史记混了。体检一切正常，来回折腾倒让奶奶累病了好几天。', effects: { stats: { happiness: -2, wealth: -0.2 } } },
        ],
      },
    ],
  },
  {
    id: 'life-future-notebook',
    category: 'life',
    rarity: 'legendary',
    requires: { minAge: 5, maxAge: 6 },
    weight: 15,
    title: '未来备忘录',
    text: '你终于能握稳铅笔了。某天深夜，你趁爸妈睡着，打开手电筒，用拼音和自创的符号，把记得的未来大事一条条写进作业本里。',
    choices: [
      { text: '写满一整本“未来备忘录”', outcomes: [{ text: '你写到天亮，手腕酸得抬不起来。这本歪歪扭扭的本子，就是你对抗遗忘的武器。', effects: { stats: { memory: 12, health: -2 }, addFlags: ['future-notebook'] } }] },
      { text: '不写了，写下来反而危险', outcomes: [{ text: '你合上了本子。记忆会褪色，但至少不会被人翻出来。', effects: { stats: { intelligence: 1, happiness: 1 } } }] },
    ],
  },

  // ───────────── 依赖标记的后续事件 ─────────────
  {
    id: 'family-dad-stock-trapped',
    category: 'family',
    requires: { minAge: 4, maxAge: 6, minYear: 2002, maxYear: 2005, flags: ['family-stock-trapped'] },
    weight: 25,
    title: '绿油油的K线',
    text: '爸爸的股票绿了一年又一年。他每天晚上守着电视里的行情，烟一根接一根，妈妈说他“魂都被套进去了”。',
    choices: [
      { text: '爬到爸爸腿上给他捶背', outcomes: [{ text: '爸爸掐了烟，抱着你叹了口气：“还好有你。”', effects: { stats: { happiness: 3, charm: 2 } } }] },
      {
        text: '凑到他耳边说：“别割肉，熬到 2005 年……”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '爸爸愣了半天，笑着说“小孩子懂什么”，却真把割肉的念头压了下去。', effects: { stats: { happiness: 2, influence: 1 } } },
          { tag: 'misremember', text: '你把年份说错了。爸爸照着你说的日子等，到了那天行情反而更差，他气得把电视关了。', effects: { stats: { happiness: -3 } } },
        ],
      },
      { text: '假装没看见，把电视换到少儿频道', outcomes: [{ text: '爸爸也没心思跟你抢遥控器，一个人去阳台抽烟了。', effects: { stats: { happiness: 2, charm: -1 } } }] },
    ],
  },
  {
    id: 'family-move-new-house',
    category: 'family',
    requires: { minAge: 6, maxAge: 7, flags: ['family-bought-house'] },
    weight: 25,
    title: '搬新家',
    text: '新房终于交了钥匙。搬家那天，爸爸借来三轮车拉了好几趟，妈妈对着空荡荡的客厅傻笑。楼下的大爷说，这一片房子已经涨了不少。',
    choices: [
      {
        text: '挑朝南的小房间当自己的卧室',
        outcomes: [
          { requires: { notFlags: ['family-two-houses'] }, text: '你有了自己的房间。夜里躺在床上，听见爸妈小声算着房子涨了多少，声音里带着笑。', effects: { stats: { happiness: 6, wealth: 8 } } },
          { requires: { flags: ['family-two-houses'] }, text: '一套自己住，另一套租了出去。爸妈第一次收到房租时，看你的眼神有点发直。', effects: { stats: { happiness: 6, wealth: 20, influence: 2 } } },
        ],
      },
      { text: '缠着爸爸把旧家具全换掉', outcomes: [{ text: '爸爸咬牙换了一套新沙发，月底全家吃了一个星期的面条。', effects: { stats: { happiness: 3, wealth: -1 } } }] },
    ],
  },
  {
    id: 'absurd-relatives-lottery',
    category: 'absurd',
    rarity: 'rare',
    requires: { minAge: 4, maxAge: 7, flags: ['weird-kid'] },
    weight: 25,
    title: '给叔报个号',
    text: '过年回老家，三叔听说你是“神童”，把你拉到墙角，掏出一张皱巴巴的彩票单子：“好侄儿，给叔报几个号。”一屋子亲戚都围了过来。',
    choices: [
      {
        text: '闭上眼，装模作样地“回忆”',
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你哪记得什么开奖号码，只隐约记得那阵子小号出得多。三叔照着蒙了一注，居然中了个小奖，从此逢人就说你是“文曲星下凡”。', effects: { stats: { fame: 4, influence: 2, happiness: 3 } } },
          { tag: 'misremember', text: '你报的号码一个都没中。三叔嘴上说没事，此后每年过年都要念叨一句“神童也有失手的时候”。', effects: { stats: { charm: -3, happiness: -2 } } },
        ],
      },
      {
        text: '一本正经地说：“彩票是智商税。”',
        outcomes: [
          { weight: 2, text: '亲戚们愣了三秒，然后笑成一团，三叔讪讪地收起了单子。', effects: { stats: { charm: 2, happiness: 2 } } },
          { weight: 1, text: '三叔恼羞成怒，给你的压岁钱从一百降到了二十。', effects: { stats: { wealth: -0.008, happiness: -2 } } },
        ],
      },
      { text: '躲进里屋看动画片', outcomes: [{ text: '你躲过一劫。外面的亲戚们已经开始比谁家孩子考了第一。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'family-notebook-found',
    category: 'family',
    rarity: 'rare',
    requires: { minAge: 6, maxAge: 7, flags: ['future-notebook'] },
    weight: 25,
    title: '本子被发现了',
    text: '妈妈收拾房间时，从你枕头底下翻出了那本作业本。上面写着“2008 奥运”“2020 口罩”之类看不懂的字。她拿着本子，脸色一点点变了。',
    choices: [
      {
        text: '说是做梦梦到的',
        outcomes: [
          { weight: 2, text: '妈妈松了口气，把本子还给你，嘱咐你“少看点电视”。', effects: { stats: { happiness: 1 } } },
          { weight: 1, text: '妈妈嘴上没说什么，第二天却偷偷拿着本子去找了算命先生。没多久，亲戚们都知道你“能通灵”。', effects: { stats: { fame: 2, happiness: -2 }, addFlags: ['weird-kid'] } },
        ],
      },
      {
        text: '咬咬牙，向妈妈“坦白”一部分',
        outcomes: [
          { weight: 1, text: '妈妈盯着你看了很久，最后说：“这件事，只能咱们一家三口知道。”从那天起，爸妈开始认真听你说话。', effects: { stats: { influence: 4 }, addFlags: ['parents-trust'] } },
          { weight: 1, text: '妈妈吓坏了，第二天就带你去医院看医生。本子被没收，你也学会了闭嘴。', effects: { stats: { happiness: -5, memory: -6 }, removeFlags: ['future-notebook'] } },
        ],
      },
      { text: '一把抢回本子撕个粉碎', outcomes: [{ text: '纸屑落了一地，妈妈被你吓到了，再也没提这件事。可你自己也记不全上面写过什么了。', effects: { stats: { memory: -8, happiness: -2 }, removeFlags: ['future-notebook'] } }] },
    ],
  },
]
