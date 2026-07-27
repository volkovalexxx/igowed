import type { Metadata } from 'next'
import { toHeaderViewer } from '@/components/layout/header.helpers'
import { CatalogClient } from '@/features/catalog/CatalogClient'
import { catalogVendorRepository } from '@/features/catalog/server/catalogVendor.repository'
import { listCatalogVendors } from '@/features/catalog/server/catalogVendor.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Каталог подрядчиков | I GO WED',
  description: 'Свадебные фотографы, видеографы, площадки и другие подрядчики на I GO WED',
}

// Список подрядчиков читается из БД в рантайме: не пререндерим на build (в CI базы нет)
// и всегда отдаём свежих подрядчиков.
export const dynamic = 'force-dynamic'

export default async function CatalogPage() {
  const [vendors, session] = await Promise.all([listCatalogVendors(catalogVendorRepository), auth()])

  return <CatalogClient vendors={vendors} viewer={toHeaderViewer(session)} />
}
