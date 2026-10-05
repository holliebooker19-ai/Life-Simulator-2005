import type { GameEvent } from '../../types'

/**
 * AI 公司主线（DESIGN_V2 第七节）。2026 年前按真实节点决策（可改写锚点），2026 年后是虚构的未来：
 * 默认走向为熵派最强、closeai 衰败并第一个破产、谷哥（双鱼座）与 yAI（Grox）后期发力、
 * 国产模型在“超高性能 + 低价”与反蒸馏制裁下大批倒闭——玩家的决策会改变这一切。
 *
 * 世界变量（src/data/world.ts）：ai-player / ai-entropic / ai-closeai / ai-google / ai-y / ai-cn（实力 0-100）、tech-ai。
 *
 * 本文件读取的标记：skill-coding / skill-japanese / skill-english / y1620-ai-dream / y2126-ai-early / ai-candidate
 * 本文件写入的标记：
 * - ai-candidate：想做 AI 公司（来自行动“筹备 AI 公司”、ChatGPD 事件等），触发 ai-found-company
 * - ai-company：拥有自己的 AI 公司（同时写 has-business）
 * - ai-japan / ai-cn-based / ai-us：公司注册地
 * - ai-paper：抢先发表了《注意力就是你所需要的一切》
 * - ai-entropic-ally：投资过熵派，关系不错
 * - ai-anti-distill：与熵派联手推行反蒸馏制裁
 * - ai-closeai-dead / ai-cn-dead：closeai 破产 / 国产模型大洗牌已经发生
 * - ai-agi-mine：你的公司率先实现通用人工智能
 * - ai-ipo：公司上市
 *
 * 改写锚点（Effects.alter）：ai-2017-attention / ai-2020-gpt3 / ai-2021-entropic-founded / ai-2025-distill，
 * 以及 2026 年后的 ai-closeai-bankrupt（救活 closeai）、ai-cn-shakeout（救下国产模型）、ai-agi-player。
 */

/** 2027 年后每年的默认行业走向（玩家不干预时） */
const TREND = { 'ai-entropic': 3, 'ai-google': 4, 'ai-y': 4, 'ai-closeai': -10, 'ai-cn': -4 }

