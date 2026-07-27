export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export type VendorOrder = {
  id: string
  clientId: string
  clientName: string
  clientContact: string
  clientAvatar: string | null
  date: string | null
  message: string | null
  status: OrderStatus
}

export type OrderTabKey = 'incoming' | 'confirmed' | 'completed' | 'cancelled'
