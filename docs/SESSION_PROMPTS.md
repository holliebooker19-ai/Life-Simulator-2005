# 新会话提示词（直接整段复制）

两个会话互不冲突：Sonnet 只改 `src/data/events/` 和 `docs/naming/`；Codex 只改 `public/img/`。
都在各自分支开 PR 到 `main`，由你合并。

---

## A. Sonnet 会话：写事件（现实锚点 + 生活事件）

```
你在为网页游戏「1998重生」写事件内容。开始前，按顺序完整阅读仓库里这些文件，并严格遵守：
AGENT.md、docs/NAMING.md、docs/EVENT_GUIDE.md（尤其“世界线”一节）、docs/PARALLEL.md、docs/EVENT_PROMPT.md、src/types.ts，
然后参考 src/data/events/early-years.ts 与 src/data/events/finance.ts 的写法。

【设定】主角 1998 年出生，带着 2026 年的现实记忆重生。世界按真实历史走，只有主角“改写历史锚点”（Effects.alter）才会偏离；
个人赚钱/成名不产生偏离。节奏要快、爽，但有代价；写实为主，偶尔荒谬。简体中文，口语化，每个事件 text 2–4 句，结果 1–2 句。

【你的任务：分批完成，每批一个分支、一个 PR，批次之间等我确认再继续】
批次 1（分支 content/y2006-2010）：新建 src/data/events/y2006-2010.ts，共 22 个事件：
  - 现实锚点 12 个（带 year + realFact），候选：2006 A 股牛市启动、2006 德国世界杯、2007 牛市见顶、2007 第一代触屏智能手机发布（改名）、
    2008 全球金融危机、2008 北京奥运会、2009 楼市回暖、2010 上海世博会。（2010 世界杯已有，不要重复；汶川地震不写成玩法事件，最多写一句严肃的自动事件。）
  - 其中 3 个带“改写版本”：真实版 requires.notAltered，改写版 requires.altered，改写选项设高影响力门槛并写 alter（id 必须是真实存在的锚点事件 id）。
  - 纯随机生活事件 10 个（无 year，用 minAge/maxAge 限定 7–12 岁：校园、友情、家庭、游戏厅/网吧、第一次独立花钱等）。
批次 2（分支 content/y2011-2015）、批次 3（content/y2016-2021）、批次 4（content/y2022-2026）：同样结构，主题见 docs/ROADMAP.md 第三节“现实锚点候选”。
  2025–2026 年的事实我没有核对，只写大方向，不写具体数字；拿不准的一律写模糊。

【硬性规则】
1. 文件名和事件 id 带批次前缀（如 y0610-）；不修改 engine.ts / game.ts / ui.ts / types.ts / 已有事件文件；事件文件新建后会自动注册，不要改 index.ts。
2. 真实人物、公司、产品一律改名（谐音/反讽）；新增改名写到 docs/naming/y2006-2010.md（表格格式同 NAMING.md），政治调侃遵守边界。
3. 每个带 year 的事件必须有 realFact（事实 + 依据）；15 岁前（2013 年前）参与现实事件必须走父母代理（flags: ['family-has-money'] 或 ['parents-trust']）并限定 minAge。
4. 带选项的事件至少一个无条件选项；usesMemory 选项必须有 success 与 misremember/fail 结果；不要写 divergence（已移除），改写历史用 alter。
5. 带现实内容但无 year 的随机事件必须写 minYear；每批 legendary 不超过 2 个。
6. 提交前必须通过：npm run typecheck && npm test && npm run build，并把结果贴在 PR 里。
7. PR 描述写：新增事件数、新增改名条目、realFact 清单（事件 id → 事实 → 依据）、你不确定的地方。不要自行合并。
8. 动手前先用 5 行以内说明你这一批的事件清单（id + 一句话），然后直接写，不要反复询问。
```

---

## B. Codex 会话：只负责生图

```
你只负责为网页游戏「1998重生」生成配图，不要修改任何代码文件。
先阅读：docs/ART_PROMPTS.md、public/img/README.md。

【任务】
1. 按 docs/ART_PROMPTS.md 里的提示词，用图片生成能力依次生成：首页图 hero，7 张分类图（life school family career finance world absurd），
   然后是“事件专属横幅”表里的 8 张。每条提示词都必须带上“统一风格”那一段；画面中不得出现任何文字、数字、Logo、水印、真实人物肖像或真实品牌。
2. 横幅比例 16:7（1600×700），主体放中央 60%；首页图 5:3（1200×720）。
3. 用命令行工具（cwebp / ImageMagick / sharp 任选其一）转成 .webp，宽度 1600（首页 1200），质量约 80，单张 ≤150KB。
4. 文件命名与位置严格按表：public/img/hero.webp、public/img/category/<分类>.webp、public/img/events/<事件id>.webp。
5. 先生成首页和 7 张分类图，作为第一个 PR（分支 art/base）；事件专属图作为第二个 PR（分支 art/events）。
6. 提交前运行 npm run build 确认能构建；PR 里附上每张图的缩略预览或文件清单，以及你使用的最终提示词。不要自行合并。

【注意】
- 只允许新增/修改 public/img/ 下的文件；不要改 docs、src、tests。
- 如果你的环境无法直接生成图片，不要用占位图冒充：请在 PR 描述（或回复）里写明，并把可以交给其他图片生成工具的最终提示词整理成一个 markdown 文件放在 docs/ART_PROMPTS_FINAL.md。
- 事件 id 以 src/data/events/*.ts 中的为准；如果表里的 id 在仓库里不存在，跳过并说明。
```
