import type { AdminVendorFlag, AdminVendorRow } from '../adminVendors.types'
import { AdminValidationError, parseToggleFlagInput } from './adminVendors.validation'

type AdminVendorsDeps = {
  listVendors(): Promise<AdminVendorRow[]>
  setFlag(vendorId: string, flag: AdminVendorFlag, value: boolean): Promise<{ count: number }>
}

/** Пускает дальше только администратора; иначе бросает ошибку с 403. */
export function assertAdmin(role: string | undefined): void {
  if (role !== 'ADMIN') {
    throw new AdminValidationError('Доступ только для администратора', 403)
  }
}

export async function listAdminVendors(role: string | undefined, deps: AdminVendorsDeps): Promise<AdminVendorRow[]> {
  assertAdmin(role)
  return deps.listVendors()
}

export async function toggleVendorFlag(
  role: string | undefined,
  vendorId: string,
  rawInput: unknown,
  deps: AdminVendorsDeps,
): Promise<{ flag: AdminVendorFlag; value: boolean }> {
  assertAdmin(role)

  if (!vendorId) {
    throw new AdminValidationError('Подрядчик не указан')
  }

  const input = parseToggleFlagInput(rawInput)

  const result = await deps.setFlag(vendorId, input.flag, input.value)
  if (result.count < 1) {
    throw new AdminValidationError('Подрядчик не найден', 404)
  }

  return input
}

export function isAdminError(error: unknown): error is AdminValidationError {
  return error instanceof AdminValidationError
}
