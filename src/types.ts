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

/** 世界线偏离度 0-100。越高，现实记忆越不可靠 */
export type Divergence = number

export type StatDelta = Partial<Record<StatKey, number>>

export interface Effects {
  stats?: StatDelta
  divergence?: number // 世界线偏离度增量
  addFlags?: string[]
  removeFlags?: string[]
}

export interface Condition {
  minAge?: number
  maxAge?: number
  /** 属性下限 / 上限 */
  statMin?: StatDelta
  statMax?: StatDelta
  /** 必须拥有 / 必须没有的标记 */
  flags?: string[]
  notFlags?: string[]
  /** 世界线偏离度范围 */
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
  /** 结果列表，按权重随机；只有一个即为确定结果 */
  outcomes: (Outcome & { tag?: 'success' | 'fail' | 'misremember' })[]
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
  divergence: Divergence
  flags: Set<string>
  seen: Set<string>
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
