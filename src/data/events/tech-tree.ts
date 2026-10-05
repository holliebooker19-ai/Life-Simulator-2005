import type { GameEvent } from '../../types'

/**
 * 科技树（2027 年后，虚构的未来）。科技等级见 src/data/world.ts：0 = 真实 2026 年的水平，最高 5。
 * 推进方式：行动“资助××研究”（actions/world.ts）、本文件的“科技进展”随机事件、后续 AI 主线。
 *
 * 本文件写入的标记：
 * - tech-uploaded：意识上传（数字永生）
 * - tech-on-mars：移民火星
 *
 * 改写锚点（Effects.alter）：tech-zombie（玩家研发解药，平息丧尸危机）。
 * 荒诞事件（人造病毒、丧尸）只在 2027 年后、荒诞度较高时出现，与现实疫情无关。
 */
export const techTreeEvents: GameEvent[] = [
  {
    id: 'tech-progress',
    category: 'world',
    once: false,
    weight: 5,
    requires: { minYear: 2027 },
    title: '科技快讯',
    text: '新闻推送里又是一条“重大突破”。有些是真的，有些只是融资通稿。你已经没有未来的记忆了，只能自己判断。',
    choices: [
      {
        text: '仔细读完，顺手转给懂行的朋友',
        outcomes: [
          { weight: 2, requires: { worldMax: { 'tech-gene': 4 } }, text: '这次是真的：基因编辑又往前走了一步。', effects: { world: { 'tech-gene': 1, absurd: 3 }, stats: { intelligence: 1 } } },
          { weight: 2, requires: { worldMax: { 'tech-energy': 4 } }, text: '这次是真的：一种新型电池让能源价格跌了一截。', effects: { world: { 'tech-energy': 1 }, stats: { intelligence: 1 } } },
          { weight: 2, requires: { worldMax: { 'tech-robot': 4 } }, text: '这次是真的：人形机器人开始在工厂里成批上岗。', effects: { world: { 'tech-robot': 1 }, stats: { intelligence: 1 } } },
          { weight: 1, requires: { worldMax: { 'tech-space': 4 } }, text: '这次是真的：一枚可回收的重型火箭把补给送上了月球。', effects: { world: { 'tech-space': 1 }, stats: { intelligence: 1 } } },
          { weight: 1, requires: { worldMax: { 'tech-brain': 4 } }, text: '这次是真的：瘫痪的志愿者用脑机接口打出了一句完整的话。', effects: { world: { 'tech-brain': 1 }, stats: { intelligence: 1 } } },
          { weight: 2, requires: { worldMax: { 'tech-ai': 4 } }, text: '这次是真的：大模型又学会了一项人类以为只有自己会的本事。', effects: { world: { 'tech-ai': 1 }, stats: { intelligence: 1 } } },
          { weight: 3, text: '又是融资通稿。你笑了笑，划走了。', effects: { stats: { intelligence: 1 } } },
        ],
      },
      { text: '科技离我太远，刷点别的', outcomes: [{ text: '你刷到了一只会弹钢琴的猫，心情很好。', effects: { stats: { happiness: 1 } } }] },
    ],
  },

  // ───────────── 基因工程：延寿 ─────────────
  {
    id: 'tech-gene-telomere',
    category: 'world',
    rarity: 'rare',
    requires: { minYear: 2027, minAge: 30, worldMin: { 'tech-gene': 2 } },
    title: '端粒疗法',
    text: '第一种被批准上市的延寿疗法出现了：通过修复端粒，让细胞“年轻十岁”。价格贵得离谱，医院门口却排起了长队。',
    choices: [
      {
        text: '花大价钱做一个疗程',
        requires: { statMin: { wealth: 500 } },
        outcomes: [{ text: '疗程结束后，你的体检报告上，好几项指标回到了十年前。你的寿命上限提高了。', effects: { stats: { wealth: -300, health: 10 }, maxAge: 10 } }],
      },
      { text: '等价格降下来再说', outcomes: [{ text: '你决定再观望几年。电视上，第一批受试者正在跑马拉松。', effects: { stats: { happiness: -1 } } }] },
    ],
  },
  {
    id: 'tech-gene-rejuvenation',
    category: 'world',
    rarity: 'legendary',
    requires: { minYear: 2030, minAge: 35, worldMin: { 'tech-gene': 4 } },
    title: '返老还童',
    text: '全身细胞重编程技术成熟了：老人可以在一年之内“回到”四十岁的身体。全世界都在讨论，人类是不是要告别衰老了。',
    choices: [
      {
        text: '接受重编程',
        requires: { statMin: { wealth: 3000 } },
        outcomes: [
          { weight: 4, text: '一年后，你照镜子时愣住了：皱纹不见了，头发也黑了。寿命上限大幅提高。', effects: { stats: { wealth: -2000, health: 25, charm: 5, happiness: 8 }, maxAge: 20 } },
          { weight: 1, text: '身体年轻了，可你的一部分记忆也跟着模糊了。你不太记得自己的十八岁了。', effects: { stats: { wealth: -2000, health: 20, happiness: -5, intelligence: -5 }, maxAge: 20 } },
        ],
      },
      { text: '自然地老去，也是一种活法', outcomes: [{ text: '你拒绝了。你说：“我已经多活过一次了。”', effects: { stats: { happiness: 5 } } }] },
    ],
  },
  {
    id: 'tech-gene-immortal',
    category: 'absurd',
    rarity: 'legendary',
    requires: { minYear: 2035, worldMin: { 'tech-gene': 5, absurd: 10 } },
    title: '永生实验',
    text: '一家神秘的生物公司宣称：他们找到了让人“理论上不会老死”的方法，正在招募第一批志愿者。报名费是一个天文数字，条款写着“后果自负”。',
    choices: [
      {
        text: '签字，成为第一批永生者',
        requires: { statMin: { wealth: 20000 } },
        outcomes: [
          { weight: 2, text: '实验成功了。你的细胞停止了衰老。从此以后，能杀死你的只有意外——和无聊。', effects: { stats: { wealth: -15000, fame: 15, health: 30 }, maxAge: 80, world: { absurd: 10 } } },
          { weight: 1, text: '实验出了岔子，你在病床上躺了三年。身体没有永生，但比原来硬朗了些。', effects: { stats: { wealth: -15000, health: -20, happiness: -10 }, maxAge: 10 } },
        ],
      },
      { text: '“永生？那得多无聊。”', outcomes: [{ text: '你关掉了招募广告。人生有终点，才会想好好走完。', effects: { stats: { happiness: 3 } } }] },
    ],
  },

  // ───────────── 基因工程：失控（荒诞） ─────────────
  {
    id: 'tech-gene-leak',
    category: 'absurd',
    rarity: 'legendary',
    requires: { minYear: 2030, worldMin: { 'tech-gene': 3, absurd: 10 } },
    title: '实验室泄漏',
    text: '一家基因公司的实验室发生泄漏，一种人造病毒让感染者“疯狂想跳广场舞”。荒诞是荒诞，可全球的医院都忙疯了。',
    choices: [
      {
        text: '出钱资助解药研发',
        requires: { statMin: { wealth: 1000 } },
        outcomes: [{ text: '你资助的团队三个月就拿出了解药。各国的广场终于安静了下来，你的名字上了新闻。', effects: { stats: { wealth: -800, fame: 10, influence: 6 }, world: { health: 10 } } }],
      },
      {
        text: '在家闭门不出，等风头过去',
        outcomes: [
          { weight: 3, text: '你在家憋了半年，学会了做面包。窗外每天晚上都有音乐。', effects: { stats: { happiness: -3 } } },
          { weight: 1, text: '你还是被传染了。在小区广场上跳了整整一个月，邻居们拍的视频至今还在流传。', effects: { stats: { health: -8, fame: 3, happiness: -5 } } },
        ],
      },
    ],
  },
  {
    id: 'tech-zombie',
    category: 'absurd',
    rarity: 'legendary',
    requires: { minYear: 2035, worldMin: { 'tech-gene': 3, absurd: 25 }, notAltered: ['tech-zombie'] },
    title: '丧尸危机',
    text: '一种失控的基因改造病毒让感染者行动迟缓、见人就扑——全世界都在用同一个词形容它：丧尸。城市拉起了警戒线，超市被抢空。你突然很想念那个只需要担心股票的年代。',
    choices: [
      {
        text: '调动你的基因公司和全部影响力，研发解药',
        requires: { statMin: { influence: 60 }, worldMin: { 'tech-gene': 4 } },
        outcomes: [{ text: '你的实验室日夜不停，第七个月，解药诞生。人类没有走进末日电影，而是走进了你写下的那一页历史。', effects: { stats: { fame: 25, influence: 10, wealth: -5000 }, alter: [{ id: 'tech-zombie', scale: 15 }], world: { health: 20, absurd: -10 } } }],
      },
      {
        text: '带着家人去你的私人岛屿避难',
        requires: { statMin: { wealth: 10000 } },
        outcomes: [{ text: '岛上风平浪静。你每天看着卫星新闻，心里却一点也不轻松。', effects: { stats: { happiness: -3, wealth: -500 } } }],
      },
      {
        text: '组织邻居守住小区',
        outcomes: [
          { weight: 2, requires: { statMin: { health: 60 } }, text: '你带着大家加固门窗、轮流守夜、分配物资。小区成了附近最安全的地方，大家叫你“楼长”。', effects: { stats: { charm: 5, influence: 4, health: -5, happiness: 2 } } },
          { weight: 2, text: '你们守住了，但代价不小：好几个人受了伤，你也累垮了。', effects: { stats: { health: -15, happiness: -6, charm: 2 } } },
          { weight: 1, text: '一个晚上，防线被冲破了。你在混乱中受了重伤，幸好被救援队及时带走。', effects: { stats: { health: -35, happiness: -10 } } },
        ],
      },
    ],
  },

  // ───────────── 其他科技分支 ─────────────
  {
    id: 'tech-brain-upload',
    category: 'world',
    rarity: 'legendary',
    requires: { minYear: 2035, minAge: 40, worldMin: { 'tech-brain': 4 }, notFlags: ['tech-uploaded'] },
    title: '意识上传',
    text: '脑机接口走到了最后一步：把一个人的意识完整地备份到云端。理论上，身体死去之后，“你”还能在服务器里继续活着。',
    choices: [
      {
        text: '备份自己',
        requires: { statMin: { wealth: 5000 } },
        outcomes: [{ text: '备份完成的那一刻，你在屏幕上看到了另一个“你”在冲你挥手。它说：“放心，剩下的交给我。”', effects: { stats: { wealth: -3000, fame: 5 }, maxAge: 30, addFlags: ['tech-uploaded'] } }],
      },
      { text: '人还是得有血有肉', outcomes: [{ text: '你拒绝了。你觉得一个只活在服务器里的人生，算不上人生。', effects: { stats: { happiness: 2 } } }] },
    ],
  },
  {
    id: 'tech-energy-fusion',
    category: 'world',
    rarity: 'rare',
    requires: { minYear: 2030, worldMin: { 'tech-energy': 3 } },
    title: '人造太阳',
    text: '第一座商用可控核聚变电站并网发电。电价开始断崖式下跌，有人说，这是工业革命以来最大的转折。',
    choices: [
      { text: '把资金投向电力密集的新产业', requires: { statMin: { wealth: 1000 } }, outcomes: [{ text: '你押对了方向，新工厂开在了电最便宜的地方，利润翻了几番。', effects: { stats: { wealth: 3000, influence: 3 }, world: { economy: 5 } } }] },
      { text: '家里的电费终于不心疼了', outcomes: [{ text: '你把空调开到了最舒服的温度，一整个夏天都没再看电表。', effects: { stats: { happiness: 4 }, world: { economy: 3 } } }] },
    ],
  },
  {
    id: 'tech-space-mars',
    category: 'world',
    rarity: 'legendary',
    requires: { minYear: 2035, worldMin: { 'tech-space': 4 }, notFlags: ['tech-on-mars'] },
    title: '火星船票',
    text: '第一批火星定居船开始售票。单程，不保证回来。马丝氪在发布会上说：“我会和你们一起去。”——然后他没有上船。',
    choices: [
      {
        text: '买一张船票，去火星',
        requires: { statMin: { wealth: 5000, health: 50 } },
        outcomes: [{ text: '飞船起飞时，你看着地球在舷窗里越来越小。你重生过一次，这一次，你换了一颗星球。', effects: { stats: { wealth: -3000, fame: 20, influence: 8, happiness: 10 }, addFlags: ['tech-on-mars'] } }],
      },
      { text: '留在地球，看直播就好', outcomes: [{ text: '你和全世界一起看着飞船消失在云层里，眼眶有点湿。', effects: { stats: { happiness: 3 } } }] },
    ],
  },
  {
    id: 'tech-robot-jobs',
    category: 'world',
    rarity: 'rare',
    requires: { minYear: 2030, worldMin: { 'tech-robot': 3 } },
    title: '机器人上岗潮',
    text: '人形机器人便宜到了一台车的价格，工厂、仓库、餐厅成批换人。街头出现了抗议的人群，标语上写着：“我们也要吃饭”。',
    choices: [
      {
        text: '推动“全民基本收入”试点',
        requires: { statMin: { influence: 60 } },
        outcomes: [{ text: '在你的推动下，几座城市开始给每个人发基本收入。失业的人没有被抛下，你的支持率高得吓人。', effects: { stats: { influence: 6, fame: 8, happiness: 5 }, world: { economy: 5 } } }],
      },
      { text: '买几台机器人，做点小生意', requires: { statMin: { wealth: 100 } }, outcomes: [{ text: '你的机器人奶茶店 24 小时营业，生意很好，就是偶尔会把糖放成盐。', effects: { stats: { wealth: 40, happiness: 2 } } }] },
      { text: '担心自己的饭碗', outcomes: [{ text: '你报了一个“人机协作”培训班，学着和机器人搭伙干活。', effects: { stats: { intelligence: 2, happiness: -2 } } }] },
    ],
  },
]
