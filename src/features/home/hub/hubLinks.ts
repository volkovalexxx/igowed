export type HubLink = {
  href: string
  label: string
  description: string
}

const VENDOR_LINKS: HubLink[] = [
  { href: '/dashboard/profile', label: 'Мой профиль', description: 'Анкета, портфолио и услуги' },
  { href: '/dashboard/orders', label: 'Заявки и заказы', description: 'Входящие брони и их статусы' },
  { href: '/dashboard/gallery', label: 'Галерея', description: 'Фотографии ваших работ' },
  { href: '/dashboard/messages', label: 'Сообщения', description: 'Переписка с клиентами' },
  { href: '/dashboard/settings', label: 'Настройки', description: 'Пароль и управление аккаунтом' },
]

const ADMIN_LINKS: HubLink[] = [
  { href: '/admin', label: 'Модерация подрядчиков', description: 'Верификация и видимость профилей' },
  { href: '/catalog', label: 'Каталог', description: 'Просмотр площадок и подрядчиков' },
  { href: '/blog', label: 'Блог', description: 'Публикации платформы' },
]

const CLIENT_LINKS: HubLink[] = [
  { href: '/catalog', label: 'Каталог подрядчиков', description: 'Найти площадки и специалистов' },
  { href: '/bookings', label: 'Мои заявки', description: 'Ваши брони и их статусы' },
  { href: '/event', label: 'Мои мероприятия', description: 'События и планирование' },
  { href: '/event/new', label: 'Создать мероприятие', description: 'Начать планирование с нуля' },
  { href: '/blog', label: 'Блог', description: 'Идеи и советы для праздника' },
]

/** Набор быстрых ссылок хаба под роль пользователя. Незнакомая роль трактуется как клиент. */
export function hubLinksForRole(role: string | null | undefined): HubLink[] {
  if (role === 'VENDOR') return VENDOR_LINKS
  if (role === 'ADMIN') return ADMIN_LINKS
  return CLIENT_LINKS
}

export function hubRoleLabel(role: string | null | undefined): string {
  if (role === 'VENDOR') return 'Подрядчик'
  if (role === 'ADMIN') return 'Администратор'
  return 'Клиент'
}

/** Имя для приветствия: обрезанное значение или null, если имени нет. */
export function greetingName(name: string | null | undefined): string | null {
  const trimmed = name?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : null
}
