# 事件写作规范

事件放在 `src/data/events/*.ts`，类型见 `src/types.ts`，新文件会被自动注册（export 一个 `GameEvent[]` 即可，不用改 `index.ts`）。

## 总体风格
- 写实为主，偶尔出现可被主角改变的荒谬剧情（世界首富提案、改写世界杯等）。
- 简体中文，口语化，每个事件 `text` 2–4 句，结果 `text` 1–2 句。
- “爽感”优先：给玩家强反馈（数字暴涨、稀有事件、反转），但要有代价与风险（记忆偏差、被套）。

## 字段要点
- `id`：kebab-case，全局唯一，以类别开头。
- `year`：现实历史节点才用；必须同时写 `realFact`，并遵守 `NAMING.md`。
- `requires.minAge`：**必须考虑主角年龄**。1998 年出生：2005 年 7 岁，2008 年 10 岁，2010 年 12 岁，2013 年 15 岁，2017 年 19 岁，2020 年 22 岁，2022 年 24 岁，2026 年 28 岁。
  15 岁（2013 年）前的现实事件用“父母代理”（`flags: ['family-has-money']` 或 `['parents-trust']`）。
- 选项：每个带选项的事件**至少一个无条件选项**（防卡死）。
- `usesMemory: true` 的选项必须包含 `tag: 'success'` 与 `tag: 'misremember'`（或 `'fail'`）结果。
- 赌博/随机：同一选项里写多个 `outcomes` 并配 `weight`。
- `rarity`：`common` 日常；`rare` 小高光；`legendary` 改变人生/世界线，数量要克制。
- 属性上限 100（财富除外），`statMin/statMax` 门槛不要超过 100；名望和影响力每年会回落，一次性奖励不宜过大。
- 数值参考：`wealth` 单位是万元；普通小赚 5–50，大赚 500–5000，首富级 100000+；
  `alter.scale`：小改动 1~5，大改动 10~25（见“世界线”）。

## 世界线（重要）
原则：**世界按真实历史走，只有主角的个人影响才会让它偏离。**
- 现实节点（带 `year` + `realFact`）是“锚点”，默认按真实历史发生。写它时，`requires`/选项里不要因为玩家赚了钱、出了名就改变事实本身。
- 个人收益（`wealth`、`fame`、`influence` 等）**不会**增加偏离度，不要为“押对了世界杯”之类个人获利写偏离。
- 想让玩家**改写某件历史事**：在选项里给高影响力门槛（`requires: { statMin: { influence: N } }`），并在结果里写
  `alter: [{ id: '<被改写的锚点事件 id>', scale: 1~25 }]`；`id` 必须是已存在的事件 id（测试会检查）。
- 同一年写两个版本：真实版 `requires: { notAltered: ['<id>'] }`，改写版 `requires: { altered: ['<id>'] }`。后续事件用 `altered/notAltered`、`flags/notFlags` 分岔。
- 想让后续历史“跟着变”：给下游事件加 `requires.altered`（被改写时才出现）或 `notAltered`（被改写后消失）。
- 带现实内容、但没有 `year` 的随机事件，必须写 `minYear`（测试会检查），否则会在错误年份出现。
- 改写锚点时，同时用 `world` 写清楚它对世界的影响（如 `world: { crypto: 15 }`），并在 `src/data/headlines.ts` 补一条带 `anchor` 和 `altered` 的新闻。
- 下游事件：受某个锚点影响但仍会发生的，写 `dependsOn: ['<锚点 id>']`；需要换说法的，写 `variants: [{ requires: { altered: [...] }, text: '…' }]`；按世界趋势分岔，用 `worldMin/worldMax`。
- 世界的默认走向（2027 年后没有真实历史可依）写成 `annual: true` 的事件，每年满足条件就触发；里程碑事件（如破产）也可以用 `annual`，靠 `notFlags` 防止重复。
- 科技树（`tech-*`）等级 0–5，0 = 真实 2026 年的水平；2026 年之前不要推进科技树。
- 偏离度是派生值，不能直接写；`divergenceMin/Max` 条件可以读。荒谬剧情放在高偏离度或 2027 年之后。

## 预知题（DESIGN_V2 P2）
- 2026 年前带 `usesMemory` 选项的现实事件，必须在 `src/data/quizzes.ts` 补一道题（或写在事件的 `quiz` 字段），测试会检查。
- 题目只用确凿的史实，并且和 `realFact` 一致；**不能从事件正文或选项文字里直接看出答案**（选项写了“押西班牙”，就问决赛对手或比分）。
- 4 个选项，干扰项用“容易记混”的真实信息（半决赛比分、另一个月份）。正确答案不要总放在同一个位置。
- 依赖的锚点被改写后答案会变的，写 `shiftedAnswer`（事件必须有 `dependsOn`）。
- 拿不准、出不了题的（如高考作文题因省份而异），在测试的 `NO_QUIZ` 名单里登记。

## 亲人（DESIGN_V2 P5）
- 条件 `relMin/relMax`：`parentAge`（主角年龄 + 26）、`parents`（父母身体 0–100）、`parentsLost`（已离世 0–2）、`partner`（感情，没有伴侣为 0）、`childAge`（没有孩子为 -1，写孩子的事件同时要求 `has-child`）。效果 `rel: { parents, partner }`。
- 点名“爸爸/妈妈”的事件要求 `relMax: { parentsLost: 0 }`；一位已离世后用“老人”“留下的那一位”这类说法。
- 孩子、配偶等家人的性别不固定，一律写“孩子”“另一半”。
- 一生一次的里程碑（孩子上学、告别、退休等）用 `annual: true` + `notFlags`，**每个结果都要写入对应标记**，否则会每年重复（测试会检查）。

## 提交流程
1. 先读 `AGENT.md`、`NAMING.md`。
2. 写事件（新建文件即自动注册）。
3. 运行 `npm run typecheck && npm test && npm run build`（`tests/events.test.ts` 会自动检查 id 唯一、选项完整、真名黑名单）。
4. PR 描述里列出新增事件数量、涉及的现实事实与出处。

## 自由行动与自由发挥选项
- `src/data/actions.ts`：每年的自由行动（学习/身体/社交/工作/理财/探索/生活），行动点随年龄 1→2→3。写法与选项相同（`outcomes`、`usesMemory`、`requires`），另有 `group`、`hint`、`once`（一局一次）、`cooldown`（冷却年数）。`Condition` 新增 `minYear/maxYear`。
- `src/data/extra-choices.ts`：通用“自由发挥”选项，引擎会随机追加 2 个到每个带选项的事件后面，文案不得指向具体事件。
- 行动写入的标记（`skill-coding`、`employed`、`partner`、`married`、`has-business` 等）见 `actions.ts` 文件头，事件可用它们做分岔。
