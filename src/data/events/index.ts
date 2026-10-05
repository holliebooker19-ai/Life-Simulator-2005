import type { GameEvent } from '../../types'

/**
 * 自动注册：本目录下除 index.ts 外的所有 .ts 文件，导出的所有数组都会并入事件池。
 * 新增事件只需新建文件并 export 一个 GameEvent[]，不用改本文件（避免多人并行时冲突）。
 */
const modules = import.meta.glob<Record<string, unknown>>(['./*.ts', '!./index.ts'], { eager: true })

export const ALL_EVENTS: GameEvent[] = Object.keys(modules)
  .sort()
  .flatMap((path) => Object.values(modules[path]).filter(Array.isArray) as GameEvent[][])
  .flat()
