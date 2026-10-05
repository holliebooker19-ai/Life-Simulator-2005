import { bannerEl, heroEl } from './art'
import { formatWealth } from './engine'
import { ORIGINS, TALENTS } from './data/talents'
import { ALLOC_MAX, ALLOC_STATS, drawOrigin, drawTalent, runGame, START_POINTS, START_REROLLS, type Host } from './game'
import { clearSave, loadGame, saveGame } from './save'
import { renderShareImage } from './share'
import type { ActionGroup, Choice, EndingDim, GameAction, GameEvent, GameState, Origin, Outcome, Rarity, StatKey, Talent } from './types'

const app = document.getElementById('app')!

function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text) e.textContent = text
  return e
}

const RARITY_LABEL: Record<Rarity, string> = { common: '普通', rare: '稀有', legendary: '传说' }
const GROUP_LABEL: Record<ActionGroup, string> = {
  study: '学习', body: '身体', social: '社交', work: '工作', money: '理财', explore: '探索', life: '生活',
}
const GROUP_ORDER = Object.keys(GROUP_LABEL) as ActionGroup[]
/** 日志里最近多少条保持展开，更早的折叠成标题 */
const LOG_OPEN = 4
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
let speed = 1

export function showTitle(): void {
  app.replaceChildren()
  const box = h('div', 'screen center hero')
  box.append(heroEl(), h('h1', 'title', '1998重生'), h('p', 'sub', '带着 2026 年的记忆，回到 1998 年出生的那一天。'))
  const btn = h('button', 'btn big', '开始重生')
  btn.onclick = () => { clearSave(); showDraw() }
  box.append(btn)
  const saved = loadGame()
  if (saved?.alive && saved.origin) {
    const cont = h('button', 'btn', `继续上一局（${saved.year} 年 · ${saved.age} 岁）`)
    cont.onclick = () => startGame(saved.origin!, saved.talents, {}, saved)
    box.append(cont)
  }
  app.append(box)
}

function card(name: string, desc: string, rarity: Rarity, delay: number | null): HTMLElement {
  const c = h('div', `card ${rarity}${delay === null ? ' still' : ''}`)
  if (delay !== null) c.style.animationDelay = `${delay}ms`
  c.append(h('div', 'card-r', RARITY_LABEL[rarity]), h('div', 'card-n', name), h('div', 'card-d', desc))
  return c
}

const ALLOC_LABEL: Record<(typeof ALLOC_STATS)[number], string> = {
  intelligence: '智力', charm: '魅力', health: '体质', happiness: '快乐', memory: '记忆',
}

/**
 * 开局：
 * - 抽卡模式：抽出身 + 3 个天赋，共 5 次重抽机会（每张卡可单独重抽），可分配 20 点；
 * - 自选模式：自己挑出身和天赋，只能分配 8 点。
 */
