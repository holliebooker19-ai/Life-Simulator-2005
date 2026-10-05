# AGENT.md — 项目规则

所有 AI / 贡献者在修改代码或写事件前必须先读本文件及其引用的文档。

## 项目简介
**1998重生**：网页版人生模拟器。主角 1998 年出生，带着 2026 年的现实记忆重生。
玩家靠“信息差”（股市、世界杯、科技浪潮等）做决策，并可能改写世界线。

## 技术栈
- Vite + TypeScript，纯前端，无后端，无框架。
- 目标运行环境：浏览器；开发环境 Windows 11（`npm install && npm run dev` 可直接运行）。
- 部署：GitHub Pages（`base: './'`）。

## 目录
- `src/engine.ts` 纯逻辑（状态、条件、结算、结局），不得依赖 DOM。
- `src/game.ts` 游戏主循环，通过 `Host` 接口与 UI 解耦。
- `src/ui.ts` / `style.css` UI 与动画。
- `src/data/` 全部游戏内容：`talents.ts`（出身/天赋）、`events/*.ts`（事件）、`actions/*.ts`（每年自由行动）、`extra-choices.ts`（通用自由发挥选项）。事件与行动**自动注册**：新建文件并 export 数组即可，不要改 `index.ts`。
- `public/img/` 可选配图（`.webp`），缺图自动回退内置 SVG；规则见 `public/img/README.md`、`docs/ART_PROMPTS.md`。
- `docs/PARALLEL.md` 并行开发规范；`docs/ROADMAP.md` 路线图；`docs/naming/` 改名分表。
- `docs/EVENT_GUIDE.md` 事件写作规范（写事件前必读）。
- `docs/NAMING.md` 真实人物/公司的改名表（写事件前必读）。

## 分支规则
**所有工作默认直接在 `main` 分支完成并推送**，不再另开功能分支、不再建 PR（除非用户明确要求）。开工前先 `git pull origin main`。

## 硬性规则
1. 语言：游戏文本使用**简体中文**（暂不做日文）。
2. 真实人物、公司、产品一律按 `docs/NAMING.md` 改名，**禁止出现真名**。新增改名必须同一个 PR 补进表里（并行开发时写成 `docs/naming/<批次>.md`，测试会自动读取）。政治人物允许调侃恶搞（仅限谐音/外号），边界见 `docs/NAMING.md`。
3. 真实历史事件（世界杯结果、股市走势等）可以使用，但必须填写 `realFact` 并确保事实准确。拿不准的数据宁可写得模糊，不要编造具体数字。
4. 游戏中的财富、赌博均为虚拟，不涉及真实资金；文案保持游戏化口吻。
5. 提交前必须通过：`npm run typecheck`、`npm test`、`npm run build`。
6. 引擎逻辑改动要补测试（`tests/`）。
7. 提交信息使用清晰的中文或英文描述，不提交 `node_modules`、`dist`。
8. 不要在 `engine.ts` 里写具体事件内容；内容只放 `src/data/`。

## 核心机制（改动前要理解）
- **记忆**：`usesMemory` 的选项按 `memoryReliability` 判定成败；世界线偏离度越高越不可靠；2026 年之后预知失效。
- **世界线原则**：世界按真实历史走，**只有主角的个人影响才会让它偏离**。带 `year` 的现实事件永远按真实历史触发；玩家个人的赚钱/成名/人脉**不产生偏离**。只有明确“改写某个历史锚点”（`Effects.alter`，锚点 = 事件 id）才会偏离。
- **世界线偏离度**：派生值 = 所有被改写锚点的 `scale` 之和（上限 100），不能直接写。偏离越高，现实记忆越不可靠；2026 年之后预知失效。改写后的版本用 `Condition.altered / notAltered` 区分。影响力和偏离度双高时触发改写世界线的事件与结局。
- **年龄限制**：主角 1998 年出生，2005 年 7 岁，2013 年 15 岁，2026 年 28 岁。游戏重点年份是 2005 年起；15 岁前的现实事件需要“父母代理”（`parents-trust`、`family-has-money` 等标记）才能参与，写事件时要考虑主角当时的年龄是否合理。
- **节奏**：`engine.ts` 的 `pacing()` 决定各年龄段的随机事件数、行动点、自由发挥选项数。0–6 岁为襁褓期（无行动菜单、结果自动继续），调节奏只改这张表。
- **写实人生（DESIGN_V2 P1）**：属性上限 100（财富不限）；每年 `yearlyDrift` 让快乐回落到 `joyBaseline`，名望（6%/年）和影响力（5%/年）回落，并按财富、名望、公司、基金会自然获得影响力（`influenceIncome`），35 岁后体质下降；`settleYear` 结算年度账单（18 岁起）；死亡按 `mortality(年龄, 体质)` 概率判定，寿命上限 `state.maxAge`（默认 100，科技树可以提高）；每年最多 `MAX_FIXED_PER_YEAR = 4` 个固定事件，按稀有度取舍。
- **世界状态与科技树（DESIGN_V2 P3）**：`state.world` 记录世界变量（登记在 `src/data/world.ts`，新变量必须登记）。事件用 `Effects.world` 修改它、用 `Condition.worldMin/worldMax` 读取它；`Effects.maxAge` 用于延寿；`variants` 按世界状态换正文；`dependsOn` 依赖的锚点被改写后，事件标注“偏移”，预知可靠度减半。每年的新闻在 `src/data/headlines.ts`，可改写的锚点（2026 年前）必须有带 `altered` 的新闻（测试会检查）。
- **设计总纲**：`docs/DESIGN_V2.md`（爽点三阶段、答题预知、世界线、AI 公司主线、实施进度）。
- **并行**：多个会话同时写内容时，遵守 `docs/PARALLEL.md`（各写各的新文件，不改引擎/UI/类型/已有事件）。
