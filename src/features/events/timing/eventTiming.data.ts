export const DEFAULT_TIMELINE_TITLE = 'Общий тайминг'

/** Участники события — роли, а не ссылки на подрядчиков: в макете «Жених» стоит рядом с «Фотограф». */
export const PARTICIPANT_ROLES = [
  'Жених',
  'Невеста',
  'Ведущий',
  'Видеограф',
  'Визажист',
  'Декоратор',
  'Организатор',
  'Фотограф',
] as const

export const timingFieldLabels = {
  time: 'Время',
  start: 'Начало',
  end: 'Окончание',
  title: 'Событие',
  entryTitle: 'Название события',
  location: 'Локация',
  participants: 'Участники',
  comment: 'Комментарий',
} as const

export const timingActionLabels = {
  addTimeline: 'Добавить тайминг',
  addEntry: 'Добавить событие',
  addParticipant: 'Добавить',
  viewComment: 'Смотреть комментарий',
  createComment: 'Добавить комментарий',
} as const
