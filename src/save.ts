import { newState } from './engine'
import type { GameState } from './types'

/** 存档：每年年初自动保存到 localStorage，刷新页面后可以“继续上一局”。 */
const KEY = 'life1998-save'
/** 存档格式版本：GameState 结构不兼容时加一，旧存档自动作废 */
const VERSION = 1

type Saved = Omit<GameState, 'flags' | 'seen'> & { flags: string[]; seen: string[] }

export function serialize(s: GameState): string {
  const data: Saved = { ...s, flags: [...s.flags], seen: [...s.seen] }
  return JSON.stringify({ v: VERSION, data })
}

export function deserialize(raw: string): GameState | null {
  try {
    const { v, data } = JSON.parse(raw) as { v: number; data: Saved }
    if (v !== VERSION || !data) return null
    // 新版本加的字段（world、rel 等）在旧存档里没有：用新开局的默认值补齐
    const base = newState()
    return { ...base, ...data, rel: { ...base.rel, ...data.rel }, flags: new Set(data.flags), seen: new Set(data.seen) }
  } catch {
    return null
  }
}

export function saveGame(s: GameState): void {
  try { localStorage.setItem(KEY, serialize(s)) } catch { /* 隐私模式等不可用时忽略 */ }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? deserialize(raw) : null
  } catch {
    return null
  }
}

export function clearSave(): void {
  try { localStorage.removeItem(KEY) } catch { /* 忽略 */ }
}
