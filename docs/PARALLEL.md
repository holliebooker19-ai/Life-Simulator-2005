# 并行开发指南（多个会话同时写内容）

## 为什么现在能并行
- 事件、行动**自动注册**：`src/data/events/*.ts`、`src/data/actions/*.ts` 里 export 的数组会被自动收集，**新增内容只需要新建文件，不要改 `index.ts`**。
- 改名表分文件：新增改名写到 `docs/naming/<批次名>.md`，不要改 `docs/NAMING.md` 主表。测试会自动读取这些表做真名黑名单。
- 配图独立：只往 `public/img/` 加 `.webp`，不碰代码。

## 防冲突规则（每个并行会话都要遵守）
1. 一个会话只负责一个**主题批次**，文件名带批次前缀，如 `src/data/events/y2006-2008-finance.ts`；事件 `id` 也带同样前缀，避免重名。
2. **不修改**：`src/engine.ts`、`src/game.ts`、`src/ui.ts`、`src/types.ts`、已有的事件文件。需要新机制先在 PR 里提出，由主会话改。
3. 每个会话在自己的分支开发（如 `content/y2006-2008`），自检通过后开 PR 到 `main`：
   `npm run typecheck && npm test && npm run build`
4. PR 描述写：新增事件数、改名条目、`realFact` 清单（事件 id → 事实 → 依据）、不确定之处。
5. 现实事实拿不准就写模糊，**宁缺毋滥**（AGENT.md 第 3 条）。

## 前置：先合并哪项再开并行
- ROADMAP 的 **P0（世界线机制修正）已完成**，现实锚点事件现在可以写了，但必须遵守 `EVENT_GUIDE.md` 的“世界线”一节。

## 可立即并行的任务（互不冲突）
| 会话 | 任务 | 文件 | 提示 |
| --- | --- | --- | --- |
| A | 7–12 岁生活事件 15 个（校园、家庭、友情，无现实对应） | `events/life-age07-12.ts` | 用 `minAge/maxAge` 限定，必须有 1 个无条件选项 |
| B | 13–17 岁生活事件 15 个（升学、早恋、网络、叛逆） | `events/life-age13-17.ts` | 同上 |
| C | 18–23 岁生活事件 15 个（大学、第一份工作、创业念头） | `events/life-age18-23.ts` | 同上 |
| D | 24–40 岁生活事件 15 个（职场、婚姻、房贷、育儿） | `events/life-age24-40.ts` | 同上 |
| E | 41–70 岁生活事件 15 个（中年危机、健康、退休、传承） | `events/life-age41-70.ts` | 同上；注意死亡/健康的写法要克制 |
| F | 行动扩充：每组再加 5 个（共 35） | `actions/*.ts` 里新建 `*-extra.ts` | 写入新标记要在 `actions/index.ts` 头部登记 |
| G | 结局扩充（~10 个） | 需改 `engine.ts`，**暂不并行**，由主会话做 | — |
| H | GPT 生图：首页 + 7 个分类图 | `public/img/` | 见 `docs/ART_PROMPTS.md` |

## 复制给新会话的提示词
```
先完整阅读仓库根目录 AGENT.md，以及 docs/NAMING.md、docs/EVENT_GUIDE.md、docs/PARALLEL.md、src/types.ts，
再参考 src/data/events/ 和 src/data/actions/ 里已有文件的写法。
你的任务：{{任务描述，如“写 7–12 岁生活事件 15 个”}}。
新建文件 {{文件路径}}（export 一个 GameEvent[]，id 统一加前缀 {{前缀}}-），不要改任何已有文件（除 docs/naming/ 下新增改名表）。
自检：npm run typecheck && npm test && npm run build 全部通过。
在分支 {{分支名}} 提交，开 PR 到 main，PR 描述按 docs/PARALLEL.md 第 4 条写。
```
