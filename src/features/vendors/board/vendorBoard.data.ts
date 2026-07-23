import type { VendorBoardKind } from './vendorBoard.types'

export const FALLBACK_VENDOR_IMAGES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80',
]

export const profileNavLinks = [
  { href: '/dashboard/profile', label: 'Профиль' },
  { href: '/event', label: 'Мероприятия' },
  { href: '/dashboard/favorites', label: 'Избранное' },
  { href: '/dashboard/shortlist', label: 'Шортлист' },
  { href: '#', label: 'Календарь занятости' },
  { href: '#', label: 'Отзывы' },
]

export const vendorFilterGroups = [
  {
    title: 'Фотосъёмка',
    items: [
      'Свадьба',
      'Love story',
      'Корпоратив',
      'День рождения',
      'Портрет',
      'Беременность',
      'Новорожденные',
      'Дети',
      'Реклама',
      'Интерьер',
      'Обработка',
    ],
  },
  {
    title: 'Специалисты',
    items: [
      'Все специалисты',
      'Ведущий',
      'Видеограф',
      'Визажист',
      'Водитель',
      'Декоратор',
      'Диджей',
      'Организатор',
      'Фотограф',
      'Другое',
    ],
  },
]

export const vendorBoardCopy: Record<VendorBoardKind, { title: string; href: string; removeLabel: string }> = {
  favorites: {
    title: 'Избранное',
    href: '/dashboard/favorites',
    removeLabel: 'Удалить из избранного',
  },
  shortlist: {
    title: 'Шорт-лист',
    href: '/dashboard/shortlist',
    removeLabel: 'Удалить из шорт-листа',
  },
}
