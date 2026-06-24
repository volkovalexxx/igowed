import type { SocialProvider } from './auth.types'

export const authSocialProviders: SocialProvider[] = [
  { id: 'google', label: 'G' },
  { id: 'vk', label: 'vk' },
  { id: 'facebook', label: 'f' },
  { id: 'mail', label: '@' },
  { id: 'yandex', label: 'Я' },
]

export const authCopy = {
  brand: 'I GO WED',
  tagline: 'Найдите лучших подрядчиков для вашего мероприятия\nв любой точке мира',
  welcome: 'Добро пожаловать!',
}
