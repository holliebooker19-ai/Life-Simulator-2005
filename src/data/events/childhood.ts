import type { GameEvent } from '../../types'

export const childhoodEvents: GameEvent[] = [
  {
    id: 'life-first-word',
    category: 'life',
    requires: { maxAge: 2 },
    weight: 20,
    title: '第一句话',
    text: '你终于学会开口了。脑子里全是二十一年后的记忆，嘴上却只能说得出“爸爸”。你决定先说点什么？',
    choices: [
      { text: '乖乖叫一声“爸爸”', outcomes: [{ text: '全家人都乐坏了，爸爸感动得红了眼眶。', effects: { stats: { happiness: 5, charm: 3 } } }] },
      {
        text: '试着说出“比特币”',
        outcomes: [
          { weight: 3, text: '你含混地蹦出几个音节，大人只当是婴儿的呓语。', effects: { stats: { memory: -2 } } },
          { weight: 1, text: '妈妈愣住了：“这孩子是不是在说‘毕业’？” 你吓得再也不敢乱说话。', effects: { stats: { happiness: -2 } } },
        ],
      },
    ],
  },
  {
    id: 'school-exam-first',
    category: 'school',
    requires: { minAge: 6, maxAge: 12 },
    weight: 20,
    title: '第一次期中考试',
    text: '小学的题目对你来说简直是降维打击，但是考太高会不会太引人注目？',
    choices: [
      { text: '考满分，享受老师的夸奖', outcomes: [{ text: '你成了全班的焦点，老师说你是“天才儿童”。', effects: { stats: { intelligence: 4, fame: 3, happiness: 3 } } }] },
      { text: '故意控制在95分，低调做人', outcomes: [{ text: '你稳稳当当，没有引起多余的注意。', effects: { stats: { intelligence: 3, happiness: 1 } } }] },
    ],
  },
  {
    id: 'family-childhood-illness',
    category: 'family',
    requires: { maxAge: 10 },
    weight: 8,
    title: '一场高烧',
    text: '小时候的一场高烧让全家人都很紧张。',
    effects: { stats: { health: -5, happiness: -2 } },
  },
]