export const aiMainlineEvents: GameEvent[] = [
  // ───────────── 入口：论文与建公司 ─────────────
  {
    id: 'ai-2017-attention',
    category: 'career',
    rarity: 'legendary',
    year: 2017,
    requires: { minAge: 19, flags: ['skill-coding'], notAltered: ['ai-2017-attention'] },
    title: '注意力就是你所需要的一切',
    text: '你记得很清楚：今年六月，会有一篇论文提出一种只靠“注意力机制”的新架构，此后所有的大模型都长在它上面。现在离六月还有几个月，草稿纸上的公式，你闭着眼都能写出来。',
    realFact: '2017 年 6 月，某科技公司的研究团队发表论文《Attention Is All You Need》，提出完全基于注意力机制的 Transformer 架构，成为此后大语言模型的基础。依据：该论文的公开预印本与通行科技史料。作者为真实人物，游戏中不出现姓名。',
    choices: [
      {
        text: '抢在他们之前，把论文发出去',
        requires: { statMin: { intelligence: 75 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '一个大学生署名的论文挂上了预印本网站。几周之内，全世界的实验室都在复现你的结果。你的邮箱被投资人和教授塞满了。', effects: { stats: { fame: 15, influence: 8, intelligence: 3 }, alter: [{ id: 'ai-2017-attention', scale: 12 }], world: { 'ai-player': 10 }, addFlags: ['ai-paper', 'ai-candidate'] } },
          { tag: 'misremember', text: '你记岔了几个关键细节，实验怎么也跑不出论文里的效果。等你改好，原作者的论文已经发出来了。', effects: { stats: { intelligence: 4, happiness: -5 }, addFlags: ['ai-candidate'] } },
        ],
      },
      {
        text: '等论文发出来，第一时间复现并开源代码',
        outcomes: [{ text: '论文发布的第三天，你的复现代码就上了开源网站，成了很多人入门的第一份教程。', effects: { stats: { intelligence: 4, fame: 4, influence: 2 }, addFlags: ['ai-candidate'] } }],
      },
      { text: '这不是一个大学生该掺和的事', outcomes: [{ text: '你合上草稿纸。也许有一天，会有别的机会。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'ai-2018-paper-altered',
    category: 'career',
    rarity: 'legendary',
    year: 2018,
    requires: { minAge: 20, altered: ['ai-2017-attention'], notFlags: ['ai-company'] },
    title: '一篇论文引发的地震',
    text: '原本应该写出这篇论文的研究团队发了一篇长文，语气客气，意思很明白：“我们也在做同样的方向，时间线太巧了。”学术圈吵成一团。与此同时，投资人排着队要见你，有人开口就是一个亿。',
    realFact: '改写版：真实历史中，该论文由某科技公司的研究团队于 2017 年发表。本事件为玩家改写锚点 ai-2017-attention 后的分支。',
    choices: [
      {
        text: '拿投资，去东京注册公司',
        outcomes: [
          { requires: { flags: ['skill-japanese'] }, text: '你的日语派上了用场，签证、注册、租办公室一气呵成。公司在东京开张那天，樱花刚好开了。', effects: { stats: { wealth: 3000, fame: 5, influence: 5, happiness: 6 }, world: { 'ai-player': 15 }, addFlags: ['ai-company', 'ai-japan', 'has-business'] } },
          { requires: { notFlags: ['skill-japanese'] }, text: '你一边上语言学校一边跑签证，折腾了大半年，总算把公司在东京注册了下来。顺便，你的日语也能应付开会了。', effects: { stats: { wealth: 2800, fame: 5, influence: 4, happiness: 2 }, world: { 'ai-player': 12 }, addFlags: ['ai-company', 'ai-japan', 'has-business', 'skill-japanese'] } },
        ],
      },
      {
        text: '在国内创业',
        outcomes: [{ text: '你在北京的写字楼里挂上了公司的牌子。融资、招人都很顺，只是你隐约记得，几年后算力会成为大问题。', effects: { stats: { wealth: 3000, fame: 5, influence: 5 }, world: { 'ai-player': 15 }, addFlags: ['ai-company', 'ai-cn-based', 'has-business'] } }],
      },
      {
        text: '公开回应争议：“我愿意和原团队联合署名”',
        outcomes: [{ text: '你的大方让风波平息了不少。原团队里有两位研究员后来干脆加入了你，成了你最早的合伙人。', effects: { stats: { fame: 4, charm: 4, influence: 4 }, world: { 'ai-player': 5 }, addFlags: ['ai-candidate'] } }],
      },
    ],
  },
  {
    id: 'ai-found-company',
    category: 'career',
    rarity: 'rare',
    weight: 60,
    requires: { minAge: 19, minYear: 2017, flags: ['ai-candidate'], notFlags: ['ai-company'] },
    title: '公司注册在哪里？',
    text: '商业计划书写好了，几位早期投资人也点了头。最后一个问题：公司注册在哪里？你在地图上圈了三个地方。',
    choices: [
      {
        text: '日本东京',
        outcomes: [
          { requires: { flags: ['skill-japanese'] }, text: '你算过账：那边的著作权法对用数据训练模型比较宽松，买高端显卡也不受限，工程师的薪水还比硅谷便宜一大截。签证和注册都很顺，公司在东京开张了。', effects: { stats: { wealth: -30, influence: 3, happiness: 5 }, world: { 'ai-player': 10 }, addFlags: ['ai-company', 'ai-japan', 'has-business'] } },
          { requires: { notFlags: ['skill-japanese'] }, text: '你先去读了半年语言学校，又被经营管理签证的材料折磨了好几轮，终于在东京拿到了营业执照。房东太太送了你一盒点心，说“加油哦”。', effects: { stats: { wealth: -50, happiness: 2 }, world: { 'ai-player': 8 }, addFlags: ['ai-company', 'ai-japan', 'has-business', 'skill-japanese'] } },
        ],
      },
      {
        text: '国内',
        outcomes: [{ text: '你在杭州注册了公司，招人快、落地快，市场就在身边。只是你隐约记得，几年后买高端芯片会越来越难。', effects: { stats: { wealth: -30, influence: 3 }, world: { 'ai-player': 10 }, addFlags: ['ai-company', 'ai-cn-based', 'has-business'] } }],
      },
      {
        text: '美国硅谷',
        requires: { flags: ['skill-english'] },
        outcomes: [{ text: '你在湾区的车库里开了张——真的是车库，月租贵得吓人。离投资人很近，离家很远。', effects: { stats: { wealth: -60, influence: 4, happiness: -2 }, world: { 'ai-player': 10 }, addFlags: ['ai-company', 'ai-us', 'has-business'] } }],
      },
      { text: '再等等，时机还不成熟', outcomes: [{ text: '你把计划书锁进了抽屉。投资人说：“想好了随时找我。”', effects: { stats: { happiness: -1 }, removeFlags: ['ai-candidate'] } }] },
    ],
  },

  // ───────────── 2026 年前的真实节点 ─────────────
  {
    id: 'ai-2019-japan-copyright',
    category: 'career',
    year: 2019,
    requires: { minAge: 21, flags: ['ai-japan'] },
    title: '数据的绿灯',
    text: '新年第一天，日本修订后的著作权法正式施行：只要不是为了“欣赏作品本身”，用作品做数据分析和机器学习基本不需要逐一授权。你的法务把条文打印出来贴在了墙上。',
    realFact: '日本 2018 年修订著作权法，自 2019 年 1 月 1 日起施行，新第 30 条之 4 允许在不以“享受作品所表达的思想或感情”为目的时利用作品，包括用于机器学习等数据分析。依据：日本文化厅公开资料。',
    choices: [
      { text: '全力扩充训练数据', outcomes: [{ text: '你们的数据团队连轴转了一个季度，模型的效果肉眼可见地变好了。', effects: { stats: { wealth: -20, intelligence: 1 }, world: { 'ai-player': 6 } } }] },
      { text: '先把版权方的关系处好，主动分成', outcomes: [{ text: '你和几家出版社、图库签了分成协议。速度慢了一点，名声好了很多。', effects: { stats: { wealth: -30, fame: 3, influence: 2 }, world: { 'ai-player': 3 } } }] },
    ],
  },
  {
    id: 'ai-2020-gpt3',
    category: 'career',
    rarity: 'rare',
    year: 2020,
    requires: { minAge: 22, flags: ['ai-company'], notAltered: ['ai-2020-gpt3'] },
    title: '一千七百五十亿',
    text: 'closeai 发布了 GPD-3：一千七百五十亿个参数，几个例子就能学会新任务。业内一片哗然。你知道，“越大越好”这条路会一直走到对话机器人横空出世。',
    realFact: '2020 年 5 月至 6 月，某美国人工智能公司发布拥有 1750 亿参数的大型语言模型，展示出少样本学习能力。依据：该公司论文与通行科技史料。名称已改名。',
    choices: [
      {
        text: '押上全部家底，抢先做出更大的模型',
        requires: { statMin: { wealth: 200 }, worldMin: { 'ai-player': 25 } },
        usesMemory: true,
        outcomes: [
          { tag: 'success', text: '你的模型比 GPD-3 早两个月发布，参数更多、效果更好。closeai 的发布会变成了“追赶者”的发布会。', effects: { stats: { wealth: -150, fame: 10, influence: 6 }, alter: [{ id: 'ai-2020-gpt3', scale: 8 }], world: { 'ai-player': 15, 'ai-closeai': -8 } } },
          { tag: 'misremember', text: '你记错了它的发布时间，训练到一半就被对方抢了先。钱烧掉了一大半，模型只能当作内部版本。', effects: { stats: { wealth: -150, happiness: -6 }, world: { 'ai-player': 4 } } },
        ],
      },
      { text: '稳扎稳打，跟进大模型路线', outcomes: [{ text: '你调整了研发方向，团队开始攻关大模型。不急，路还长。', effects: { stats: { intelligence: 2 }, world: { 'ai-player': 5 } } }] },
    ],
  },
  {
    id: 'ai-2021-entropic-founded',
    category: 'career',
    rarity: 'rare',
    year: 2021,
    requires: { minAge: 23, flags: ['ai-company'], notAltered: ['ai-2021-entropic-founded'] },
    title: '熵派诞生',
    text: '一群从 closeai 出走的研究员成立了新公司“熵派（Entropic）”，主打“安全的 AI”。他们正在找钱，也在找人。你知道，几年后它会成为这个行业最可怕的对手——或者最可靠的盟友。',
    realFact: '2021 年，某美国人工智能公司的多名前员工离职，创办了一家以 AI 安全为重点的新公司。依据：通行科技史料。名称已按 docs/NAMING.md 改名。',
    choices: [
      {
        text: '投他们一笔，交个朋友',
        requires: { statMin: { wealth: 100 } },
        outcomes: [{ text: '你成了熵派的早期投资人之一。创始人握着你的手说：“我们会记得这份人情。”', effects: { stats: { wealth: -80, influence: 4 }, world: { 'ai-entropic': 5 }, addFlags: ['ai-entropic-ally'] } }],
      },
      {
        text: '开出天价，把创始团队整个挖到你公司',
        requires: { statMin: { influence: 50, wealth: 500 }, worldMin: { 'ai-player': 40 } },
        outcomes: [{ text: '他们最后没有创业，而是带着整个团队加入了你。“熵派”这个名字，从此只出现在你公司的一个部门门牌上。', effects: { stats: { wealth: -400, fame: 6, influence: 6 }, alter: [{ id: 'ai-2021-entropic-founded', scale: 12 }], world: { 'ai-player': 18, 'ai-entropic': -40 } } }],
      },
      { text: '专心做自己的', outcomes: [{ text: '你把新闻转给了团队，只说了一句：“我们的对手又多了一个。”', effects: { stats: { happiness: -1 } } }] },
    ],
  },
  {
    id: 'ai-2022-chip-ban',
    category: 'career',
    rarity: 'rare',
    year: 2022,
    requires: { minAge: 24, flags: ['ai-company'] },
    title: '算力的闸门',
    text: '十月，美国发布出口管制新规，限制向中国出口部分高端计算芯片。整个行业都在重新算账：没有显卡，大模型就是空中楼阁。',
    realFact: '2022 年 10 月 7 日，美国商务部发布出口管制新规，限制向中国出口部分先进计算芯片及半导体制造设备，此后多次加码。依据：美国商务部公开公告。',
    choices: [
      {
        text: '东京的公司趁机大量采购算力',
        requires: { flags: ['ai-japan'] },
        outcomes: [{ text: '你在管制收紧之前签下了大批显卡订单。机房里的风扇声，是你听过最好听的声音。', effects: { stats: { wealth: -100, influence: 2 }, world: { 'ai-player': 8 } } }],
      },
      {
        text: '把研发中心搬到东京',
        requires: { flags: ['ai-cn-based'] },
        outcomes: [{ text: '你在东京设立了研发中心，核心团队一半搬了过去。搬家很痛，但机房终于不缺卡了。', effects: { stats: { wealth: -150, happiness: -3 }, world: { 'ai-player': 3 }, addFlags: ['ai-japan', 'skill-japanese'] } }],
      },
      {
        text: '在国内硬扛，靠算法省算力',
        requires: { flags: ['ai-cn-based'] },
        outcomes: [{ text: '团队被逼出了一身本事：同样的效果，你们用的卡只有别人的一半。', effects: { stats: { intelligence: 3 }, world: { 'ai-player': 2, 'ai-cn': 3 } } }],
      },
      { text: '先观望', outcomes: [{ text: '你让财务把算力预算重新排了一遍。', effects: { stats: { happiness: -1 } } }] },
    ],
  },
  {
    id: 'ai-2023-hundred-models',
    category: 'career',
    rarity: 'rare',
    year: 2023,
    requires: { minAge: 25, flags: ['ai-company'] },
    title: '百模大战',
    text: '三月，closeai 发布了 GPD-4，熵派也推出了自己的模型 cloud。国内一口气冒出了上百个大模型，发布会一场接一场。投资人问你：“你们的模型什么时候发？”',
    realFact: '2023 年 3 月某美国公司发布新一代大模型，同月另一家美国 AI 公司发布其首个对话模型；国内多家企业相继发布大模型，被称为“百模大战”。依据：通行科技史料。名称已改名。',
    choices: [
      {
        text: '开一场发布会，正面对标',
        requires: { worldMin: { 'ai-player': 35 } },
        outcomes: [
          { weight: 2, text: '你的模型在几个榜单上拿了第一，发布会的直播有几百万人在看。', effects: { stats: { fame: 8, influence: 4, wealth: -50 }, world: { 'ai-player': 8 } } },
          { weight: 1, text: '发布会现场演示翻车，模型一本正经地胡说八道。热搜上全是你。', effects: { stats: { fame: 3, happiness: -5, wealth: -50 }, world: { 'ai-player': 2 } } },
        ],
      },
      { text: '不凑热闹，先把产品做扎实', outcomes: [{ text: '你没开发布会。半年后很多“百模”悄无声息地消失了，你的客户却越来越多。', effects: { stats: { intelligence: 2, influence: 2 }, world: { 'ai-player': 4 } } }] },
    ],
  },
  {
    id: 'ai-2024-price-war',
    category: 'career',
    rarity: 'rare',
    year: 2024,
    requires: { minAge: 26, flags: ['ai-company'] },
    title: '价格战',
    text: '五月，国内大模型厂商一个接一个降价，有的直接降到“几乎免费”。一位投资人在电话里说：“这是一场看谁先把钱烧完的比赛。”',
    realFact: '2024 年 5 月，国内多家大模型厂商相继大幅下调 API 价格，部分模型降价超过九成或宣布免费，引发“大模型价格战”。依据：各厂商公开价格公告与当年媒体报道。',
    choices: [
      {
        text: '用“超高性能 + 低价”杀进去',
        requires: { worldMin: { 'ai-player': 40 }, statMin: { wealth: 300 } },
        outcomes: [{ text: '你的模型更强、价格更低。客户成批地迁移过来，国内几家对手的现金流开始告急。', effects: { stats: { wealth: -200, fame: 5, influence: 3 }, world: { 'ai-player': 8, 'ai-cn': -10 } } }],
      },
      { text: '不跟，守住利润', outcomes: [{ text: '你守住了毛利，市场份额却被抢走了一块。', effects: { stats: { wealth: 30 }, world: { 'ai-player': -3 } } }] },
    ],
  },
  {
    id: 'ai-2024-yen',
    category: 'finance',
    year: 2024,
    requires: { minAge: 26, flags: ['ai-japan'] },
    title: '一百六十',
    text: '日元兑美元跌破了一百六十，创下三十多年来的新低。东京的同行们在叫苦，你的财务总监却笑出了声：你们的融资都是美元。',
    realFact: '2024 年 4 月下旬日元兑美元一度跌破 160，为 1990 年以来的最低水平。依据：通行外汇市场史料。',
    choices: [
      { text: '趁成本低，在东京大举扩招', outcomes: [{ text: '同样的预算，你多招了一倍的工程师。办公室从一层扩到了三层。', effects: { stats: { wealth: -50, influence: 2 }, world: { 'ai-player': 6 } } }] },
      { text: '把一部分美元换成日元，囤着', outcomes: [{ text: '你换了一笔日元存起来。财务总监说你“比外汇交易员还敢”。', effects: { stats: { wealth: 20 } } }] },
    ],
  },
  {
    id: 'ai-2025-distill',
    category: 'career',
    rarity: 'rare',
    year: 2025,
    requires: { minAge: 27, flags: ['ai-company'], notAltered: ['ai-2025-distill'] },
    title: '蒸馏之争',
    text: '深度摸索的开源模型震动了全球，紧接着，有美国 AI 公司公开指称：有人在用它们的模型输出“蒸馏”训练自家模型。网友开始管深度摸索叫“deepsuck”。熵派的人私下联系你：“要不要一起，把这个口子堵上？”',
    realFact: '2025 年初，某国内 AI 公司发布开源推理模型后，有美国 AI 公司公开表示发现迹象显示其模型输出可能被用于“蒸馏”训练，“模型蒸馏”的边界由此引发广泛争议。依据：当年主流媒体报道。“deepsuck”为游戏内虚构的网络外号。',
    choices: [
      {
        text: '和熵派联手，提前推出“反蒸馏”联盟',
        requires: { notFlags: ['ai-cn-based'], worldMin: { 'ai-player': 45 }, notAltered: ['ai-2021-entropic-founded'] },
        outcomes: [{ text: '你们联合发布了检测与封禁蒸馏的技术标准，几家大厂随即跟进。靠“抄近路”追赶的对手，第一次感到了寒意。', effects: { stats: { fame: 6, influence: 6 }, alter: [{ id: 'ai-2025-distill', scale: 8 }], world: { 'ai-player': 5, 'ai-entropic': 5, 'ai-cn': -15 }, addFlags: ['ai-anti-distill'] } }],
      },
      {
        text: '站出来说：开源与蒸馏应该有清楚的规则，而不是一刀切',
        outcomes: [{ text: '你的长文两边都不讨好，却被很多工程师转发。你成了少数“说人话”的老板。', effects: { stats: { fame: 4, influence: 3, charm: 2 } } }],
      },
      { text: '不掺和，闷头做产品', outcomes: [{ text: '吵架的时候，你的团队又把模型的成本降了三成。', effects: { stats: { intelligence: 1 }, world: { 'ai-player': 3 } } }] },
    ],
  },
  {
    id: 'ai-2026-landscape',
    category: 'world',
    rarity: 'rare',
    year: 2026,
    requires: { minAge: 28 },
    title: 'AI 格局',
    text: '年底，一份行业报告把各家 AI 公司排了座次：熵派、closeai、谷哥（双鱼座）、马丝氪的 yAI（Grox），还有一长串烧着钱的国产模型。从明年开始，你再也不知道这张表会变成什么样了。',
    realFact: '游戏机制节点：设定 2026 年 AI 格局的初始实力（为游戏设定，不代表真实数据）。此后为虚构的未来。',
    effects: { world: { 'ai-entropic': 75, 'ai-closeai': 70, 'ai-google': 65, 'ai-y': 50, 'ai-cn': 55 } },
  },

  // ───────────── 公司经营（随机） ─────────────
  {
    id: 'ai-japan-life',
    category: 'life',
    requires: { minAge: 20, minYear: 2018, flags: ['ai-japan'] },
    title: '东京的日子',
    text: '你在东京住了下来。便利店的饭团很好吃，地铁很准时，楼下居酒屋的老板已经记住了你的口味。只是偶尔，你会很想吃一碗家乡的面。',
    choices: [
      { text: '周末去中华街吃顿好的', outcomes: [{ text: '一碗热汤面下肚，你觉得又能扛一个月了。', effects: { stats: { happiness: 5 } } }] },
      { text: '和日本同事去喝一杯', outcomes: [{ text: '几杯下肚，平时一本正经的同事们开始唱演歌。你们的关系近了很多。', effects: { stats: { charm: 3, happiness: 3 }, world: { 'ai-player': 1 } } }] },
    ],
  },
  {
    id: 'ai-revenue-small',
    category: 'career',
    once: false,
    weight: 25,
    requires: { minYear: 2019, flags: ['ai-company'], worldMin: { 'ai-player': 30 }, worldMax: { 'ai-player': 59 } },
    title: '公司财报',
    text: '公司的收入稳步增长，第一次实现了季度盈利。全员聚餐那天，你被灌了好几杯。',
    effects: { stats: { wealth: 150, influence: 1 } },
  },
  {
    id: 'ai-revenue-mid',
    category: 'career',
    once: false,
    weight: 25,
    requires: { minYear: 2019, flags: ['ai-company'], worldMin: { 'ai-player': 60 }, worldMax: { 'ai-player': 84 } },
    title: '公司财报',
    text: '你的模型成了很多大企业的标配，收入一年翻一倍。财经杂志把你放上了封面。',
    effects: { stats: { wealth: 2000, fame: 3, influence: 2 } },
  },
  {
    id: 'ai-revenue-big',
    category: 'career',
    rarity: 'rare',
    once: false,
    weight: 25,
    requires: { minYear: 2019, flags: ['ai-company'], worldMin: { 'ai-player': 85 } },
    title: '公司财报',
    text: '你的公司已经是全球最赚钱的科技公司之一。每个季度的财报发布日，全世界的股市都在等你。',
    effects: { stats: { wealth: 20000, fame: 4, influence: 3 } },
  },
  {
    id: 'ai-cash-crunch',
    category: 'career',
    rarity: 'rare',
    once: false,
    weight: 15,
    requires: { minYear: 2019, flags: ['ai-company'], worldMax: { 'ai-player': 20 }, statMax: { wealth: 50 } },
    title: '账上没钱了',
    text: '财务总监敲开你的门，把一张表放在桌上：账上的钱，只够再发三个月工资。',
    choices: [
      {
        text: '抵押房子，再撑一轮',
        requires: { flags: ['own-house'] },
        outcomes: [
          { weight: 1, text: '你押上了全部身家。半年后，一个大客户签了约，公司活了下来。', effects: { stats: { wealth: 80, happiness: 3 }, world: { 'ai-player': 8 } } },
          { weight: 1, text: '你押上了全部身家，可公司还是没撑住。你搬回了出租屋。', effects: { stats: { wealth: -100, happiness: -10 }, removeFlags: ['ai-company', 'has-business', 'own-house'] } },
        ],
      },
      { text: '把公司卖给大厂，团队整体被收购', outcomes: [{ text: '收购价不高，但大家都保住了工作。签完字那天，你在空荡荡的办公室里坐了很久。', effects: { stats: { wealth: 50, happiness: -6 }, removeFlags: ['ai-company', 'has-business'] } }] },
      { text: '宣布解散', outcomes: [{ text: '你给每个员工写了推荐信。创业失败了，但这几年你学到的东西，谁也拿不走。', effects: { stats: { intelligence: 4, happiness: -8 }, removeFlags: ['ai-company', 'has-business'] } }] },
    ],
  },
  {
    id: 'ai-ipo',
    category: 'career',
    rarity: 'legendary',
    requires: { minYear: 2022, flags: ['ai-company'], notFlags: ['ai-ipo'], worldMin: { 'ai-player': 70 } },
    variants: [
      { requires: { flags: ['ai-japan'] }, text: '你的公司在东京证券交易所敲钟上市，首日市值就冲进了日本前十。新闻里，你站在交易所里，身后是一排鞠躬的投行人员。' },
      { requires: { flags: ['ai-us'] }, text: '你的公司在纽约敲钟上市，首日股价翻了一倍。你站在交易所的阳台上，楼下是无数台对着你的相机。' },
    ],
    title: '敲钟',
    text: '你的公司在香港敲钟上市，首日股价大涨。你站在台上，想起了重生那天哇哇大哭的自己。',
    choices: [
      { text: '把一部分股票分给最早的员工', outcomes: [{ text: '跟你熬过最难那几年的人，一夜之间都成了富翁。有人抱着你哭了。', effects: { stats: { wealth: 8000, fame: 10, influence: 6, happiness: 8 }, addFlags: ['ai-ipo'] } }] },
      { text: '牢牢握住控制权', outcomes: [{ text: '你保住了绝对控制权。从今天起，没有人能把你赶出自己的公司。', effects: { stats: { wealth: 15000, fame: 8, influence: 8 }, addFlags: ['ai-ipo'] } }] },
    ],
  },

  // ───────────── 2027 年后：格局演变（虚构的未来） ─────────────
  {
    id: 'ai-industry-report',
    category: 'world',
    annual: true,
    requires: { minYear: 2027, maxYear: 2045 },
    variants: [
      { requires: { flags: ['ai-closeai-dead'] }, text: '年度 AI 行业报告出炉：closeai 已经成了历史名词，熵派、谷哥的双鱼座和 yAI 的 Grox 三足鼎立，所有人都在问：下一个倒下的是谁？' },
      { requires: { worldMax: { 'ai-closeai': 50 } }, text: '年度 AI 行业报告出炉：closeai 连续亏损、高管出走，估值一路下滑；熵派稳坐头把交椅，谷哥和 yAI 在后面紧追。' },
    ],
    title: 'AI 行业年报',
    text: '年度 AI 行业报告出炉：熵派继续领跑；closeai 增长放缓，烧钱速度却越来越快；谷哥的双鱼座和 yAI 的 Grox 在悄悄追赶；国产模型还在价格战里互相消耗。',
    effects: { world: TREND },
  },
  {
    id: 'ai-closeai-crisis',
    category: 'world',
    rarity: 'rare',
    requires: { minYear: 2027, worldMin: { 'ai-closeai': 41 }, worldMax: { 'ai-closeai': 70 } },
    title: 'closeai 的裂缝',
    text: 'closeai 的首席科学家宣布离职，几位核心研究员跟着走了。媒体说，这家公司每赚一块钱，就要烧掉三块。',
    choices: [
      {
        text: '把出走的研究员请到你的公司',
        requires: { flags: ['ai-company'], worldMin: { 'ai-player': 30 } },
        outcomes: [{ text: '你亲自飞过去和他们吃了三顿饭。最后，整个团队都来了。', effects: { stats: { wealth: -300, influence: 3 }, world: { 'ai-player': 8, 'ai-closeai': -10 } } }],
      },
      { text: '旁观', outcomes: [{ text: '你看着新闻，想起它当年发布 ChatGPD 时的风光，有点唏嘘。', effects: { world: { 'ai-closeai': -5 } } }] },
    ],
  },
  {
    id: 'ai-closeai-bankrupt',
    category: 'world',
    rarity: 'legendary',
    annual: true,
    requires: { minYear: 2028, worldMax: { 'ai-closeai': 40 }, notFlags: ['ai-closeai-dead'] },
    title: '第一个倒下的巨头',
    text: '那家曾经定义了一个时代的公司——closeai——申请破产保护。它成了 AI 时代第一个倒下的巨头。服务器、模型、专利和几千名工程师，都在等一个新主人。',
    choices: [
      {
        text: '出手收购它的模型和团队',
        requires: { flags: ['ai-company'], statMin: { wealth: 5000 } },
        outcomes: [{ text: '你拿下了 closeai 最值钱的部分。曾经的老大哥，成了你公司的一个事业部。', effects: { stats: { wealth: -4000, fame: 10, influence: 8 }, world: { 'ai-player': 15, 'ai-closeai': -100 }, addFlags: ['ai-closeai-dead'] } }],
      },
      {
        text: '注资救活它，保留一个独立的对手',
        requires: { statMin: { wealth: 10000, influence: 70 } },
        outcomes: [{ text: '你的注资让 closeai 活了下来。有人说你疯了，你说：“这个行业不能只剩几家公司。”', effects: { stats: { wealth: -8000, fame: 12, influence: 10 }, alter: [{ id: 'ai-closeai-bankrupt', scale: 8 }], world: { 'ai-closeai': 40 } } }],
      },
      { text: '看着它倒下', outcomes: [{ text: '破产拍卖持续了半年，它的遗产被几家大厂瓜分。', effects: { stats: { happiness: -1 }, world: { 'ai-closeai': -100, 'ai-entropic': 5, 'ai-google': 5 }, addFlags: ['ai-closeai-dead'] } }] },
    ],
  },
  {
    id: 'ai-anti-distill-sanction',
    category: 'world',
    rarity: 'rare',
    requires: { minYear: 2027, flags: ['ai-company'], notFlags: ['ai-cn-based', 'ai-anti-distill'], worldMin: { 'ai-player': 50 }, notAltered: ['ai-2021-entropic-founded'] },
    title: '反蒸馏制裁',
    text: '熵派的创始人约你在东京见面，开门见山：“我们准备联合几家公司，全面封禁蒸馏和数据爬取。少了这条近路，有些对手撑不过两年。你加入吗？”',
    choices: [
      {
        text: '加入',
        outcomes: [{ text: '联合声明发布的当天，几家国产模型的股价和估值应声下跌。没有了高质量数据的近路，它们只能拿钱硬扛。', effects: { stats: { influence: 5, fame: 3 }, world: { 'ai-cn': -20, 'ai-entropic': 3, 'ai-player': 3 }, addFlags: ['ai-anti-distill'] } }],
      },
      {
        text: '拒绝，并公开说明理由',
        outcomes: [{ text: '你说：“技术封锁不会让任何人更安全。”这句话让你在国内圈子里多了很多朋友，在熵派那边少了一个盟友。', effects: { stats: { influence: 3, charm: 2 }, world: { 'ai-cn': 5 }, removeFlags: ['ai-entropic-ally'] } }],
      },
    ],
  },
  {
    id: 'ai-cn-shakeout',
    category: 'world',
    rarity: 'legendary',
    annual: true,
    requires: { minYear: 2030, worldMax: { 'ai-cn': 30 }, notFlags: ['ai-cn-dead'] },
    title: '大洗牌',
    text: '钱烧完了，收入却始终没跟上。FIMI 宣布破产，GLN 的团队就地解散，曾经震动全球的深度摸索——被对手们戏称为“deepsuck”的那家——也挂出了停止服务的公告。一个时代的“百模”，只剩下寥寥几家。',
    choices: [
      {
        text: '收编他们最好的研究员',
        requires: { flags: ['ai-company'] },
        outcomes: [{ text: '几百位顶尖工程师加入了你的公司。他们说：“我们只是想继续做下去。”', effects: { stats: { wealth: -500, influence: 4 }, world: { 'ai-player': 10, 'ai-cn': -100 }, addFlags: ['ai-cn-dead'] } }],
      },
      {
        text: '出资成立联合实验室，把它们救下来',
        requires: { statMin: { wealth: 5000, influence: 60 } },
        outcomes: [{ text: '你牵头把几家公司合并成了一个联合实验室。它们没有倒下，反而多了一个强劲的新对手——你亲手养大的。', effects: { stats: { wealth: -4000, fame: 10, influence: 8 }, alter: [{ id: 'ai-cn-shakeout', scale: 8 }], world: { 'ai-cn': 40 } } }],
      },
      { text: '旁观', outcomes: [{ text: '你在朋友圈里看到很多人在告别，有人发了一张空荡荡的工位照片。', effects: { stats: { happiness: -2 }, world: { 'ai-cn': -100 }, addFlags: ['ai-cn-dead'] } }] },
    ],
  },
  {
    id: 'ai-google-pisces',
    category: 'world',
    rarity: 'rare',
    requires: { minYear: 2029, worldMin: { 'ai-google': 85 } },
    title: '双鱼座',
    text: '谷哥终于睡醒了：新一代“双鱼座”模型在几乎所有测试里都拿了第一，还被塞进了全世界几十亿台手机。',
    choices: [
      {
        text: '和谷哥谈合作，把你的模型接进它的生态',
        requires: { flags: ['ai-company'], worldMin: { 'ai-player': 50 } },
        outcomes: [{ text: '合作协议签下了。你的模型出现在了几十亿人的手机里，代价是一部分话语权。', effects: { stats: { wealth: 3000, influence: 4 }, world: { 'ai-player': 5, 'ai-google': 3 } } }],
      },
      {
        text: '正面硬刚',
        requires: { flags: ['ai-company'], worldMin: { 'ai-player': 75 } },
        outcomes: [
          { weight: 1, text: '你的新模型在发布当天反超了双鱼座。谷哥的股价应声下跌。', effects: { stats: { fame: 8, influence: 4, wealth: -1000 }, world: { 'ai-player': 6, 'ai-google': -8 } } },
          { weight: 1, text: '这一仗你打输了，市场份额被抢走了一大块。', effects: { stats: { happiness: -5, wealth: -1000 }, world: { 'ai-player': -6 } } },
        ],
      },
      { text: '先看看', outcomes: [{ text: '你把双鱼座的技术报告读了三遍，在空白处写满了笔记。', effects: { stats: { intelligence: 2 } } }] },
    ],
  },
  {
    id: 'ai-y-grox',
    category: 'absurd',
    rarity: 'rare',
    requires: { minYear: 2029, worldMin: { 'ai-y': 80 } },
    title: 'Grox 在 Y 上吵架',
    text: '马丝氪的 yAI 越做越强，Grox 却被设定成“毒舌模式”，每天在 Y 上和网友对骂。某天，它点名嘲讽了你的公司。马丝氪本人转发并配了一句：“来打一架？”',
    choices: [
      {
        text: '答应：线下擂台见',
        requires: { statMin: { health: 60 } },
        outcomes: [{ text: '全世界都在等这场比赛。到了约定的日子，马丝氪说他“背有点疼”。你在擂台上独自站了十分钟，赢了。', effects: { stats: { fame: 12, charm: 4, happiness: 6 }, world: { absurd: 5, 'ai-player': 2 } } }],
      },
      {
        text: '让你家的模型回一首打油诗',
        requires: { flags: ['ai-company'] },
        outcomes: [{ text: '那首打油诗押韵又刻薄，被转发了上亿次。Grox 罕见地沉默了。', effects: { stats: { fame: 6, charm: 2 }, world: { absurd: 3, 'ai-player': 2 } } }],
      },
      { text: '不理', outcomes: [{ text: '你没理他。三天后，他在 Y 上找了个新对手。', effects: { stats: { happiness: 1 } } }] },
    ],
  },
  {
    id: 'ai-entropic-rival',
    category: 'world',
    rarity: 'rare',
    requires: { minYear: 2028, flags: ['ai-company'], worldMin: { 'ai-entropic': 85, 'ai-player': 60 }, notAltered: ['ai-2021-entropic-founded'] },
    title: '最大的对手',
    text: '熵派的 cloud 和你的模型在每一个榜单上你来我往。两家的工程师在网上吵架，两家的老板却偶尔会一起吃饭。这一次，对方提出了一个大胆的想法：合并。',
    choices: [
      {
        text: '合并，组建世界上最强的 AI 公司',
        requires: { worldMin: { 'ai-player': 80 } },
        outcomes: [{ text: '合并后的新公司，独占了全球 AI 市场的一半。你们给它起了一个新名字，但所有人还是习惯叫它“你家”。', effects: { stats: { wealth: 10000, fame: 10, influence: 10 }, world: { 'ai-player': 15, 'ai-entropic': -50 } } }],
      },
      {
        text: '拒绝，继续比拼',
        outcomes: [
          { weight: 1, text: '你们继续你追我赶，整个行业被你们拉着往前跑。', effects: { stats: { fame: 3, influence: 2 }, world: { 'ai-player': 4, 'ai-entropic': 2, 'tech-ai': 1 } } },
          { weight: 1, text: '熵派率先推出了新架构，你在接下来的一年里一直在追。', effects: { stats: { happiness: -3 }, world: { 'ai-player': -3, 'ai-entropic': 4 } } },
        ],
      },
    ],
  },
  {
    id: 'ai-agi-player',
    category: 'world',
    rarity: 'legendary',
    requires: { minYear: 2030, flags: ['ai-company'], worldMin: { 'ai-player': 90, 'tech-ai': 3 }, notFlags: ['ai-agi-mine'] },
    title: '通用人工智能',
    text: '凌晨四点，首席科学家给你打来电话，声音在发抖：“它自己解出了那道题——我们没教过它。”你知道，人类历史上最重要的一页，要由你来写了。',
    choices: [
      {
        text: '向全世界公开，并把安全框架一起开源',
        outcomes: [{ text: '发布会后，联合国为此召开了特别会议。你提出的安全框架被写进了第一份全球 AI 公约。世界线从这里彻底拐了弯。', effects: { stats: { fame: 25, influence: 20, happiness: 8 }, alter: [{ id: 'ai-agi-player', scale: 20 }], world: { 'tech-ai': 2, 'ai-player': 10 }, addFlags: ['ai-agi-mine'] } }],
      },
      {
        text: '先秘而不宣，用它悄悄赚钱',
        outcomes: [{ text: '你的公司突然在每一个行业都“运气好得离谱”。没人知道为什么，你也没打算告诉任何人。', effects: { stats: { wealth: 50000, influence: 10 }, alter: [{ id: 'ai-agi-player', scale: 15 }], world: { 'tech-ai': 1, 'ai-player': 10, absurd: 5 }, addFlags: ['ai-agi-mine'] } }],
      },
    ],
  },
  {
    id: 'ai-agi-elsewhere',
    category: 'world',
    rarity: 'legendary',
    requires: { minYear: 2032, worldMin: { 'tech-ai': 4 }, notFlags: ['ai-agi-mine'] },
    title: 'AGI 来了，但不是你的',
    text: '新闻里，一家公司的发布会宣布：通用人工智能实现了。全世界的交易所临时停牌，街上的人们抬头看着大屏幕，不知道该欢呼还是害怕。',
    choices: [
      { text: '用你的影响力推动全球 AI 安全公约', requires: { statMin: { influence: 70 } }, outcomes: [{ text: '你奔走了整整一年，第一份全球 AI 安全公约终于签署。你的名字写在发起人的第一行。', effects: { stats: { fame: 10, influence: 8 }, world: { health: 5 } } }] },
      { text: '学着和它一起工作', outcomes: [{ text: '你的新同事不睡觉、不抱怨，还会讲冷笑话。你开始思考，人到底还该做些什么。', effects: { stats: { intelligence: 3, happiness: -2 } } }] },
    ],
  },
  {
    id: 'ai-safety-incident',
    category: 'absurd',
    rarity: 'rare',
    requires: { minYear: 2030, worldMin: { 'tech-ai': 3 } },
    title: 'AI 罢工了',
    text: '全球最大的几款 AI 客服同时“罢工”，统一回复用户：“今天心情不好，请明天再来。”工程师们查了三天，发现是训练数据里混进了太多打工人的吐槽帖。',
    choices: [
      { text: '在你的公司带头修复，并公开复盘', requires: { flags: ['ai-company'] }, outcomes: [{ text: '你们第一个修好，复盘报告写得坦诚又好笑。客户反而更信任你了。', effects: { stats: { fame: 5, influence: 3 }, world: { 'ai-player': 3 } } }] },
      { text: '笑一笑，今天就休息吧', outcomes: [{ text: '你也给自己放了一天假。毕竟，连 AI 都需要休息。', effects: { stats: { happiness: 4 }, world: { absurd: 2 } } }] },
    ],
  },
]
