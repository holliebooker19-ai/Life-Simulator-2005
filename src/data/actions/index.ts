import type { GameAction } from '../../types'

/**
 * 自动注册：本目录下除 index.ts 外所有 .ts 文件导出的 GameAction[] 都会并入行动池。
 *
 * 行动写入的标记（新增标记请在此登记一行）：
 * - skill-coding：学过编程（解锁个人项目、技术创业）
 * - skill-english：英语很好（解锁出国交流）
 * - fit：坚持锻炼
 * - partner / married / has-child：感情线
 * - has-business：有自己的小生意（解锁扩张、转让）
 * - employed / side-gig：有工作/兼职
 * - own-house / best-friend：买了房 / 有挚友
 * - retired：60 岁退休（由引擎年度结算写入）
 * - health-chronic：慢性病（events/health.ts）
 * - has-foundation：成立了基金会（每年自然获得影响力）
 */
const modules = import.meta.glob<Record<string, unknown>>(['./*.ts', '!./index.ts'], { eager: true })

export const ALL_ACTIONS: GameAction[] = Object.keys(modules)
  .sort()
  .flatMap((path) => Object.values(modules[path]).filter(Array.isArray) as GameAction[][])
  .flat()
