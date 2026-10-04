# 事件写作规范

事件放在 `src/data/events/*.ts`，类型见 `src/types.ts`，新文件需在 `src/data/events/index.ts` 注册。

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
  `divergence` 小干预 +1~3，大干预 +10~25。

## 世界线
利用记忆改变现实后，用 `addFlags` 记录变化（如 `ai-opensource`），后续事件用 `flags`/`notFlags` 分岔。
`divergenceMin` 高的事件应当“和现实不一样”，可以荒谬。

## 提交流程
1. 先读 `AGENT.md`、`NAMING.md`。
2. 写事件，注册到 `index.ts`。
3. 运行 `npm run typecheck && npm test && npm run build`（`tests/events.test.ts` 会自动检查 id 唯一、选项完整、真名黑名单）。
4. PR 描述里列出新增事件数量、涉及的现实事实与出处。
