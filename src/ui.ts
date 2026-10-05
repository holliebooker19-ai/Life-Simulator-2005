import { bannerEl, heroEl } from './art'
import { formatWealth, relOf, worldlineDiff, worldOf } from './engine'
import { HEADLINES } from './data/headlines'
import { TECH_MAX, WORLD_VARS } from './data/world'
import { ORIGINS, TALENTS } from './data/talents'
import { ALLOC_MAX, ALLOC_STATS, drawOrigin, drawTalent, runGame, START_POINTS, START_REROLLS, type Host } from './game'
import { clearSave, loadGame, saveGame } from './save'
import { renderShareImage } from './share'
import type {
  ActionGroup, Choice, EndingDim, GameAction, GameEvent, GameState, MemoryCheck, Origin, Outcome, Rarity, StatKey, Talent,
} from './types'

const app = document.getElementById('app')!

function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text) e.textContent = text
  return e
}

const RARITY_LABEL: Record<Rarity, string> = { common: '普通', rare: '稀有', legendary: '传说' }
const GROUP_LABEL: Record<ActionGroup, string> = {
  study: '学习', body: '身体', social: '社交', work: '工作', money: '理财', explore: '探索', life: '生活', world: '改变世界',
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
  const wl = h('button', 'btn small', '世界线')
  let current: GameState | null = resume ?? null
  wl.onclick = () => { if (current) showWorld(current) }
  const top = h('div', 'panel-top')
  top.append(header, wl, spd)
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
  const family = h('div', 'family')
  panel.append(top, divWrap, grid, family)
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
    current = s
    header.textContent = `${s.year} · ${s.age}岁`
    for (const [k] of STAT_LABELS) roll(k, s.stats[k])
    divBar.style.width = `${s.divergence}%`
    family.replaceChildren(...familyLines(s).map((t) => h('p', '', t)))
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
    async showQuiz(ev, _choice, quiz, hint, s) {
      const box = h('div', `event quiz ${ev.rarity ?? 'common'}`)
      const m = Math.round(s.stats.memory)
      const tip = hint.flash !== undefined
        ? `记忆 ${m}：记忆闪回！答案自己浮现在眼前。`
        : hint.eliminated.length
          ? `记忆 ${m}：你很确定，不是划掉的那 ${hint.eliminated.length} 个。`
          : `记忆 ${m}：记忆太模糊了，只能靠你自己。`
      box.append(h('h3', '', `回忆一下：${quiz.q}`), h('p', 'muted', tip))
      return new Promise<number | null>((res) => {
        quiz.options.forEach((opt, i) => {
          const out = hint.eliminated.includes(i)
          const b = h('button', `btn choice${out ? ' out' : ''}${hint.flash === i ? ' flash' : ''}`, opt)
          b.disabled = out
          b.onclick = () => { stage.replaceChildren(); res(i) }
          box.append(b)
        })
        const gut = h('button', 'btn choice skip', `想不起来，交给直觉（约 ${Math.round(hint.intuition * 100)}% 把握）`)
        gut.onclick = () => { stage.replaceChildren(); res(null) }
        box.append(gut)
        stage.replaceChildren(box)
        reveal()
      })
    },
    async showOutcome(ev, outcome: Outcome, check, s, auto) {
      const note = checkNote(check)
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

function checkNote(c?: MemoryCheck): string {
  if (!c) return ''
  if (c.via === 'quiz') return c.reliable ? '（答对了！）' : '（答错了：历史不是这样走的。）'
  if (c.via === 'intuition') return c.reliable ? '（直觉对了！）' : '（直觉失灵了！）'
  return c.reliable ? '' : '（记忆出现偏差！）'
}

/** 侧栏的“家人”一栏 */
function familyLines(s: GameState): string[] {
  if (s.age < 16) return []
  const lines: string[] = []
  const r = s.rel
  if (r.parentsLost >= 2) lines.push('父母：已离世')
  else lines.push(`父母：${relOf(s, 'parentAge')} 岁 · ${r.parents >= 70 ? '身体硬朗' : r.parents >= 40 ? '有些小毛病' : '身体不好'}${r.parentsLost ? '（一位已离世）' : ''}`)
  if (s.flags.has('married') || s.flags.has('partner')) {
    const who = s.flags.has('married') ? '伴侣' : '恋人'
    lines.push(`${who}：${!r.partner ? '刚刚在一起' : r.partner >= 70 ? '感情很好' : r.partner >= 40 ? '平平淡淡' : '有些冷淡'}`)
  }
  const ca = relOf(s, 'childAge')
  if (s.flags.has('has-child')) lines.push(`孩子：${ca > 0 ? `${ca} 岁` : '刚出生'}${s.flags.has('grandchild') ? ' · 已有孙辈' : ''}`)
  return lines
}

/** 世界线面板：原历史 vs 你的世界、科技树、AI 格局、世界趋势 */
function showWorld(s: GameState): void {
  const mask = h('div', 'overlay')
  const box = h('div', 'overlay-box')
  const close = h('button', 'btn small', '关闭')
  close.onclick = () => mask.remove()
  mask.onclick = (e) => { if (e.target === mask) mask.remove() }
  box.append(h('h3', '', `世界线偏离度 ${Math.round(s.divergence)}%`), close)

  box.append(h('h4', 'sec', '原历史 vs 你的世界'))
  const diff = worldlineDiff(s, HEADLINES)
  if (!diff.length) box.append(h('p', 'sub', '还没有到达任何可以改写的历史节点。'))
  for (const d of diff) {
    const row = h('div', `wl-row${d.mine ? ' changed' : ''}`)
    row.append(h('b', '', String(d.year)), h('p', '', `原历史：${d.real}`))
    row.append(h('p', d.mine ? 'mine' : 'sub', d.mine ? `你的世界：${d.mine}` : '你的世界：（与原历史相同）'))
    box.append(row)
  }

  const bar = (label: string, v: number, max: number) => {
    const row = h('div', 'dim')
    const b = h('div', 'dim-bar')
    const fill = h('i')
    fill.style.width = `${Math.max(0, Math.min(100, (v / max) * 100))}%`
    b.append(fill)
    row.append(h('span', '', label), b, h('b', '', max === TECH_MAX ? `${v}/${max}` : String(Math.round(v))))
    return row
  }
  box.append(h('h4', 'sec', '科技树'))
  const tech = h('div', 'dims')
  for (const v of WORLD_VARS.filter((x) => x.kind === 'tech')) tech.append(bar(v.name, worldOf(s, v.id), TECH_MAX))
  box.append(tech)

  const power = WORLD_VARS.filter((x) => x.kind === 'power' && s.world[x.id] !== undefined)
  if (power.length) {
    box.append(h('h4', 'sec', 'AI 格局'))
    const g = h('div', 'dims')
    for (const v of power) {
      const n = worldOf(s, v.id)
      g.append(n > 0 ? bar(v.name, n, 100) : (() => { const r = h('div', 'dim'); r.append(h('span', '', v.name), h('i', 'sub', '已出局')); return r })())
    }
    box.append(g)
  }
  const trends = WORLD_VARS.filter((x) => x.kind === 'trend' && worldOf(s, x.id))
  if (trends.length) {
    box.append(h('h4', 'sec', '世界趋势（相对原历史）'))
    for (const v of trends) {
      const n = Math.round(worldOf(s, v.id))
      box.append(h('p', '', `${v.name}：${n > 0 ? '+' : ''}${n}（${v.desc}）`))
    }
  }
  mask.append(box)
  document.body.append(mask)
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
  const paper = h('div', 'paper')
  paper.append(h('div', 'paper-head', '世界日报 · 头版'))
  for (const line of e.newspaper) paper.append(h('p', '', line))
  box.append(paper)
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
