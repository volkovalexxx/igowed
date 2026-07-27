import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { OrdersClient } from '@/features/vendors/orders/OrdersClient'
import { ordersRepository } from '@/features/vendors/orders/server/orders.repository'
import { listOrders } from '@/features/vendors/orders/server/orders.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Заявки и заказы | I GO WED',
}

export default async function DashboardOrdersPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/dashboard/orders')
  }

  const vendorId = await ordersRepository.findVendorIdForUser(session.user.id)

  if (!vendorId) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>
        <p style={{ fontSize: 16, marginBottom: 8 }}>Заявки доступны подрядчикам</p>
        <p style={{ fontSize: 14 }}>Зарегистрируйтесь как подрядчик, чтобы принимать заказы.</p>
      </div>
    )
  }

  const orders = await listOrders(session.user.id, ordersRepository)

  return <OrdersClient initialOrders={orders} />
}
