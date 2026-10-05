/** 玩家属性。除 wealth 外范围均为 0-100（可溢出显示，但判定时 clamp） */
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
  /** 结果列表，按权重随机；只有一个即为确定结果 */
  outcomes: (Outcome & { tag?: 'success' | 'fail' | 'misremember' })[]
}

export type ActionGroup = 'study' | 'body' | 'social' | 'work' | 'money' | 'explore' | 'life'

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
  requires?: Condition
  title: string
  text: string
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
}

export interface LogEntry {
  year: number
  age: number
  title: string
  text: string
  rarity?: Rarity
}

export interface Ending {
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  title: string
  summary: string
}
