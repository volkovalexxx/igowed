export type RegisterRole = 'CLIENT' | 'VENDOR'

export type RegisterInput = {
  email: string
  password: string
  name: string
  role: RegisterRole
  category?: string
  city?: string
}

export type RegisterUser = {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
}

export type RegisterDeps = {
  hashPassword(password: string): Promise<string>
  findUserByEmail(email: string): Promise<unknown | null>
  createUser(input: {
    email: string
    password: string
    name: string
    role: RegisterRole
  }): Promise<RegisterUser>
  findVendorBySlug(slug: string): Promise<unknown | null>
  findVendorByUsername(username: string): Promise<unknown | null>
  createVendor(input: {
    userId: string
    slug: string
    firstName: string
    lastName: string
    username: string
    cities: string[]
    businessType: string | null
  }): Promise<void>
}
