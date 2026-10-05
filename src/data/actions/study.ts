import type { GameAction } from '../../types'

/** 行动：学习。规范见 docs/EVENT_GUIDE.md；写入的标记汇总见 src/data/actions/index.ts。 */
export const studyActions: GameAction[] = [
  {
    id: 'act-study-hard', group: 'study', text: '埋头刷题', hint: '智力↑，快乐↓',
    requires: { minAge: 7, maxAge: 22 },
    outcomes: [
      { weight: 3, text: '你做完了一摞又一摞的卷子，成绩稳步往上走。', effects: { stats: { intelligence: 4, happiness: -2 } } },
      { weight: 1, text: '刷题刷到眼冒金星，好在期末排名进了前十。', effects: { stats: { intelligence: 5, happiness: -3, health: -1 } } },
    ],
  },
  {
    id: 'act-read-books', group: 'study', text: '读闲书', hint: '智力、魅力小幅↑',
    requires: { minAge: 6 },
    outcomes: [
      { weight: 3, text: '这一年你读了很多书，说话也比以前有意思了。', effects: { stats: { intelligence: 2, charm: 1, happiness: 2 } } },
      { weight: 1, text: '你在一本旧书里找到一句话，后来一直抄在笔记本的第一页。', effects: { stats: { intelligence: 2, happiness: 3 } } },
    ],
  },
  {
    id: 'act-tutoring', group: 'study', text: '报补习班', hint: '花钱换成绩',
    requires: { minAge: 10, maxAge: 18, flags: ['family-has-money'] },
    cooldown: 1,
    outcomes: [
      { weight: 2, text: '名师一点拨，你的短板补上了一大块。', effects: { stats: { intelligence: 5, wealth: -1, happiness: -1 } } },
      { weight: 1, text: '补习班的老师照本宣科，钱花了，效果一般。', effects: { stats: { intelligence: 1, wealth: -1, happiness: -2 } } },
    ],
  },
  {
    id: 'act-learn-coding', group: 'study', text: '自学编程', hint: '掌握后解锁“做个人项目”',
    requires: { minAge: 12, minYear: 2008, notFlags: ['skill-coding'] },
    outcomes: [
      { weight: 2, requires: { statMin: { intelligence: 50 } }, text: '你啃完了一本入门书，写出了第一个能跑的小程序。', effects: { stats: { intelligence: 3 }, addFlags: ['skill-coding'] } },
      { weight: 1, text: '满屏的报错把你劝退了好几次，但你还是学下来了一点。', effects: { stats: { intelligence: 2, happiness: -1 } } },
    ],
  },
  {
    id: 'act-learn-language', group: 'study', text: '学外语', hint: '英语、日语……',
    requires: { minAge: 10, notFlags: ['skill-english'] },
    outcomes: [
      { weight: 2, text: '你每天早起背单词、跟读，一年后已经能和外国人聊上几句。', effects: { stats: { intelligence: 2, charm: 2 }, addFlags: ['skill-english'] } },
      { weight: 1, text: '学了一年还是开不了口，不过词汇量涨了不少。', effects: { stats: { intelligence: 2 } } },
    ],
  },
  {
    id: 'act-night-class', group: 'study', text: '在职进修/考证', hint: '成年人的学习',
    requires: { minAge: 23, maxAge: 60 },
    cooldown: 1,
    outcomes: [
      { weight: 2, text: '你下班后去上课，熬了一年拿到了证书，简历上又多了一行。', effects: { stats: { intelligence: 4, influence: 1, health: -1, wealth: -1 } } },
      { weight: 1, text: '工作太忙，课上了一半就没坚持下去。', effects: { stats: { intelligence: 1, happiness: -2, wealth: -1 } } },
    ],
  },
  {
    id: 'act-old-university', group: 'study', text: '上老年大学', hint: '学书法、摄影，延缓衰老',
    requires: { minAge: 55 },
    outcomes: [
      { text: '你在老年大学学了书法，班上的同学都比你还有精神。', effects: { stats: { intelligence: 2, happiness: 4, charm: 1 } } },
    ],
  },
]
