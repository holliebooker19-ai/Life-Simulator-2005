import type { GameEvent } from './types'

/** 全部为内联 SVG（纯代码绘制，无外部图片），内容固定，不含用户输入 */

const win = (x: number, y: number, on: boolean) =>
  `<rect x="${x}" y="${y}" width="5" height="7" fill="${on ? '#ffd86b' : '#27345f'}"/>`

function skyline(): string {
  const blds = [
    [0, 90, 40], [40, 60, 34], [74, 100, 30], [104, 70, 44], [148, 110, 28], [176, 80, 38],
    [214, 55, 32], [246, 95, 40], [286, 75, 30], [316, 105, 36], [352, 65, 42], [394, 90, 30],
  ]
  let out = ''
  blds.forEach(([x, h, w], i) => {
    out += `<rect x="${x}" y="${200 - h}" width="${w}" height="${h}" fill="#10172e"/>`
    for (let r = 0; r < Math.floor(h / 16); r++) {
      for (let c = 0; c < Math.floor(w / 12); c++) out += win(x + 5 + c * 12, 200 - h + 8 + r * 16, (i * 7 + r * 3 + c) % 3 !== 0)
    }
  })
  return out
}

export function heroSvg(): string {
  const stars = Array.from({ length: 28 }, (_, i) => {
    const x = (i * 97) % 420, y = (i * 53) % 110
    return `<circle cx="${x}" cy="${y}" r="${i % 4 === 0 ? 1.6 : 1}" fill="#fff" opacity="${0.4 + (i % 5) * 0.12}"><animate attributeName="opacity" values="0.2;1;0.2" dur="${2 + (i % 4)}s" repeatCount="indefinite"/></circle>`
  }).join('')
  return `<svg viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="1998 年的夜景与一台老电脑">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1147"/><stop offset=".6" stop-color="#3b1d6e"/><stop offset="1" stop-color="#e0568a"/></linearGradient>
    <radialGradient id="scr" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#7affc8"/><stop offset="1" stop-color="#0c5b4a"/></radialGradient>
  </defs>
  <rect width="420" height="240" fill="url(#sky)"/>
  ${stars}
  <circle cx="330" cy="70" r="26" fill="#ffe9a8" opacity=".95"/>
  <g transform="translate(0,30)">${skyline()}</g>
  <g transform="translate(120,52)">
    <rect x="0" y="0" width="180" height="130" rx="14" fill="#cfc9b8" stroke="#8d8672" stroke-width="3"/>
    <rect x="14" y="14" width="152" height="94" rx="10" fill="url(#scr)"/>
    <text x="90" y="72" text-anchor="middle" font-family="monospace" font-weight="700" font-size="34" fill="#052b22">1998</text>
    <text x="90" y="95" text-anchor="middle" font-family="monospace" font-size="11" fill="#063a2d">▶ 2026 MEMORY LOADED</text>
    <circle cx="150" cy="119" r="3" fill="#6be28f"/>
    <rect x="30" y="130" width="120" height="10" fill="#b9b3a0"/>
    <rect x="10" y="140" width="160" height="12" rx="3" fill="#a39d8a"/>
  </g>
  <rect y="226" width="420" height="14" fill="#0b1020"/>
</svg>`
}

type Scene = { a: string; b: string; icon: string }

const SCENES: Record<GameEvent['category'], Scene> = {
  life: { a: '#2b5876', b: '#4e4376', icon: '<circle cx="60" cy="38" r="14" fill="#ffd86b"/><path d="M30 80 q30 -34 60 0z" fill="#fff" opacity=".9"/>' },
  school: { a: '#1d4350', b: '#a43931', icon: '<rect x="30" y="34" width="60" height="40" fill="#fff" opacity=".92"/><path d="M60 34 L30 34 L60 20 L90 34z" fill="#ffd86b"/>' },
  family: { a: '#614385', b: '#516395', icon: '<path d="M60 22 L26 52 H94z" fill="#ffd86b"/><rect x="36" y="52" width="48" height="26" fill="#fff" opacity=".92"/><rect x="54" y="60" width="12" height="18" fill="#614385"/>' },
  career: { a: '#232526', b: '#414345', icon: '<rect x="30" y="40" width="60" height="38" rx="4" fill="#ffd86b"/><rect x="48" y="30" width="24" height="10" fill="none" stroke="#fff" stroke-width="4"/>' },
  finance: { a: '#134e5e', b: '#71b280', icon: '<polyline points="22,76 44,54 62,64 98,26" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><circle cx="98" cy="26" r="6" fill="#ffd86b"/>' },
  world: { a: '#0f2027', b: '#2c5364', icon: '<circle cx="60" cy="52" r="28" fill="#4aa3ff"/><path d="M42 44 q10 -10 20 0 t14 12 q-6 14 -24 12 q-8 -10 -10 -24z" fill="#6be28f"/>' },
  absurd: { a: '#7f00ff', b: '#e100ff', icon: '<text x="60" y="68" text-anchor="middle" font-size="56" font-weight="900" fill="#fff">?!</text>' },
}

export function eventBanner(category: GameEvent['category']): string {
  const s = SCENES[category] ?? SCENES.life
  const id = `g-${category}`
  return `<svg viewBox="0 0 240 90" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="-200" y1="-100" x2="440" y2="190"><stop offset="0" stop-color="${s.a}"/><stop offset="1" stop-color="${s.b}"/></linearGradient></defs>
  <rect x="-1000" y="-1000" width="2240" height="2090" fill="url(#${id})"/><g transform="translate(60,0)">${s.icon}</g></svg>`
}

/** 把固定的 SVG 字符串挂到一个 div 上 */
export function artEl(svg: string, cls: string): HTMLDivElement {
  const d = document.createElement('div')
  d.className = cls
  d.innerHTML = svg
  return d
}

/**
 * 外部配图（可选）：放在 public/img/ 下即可自动生效，缺图时回退到上面的内联 SVG。
 * 命名规则见 public/img/README.md 与 docs/ART_PROMPTS.md。
 */
const imgOk = new Map<string, Promise<HTMLImageElement | null>>()

function loadImg(src: string): Promise<HTMLImageElement | null> {
  let p = imgOk.get(src)
  if (!p) {
    p = new Promise((res) => {
      const im = new Image()
      im.onload = () => res(im)
      im.onerror = () => res(null)
      im.src = src
    })
    imgOk.set(src, p)
  }
  return p
}

/** 依次尝试候选图片，第一张加载成功的替换 box 内容 */
function upgradeToImage(box: HTMLElement, candidates: string[], alt: string): void {
  const base = import.meta.env.BASE_URL
  void (async () => {
    for (const c of candidates) {
      const im = await loadImg(`${base}img/${c}`)
      if (im) {
        const el = im.cloneNode() as HTMLImageElement
        el.alt = alt
        box.classList.add('has-img')
        box.replaceChildren(el)
        return
      }
    }
  })()
}

/** 事件横幅：img/events/<事件id>.webp → img/category/<分类>.webp → 内联 SVG */
export function bannerEl(ev: GameEvent): HTMLElement {
  const box = artEl(eventBanner(ev.category), 'banner')
  upgradeToImage(box, [`events/${ev.id}.webp`, `category/${ev.category}.webp`], ev.title)
  return box
}

/** 首页大图：img/hero.webp → 内联 SVG */
export function heroEl(): HTMLElement {
  const box = artEl(heroSvg(), 'hero-art')
  upgradeToImage(box, ['hero.webp'], '1998重生')
  return box
}
