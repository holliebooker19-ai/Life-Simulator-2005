import type { GameEvent } from '../../types'

/**
 * 健康与衰老：随年龄和体质触发的生活事件（无现实对应）。写法克制，重病给出处理的出路。
 *
 * 本文件读取的标记：fit / married / has-child / employed
 * 本文件写入的标记：health-chronic（慢性病，后续事件可读取）
 */
export const healthEvents: GameEvent[] = [
  {
    id: 'health-flu',
    category: 'life',
    once: false,
    weight: 4,
    requires: { minAge: 7, statMax: { health: 70 } },
    title: '病了一场',
    text: '换季的时候你发起了高烧，浑身酸痛，在床上躺了好几天。',
    choices: [
      { text: '老老实实去医院', outcomes: [{ text: '打了两天点滴，很快就好了。医生让你多运动。', effects: { stats: { health: 2, wealth: -0.1 } } }] },
      { text: '硬扛过去', outcomes: [
        { weight: 2, text: '扛了一个星期，总算好了，人瘦了一圈。', effects: { stats: { health: -2, happiness: -2 } } },
        { weight: 1, text: '拖成了肺炎，最后还是住了院。', effects: { stats: { health: -6, happiness: -4, wealth: -0.5 } } },
      ] },
    ],
  },
  {
    id: 'health-back-pain',
    category: 'life',
    requires: { minAge: 28, maxAge: 60, flags: ['employed'] },
    title: '腰不行了',
    text: '常年坐着办公，你弯腰捡东西时“咔”的一声，疼得半天直不起身。医生说是腰椎间盘突出。',
    choices: [
      { text: '开始每天锻炼核心', outcomes: [{ text: '你坚持了半年，腰好了不少，肚子也小了。', effects: { stats: { health: 4, happiness: 2 }, addFlags: ['fit'] } }] },
      { text: '贴几片膏药凑合', outcomes: [{ text: '疼的时候贴一贴，不疼就忘了。它成了你的老朋友。', effects: { stats: { health: -3 }, addFlags: ['health-chronic'] } }] },
    ],
  },
  {
    id: 'health-midlife-weight',
    category: 'life',
    requires: { minAge: 35, maxAge: 55, notFlags: ['fit'] },
    title: '中年发福',
    text: '体检报告上，体重、血脂、尿酸后面都跟着向上的箭头。你看了看镜子里的肚子，沉默了。',
    choices: [
      { text: '管住嘴，迈开腿', outcomes: [
        { weight: 2, text: '你戒了夜宵，每天走一万步，一年瘦了十几斤。', effects: { stats: { health: 6, charm: 2, happiness: 2 }, addFlags: ['fit'] } },
        { weight: 1, text: '坚持了三个月，然后被一顿火锅打回原形。', effects: { stats: { health: 1, happiness: 1 } } },
      ] },
      { text: '“人到中年，胖点是福气。”', outcomes: [{ text: '你接受了自己的样子。只是爬楼梯越来越喘。', effects: { stats: { health: -4, happiness: 1 } } }] },
    ],
  },
  {
    id: 'health-checkup-warning',
    category: 'life',
    rarity: 'rare',
    requires: { minAge: 40, statMax: { health: 60 } },
    title: '体检报告上的阴影',
    text: '医生指着片子上的一小块阴影，语气很平静：“建议尽快做进一步检查。”你走出诊室，在走廊里坐了很久。',
    choices: [
      { text: '马上去大医院复查', outcomes: [
        { weight: 3, text: '是良性的，切掉就好。你出院那天，觉得阳光特别好。', effects: { stats: { health: 4, happiness: 3, wealth: -3 } } },
        { weight: 1, text: '是早期的恶性病变，好在发现及时。手术和治疗很辛苦，但你挺过来了。', effects: { stats: { health: -8, happiness: -6, wealth: -15 }, addFlags: ['health-chronic'] } },
      ] },
      { text: '拖一拖，最近太忙', outcomes: [
        { weight: 1, text: '半年后你才去复查，问题已经变大了。医生叹了口气。', effects: { stats: { health: -18, happiness: -10, wealth: -20 }, addFlags: ['health-chronic'] } },
        { weight: 1, text: '运气不错，复查时阴影没有变化。你发誓以后再也不拖了。', effects: { stats: { happiness: -2 } } },
      ] },
    ],
  },
  {
    id: 'health-blood-pressure',
    category: 'life',
    requires: { minAge: 50, statMax: { health: 70 } },
    title: '高血压',
    text: '早上起来头晕，一量血压高得吓人。医生说以后得天天吃药了。',
    choices: [
      { text: '按时吃药，少油少盐', outcomes: [{ text: '血压慢慢稳住了。你开始研究清淡的菜谱，味道居然还不错。', effects: { stats: { health: 3, happiness: -1 }, addFlags: ['health-chronic'] } }] },
      { text: '药时吃时不吃', outcomes: [{ text: '血压忽高忽低。有一次在饭桌上差点晕倒，把家里人吓坏了。', effects: { stats: { health: -8, happiness: -3 }, addFlags: ['health-chronic'] } }] },
    ],
  },
  {
    id: 'health-insomnia',
    category: 'life',
    requires: { minAge: 16, statMax: { happiness: 35 } },
    title: '睡不着',
    text: '你已经连续好几个月半夜醒来，盯着天花板到天亮。白天什么都提不起兴趣。',
    choices: [
      { text: '去看心理医生', outcomes: [{ text: '医生陪你聊了很久，也开了一些帮助睡眠的药。慢慢地，你能睡着了。', effects: { stats: { happiness: 10, health: 2, wealth: -0.5 } } }] },
      { text: '跟家人或朋友说说', outcomes: [{ text: '你第一次把心里的事说了出来。对方没说什么大道理，只是抱了抱你。', effects: { stats: { happiness: 7 } } }] },
      { text: '一个人扛着', outcomes: [{ text: '日子一天天地熬过去，你把情绪藏得很好，只是身体先垮了一点。', effects: { stats: { health: -5, happiness: -2 } } }] },
    ],
  },
  {
    id: 'health-fall',
    category: 'life',
    requires: { minAge: 65 },
    title: '摔了一跤',
    text: '下楼梯时脚下一滑，你摔倒了，胯骨疼得站不起来。',
    choices: [
      { text: '听医生的，手术加康复', outcomes: [{ text: '手术很顺利。康复训练很痛，但半年后你又能自己下楼买菜了。', effects: { stats: { health: -5, wealth: -5, happiness: -2 } } }] },
      { text: '保守治疗，在家躺着养', outcomes: [{ text: '躺了大半年，腿脚明显不如从前，出门得拄拐了。', effects: { stats: { health: -12, happiness: -5 } } }] },
    ],
  },
  {
    id: 'health-old-friends',
    category: 'life',
    requires: { minAge: 60 },
    title: '老朋友',
    text: '同学群里又传来消息：当年坐在你后排的那个人，走了。你翻出毕业照，一张张脸看过去。',
    choices: [
      { text: '组织一次老同学聚会', outcomes: [{ text: '来了十几个人，头发都白了。大家聊起当年的糗事，笑得像一群孩子。', effects: { stats: { happiness: 6, charm: 1 } } }] },
      { text: '一个人去公园走走', outcomes: [{ text: '你在长椅上坐了一下午。人生就是这样，一边相聚，一边告别。', effects: { stats: { happiness: -2, intelligence: 1 } } }] },
    ],
  },
  {
    id: 'health-red-alert',
    category: 'life',
    rarity: 'rare',
    once: false,
    weight: 60,
    requires: { minAge: 16, statMax: { health: 25 } },
    title: '身体亮红灯',
    text: '你最近总是心慌、胸闷，爬两层楼就喘不上气。一天夜里，你在洗手间里眼前一黑，扶着墙才没倒下。身体在给你发最后的警告。',
    choices: [
      { text: '停下一切，住院好好检查和休养', outcomes: [{ text: '你在医院躺了一个月，医生说再晚来一点就危险了。出院时你瘦了一圈，但精神好多了。', effects: { stats: { health: 20, wealth: -5, happiness: 2 } } }] },
      { text: '请一段长假，回家调养', outcomes: [{ text: '你关掉工作群，每天早睡早起、散步、喝汤。几个月后，身体慢慢缓了过来。', effects: { stats: { health: 12, happiness: 4, wealth: -2 } } }] },
      { text: '再撑一撑，忙完这阵再说', outcomes: [{ text: '你吞了两片药，继续回到桌前。身体的账，总是要还的。', effects: { stats: { health: -5, wealth: 3 } } }] },
    ],
  },
]
