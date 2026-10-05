/**
 * 世界状态变量登记表。事件用 Effects.world 改变它们、用 Condition.worldMin/worldMax 读取它们。
 * 新增变量请登记在这里（测试会检查事件里用到的变量都已登记）。
 *
 * - trend：趋势，0 = 与真实历史一致，正负表示偏离方向，范围 -100~100
 * - tech：科技树等级 0-5，0 = 真实 2026 年的水平；由研究行动、事件推进
 * - power：AI 格局中各方实力 0-100（2026 年后的主线，见 docs/DESIGN_V2.md 第七节）
 */
export interface WorldVarDef {
  id: string
  name: string
  kind: 'trend' | 'tech' | 'power'
  desc: string
}

export const WORLD_VARS: WorldVarDef[] = [
  { id: 'economy', name: '经济景气', kind: 'trend', desc: '正：比原历史更繁荣；负：更萧条' },
  { id: 'crypto', name: '币圈热度', kind: 'trend', desc: '正：加密货币更早、更大规模出圈' },
  { id: 'health', name: '公共卫生', kind: 'trend', desc: '正：疫情与公共卫生危机的损失更小' },
  { id: 'media', name: '舆论生态', kind: 'trend', desc: '正：信息更透明、骗局更早曝光' },
  { id: 'absurd', name: '荒诞度', kind: 'trend', desc: '越高越容易出现荒诞剧情（丧尸、私人岛屿世界杯……）' },

  { id: 'tech-ai', name: '人工智能', kind: 'tech', desc: '大模型、通用人工智能' },
  { id: 'tech-gene', name: '基因工程', kind: 'tech', desc: '延寿、治愈遗传病，也可能失控' },
  { id: 'tech-brain', name: '脑机接口', kind: 'tech', desc: '意识上传、记忆备份' },
  { id: 'tech-energy', name: '能源', kind: 'tech', desc: '可控核聚变、廉价能源' },
  { id: 'tech-space', name: '航天', kind: 'tech', desc: '登月、火星殖民' },
  { id: 'tech-robot', name: '机器人', kind: 'tech', desc: '人形机器人、无人工厂' },

  { id: 'ai-player', name: '你的 AI 公司', kind: 'power', desc: '玩家公司的实力' },
  { id: 'ai-entropic', name: '熵派', kind: 'power', desc: '默认走向中最大的竞争对手' },
  { id: 'ai-closeai', name: 'closeai', kind: 'power', desc: '默认走向：2026 年后衰败' },
  { id: 'ai-google', name: '谷哥', kind: 'power', desc: '模型“双鱼座”，后期发力' },
  { id: 'ai-y', name: 'yAI', kind: 'power', desc: '马丝氪的 AI 公司，模型 Grox，后期发力' },
  { id: 'ai-cn', name: '国产模型', kind: 'power', desc: '默认走向：烧钱无收益，大部分倒闭' },
]

export const TECH_MAX = 5
