import { formatWealth } from './engine'
import type { Ending, GameState } from './types'

/** 生成分享图（canvas → PNG dataURL） */
export function renderShareImage(s: GameState, e: Ending): string {
  const c = document.createElement('canvas')
  c.width = 720
  c.height = 960
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 0, 960)
  grad.addColorStop(0, '#1b2a49')
  grad.addColorStop(1, '#0b1020')
  g.fillStyle = grad
  g.fillRect(0, 0, 720, 960)

  g.fillStyle = '#ffd86b'
  g.font = 'bold 40px sans-serif'
  g.fillText('2005重生 · 人生模拟器', 48, 90)

  g.font = 'bold 220px sans-serif'
  g.fillStyle = e.grade === 'S' ? '#ff6b6b' : e.grade === 'A' ? '#ffd86b' : '#9ad1ff'
  g.fillText(e.grade, 48, 330)

  g.fillStyle = '#fff'
  g.font = 'bold 52px sans-serif'
  g.fillText(e.title, 48, 420)

  g.font = '30px sans-serif'
  g.fillStyle = '#cfd8ef'
  const lines = [
    `出身：${s.origin?.name ?? '-'}`,
    `天赋：${s.talents.map((t) => t.name).join(' / ')}`,
    `享年：${s.age} 岁（2005—${s.year}）`,
    `财富：${formatWealth(s.stats.wealth)}`,
    `名望 ${Math.round(s.stats.fame)}  影响力 ${Math.round(s.stats.influence)}`,
    `世界线偏离度：${Math.round(s.divergence)}%`,
  ]
  lines.forEach((l, i) => g.fillText(l, 48, 500 + i * 56))

  g.font = '24px sans-serif'
  g.fillStyle = '#7f8db3'
  g.fillText('带着2026年的记忆，重生在2005年', 48, 900)
  return c.toDataURL('image/png')
}
