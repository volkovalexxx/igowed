export function formatEventDateShort(date: Date | null) {
  if (!date) return 'Дата не выбрана'
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatEventDateNumeric(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date)
}

export function formatEventPlace(country: string | null, city: string | null) {
  const cityValue = city?.trim()
  const countryValue = country?.trim()
  if (cityValue && countryValue) return `${cityValue} ${countryValue}`
  return cityValue || countryValue || 'Место не выбрано'
}

export function formatEventNumber(value: number | null) {
  if (value === null) return '—'
  return new Intl.NumberFormat('ru-RU').format(value).replace(/\u00a0/g, ' ')
}

export function getDaysUntilEvent(date: Date | null, now = new Date()) {
  if (!date) return null
  const eventDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(0, Math.ceil((eventDay - today) / 86_400_000))
}
