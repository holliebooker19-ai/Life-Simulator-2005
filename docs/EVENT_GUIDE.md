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
- 偏离度是派生值，不能直接写；`divergenceMin/Max` 条件可以读。荒谬剧情放在高偏离度或 2027 年之后。

## 提交流程
1. 先读 `AGENT.md`、`NAMING.md`。
2. 写事件（新建文件即自动注册）。
3. 运行 `npm run typecheck && npm test && npm run build`（`tests/events.test.ts` 会自动检查 id 唯一、选项完整、真名黑名单）。
4. PR 描述里列出新增事件数量、涉及的现实事实与出处。

## 自由行动与自由发挥选项
- `src/data/actions.ts`：每年的自由行动（学习/身体/社交/工作/理财/探索/生活），行动点随年龄 1→2→3。写法与选项相同（`outcomes`、`usesMemory`、`requires`），另有 `group`、`hint`、`once`（一局一次）、`cooldown`（冷却年数）。`Condition` 新增 `minYear/maxYear`。
- `src/data/extra-choices.ts`：通用“自由发挥”选项，引擎会随机追加 2 个到每个带选项的事件后面，文案不得指向具体事件。
- 行动写入的标记（`skill-coding`、`employed`、`partner`、`married`、`has-business` 等）见 `actions.ts` 文件头，事件可用它们做分岔。
