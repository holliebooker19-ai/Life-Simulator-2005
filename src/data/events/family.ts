import type { GameEvent } from '../../types'

/**
 * 亲人：父母老去、伴侣、孩子成长、情绪（DESIGN_V2 P5）。写法克制，生老病死给出处理的出路。
 *
 * 读取 state.rel（见 types.Relations，条件写 relMin/relMax）：
 * - parentAge：父母年龄（主角年龄 + 26）；parents：父母的身体 0-100；parentsLost：已离世的人数 0-2
 * - partner：和伴侣的感情（有伴侣时 1-100，没有为 0）；childAge：孩子年龄（没有孩子为 -1）
 * - 引擎在父母离世时写入 parent-lost / parents-gone，本文件的告别事件接住它们。
 * - 孩子的里程碑用 annual + notFlags：每个结果都必须写入对应的 kid-* 标记，否则会每年重复。
 *
 * 本文件读取的标记：partner / married / has-child / parent-lost / parents-gone / partner-lost / employed / kid-close
 * （parent-lost / parents-gone / partner-lost 由引擎 relationsDrift 写入）
 * 本文件写入的标记：
 * - filial：孝顺（结局家庭分 +10）。只在告别时给：这些年把父母照顾得好（parents ≥ 40），或接留下的那一位同住
 * - mourned-parent / mourned-parents：告别事件已触发
 * - divorced / widowed：离婚 / 丧偶
 * - kid-kindergarten / kid-school / kid-hobby / kid-teen / kid-gaokao / kid-leave：孩子的成长阶段
 * - kid-close：和孩子亲近；kid-pressure：管得太严；kid-married：孩子成家；grandchild：有了孙辈（结局家庭分 +10）
 */
