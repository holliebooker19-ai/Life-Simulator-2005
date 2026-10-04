/** 可注入随机源，便于测试 */
export type Rng = () => number

export function weightedPick<T>(items: T[], weightOf: (t: T) => number, rng: Rng): T | undefined {
  const total = items.reduce((s, i) => s + Math.max(0, weightOf(i)), 0)
  if (total <= 0) return undefined
  let r = rng() * total
  for (const item of items) {
    r -= Math.max(0, weightOf(item))
    if (r <= 0) return item
  }
  return items[items.length - 1]
}
