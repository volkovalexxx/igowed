import type { AdminVendorFlag } from '../adminVendors.types'

export class AdminValidationError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'AdminValidationError'
    this.status = status
  }
}

const FLAGS: AdminVendorFlag[] = ['verified', 'active']

export type ToggleFlagInput = {
  flag: AdminVendorFlag
  value: boolean
}

/** Разбирает тело PATCH: какой флаг (`verified`/`active`) и в какое булево значение выставить. */
export function parseToggleFlagInput(raw: unknown): ToggleFlagInput {
  if (!raw || typeof raw !== 'object') {
    throw new AdminValidationError('Некорректные данные')
  }

  const source = raw as Record<string, unknown>

  if (typeof source.flag !== 'string' || !FLAGS.includes(source.flag as AdminVendorFlag)) {
    throw new AdminValidationError('Недопустимый флаг')
  }

  if (typeof source.value !== 'boolean') {
    throw new AdminValidationError('Значение флага должно быть булевым')
  }

  return { flag: source.flag as AdminVendorFlag, value: source.value }
}
