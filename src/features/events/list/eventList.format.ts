export function formatEventDate(date: Date | null) {
  if (!date) return 'Дата не выбрана'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatEventDateCompact(date: Date | null) {
  if (!date) return 'Дата не выбрана'
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatEventPlace(country: string | null, city: string | null) {
  return [country, city].filter(Boolean).join(', ') || 'Место не выбрано'
}

export function formatEventPlaceShort(city: string | null) {
  return city || 'Москва'
}

export function formatEventRange(min: number | null, max: number | null, unit: string) {
  if (min !== null && max !== null) return `${min} - ${max} ${unit}`
  if (min !== null) return `от ${min} ${unit}`
  if (max !== null) return `до ${max} ${unit}`
  return 'Не указано'
}
