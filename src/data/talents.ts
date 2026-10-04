import type { Origin, Talent } from '../types'

export const ORIGINS: Origin[] = [
  { id: 'rural', name: '农村家庭', rarity: 'common', desc: '起点很低，但吃得了苦。', effects: { stats: { health: 10, wealth: 1 } } },
  { id: 'worker', name: '普通工薪', rarity: 'common', desc: '平凡稳定，没什么惊喜。', effects: { stats: { wealth: 10, happiness: 5 } } },
  { id: 'teacher', name: '教师家庭', rarity: 'common', desc: '书香门第，家里有很多书。', effects: { stats: { intelligence: 10, wealth: 8 } } },
  { id: 'business', name: '小老板家庭', rarity: 'rare', desc: '家里做小生意，爸妈有点积蓄。', effects: { stats: { wealth: 80, influence: 3 }, addFlags: ['family-has-money'] } },
  { id: 'rich', name: '富二代', rarity: 'legendary', desc: '含着金汤匙出生，爸妈愿意陪你“折腾”。', effects: { stats: { wealth: 3000, influence: 10, happiness: 5 }, addFlags: ['family-has-money', 'rich-family'] } },
]

export const TALENTS: Talent[] = [
  { id: 'photographic', name: '过目不忘', rarity: 'rare', desc: '重生后的记忆格外清晰。', effects: { stats: { memory: 30, intelligence: 10 } } },
  { id: 'fuzzy', name: '记忆模糊', rarity: 'common', desc: '只记得个大概，细节全靠猜。', effects: { stats: { memory: -15 } } },
  { id: 'charisma', name: '天生领袖', rarity: 'rare', desc: '说话让人愿意相信。大人也愿意听你的“胡言乱语”。', effects: { stats: { charm: 20, influence: 5 }, addFlags: ['parents-trust'] } },
  { id: 'cute', name: '萌娃体质', rarity: 'common', desc: '长得可爱，做什么都被原谅。', effects: { stats: { charm: 15, happiness: 5 } } },
  { id: 'tough', name: '铁打的身体', rarity: 'common', desc: '一年不生一次病。', effects: { stats: { health: 25 } } },
  { id: 'lucky', name: '锦鲤', rarity: 'legendary', desc: '运气好得离谱。', effects: { stats: { charm: 5, happiness: 10 }, addFlags: ['lucky'] } },
  { id: 'poker', name: '扑克脸', rarity: 'rare', desc: '喜怒不形于色，赌桌与谈判桌通吃。', effects: { stats: { intelligence: 8, charm: 8 }, addFlags: ['poker-face'] } },
]
