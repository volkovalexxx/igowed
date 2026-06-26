import type { EventTask, TaskGroup, TaskPriority } from './eventTasks.types'

export const priorityLabels: Record<TaskPriority, string> = {
  high: 'Высокий приоритет',
  medium: 'Средний приоритет',
  low: 'Низкий приоритет',
}

export const defaultTaskGroups: TaskGroup[] = [
  {
    id: 'org',
    title: 'Общие организационные вопросы',
    order: 0,
    tasks: [
      { id: 'budget', title: 'Определить бюджет, составить смету', priority: 'high', deadline: '28.02.2026', status: 'open', order: 0 },
      { id: 'guests', title: 'Составить список гостей', priority: 'high', deadline: '28.02.2026', status: 'open', order: 1 },
      { id: 'date', title: 'Выбрать и забронировать дату', priority: 'high', deadline: '28.02.2026', status: 'done', order: 2 },
      { id: 'venue', title: 'Найти и забронировать площадку', priority: 'medium', deadline: '28.02.2026', status: 'open', order: 3 },
      { id: 'registry', title: 'Подать заявление в ЗАГС', priority: 'high', deadline: '28.02.2026', status: 'open', order: 4 },
      { id: 'rings', title: 'Выбрать кольца', priority: 'high', deadline: '28.02.2026', status: 'open', order: 5 },
      { id: 'registration', title: 'Определиться с форматом регистрации', priority: 'medium', deadline: '28.02.2026', status: 'open', order: 6 },
      { id: 'palette', title: 'Выбрать цветовую гамму', priority: 'low', deadline: '28.02.2026', status: 'open', order: 7 },
      { id: 'invites', title: 'Определиться с форматом приглашений', priority: 'high', deadline: '28.02.2026', status: 'open', order: 8 },
    ],
  },
  {
    id: 'banquet',
    title: 'Организация банкета',
    order: 1,
    tasks: [
      { id: 'menu', title: 'Согласовать меню', priority: 'low', deadline: '28.02.2026', status: 'open', order: 0 },
      { id: 'cake', title: 'Выбрать свадебный торт', priority: 'medium', deadline: '28.02.2026', status: 'open', order: 1 },
      { id: 'seating', title: 'Подготовить план рассадки', priority: 'high', deadline: '28.02.2026', status: 'open', order: 2 },
    ],
  },
  {
    id: 'photo',
    title: 'Подготовка к фотосессии',
    order: 2,
    tasks: [
      { id: 'moodboard', title: 'Собрать референсы для фотосессии', priority: 'low', deadline: '28.02.2026', status: 'open', order: 0 },
      { id: 'route', title: 'Согласовать маршрут съемки', priority: 'medium', deadline: '28.02.2026', status: 'open', order: 1 },
    ],
  },
  {
    id: 'show',
    title: 'Организация шоу-программы',
    order: 3,
    tasks: [
      { id: 'host', title: 'Выбрать ведущего', priority: 'high', deadline: '28.02.2026', status: 'open', order: 0 },
      { id: 'music', title: 'Согласовать музыкальную программу', priority: 'medium', deadline: '28.02.2026', status: 'open', order: 1 },
    ],
  },
]

export function getAllTasks(groups: TaskGroup[] = defaultTaskGroups): EventTask[] {
  return groups.flatMap((group) => group.tasks)
}
