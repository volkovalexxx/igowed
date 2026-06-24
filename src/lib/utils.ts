export function fmtPrice(n: number, currency = 'RUB') {
  return 'от ' + n.toLocaleString('ru-RU') + ' ' + currency + '/час'
}

export function fmtNumber(n: number) {
  return n.toLocaleString('ru-RU')
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
}
