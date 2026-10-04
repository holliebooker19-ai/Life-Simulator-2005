import type { GameEvent } from '../../types'
import { childhoodEvents } from './childhood'
import { earlyYearsEvents } from './early-years'
import { financeEvents } from './finance'
import { worldEvents } from './world'

/**
 * 新增事件文件后，在这里引入并展开即可。
 * 事件规范见 docs/EVENT_GUIDE.md，PR 前请运行 npm run validate。
 */
export const ALL_EVENTS: GameEvent[] = [
  ...childhoodEvents,
  ...earlyYearsEvents,
  ...financeEvents,
  ...worldEvents,
]