export const familyEvents: GameEvent[] = [
  // ---------------- 父母 ----------------
  {
    id: 'family-parents-checkup',
    category: 'family',
    weight: 14,
    requires: { minAge: 25, relMin: { parentAge: 58 }, relMax: { parentsLost: 0, parents: 80 } },
    title: '爸妈的体检单',
    text: '妈妈在电话里轻描淡写地说，单位组织了体检，“有几项箭头，没事”。你让她把报告拍给你，好几行数字后面都标着红。',
    choices: [
      {
        text: '请假回去，带他们去大医院复查',
        outcomes: [{ text: '专家说发现得早，按时吃药、注意饮食就行。回来的路上，爸爸破天荒地拉着你的手过马路。', effects: { stats: { happiness: 3, wealth: -1 }, rel: { parents: 10 } } }],
      },
      {
        text: '给他们订一个最贵的体检套餐',
        requires: { statMin: { wealth: 20 } },
        outcomes: [{ text: '套餐里连基因检测都有。妈妈嘴上说“浪费钱”，转头就在亲戚群里发了截图。', effects: { stats: { wealth: -2, happiness: 2 }, rel: { parents: 6 } } }],
      },
      {
        text: '叮嘱几句“少吃咸的”',
        outcomes: [{ text: '他们满口答应。挂了电话，照样腌了一缸咸菜。', effects: { rel: { parents: -3 } } }],
      },
    ],
  },
  {
    id: 'family-parents-fall',
    category: 'family',
    weight: 12,
    requires: { minAge: 30, relMin: { parentAge: 68 }, relMax: { parentsLost: 1 } },
    title: '楼梯上的一跤',
    text: '老家的邻居打来电话：老人早上去买菜，在楼梯上摔了一跤，髋骨骨折，已经送进了医院。电话里还能听见病房走廊的广播声。',
    choices: [
      {
        text: '请长假回去陪护',
        outcomes: [{ text: '你在病床边守了一个月，学会了怎么翻身、怎么擦洗。出院那天，老人拄着拐，非要自己走出医院大门。', effects: { stats: { happiness: -2, wealth: -2 }, rel: { parents: 8 } } }],
      },
      {
        text: '请一个好护工，每天视频',
        requires: { statMin: { wealth: 10 } },
        outcomes: [{ text: '护工很尽心。每天晚上视频的时候，老人都说“好着呢”，可你看得出镜头外那条腿还肿着。', effects: { stats: { wealth: -5 }, rel: { parents: 4 } } }],
      },
      {
        text: '先请亲戚帮忙照看',
        outcomes: [{ text: '亲戚们轮流去了几趟，后来就来得少了。老人在电话里说“你忙你的”，你心里却一直不踏实。', effects: { stats: { happiness: -4 }, rel: { parents: -6 } } }],
      },
    ],
  },
  {
    id: 'family-parents-ai-scam',
    category: 'family',
    weight: 8,
    requires: { minAge: 30, minYear: 2027, relMin: { parentAge: 60 }, relMax: { parentsLost: 0 } },
    title: '电话里“你”的声音',
    text: '妈妈慌慌张张地打来电话：“你刚才是不是出车祸了？电话里明明是你的声音，哭着让我转钱！”AI 合成的声音，已经能骗过亲妈的耳朵。',
    choices: [
      {
        text: '和爸妈约一个只有家里人知道的暗号',
        outcomes: [{ text: '你们定了一个暗号：你小时候第一句说出口的话。后来骗子又打来过两次，都在暗号这一关露了馅。', effects: { stats: { happiness: 3, intelligence: 1 }, rel: { parents: 2 } } }],
      },
      {
        text: '报警，再去社区给老人们讲一课',
        outcomes: [{ text: '你在社区活动室讲了一下午，台下坐满了老人。后来街道把你的课录成视频，到处转发。', effects: { stats: { fame: 2, influence: 1, happiness: 2 } } }],
      },
      {
        text: '“我们家的人不会上当的。”',
        outcomes: [
          { weight: 2, text: '还好这一次，妈妈多了个心眼，先给你打了电话。', effects: { stats: { happiness: -1 } } },
          { weight: 1, text: '几个月后，爸爸还是被同样的手法骗走了一笔养老钱，好几天吃不下饭。', effects: { stats: { wealth: -10, happiness: -6 }, rel: { parents: -5 } } },
        ],
      },
    ],
  },
  {
    id: 'family-parents-golden',
    category: 'family',
    weight: 10,
    requires: { minAge: 45, relMin: { parentAge: 74 }, relMax: { parentAge: 80, parentsLost: 0 } },
    title: '金婚',
    text: '翻日历的时候你才发现，今年是爸妈结婚五十周年。他们自己倒没当回事，说“老夫老妻了，过什么纪念日”。',
    choices: [
      {
        text: '张罗一场金婚宴，把老亲戚都请来',
        outcomes: [{ text: '宴席上，爸爸喝了两杯，当着所有人说起当年骑自行车去提亲的事。妈妈在旁边笑着骂他“老不正经”。', effects: { stats: { happiness: 8, wealth: -3 }, rel: { parents: 5 } } }],
      },
      {
        text: '带他们去补拍一套婚纱照',
        outcomes: [{ text: '摄影师让他们靠近一点，两位老人别别扭扭地挨在一起。那张照片后来一直挂在客厅正中间。', effects: { stats: { happiness: 6, charm: 1 }, rel: { parents: 4 } } }],
      },
      {
        text: '发个大红包，祝他们节日快乐',
        outcomes: [{ text: '妈妈回了一个“谢谢”的表情，又补了一句：“有空回来吃饭。”', effects: { stats: { happiness: 1 } } }],
      },
    ],
  },
  {
    id: 'family-parents-dementia',
    category: 'family',
    rarity: 'rare',
    weight: 6,
    requires: { minAge: 45, relMin: { parentAge: 75 }, relMax: { parentsLost: 1 } },
    title: '认不出你了',
    text: '你推门进去，老人抬起头，客客气气地问：“你找谁？”医生说是阿尔茨海默病，会一点点忘掉身边的人，最后忘掉自己。',
    choices: [
      {
        text: '搬回去住一段时间，陪着',
        outcomes: [{ text: '你每天陪着翻老相册，一张一张地讲。有一天下午，老人忽然叫出了你的小名，你转过身去，眼泪止不住。', effects: { stats: { happiness: -3, wealth: -3 }, rel: { parents: 8 } } }],
      },
      {
        text: '找一家专业的护理机构',
        outcomes: [{ text: '护理院的条件很好，护士们也很耐心。你每周去两次，老人每次都很高兴认识你这位“新朋友”。', effects: { stats: { wealth: -10, happiness: -2 }, rel: { parents: 3 } } }],
      },
      {
        text: '趁还记得一些事，带去看一次海',
        outcomes: [{ text: '老人在海边坐了一下午，一直笑，说年轻时就想来。回去以后，这件事也忘了，可你记得。', effects: { stats: { happiness: 4, wealth: -2 }, rel: { parents: 3 } } }],
      },
    ],
  },
  {
    id: 'family-parent-farewell',
    category: 'family',
    rarity: 'rare',
    annual: true,
    requires: { flags: ['parent-lost'], notFlags: ['mourned-parent', 'parents-gone'] },
    title: '那个电话',
    text: '你最怕接到的那个电话，还是来了。电话那头，另一位老人哭得说不出一句完整的话。你订了最早的一班车，一路看着窗外，脑子里全是小时候被抱着看世界杯的那个夜晚。',
    choices: [
      {
        text: '放下一切，回去守着，把后事办妥',
        outcomes: [
          { requires: { relMin: { parents: 40 } }, text: '你守了三天三夜，把后事办得妥妥当当。送别那天来了很多你不认识的人，他们都说，老人生前常常提起你，说你是个孝顺孩子。', effects: { stats: { happiness: -10, health: -2, wealth: -3 }, rel: { parents: 5 }, addFlags: ['mourned-parent', 'filial'] } },
          { requires: { relMax: { parents: 39 } }, text: '你守了三天三夜，把后事办得妥妥当当。整理病历的时候你才知道，老人这几年一直在吃药，却从没在电话里跟你提过。', effects: { stats: { happiness: -12, health: -2, wealth: -3 }, rel: { parents: 5 }, addFlags: ['mourned-parent'] } },
        ],
      },
      {
        text: '办完后事，把留下的那一位接到身边',
        outcomes: [{ text: '老人一开始总说住不惯城里，后来每天早上都会在桌上给你留一碗粥。', effects: { stats: { happiness: -6, wealth: -5 }, rel: { parents: 10 }, addFlags: ['mourned-parent', 'filial'] } }],
      },
      {
        text: '工作实在走不开，只回去了一天',
        outcomes: [{ text: '你在灵堂前站了一个下午，当晚就赶了回去。很多年以后，你还会梦见那天没来得及说完的话。', effects: { stats: { happiness: -15, wealth: 2 }, rel: { parents: -5 }, addFlags: ['mourned-parent'] } }],
      },
    ],
  },
  {
    id: 'family-parents-gone',
    category: 'family',
    rarity: 'rare',
    annual: true,
    requires: { flags: ['parents-gone'], notFlags: ['mourned-parents'] },
    title: '最年长的一辈',
    text: '另一位老人也走了。整理遗物的时候，你在抽屉最深处翻出一本旧存折，扉页上是你小时候歪歪扭扭写的名字。从今往后，你就是家里最年长的那一辈了。',
    variants: [{
      requires: { notFlags: ['mourned-parent'] },
      text: '同一年里，两位老人相继离开。整理遗物的时候，你在抽屉最深处翻出一本旧存折，扉页上是你小时候歪歪扭扭写的名字。从今往后，你就是家里最年长的那一辈了。',
    }],
    choices: [
      {
        text: '回老家，把老房子收拾干净',
        outcomes: [{ text: '你在老房子里住了一个星期，把每样东西都擦了一遍。临走前锁上门，在门口站了很久。', effects: { stats: { happiness: -8, intelligence: 1 }, addFlags: ['mourned-parent', 'mourned-parents'] } }],
      },
      {
        text: '把爸妈的故事写下来，留给后人',
        outcomes: [{ text: '你写了三万字，从他们年轻时骑自行车提亲写起。写完最后一个字，你觉得他们好像还在。', effects: { stats: { happiness: -5, intelligence: 1, charm: 1 }, addFlags: ['mourned-parent', 'mourned-parents'] } }],
      },
      {
        text: '一个人去看一场球',
        outcomes: [{ text: '球场里几万人在欢呼，你坐在看台上，第一次觉得自己像个大人，也第一次觉得自己像个孤儿。', effects: { stats: { happiness: -7, health: 1 }, addFlags: ['mourned-parent', 'mourned-parents'] } }],
      },
    ],
  },

  // ---------------- 伴侣 ----------------
  {
    id: 'family-partner-cold',
    category: 'family',
    weight: 20,
    once: false,
    requires: { minAge: 22, relMin: { partner: 1 }, relMax: { partner: 40 } },
    title: '各自看手机的晚饭',
    text: '你们已经很久没有好好说过话了。晚饭的时候，两个人各自低头刷手机，屋子里只剩下碗筷碰撞的声音。',
    choices: [
      {
        text: '订一趟只有两个人的旅行',
        outcomes: [{ text: '在海边的小旅馆里，你们聊到半夜，像刚认识那会儿一样。', effects: { stats: { happiness: 4, wealth: -3 }, rel: { partner: 20 } } }],
      },
      {
        text: '放下手机，认真聊一次',
        outcomes: [
          { weight: 2, text: '你们把憋了很久的话都说了出来，说着说着都哭了，又都笑了。', effects: { stats: { happiness: 3 }, rel: { partner: 15 } } },
          { weight: 1, text: '聊着聊着又吵了起来。不过至少，你们终于把话说开了。', effects: { stats: { happiness: -1 }, rel: { partner: 5 } } },
        ],
      },
      {
        text: '最近太忙了，以后再说',
        outcomes: [{ text: '“以后”一直没有来。你们像两个合租的室友，客客气气，互不打扰。', effects: { stats: { happiness: -3 }, rel: { partner: -8 } } }],
      },
    ],
  },
  {
    id: 'family-partner-crisis',
    category: 'family',
    rarity: 'rare',
    weight: 40,
    once: false,
    requires: { minAge: 26, flags: ['married'], relMax: { partner: 20 } },
    title: '桌上的协议书',
    text: '另一半把一份打印好的离婚协议放在桌上，语气很平静：“我们都累了，你看一下。”',
    choices: [
      {
        text: '去做婚姻咨询，再试一次',
        outcomes: [
          { weight: 2, text: '咨询师让你们各自说出对方的三个优点。你说到第二个的时候，对方的眼圈红了。', effects: { stats: { happiness: 4, wealth: -1 }, rel: { partner: 30 } } },
          { weight: 1, text: '你们努力过了，还是决定分开。签字那天，两个人一起吃了最后一顿饭。', effects: { stats: { happiness: -10, wealth: -20 }, removeFlags: ['married'], addFlags: ['divorced'] } },
        ],
      },
      {
        text: '签字，好聚好散',
        outcomes: [{ text: '财产分得很清楚，谁也没有为难谁。搬家那天，你一个人把箱子一个个搬下楼。', effects: { stats: { happiness: -10, wealth: -30 }, removeFlags: ['married'], addFlags: ['divorced'] } }],
      },
      {
        text: '拖着，不签',
        outcomes: [{ text: '协议在抽屉里躺了一年，你们在同一个屋檐下过着各自的日子。', effects: { stats: { happiness: -8 }, rel: { partner: -5 } } }],
      },
    ],
  },
  {
    id: 'family-anniversary',
    category: 'family',
    weight: 10,
    requires: { minAge: 28, flags: ['married'], relMin: { partner: 55 } },
    title: '结婚纪念日',
    text: '今天是你们的结婚纪念日。早上出门前，另一半看了你一眼，什么也没说。',
    choices: [
      {
        text: '偷偷准备一个惊喜',
        outcomes: [{ text: '你订了当年求婚的那家小馆子。对方推门进来的那一刻，愣了足足三秒。', effects: { stats: { happiness: 5, wealth: -1 }, rel: { partner: 8 } } }],
      },
      {
        text: '一起回第一次约会的地方走走',
        outcomes: [{ text: '那家店早就没了，变成了一家奶茶店。你们捧着两杯奶茶站在门口，笑得像两个学生。', effects: { stats: { happiness: 6 }, rel: { partner: 8 } } }],
      },
      {
        text: '忙忘了',
        outcomes: [{ text: '直到晚上回家看见桌上的蛋糕，你才想起来。那一晚，屋里特别安静。', effects: { stats: { happiness: -2 }, rel: { partner: -8 } } }],
      },
    ],
  },
  {
    id: 'family-partner-ill',
    category: 'family',
    rarity: 'rare',
    weight: 5,
    requires: { minAge: 45, flags: ['married'] },
    title: '病床边',
    text: '另一半在体检里查出了问题，要做一个不小的手术。签手术同意书的时候，你的手一直在抖。',
    choices: [
      {
        text: '推掉所有工作，陪在病床前',
        outcomes: [{ text: '手术很顺利。麻药过后，对方睁开眼，第一句话是：“你怎么瘦成这样了？”', effects: { stats: { happiness: -2, wealth: -5 }, rel: { partner: 20 } } }],
      },
      {
        text: '请最好的医生和护工',
        requires: { statMin: { wealth: 100 } },
        outcomes: [{ text: '最好的专家主刀，恢复得很快。只是对方偶尔会说：“病房里人来人往，就是很少见到你。”', effects: { stats: { wealth: -30 }, rel: { partner: 8 } } }],
      },
      {
        text: '白天上班，晚上陪床',
        outcomes: [{ text: '你在折叠床上睡了一个月，腰都直不起来了。出院那天，对方偷偷把你的外套洗干净叠好了。', effects: { stats: { health: -4 }, rel: { partner: 12 } } }],
      },
    ],
  },
  {
    id: 'family-remarry',
    category: 'family',
    weight: 8,
    requires: { minAge: 30, maxAge: 70, flags: ['divorced'], notFlags: ['partner', 'married'] },
    title: '第二次心动',
    text: '朋友的饭局上，你认识了一个说话很温和的人。散场的时候，对方问你要不要一起走一段。',
    choices: [
      {
        text: '再勇敢一次',
        outcomes: [{ text: '你们走了很长的一段路。这一次，你学会了先把话说出口。', effects: { stats: { happiness: 8 }, addFlags: ['partner'], removeFlags: ['divorced'] } }],
      },
      {
        text: '一个人也挺好',
        outcomes: [{ text: '你礼貌地道了别，一个人走回家。路灯一盏一盏亮起来，你觉得这样也不错。', effects: { stats: { happiness: 3, charm: 1 } } }],
      },
    ],
  },
  {
    id: 'family-widowed',
    category: 'family',
    rarity: 'rare',
    annual: true,
    requires: { flags: ['married', 'partner-lost'], notFlags: ['widowed'] },
    title: '先走一步',
    text: '那天早上，另一半没有像往常一样起来做早饭。走得很安详，床头还放着没看完的那本书，书签夹在倒数第二章。',
    choices: [
      {
        text: '去孩子那边住一段',
        requires: { flags: ['has-child'] },
        outcomes: [{ text: '孩子把最向阳的房间收拾出来给你。晚上你常常一个人坐在阳台上，替对方把那本书看完了。', effects: { stats: { happiness: -10 }, removeFlags: ['married'], addFlags: ['widowed'] } }],
      },
      {
        text: '报个老年大学，让自己忙起来',
        outcomes: [{ text: '你学了书法，也学了摄影。第一张拿得出手的作品，拍的是你们一起种的那棵树。', effects: { stats: { happiness: -12, intelligence: 2 }, removeFlags: ['married'], addFlags: ['widowed'] } }],
      },
      {
        text: '每天去对方常去的那个公园坐坐',
        outcomes: [{ text: '公园里的老伙计们都认识你了。他们不太说话，只是每天给你留一个位置。', effects: { stats: { happiness: -14, health: 1 }, removeFlags: ['married'], addFlags: ['widowed'] } }],
      },
    ],
  },

  // ---------------- 孩子 ----------------
  {
    id: 'family-kid-kindergarten',
    category: 'family',
    annual: true,
    requires: { flags: ['has-child'], relMin: { childAge: 3 }, relMax: { childAge: 5 }, notFlags: ['kid-kindergarten'] },
    title: '上幼儿园',
    text: '孩子三岁了，该上幼儿园了。家长群里有人说双语幼儿园“起跑线不一样”，也有人说“开心就好”。',
    choices: [
      {
        text: '挤破头上最好的双语幼儿园',
        outcomes: [{ text: '学费贵得吓人。孩子学会的第一句英语是“I want to go home”。', effects: { stats: { wealth: -8, happiness: 1 }, addFlags: ['kid-kindergarten'] } }],
      },
      {
        text: '家门口的幼儿园就好',
        outcomes: [{ text: '每天走五分钟就到。孩子交了一堆好朋友，放学时总是最后一个舍得走的。', effects: { stats: { happiness: 4 }, addFlags: ['kid-kindergarten'] } }],
      },
      {
        text: '自己在家带，自己教',
        outcomes: [{ text: '你把客厅改成了教室。孩子学得很快，你累得够呛，但这一年你们形影不离。', effects: { stats: { happiness: 3, health: -2, intelligence: 1 }, addFlags: ['kid-kindergarten', 'kid-close'] } }],
      },
    ],
  },
  {
    id: 'family-kid-school',
    category: 'family',
    annual: true,
    requires: { flags: ['has-child'], relMin: { childAge: 6 }, relMax: { childAge: 8 }, notFlags: ['kid-school'] },
    title: '上小学',
    text: '孩子要上小学了。小区里的家长都在聊学区房，说一套“老破小”的价格，够在老家买一栋楼。',
    variants: [{
      requires: { worldMin: { 'tech-ai': 2 } },
      text: '孩子要上小学了。现在每个学生都配了一个 AI 助教，作业它会批，问题它会答。家长们却还在聊学区房，说“老师还是得看人”。',
    }],
    choices: [
      {
        text: '咬咬牙，买一套学区房',
        requires: { statMin: { wealth: 300 } },
        outcomes: [{ text: '你们搬进了一套四十平的老房子，孩子每天走路三分钟就到学校。', effects: { stats: { wealth: -200, happiness: 1 }, addFlags: ['kid-school'] } }],
      },
      {
        text: '就近上学，周末多陪陪',
        outcomes: [{ text: '学校普普通通，可每个周末你们都去爬山、逛博物馆。孩子的作文里，写的全是这些周末。', effects: { stats: { happiness: 4 }, addFlags: ['kid-school', 'kid-close'] } }],
      },
      {
        text: '送去国际学校',
        requires: { statMin: { wealth: 150 } },
        outcomes: [{ text: '学费按年算，比你当年的工资还高。孩子很快说得一口流利的外语，回家却越来越少说话。', effects: { stats: { wealth: -60 }, addFlags: ['kid-school'] } }],
      },
    ],
  },
  {
    id: 'family-kid-hobby',
    category: 'family',
    annual: true,
    requires: { flags: ['has-child'], relMin: { childAge: 9 }, relMax: { childAge: 11 }, notFlags: ['kid-hobby'] },
    title: '孩子的梦想',
    text: '孩子攥着一张皱巴巴的传单跑回家，眼睛亮晶晶的：“我想学踢球！”你想起自己小时候，也有过这样的一张传单。',
    choices: [
      {
        text: '支持，周末陪着去',
        outcomes: [{ text: '你在场边站了一个又一个周末，嗓子都喊哑了。孩子第一次进球，是冲着你跑过来庆祝的。', effects: { stats: { happiness: 5, health: 1 }, addFlags: ['kid-hobby', 'kid-close'] } }],
      },
      {
        text: '先把成绩搞上去再说',
        outcomes: [{ text: '传单被压在了书桌最底下。孩子没再提过，只是看球赛的时候，会把声音开得很小。', effects: { stats: { happiness: -2 }, addFlags: ['kid-hobby', 'kid-pressure'] } }],
      },
      {
        text: '踢球、钢琴、编程、奥数，全都报上',
        outcomes: [{ text: '孩子的周末被排得满满当当，每天在车后座上睡着。你也累，但心里踏实了。', effects: { stats: { wealth: -5, happiness: -1 }, addFlags: ['kid-hobby', 'kid-pressure'] } }],
      },
    ],
  },
  {
    id: 'family-kid-teen',
    category: 'family',
    annual: true,
    requires: { flags: ['has-child'], relMin: { childAge: 13 }, relMax: { childAge: 16 }, notFlags: ['kid-teen'] },
    title: '关上的房门',
    text: '孩子关房门的声音越来越响了。饭桌上问一句，回一个“嗯”；再问一句，碗一放就回了房间。',
    choices: [
      {
        text: '敲门，坐下来好好聊',
        outcomes: [
          { requires: { flags: ['kid-close'] }, text: '因为从小就有说话的习惯，孩子没过多久就把心事说了出来。原来是在学校里被人孤立了，你们一起想了办法。', effects: { stats: { happiness: 4 }, addFlags: ['kid-teen'] } },
          { requires: { notFlags: ['kid-close'] }, text: '聊了半小时，孩子只回了三个“嗯”。不过第二天早上，你的桌上多了一张写着“对不起”的便签。', effects: { stats: { happiness: 1 }, addFlags: ['kid-teen'] } },
        ],
      },
      {
        text: '没收手机，严加管教',
        outcomes: [{ text: '手机收了，成绩没怎么变，话却更少了。很多年后孩子说起这一年，你才知道那时候有多难受。', effects: { stats: { happiness: -5 }, addFlags: ['kid-teen', 'kid-pressure'] } }],
      },
      {
        text: '放手，相信孩子',
        outcomes: [{ text: '你不再追问。过了一阵，房门开着的时间慢慢变长了。', effects: { stats: { happiness: 1 }, addFlags: ['kid-teen'] } }],
      },
    ],
  },
  {
    id: 'family-kid-gaokao',
    category: 'family',
    rarity: 'rare',
    annual: true,
    requires: { flags: ['has-child'], relMin: { childAge: 18 }, relMax: { childAge: 19 }, notFlags: ['kid-gaokao'] },
    title: '轮到你在考场外等',
    text: '六月，你站在考场外的树荫下，和一群家长一起等。你第一次发现，没有预知的考试，比自己上考场还紧张。',
    choices: [
      {
        text: '分数出来后，尊重孩子自己选专业',
        outcomes: [
          { requires: { flags: ['kid-close'] }, text: '孩子选了一个你从没听说过的专业，讲起来眉飞色舞。你突然觉得，未来真的不需要你来预知了。', effects: { stats: { happiness: 7 }, addFlags: ['kid-gaokao'] } },
          { requires: { notFlags: ['kid-close'] }, text: '孩子选了离家最远的一所大学。你嘴上说“挺好”，送站回来的路上却一直没说话。', effects: { stats: { happiness: 3 }, addFlags: ['kid-gaokao'] } },
        ],
      },
      {
        text: '帮着选一个“最有前途”的专业',
        outcomes: [{ text: '你研究了一个月的就业报告，替孩子填好了志愿。孩子没有反对，只是开学那天说了一句：“这是你想学的。”', effects: { stats: { happiness: -2, intelligence: 1 }, addFlags: ['kid-gaokao', 'kid-pressure'] } }],
      },
      {
        text: '送出国读书',
        requires: { statMin: { wealth: 200 } },
        outcomes: [{ text: '机场安检口，孩子回头挥了挥手，就消失在人群里。从此你多了一个习惯：算着时差等电话。', effects: { stats: { wealth: -150, happiness: 2 }, addFlags: ['kid-gaokao'] } }],
      },
    ],
  },
  {
    id: 'family-kid-leave',
    category: 'family',
    annual: true,
    requires: { flags: ['has-child'], relMin: { childAge: 22 }, relMax: { childAge: 25 }, notFlags: ['kid-leave'] },
    title: '孩子要去远方',
    text: '孩子毕业了，拿着一份外地的工作邀请来找你商量。你看着那张熟悉的脸，想起自己当年也是这样站在爸妈面前。',
    choices: [
      {
        text: '“去吧，家里有我们。”',
        outcomes: [{ text: '你送孩子上了车。回家看见空荡荡的房间，愣了一会儿，然后把它收拾成了书房。', effects: { stats: { happiness: 2 }, addFlags: ['kid-leave'] } }],
      },
      {
        text: '劝孩子留在身边，找个稳定的工作',
        outcomes: [{ text: '孩子留了下来，每周回家吃两顿饭。只是偶尔看着窗外发呆，你知道那是在想什么。', effects: { stats: { happiness: 3 }, addFlags: ['kid-leave', 'kid-pressure'] } }],
      },
      {
        text: '给一笔启动资金，支持去创业',
        requires: { statMin: { wealth: 500 } },
        outcomes: [
          { weight: 1, text: '孩子的小公司撑过了第一年，还上了一次本地新闻。电话里的声音，和你年轻时一模一样。', effects: { stats: { wealth: -200, happiness: 6, fame: 1 }, addFlags: ['kid-leave'] } },
          { weight: 1, text: '公司没撑过一年。孩子红着眼来道歉，你拍拍肩膀说：“我当年也赔过。”', effects: { stats: { wealth: -200, happiness: 2 }, addFlags: ['kid-leave', 'kid-close'] } },
        ],
      },
    ],
  },
  {
    id: 'family-kid-wedding',
    category: 'family',
    weight: 15,
    requires: { flags: ['has-child', 'kid-leave'], relMin: { childAge: 26 }, relMax: { childAge: 40 }, notFlags: ['kid-married'] },
    title: '孩子带回来一个人',
    text: '过年的时候，孩子带回来一个人，进门就有点紧张地叫你。饭桌上，两个年轻人偷偷在桌子底下牵着手。',
    choices: [
      {
        text: '帮着张罗，办得体体面面',
        outcomes: [{ text: '婚礼上你被拉上台讲话，准备好的稿子一个字也没念出来。', effects: { stats: { happiness: 8, wealth: -30 }, addFlags: ['kid-married'] } }],
      },
      {
        text: '简简单单就好，钱留给他们过日子',
        outcomes: [{ text: '两家人在一起吃了顿饭，就算办过了。你把准备好的存折塞给了孩子。', effects: { stats: { happiness: 6, wealth: -20 }, addFlags: ['kid-married'] } }],
      },
      {
        text: '“你们自己的事，自己做主。”',
        outcomes: [{ text: '他们去旅行结了婚，回来给你带了一盒当地的点心和一张合影。', effects: { stats: { happiness: 5 }, addFlags: ['kid-married'] } }],
      },
    ],
  },
  {
    id: 'family-grandchild',
    category: 'family',
    rarity: 'rare',
    weight: 25,
    requires: { flags: ['kid-married'], relMin: { childAge: 27 }, notFlags: ['grandchild'] },
    title: '升级当长辈',
    text: '凌晨三点，孩子在电话里激动得语无伦次：“生了！大人孩子都平安！”你挂了电话，坐在床边，半天没缓过神来。',
    choices: [
      {
        text: '天天过去帮忙带',
        outcomes: [{ text: '你又过上了半夜起来冲奶粉的日子，腰酸背痛，却每天都笑着醒来。', effects: { stats: { happiness: 10, health: -2 }, addFlags: ['grandchild'] } }],
      },
      {
        text: '出钱不出力，请个好阿姨',
        outcomes: [{ text: '你包了一个大红包，又请了最好的育儿阿姨。每个周末，你都会准时去看小家伙。', effects: { stats: { happiness: 6, wealth: -20 }, addFlags: ['grandchild'] } }],
      },
      {
        text: '各过各的，周末团聚',
        outcomes: [{ text: '每个周末，小家伙都会被抱来你家。你把那天叫做“全家福日”。', effects: { stats: { happiness: 6 }, addFlags: ['grandchild'] } }],
      },
    ],
  },
  {
    id: 'family-kid-borrow',
    category: 'family',
    weight: 8,
    requires: { flags: ['has-child'], relMin: { childAge: 24 }, relMax: { childAge: 40 }, statMin: { wealth: 300 } },
    title: '孩子开口了',
    text: '孩子吞吞吐吐了半天，终于说出口：想买房，首付还差一大截。说完就低着头，不敢看你。',
    choices: [
      {
        text: '全额支持',
        outcomes: [{ text: '你直接转了账。孩子搬家那天，特意在新家给你留了一间房。', effects: { stats: { wealth: -150, happiness: 5 } } }],
      },
      {
        text: '借一半，写个借条',
        outcomes: [{ text: '孩子认认真真写了借条，每个月按时还一点。你把钱攒着，打算以后再还给孩子。', effects: { stats: { wealth: -60, happiness: 2 } } }],
      },
      {
        text: '自己的路，自己走',
        outcomes: [{ text: '孩子说“我明白”，后来自己攒够了首付。只是那年过年，回家晚了两天。', effects: { stats: { happiness: -3 } } }],
      },
    ],
  },

  // ---------------- 情绪 ----------------
  {
    id: 'mood-burnout',
    category: 'life',
    weight: 25,
    requires: { minAge: 22, statMax: { happiness: 30 } },
    title: '透支',
    text: '你已经连续几个月凌晨两点才睡，早上醒来第一件事就是心慌。有一天在地铁上，你突然想不起来自己要去哪里。',
    choices: [
      {
        text: '请一段长假，什么都不做',
        outcomes: [{ text: '你关掉了所有的工作消息，每天睡到自然醒，去公园看老人下棋。一个月后，你终于又能感觉到饿了。', effects: { stats: { happiness: 12, health: 3, wealth: -2 } } }],
      },
      {
        text: '去看心理医生',
        outcomes: [{ text: '医生说这种情况很常见，教了你几个调整的办法，约好按时复诊。走出诊室的时候，你觉得肩膀轻了一些。', effects: { stats: { happiness: 10, wealth: -1 } } }],
      },
      {
        text: '约老朋友喝一杯，把话说出来',
        outcomes: [{ text: '你说了很多，朋友只是听着，最后拍了拍你：“有事就打电话，多晚都行。”', effects: { stats: { happiness: 7 } } }],
      },
      {
        text: '再撑一撑',
        outcomes: [{ text: '你又撑了几个月。身体比你先撑不住了。', effects: { stats: { happiness: -4, health: -5 } } }],
      },
    ],
  },
  {
    id: 'mood-midlife',
    category: 'life',
    weight: 10,
    requires: { minAge: 40, maxAge: 50 },
    title: '电梯里的中年人',
    text: '某个加班的深夜，你在电梯的镜子里看见一个陌生的中年人：发际线后退，眼神疲惫。过了好几秒，你才反应过来那是自己。',
    choices: [
      {
        text: '重新拿起年轻时放下的爱好',
        outcomes: [{ text: '你报了一个成人乐队班，每周排练一次。第一次上台演出，台下只有十几个人，你却紧张得像第一次高考。', effects: { stats: { happiness: 6, charm: 2, wealth: -1 } } }],
      },
      {
        text: '辞掉工作，去做一直想做的事',
        requires: { flags: ['employed'], statMin: { wealth: 200 } },
        outcomes: [{ text: '你递了辞呈，开了一家小小的书店。生意不温不火，可你每天早上都想去开门。', effects: { stats: { happiness: 8, wealth: -30 }, removeFlags: ['employed'], addFlags: ['has-business'] } }],
      },
      {
        text: '日子还得过',
        outcomes: [{ text: '你按下了一楼。明天还要早起。', effects: { stats: { happiness: -2 } } }],
      },
    ],
  },
]
