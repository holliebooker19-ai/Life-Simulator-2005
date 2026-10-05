/** 玩家属性。除 wealth 外范围均为 0-100（引擎会 clamp 到 0-100，health 允许降到 0 以下表示死亡） */
export interface Stats {
  intelligence: number // 智力
  charm: number // 魅力
  health: number // 体质，<=0 死亡
  happiness: number // 快乐
  fame: number // 名望
  influence: number // 影响力，决定能否改写世界线
  memory: number // 记忆清晰度：用于“预知”类选项的成功率
  wealth: number // 财富，单位：万元，可为负
}

export type StatKey = keyof Stats

/** 世界线偏离度 0-100，由被改写的历史锚点派生。越高，现实记忆越不可靠 */
export type Divergence = number

export type StatDelta = Partial<Record<StatKey, number>>

export interface Effects {
  stats?: StatDelta
  /**
   * 改写历史锚点：{ id: 事件id, scale: 影响大小 1~25 }。
   * 只有“真的改变了世界”才用它；个人赚钱/成名/人脉不要用。世界线偏离度由所有被改写锚点的 scale 之和派生。
   */
  alter?: { id: string; scale: number }[]
  addFlags?: string[]
  removeFlags?: string[]
  /**
   * 改变世界状态变量（见 src/data/world.ts）：趋势类 0 = 与真实历史一致，正负表示偏离方向；
   * 科技树类为等级 0-5（0 = 真实 2026 年的水平）。
   */
  world?: Record<string, number>
  /** 寿命上限增减（科技树延寿等） */
  maxAge?: number
  /** 亲人状态增减：父母身体、与伴侣的感情（见 Relations） */
  rel?: Partial<Record<'parents' | 'partner', number>>
}

export interface Condition {
  minAge?: number
  maxAge?: number
  /** 现实年份范围（用于只在某段历史里可做的行动） */
  minYear?: number
  maxYear?: number
  /** 属性下限 / 上限 */
  statMin?: StatDelta
  statMax?: StatDelta
  /** 必须拥有 / 必须没有的标记 */
  flags?: string[]
  notFlags?: string[]
  /** 锚点是否被玩家改写：用于写“改写后的版本”事件，真实版本写 notAltered */
  altered?: string[]
  notAltered?: string[]
  /** 世界线偏离度范围（派生值） */
  divergenceMin?: number
  divergenceMax?: number
  /** 世界状态变量范围，未设置的变量视为 0 */
  worldMin?: Record<string, number>
  worldMax?: Record<string, number>
  /** 亲人状态范围（见 RelKey）。没有孩子时 childAge 为 -1，写孩子的事件请同时要求 has-child */
  relMin?: Partial<Record<RelKey, number>>
  relMax?: Partial<Record<RelKey, number>>
}

/**
 * 预知题：玩家选择“利用记忆”的选项后作答。答对按 success 结算，答错按 misremember/fail 结算；
 * 也可以“交给直觉”，按旧的掷骰判定（成功率打折）。题目只用确凿的史实。
 */
export interface Quiz {
  q: string
  /** 3–4 个选项 */
  options: string[]
  /** 正确答案的下标（原历史） */
  answer: number
  /**
   * 世界线偏移后（事件 dependsOn 的锚点被改写）真正的答案。记忆提示仍然指向 answer，变成“陷阱题”。
   * 不写时，偏移后答对也只有一半把握。
   */
  shiftedAnswer?: number
}

/** 记忆给出的提示：排除的错误选项、“记忆闪回”直接给出的答案、交给直觉的成功率 */
export interface QuizHint {
  eliminated: number[]
  flash?: number
  intuition: number
}

/** 预知选项的判定结果：quiz = 自己作答，intuition = 交给直觉，dice = 没有题目的旧判定 */
export interface MemoryCheck {
  reliable: boolean
  via: 'quiz' | 'intuition' | 'dice'
}

export interface Outcome {
  /** 权重，默认 1。用于赌博/随机类结果 */
  weight?: number
  /** 仅当满足条件时才会进入候选 */
  requires?: Condition
  text: string
  effects?: Effects
}

export interface Choice {
  text: string
  /** 选项可见/可选的条件 */
  requires?: Condition
  /**
   * 标记这是“利用未来记忆”的选项：
   * 引擎会按 memory 与 divergence 计算“记忆可靠”概率，
   * 不可靠时走 outcomes 中 tag 为 'misremember' 的结果（如有）。
   */
  usesMemory?: boolean
  /** 通用“自由发挥”选项（由引擎追加到事件里，UI 会特别标注） */
  free?: boolean
  /** 预知题（只对 usesMemory 有效）；不写时用事件的 quiz 或题库 src/data/quizzes.ts */
  quiz?: Quiz
  /** 结果列表，按权重随机；只有一个即为确定结果 */
  outcomes: (Outcome & { tag?: 'success' | 'fail' | 'misremember' })[]
}

