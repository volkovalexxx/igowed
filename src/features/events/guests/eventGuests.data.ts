import type { EventGuest } from './eventGuests.types'

export const rsvpLabels = {
  confirmed: 'Да',
  declined: 'Нет',
  pending: 'Не подтвержден',
}

export const sideLabels = {
  bride: 'Гость невесты',
  groom: 'Гость жениха',
}

export const booleanLabels = {
  true: 'Да',
  false: 'Нет',
}

export const defaultGuests: EventGuest[] = [
  {
    id: 'oleg-belov',
    fullName: 'Олег Белов',
    rsvpStatus: 'confirmed',
    side: 'bride',
    needsTransfer: true,
    needsAccommodation: false,
    comment: null,
    order: 0,
  },
  {
    id: 'nikolay-petrov',
    fullName: 'Николай Петров',
    rsvpStatus: 'declined',
    side: 'groom',
    needsTransfer: true,
    needsAccommodation: false,
    comment: 'Уточнить, сможет ли приехать после работы.',
    order: 1,
  },
  {
    id: 'ekaterina-vasilevskaya',
    fullName: 'Екатерина Василевская',
    rsvpStatus: 'declined',
    side: 'bride',
    needsTransfer: false,
    needsAccommodation: true,
    comment: 'Нужен номер рядом с площадкой.',
    order: 2,
  },
  {
    id: 'natalya-doroshevskaya',
    fullName: 'Наталья Дорошевская',
    rsvpStatus: 'confirmed',
    side: 'bride',
    needsTransfer: false,
    needsAccommodation: true,
    comment: null,
    order: 3,
  },
  {
    id: 'oleg-nikiforov',
    fullName: 'Олег Никифоров',
    rsvpStatus: 'confirmed',
    side: 'groom',
    needsTransfer: false,
    needsAccommodation: false,
    comment: null,
    order: 4,
  },
]
