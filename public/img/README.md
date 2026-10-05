# 配图目录（可选）

放进来就自动生效，缺图时游戏回退到内置 SVG，不会报错。**只用 `.webp`**（体积小）。

| 路径 | 用途 | 建议尺寸 |
| --- | --- | --- |
| `hero.webp` | 首页大图 | 1200×720 |
| `category/<分类>.webp` | 该分类所有事件的默认横幅；分类：`life school family career finance world absurd` | 1600×700 |
| `events/<事件id>.webp` | 某个事件的专属横幅（优先于分类图） | 1600×700 |

文件名里的事件 id 必须和 `src/data/events/*.ts` 里的 `id` 完全一致。
提示词与风格规范见 `docs/ART_PROMPTS.md`。图片单张尽量 ≤150KB。