export type ActionGroup = 'study' | 'body' | 'social' | 'work' | 'money' | 'explore' | 'life' | 'world'

/** 每年可自由选择的“行动”，不依赖事件触发，是玩家主动权的主要来源 */
export interface GameAction extends Choice {
  id: string
  group: ActionGroup
  /** 按钮下方的一句话提示 */
  hint?: string
  /** 一局只能做一次 */
  once?: boolean
  /** 做完后隔多少年才能再做，默认 0 */
  cooldown?: number
}

export type Rarity = 'common' | 'rare' | 'legendary'

export interface GameEvent {
  /** 全局唯一，kebab-case，建议以类别开头，如 finance-2007-bull */
  id: string
  category: 'life' | 'school' | 'family' | 'career' | 'finance' | 'world' | 'absurd'
  rarity?: Rarity
  /** 固定年份事件（现实历史节点）。设置后优先触发 */
  year?: number
  /** 随机事件使用的权重，默认 10 */
  weight?: number
  /** 同一局内只触发一次，默认 true */
  once?: boolean
  /** 每年都触发（满足条件时，可重复），和固定年份事件一起结算。用于世界的默认走向，如行业年报 */
  annual?: boolean
  requires?: Condition
  title: string
  text: string
  /** 按世界状态替换标题/正文：取第一个满足条件的版本（重量世界线用它做“同一事件、不同世界”的变体） */
  variants?: { requires: Condition; title?: string; text: string }[]
  /** 事件里所有 usesMemory 选项共用的预知题（也可以写在题库 src/data/quizzes.ts） */
  quiz?: Quiz
  /** 依赖的历史锚点：其中任何一个被改写，事件会标注“世界线已偏移”，预知可靠度减半 */
  dependsOn?: string[]
  /** 无 choices 表示自动事件：直接结算 effects */
  effects?: Effects
  choices?: Choice[]
  /**
   * 现实事实备注。凡涉及真实历史/数据的事件必须填写，用于人工核对。
   * 人名、公司名必须按 docs/NAMING.md 改名，这里写原始事实时不写真名，写“某某”即可。
   */
  realFact?: string
}

export interface Talent {
  id: string
  name: string
  rarity: Rarity
  desc: string
  effects: Effects
}

export interface Origin {
  id: string
  name: string
  rarity: Rarity
  desc: string
  effects: Effects
}

export interface GameState {
  year: number // 当前现实年份
  age: number
  alive: boolean
  stats: Stats
  divergence: Divergence // 派生值，由 altered 计算
  /** 被改写的锚点：事件 id → 影响大小 */
  altered: Record<string, number>
  flags: Set<string>
  seen: Set<string>
  /** 行动上次执行的年份，用于冷却 */
  lastDone: Record<string, number>
  talents: Talent[]
  origin: Origin | null
  log: LogEntry[]
  /** 寿命上限，默认 100；由科技树（如基因工程）通过 Effects.maxAge 提高 */
  maxAge: number
  /** 世界状态变量（含科技树等级），见 src/data/world.ts */
  world: Record<string, number>
  /** 一生快乐值累计，用于结局的“幸福”维度 */
  joySum: number
  joyYears: number
  /** 亲人：父母、伴侣、孩子（DESIGN_V2 P5） */
  rel: Relations
}

/** 亲人的状态。父母年龄、孩子年龄由年份派生，见 engine.relOf */
export interface Relations {
  /** 父母的身体状况 0-100，随年龄下降 */
  parents: number
  /** 已经离世的父母人数 0-2 */
  parentsLost: number
  /** 和伴侣的感情 1-100；没有伴侣时为 0 */
  partner: number
  /** 第一个孩子的出生年份；0 = 还没有孩子 */
  childBorn: number
}

/** 条件里可读的亲人状态：parentAge / childAge 为派生值 */
export type RelKey = 'parentAge' | 'parents' | 'parentsLost' | 'partner' | 'childAge'

/** 年度账单：每年年底结算的收入与开销，单位万元 */
export interface YearBill {
  income: number
  expense: number
  lines: string[]
}

export interface LogEntry {
  year: number
  age: number
  title: string
  text: string
  rarity?: Rarity
}

/** 新闻头条：原历史与玩家世界线的对照。带 anchor 的条目会进入“世界线对比”面板 */
export interface Headline {
  year: number
  /** 关联的历史锚点（事件 id）：被改写时显示 altered */
  anchor?: string
  real: string
  altered?: string
  /** 只在满足条件时出现（2027 年后按世界状态生成新闻用） */
  requires?: Condition
}

export type EndingDim = 'wealth' | 'influence' | 'world' | 'family' | 'joy' | 'longevity'

export interface Ending {
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  title: string
  summary: string
  /** 六个维度的得分 0-100 */
  dims: Record<EndingDim, number>
  score: number
  /** 结局报纸的头条 */
  newspaper: string[]
}