function showDraw(mode: 'draw' | 'pick' = 'draw'): void {
  let origin = drawOrigin()
  let talents: Talent[] = []
  for (let i = 0; i < 3; i++) talents.push(drawTalent(talents))
  let rerolls = START_REROLLS
  const alloc: Record<string, number> = {}
  let first = true

  const render = () => {
    const pool = START_POINTS[mode]
    const used = Object.values(alloc).reduce((a, b) => a + b, 0)
    app.replaceChildren()
    const box = h('div', 'screen center draw')
    box.append(h('h2', '', '决定你的开局'))

    const tabs = h('div', 'tabs')
    for (const [m, label] of [['draw', '抽卡（20 点）'], ['pick', '自选（8 点）']] as const) {
      const tb = h('button', `tab${m === mode ? ' on' : ''}`, label)
      tb.onclick = () => { mode = m; for (const k of Object.keys(alloc)) delete alloc[k]; render() }
      tabs.append(tb)
    }
    box.append(tabs)

    const row = h('div', 'cards')
    const delay = (i: number) => (first ? 250 * i : null)
    if (mode === 'draw') {
      const wrapCard = (el: HTMLElement, reroll: () => void) => {
        const b = h('button', 'btn small reroll', `重抽（剩 ${rerolls}）`)
        b.disabled = rerolls <= 0
        b.onclick = () => { rerolls--; first = false; reroll(); render() }
        el.append(b)
        return el
      }
      row.append(wrapCard(card(`出身：${origin.name}`, origin.desc, origin.rarity, delay(0)), () => { origin = drawOrigin() }))
      talents.forEach((tl, i) => row.append(wrapCard(card(`天赋：${tl.name}`, tl.desc, tl.rarity, delay(i + 1)), () => { talents[i] = drawTalent(talents) })))
      box.append(row)
    } else {
      box.append(h('p', 'sub', '选 1 个出身，最多 3 个天赋'))
      const pickRow = (title: string, items: (Origin | Talent)[], isOrigin: boolean) => {
        box.append(h('h3', 'sec', title))
        const grid = h('div', 'cards pick')
        items.forEach((it) => {
          const on = isOrigin ? origin.id === it.id : talents.some((x) => x.id === it.id)
          const c = card(it.name, it.desc, it.rarity, null)
          c.classList.add('selectable')
          if (on) c.classList.add('on')
          c.onclick = () => {
            if (isOrigin) origin = it as Origin
            else if (on) talents = talents.filter((x) => x.id !== it.id)
            else if (talents.length < 3) talents = [...talents, it as Talent]
            render()
          }
          grid.append(c)
        })
        box.append(grid)
      }
      pickRow('出身', ORIGINS, true)
      pickRow(`天赋（${talents.length}/3）`, TALENTS, false)
    }

    box.append(h('h3', 'sec', `分配属性点（剩 ${pool - used}）`))
    const al = h('div', 'alloc')
    for (const k of ALLOC_STATS) {
      const line = h('div', 'alloc-row')
      const minus = h('button', 'btn small', '−')
      const plus = h('button', 'btn small', '＋')
      minus.disabled = !alloc[k]
      plus.disabled = used >= pool || (alloc[k] ?? 0) >= ALLOC_MAX
      minus.onclick = () => { alloc[k] = (alloc[k] ?? 0) - 1; render() }
      plus.onclick = () => { alloc[k] = (alloc[k] ?? 0) + 1; render() }
      line.append(h('span', '', ALLOC_LABEL[k]), minus, h('b', '', `+${alloc[k] ?? 0}`), plus)
      al.append(line)
    }
    box.append(al)

    const go = h('button', 'btn big', '开始人生')
    go.onclick = () => startGame(origin, talents, alloc)
    const bar = h('div', 'bar')
    bar.append(go)
    box.append(bar)
    app.append(box)
    first = false
  }
  render()
}

const STAT_LABELS: [StatKey, string][] = [
  ['intelligence', '智力'], ['charm', '魅力'], ['health', '体质'], ['happiness', '快乐'],
  ['fame', '名望'], ['influence', '影响力'], ['memory', '记忆'], ['wealth', '财富'],
]

