import type { EventTask, TaskGroup, TaskPriority } from './eventTasks.types'

export const priorityLabels: Record<TaskPriority, string> = {
  high: 'Высокий приоритет',
  medium: 'Средний приоритет',
  low: 'Низкий приоритет',
}

export const taskGroups: TaskGroup[] = [
  {
    id: 'org',
    title: 'Общие организационные вопросы',
    tasks: [
      { id: 'budget', title: 'Определить бюджет, составить смету', priority: 'high', deadline: '29.02.2026', status: 'open' },
      { id: 'guests', title: 'Составить список гостей', priority: 'high', deadline: '29.02.2026', status: 'open' },
      { id: 'date', title: 'Выбрать и забронировать дату', priority: 'high', deadline: '29.02.2026', status: 'done' },
      { id: 'venue', title: 'Найти и забронировать площадку', priority: 'medium', deadline: '29.02.2026', status: 'open' },
      { id: 'registry', title: 'Подать заявление в ЗАГС', priority: 'high', deadline: '29.02.2026', status: 'open' },
      { id: 'rings', title: 'Выбрать кольца', priority: 'high', deadline: '29.02.2026', status: 'open' },
      { id: 'registration', title: 'Определиться с форматом регистрации', priority: 'medium', deadline: '29.02.2026', status: 'open' },
      { id: 'palette', title: 'Выбрать цветовую гамму', priority: 'low', deadline: '29.02.2026', status: 'open' },
      { id: 'invites', title: 'Определиться с форматом приглашений', priority: 'high', deadline: '29.02.2026', status: 'open' },
    ],
  },
  {
    id: 'banquet',
    title: 'Организация банкета',
    tasks: [
      { id: 'menu', title: 'Согласовать меню', priority: 'low', deadline: '29.02.2026', status: 'open' },
      { id: 'cake', title: 'Выбрать свадебный торт', priority: 'medium', deadline: '29.02.2026', status: 'open' },
      { id: 'seating', title: 'Подготовить план рассадки', priority: 'high', deadline: '29.02.2026', status: 'open' },
    ],
  },
  {
    id: 'photo',
    title: 'Подготовка к фотосессии',
    tasks: [
      { id: 'moodboard', title: 'Собрать референсы для фотосессии', priority: 'low', deadline: '29.02.2026', status: 'open' },
      { id: 'route', title: 'Согласовать маршрут съемки', priority: 'medium', deadline: '29.02.2026', status: 'open' },
    ],
  },
  {
    id: 'show',
    title: 'Организация шоу-программы',
    tasks: [
      { id: 'host', title: 'Выбрать ведущего', priority: 'high', deadline: '29.02.2026', status: 'open' },
      { id: 'music', title: 'Согласовать музыкальную программу', priority: 'medium', deadline: '29.02.2026', status: 'open' },
    ],
  },
]

export function getAllTasks(groups: TaskGroup[] = taskGroups): EventTask[] {
  return groups.flatMap((group) => group.tasks)
}
