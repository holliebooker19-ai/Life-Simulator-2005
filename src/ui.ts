import { formatWealth } from './engine'
import { drawStart, runGame, type Host } from './game'
import { renderShareImage } from './share'
import type { Choice, GameEvent, GameState, Origin, Outcome, Rarity, StatKey, Talent } from './types'

const app = document.getElementById('app')!

function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text) e.textContent = text
  return e
}

const RARITY_LABEL: Record<Rarity, string> = { common: '普通', rare: '稀有', legendary: '传说' }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
let speed = 1

export function showTitle(): void {
  app.replaceChildren()
  const box = h('div', 'screen center')
  box.append(h('h1', 'title', '2005重生'), h('p', 'sub', '带着 2026 年的记忆，回到 2005 年出生的那一天。'))
  const btn = h('button', 'btn big', '开始重生')
  btn.onclick = showDraw
  box.append(btn)
  app.append(box)
}

function card(name: string, desc: string, rarity: Rarity, delay: number): HTMLElement {
  const c = h('div', `card ${rarity}`)
  c.style.animationDelay = `${delay}ms`
  c.append(h('div', 'card-r', RARITY_LABEL[rarity]), h('div', 'card-n', name), h('div', 'card-d', desc))
  return c
}

function showDraw(): void {
  app.replaceChildren()
  const box = h('div', 'screen center')
  box.append(h('h2', '', '抽取你的命运'))
  const row = h('div', 'cards')
  const { origin, talents } = drawStart()
  row.append(card(`出身：${origin.name}`, origin.desc, origin.rarity, 0))
  talents.forEach((t, i) => row.append(card(`天赋：${t.name}`, t.desc, t.rarity, 250 * (i + 1))))
  const again = h('button', 'btn', '重抽一次')
  again.onclick = showDraw
  const go = h('button', 'btn big', '开始人生')
  go.onclick = () => startGame(origin, talents)
  const bar = h('div', 'bar')
  bar.append(again, go)
  box.append(row, bar)
  app.append(box)
}

const STAT_LABELS: [StatKey, string][] = [
  ['intelligence', '智力'], ['charm', '魅力'], ['health', '体质'], ['happiness', '快乐'],
  ['fame', '名望'], ['influence', '影响力'], ['memory', '记忆'], ['wealth', '财富'],
]

async function startGame(origin: Origin, talents: Talent[]): Promise<void> {
  app.replaceChildren()
  const wrap = h('div', 'game')
  const panel = h('aside', 'panel')
  const main = h('main', 'main')
  const header = h('div', 'year', '2005 · 0岁')
  const divWrap = h('div', 'diverge')
  const divBar = h('div', 'diverge-bar')
  divWrap.append(h('span', '', '世界线偏离度'), divBar)
  const values = new Map<StatKey, HTMLElement>()
  panel.append(header, divWrap)
  for (const [k, label] of STAT_LABELS) {
    const row = h('div', 'stat')
    const v = h('b', '', '0')
    values.set(k, v)
    row.append(h('span', '', label), v)
    panel.append(row)
  }
  const spd = h('button', 'btn small', '加速：关')
  spd.onclick = () => { speed = speed === 1 ? 4 : 1; spd.textContent = `加速：${speed === 1 ? '关' : '开'}` }
  panel.append(spd)
  const log = h('div', 'log')
  const stage = h('div', 'stage')
  main.append(log, stage)
  wrap.append(panel, main)
  app.append(wrap)

  const shown = new Map<StatKey, number>()
  const roll = (k: StatKey, to: number) => {
    const el = values.get(k)!
    const from = shown.get(k) ?? 0
    shown.set(k, to)
    const t0 = performance.now()
    const dur = 500 / speed
    const fmt = (n: number) => (k === 'wealth' ? formatWealth(n) : String(Math.round(n)))
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      el.textContent = fmt(from + (to - from) * p)
      if (p < 1) requestAnimationFrame(step)
    }
    if (from !== to) {
      el.classList.remove('up', 'down')
      el.classList.add(to > from ? 'up' : 'down')
    }
    requestAnimationFrame(step)
  }
  const sync = (s: GameState) => {
    header.textContent = `${s.year} · ${s.age}岁`
    for (const [k] of STAT_LABELS) roll(k, s.stats[k])
    divBar.style.width = `${s.divergence}%`
  }
  const addLog = (s: GameState, ev: GameEvent, extra: string) => {
    const line = h('div', `log-line ${ev.rarity ?? 'common'}`)
    line.append(h('b', '', `${s.year}（${s.age}岁）${ev.title}`), h('p', '', extra))
    log.append(line)
    log.scrollTop = log.scrollHeight
    sync(s)
  }
  const waitClick = (label: string) => new Promise<void>((res) => {
    const b = h('button', 'btn', label)
    b.onclick = () => { b.remove(); res() }
    stage.replaceChildren(b)
  })

  const host: Host = {
    onYear: sync,
    async showAuto(ev, s) {
      addLog(s, ev, ev.text)
      await sleep(900 / speed)
    },
    async showChoice(ev, choices, s) {
      const wrapEv = h('div', `event ${ev.rarity ?? 'common'}`)
      wrapEv.append(h('h3', '', `${s.year}（${s.age}岁）${ev.title}`), h('p', '', ev.text))
      stage.replaceChildren(wrapEv)
      return new Promise<Choice>((res) => {
        choices.forEach((c) => {
          const b = h('button', 'btn choice', c.text)
          if (c.usesMemory) b.append(h('span', 'tag', '利用记忆'))
          b.onclick = () => { stage.replaceChildren(); res(c) }
          wrapEv.append(b)
        })
      })
    },
    async showOutcome(ev, outcome: Outcome, reliable, s) {
      const note = reliable === false ? '（记忆出现偏差！）' : ''
      addLog(s, ev, `${outcome.text}${note}`)
      await waitClick('继续')
    },
  }

  const { state, ending } = await runGame(origin, talents, host)
  showEnding(state, ending)
}

function showEnding(s: GameState, e: ReturnType<typeof import('./engine').computeEnding>): void {
  app.replaceChildren()
  const box = h('div', 'screen center')
  box.append(h('div', `grade g-${e.grade}`, e.grade), h('h2', '', e.title), h('p', '', e.summary))
  const img = h('img', 'share') as HTMLImageElement
  img.src = renderShareImage(s, e)
  const bar = h('div', 'bar')
  const save = h('a', 'btn', '保存分享图') as HTMLAnchorElement
  save.href = img.src
  save.download = 'life-2005.png'
  const again = h('button', 'btn big', '再活一次')
  again.onclick = showTitle
  bar.append(save, again)
  box.append(img, bar)
  app.append(box)
}
