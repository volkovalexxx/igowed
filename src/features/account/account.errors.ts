export class AccountValidationError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'AccountValidationError'
    this.status = status
  }
}

export function isAccountError(error: unknown): error is AccountValidationError {
  return error instanceof AccountValidationError
}
