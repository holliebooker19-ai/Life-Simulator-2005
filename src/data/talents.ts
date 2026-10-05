import type { Origin, Talent } from '../types'

export const ORIGINS: Origin[] = [
  { id: 'rural', name: '农村家庭', rarity: 'common', desc: '起点很低，但吃得了苦。', effects: { stats: { health: 10, wealth: 1 } } },
  { id: 'worker', name: '普通工薪', rarity: 'common', desc: '平凡稳定，没什么惊喜。', effects: { stats: { wealth: 10, happiness: 5 } } },
  { id: 'teacher', name: '教师家庭', rarity: 'common', desc: '书香门第，家里有很多书。', effects: { stats: { intelligence: 10, wealth: 8 } } },
  { id: 'business', name: '小老板家庭', rarity: 'rare', desc: '家里做小生意，爸妈有点积蓄。', effects: { stats: { wealth: 80, influence: 3 }, addFlags: ['family-has-money'] } },
  { id: 'town', name: '县城家庭', rarity: 'common', desc: '日子不富裕，邻里亲切，人情味浓。', effects: { stats: { wealth: 5, happiness: 5, health: 5 } } },
  { id: 'single-parent', name: '单亲家庭', rarity: 'common', desc: '妈妈一个人撑起家，你早早学会了懂事。', effects: { stats: { intelligence: 8, health: 5, wealth: 3, happiness: -3 } } },
  { id: 'migrant', name: '外来务工家庭', rarity: 'common', desc: '父母在大城市打工，租房搬家是常事，但你见过的世面不少。', effects: { stats: { wealth: 2, health: 8, charm: 4 } } },
  { id: 'civil', name: '体制内家庭', rarity: 'common', desc: '爸妈都有“铁饭碗”，人脉不错，管得也严。', effects: { stats: { wealth: 20, influence: 4, happiness: -2 } } },
  { id: 'doctor', name: '医生家庭', rarity: 'rare', desc: '从小被灌输“多喝热水”，体质和脑子都在线。', effects: { stats: { health: 10, intelligence: 8, wealth: 30 } } },
  { id: 'tech', name: '工程师家庭', rarity: 'rare', desc: '家里有台稀罕的电脑，爸爸常在深夜敲代码。', effects: { stats: { intelligence: 12, wealth: 40 } } },
  { id: 'overseas', name: '海归家庭', rarity: 'rare', desc: '父母留过洋，家里英文书比中文书还多。', effects: { stats: { wealth: 120, charm: 3 }, addFlags: ['family-has-money', 'skill-english'] } },
  { id: 'rich', name: '富二代', rarity: 'legendary', desc: '含着金汤匙出生，爸妈愿意陪你“折腾”。', effects: { stats: { wealth: 3000, influence: 10, happiness: 5 }, addFlags: ['family-has-money', 'rich-family'] } },
]

export const TALENTS: Talent[] = [
  { id: 'photographic', name: '过目不忘', rarity: 'rare', desc: '重生后的记忆格外清晰。', effects: { stats: { memory: 30, intelligence: 10 } } },
  { id: 'fuzzy', name: '记忆模糊', rarity: 'common', desc: '只记得个大概，细节全靠猜。', effects: { stats: { memory: -15 } } },
  { id: 'charisma', name: '天生领袖', rarity: 'rare', desc: '说话让人愿意相信。大人也愿意听你的“胡言乱语”。', effects: { stats: { charm: 20, influence: 5 }, addFlags: ['parents-trust'] } },
  { id: 'cute', name: '萌娃体质', rarity: 'common', desc: '长得可爱，做什么都被原谅。', effects: { stats: { charm: 15, happiness: 5 } } },
  { id: 'tough', name: '铁打的身体', rarity: 'common', desc: '一年不生一次病。', effects: { stats: { health: 25 } } },
  { id: 'lucky', name: '锦鲤', rarity: 'legendary', desc: '运气好得离谱。', effects: { stats: { charm: 5, happiness: 10 }, addFlags: ['lucky'] } },
  { id: 'musical', name: '乐感满分', rarity: 'common', desc: '听过一遍的旋律就能哼出来。', effects: { stats: { charm: 10, happiness: 5 } } },
  { id: 'athlete', name: '运动细胞', rarity: 'common', desc: '跑得快、跳得高，球场上的宠儿。', effects: { stats: { health: 15, charm: 5 } } },
  { id: 'social', name: '社交牛人', rarity: 'rare', desc: '三句话就能和陌生人称兄道弟。', effects: { stats: { charm: 18, influence: 3 } } },
  { id: 'frugal', name: '精打细算', rarity: 'common', desc: '一分钱掰成两半花，天生的理财苗子。', effects: { stats: { intelligence: 5, wealth: 5 } } },
  { id: 'night-owl', name: '夜猫子', rarity: 'common', desc: '越晚越清醒，但身体有点吃不消。', effects: { stats: { intelligence: 8, health: -8 } } },
  { id: 'nerd', name: '书呆子', rarity: 'common', desc: '成绩顶呱呱，就是不太会聊天。', effects: { stats: { intelligence: 20, charm: -8 } } },
  { id: 'optimist', name: '乐天派', rarity: 'common', desc: '天塌下来也能笑着吃饭。', effects: { stats: { happiness: 20 } } },
  { id: 'poker', name: '扑克脸', rarity: 'rare', desc: '喜怒不形于色，赌桌与谈判桌通吃。', effects: { stats: { intelligence: 8, charm: 8 }, addFlags: ['poker-face'] } },
]