async function startGame(origin: Origin, talents: Talent[], alloc: Record<string, number>, resume?: GameState): Promise<void> {
  app.replaceChildren()
  const wrap = h('div', 'game')
  const panel = h('aside', 'panel')
  const main = h('main', 'main')
  const header = h('div', 'year', '1998 · 0岁')
  const spd = h('button', 'btn small', '加速：关')
  spd.onclick = () => { speed = speed === 1 ? 4 : 1; spd.textContent = `加速：${speed === 1 ? '关' : '开'}` }
  const top = h('div', 'panel-top')
  top.append(header, spd)
  const divWrap = h('div', 'diverge')
  const divBar = h('div', 'diverge-bar')
  divWrap.append(h('span', '', '世界线偏离度'), divBar)
  const values = new Map<StatKey, HTMLElement>()
  const grid = h('div', 'stats')
  for (const [k, label] of STAT_LABELS) {
    const row = h('div', 'stat')
    const v = h('b', '', '0')
    values.set(k, v)
    row.append(h('span', '', label), v)
    grid.append(row)
  }
  panel.append(top, divWrap, grid)
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
    line.onclick = () => line.classList.toggle('open')
    log.append(line)
    // 较早的记录折叠成标题，点一下可展开，避免历史把当前选项挤出屏幕
    log.querySelectorAll('.log-line').forEach((el, i, all) => el.classList.toggle('old', i < all.length - LOG_OPEN))
    sync(s)
  }
  /** 让当前舞台内容进入视野：内容比屏幕高就对齐顶部（先读题），否则对齐底部 */
  const reveal = () => requestAnimationFrame(() => {
    stage.scrollIntoView({ behavior: 'smooth', block: stage.offsetHeight > main.clientHeight * 0.8 ? 'start' : 'end' })
  })
  const waitClick = (label: string) => new Promise<void>((res) => {
    const b = h('button', 'btn', label)
    b.onclick = () => { b.remove(); res() }
    stage.replaceChildren(b)
    reveal()
  })

  // 继续上一局时，把之前的日志重新铺出来
  for (const e of resume?.log ?? []) {
    const line = h('div', `log-line ${e.rarity ?? 'common'} old`)
    line.append(h('b', '', `${e.year}（${e.age}岁）${e.title}`), h('p', '', e.text))
    line.onclick = () => line.classList.toggle('open')
    log.append(line)
  }

  const host: Host = {
    onYear(s) { sync(s); saveGame(s) },
    async showAuto(ev, s) {
      addLog(s, ev, ev.text)
      reveal()
      await sleep(900 / speed)
    },
    async showChoice(ev, choices, s) {
      const wrapEv = h('div', `event ${ev.rarity ?? 'common'}`)
      wrapEv.append(bannerEl(ev), h('h3', '', `${s.year}（${s.age}岁）${ev.title}`), h('p', '', ev.text))
      stage.replaceChildren(wrapEv)
      return new Promise<Choice>((res) => {
        choices.forEach((c) => {
          const b = h('button', 'btn choice', c.text)
          if (c.usesMemory) b.append(h('span', 'tag', '利用记忆'))
          if (c.free) b.append(h('span', 'tag free', '自由发挥'))
          b.onclick = () => { stage.replaceChildren(); res(c) }
          wrapEv.append(b)
        })
        reveal()
      })
    },
    async showActions(s, actions, points) {
      const box = h('div', 'event actions')
      box.append(
        h('h3', '', `${s.year}（${s.age}岁）这一年，你想做什么？`),
        h('p', 'muted', `还能行动 ${points} 次。选一件事，或者顺其自然。`),
      )
      const tabs = h('div', 'tabs')
      const list = h('div', 'action-list')
      const groups = GROUP_ORDER.filter((g) => actions.some((a) => a.group === g))
      let active = groups[0]
      const render = () => {
        tabs.replaceChildren(...groups.map((g) => {
          const t = h('button', `tab${g === active ? ' on' : ''}`, GROUP_LABEL[g])
          t.onclick = () => { active = g; render() }
          return t
        }))
        list.replaceChildren(...actions.filter((a) => a.group === active).map((a) => {
          const b = h('button', 'btn choice action')
          b.append(h('span', 'a-t', a.text))
          if (a.usesMemory) b.append(h('span', 'tag', '利用记忆'))
          if (a.hint) b.append(h('span', 'a-h', a.hint))
          b.onclick = () => { stage.replaceChildren(); resolve(a) }
          return b
        }))
      }
      let resolve: (a: GameAction | null) => void = () => {}
      const p = new Promise<GameAction | null>((res) => { resolve = res })
      const skip = h('button', 'btn choice skip', '顺其自然，进入下一年')
      skip.onclick = () => { stage.replaceChildren(); resolve(null) }
      render()
      box.append(tabs, list, skip)
      stage.replaceChildren(box)
      reveal()
      return p
    },
    async showOutcome(ev, outcome: Outcome, reliable, s, auto) {
      const note = reliable === false ? '（记忆出现偏差！）' : ''
      addLog(s, ev, `${outcome.text}${note}`)
      reveal()
      if (auto) await sleep(1500 / speed)
      else await waitClick('继续')
    },
  }

  const { state, ending } = await runGame(origin, talents, host, Math.random, alloc, resume)
  clearSave()
  showEnding(state, ending)
}

const DIM_LABEL: Record<EndingDim, string> = {
  wealth: '财富', influence: '影响力', world: '世界线', family: '家庭', joy: '幸福', longevity: '寿命',
}

function showEnding(s: GameState, e: ReturnType<typeof import('./engine').computeEnding>): void {
  app.replaceChildren()
  const box = h('div', 'screen center')
  box.append(h('div', `grade g-${e.grade}`, e.grade), h('h2', '', e.title), h('p', '', e.summary))
  const dims = h('div', 'dims')
  for (const k of Object.keys(DIM_LABEL) as EndingDim[]) {
    const row = h('div', 'dim')
    const bar = h('div', 'dim-bar')
    const fill = h('i')
    fill.style.width = `${Math.round(e.dims[k])}%`
    bar.append(fill)
    row.append(h('span', '', DIM_LABEL[k]), bar, h('b', '', String(Math.round(e.dims[k]))))
    dims.append(row)
  }
  box.append(dims, h('p', 'sub', `综合得分 ${e.score}`))
  const img = h('img', 'share') as HTMLImageElement
  img.src = renderShareImage(s, e)
  const bar = h('div', 'bar')
  const save = h('a', 'btn', '保存分享图') as HTMLAnchorElement
  save.href = img.src
  save.download = 'life-1998.png'
  const again = h('button', 'btn big', '再活一次')
  again.onclick = showTitle
  bar.append(save, again)
  box.append(img, bar)
  app.append(box)
}
