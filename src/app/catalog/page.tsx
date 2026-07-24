import type { Metadata } from 'next'
import { CatalogClient } from '@/features/catalog/CatalogClient'
import { catalogVendorRepository } from '@/features/catalog/server/catalogVendor.repository'
import { listCatalogVendors } from '@/features/catalog/server/catalogVendor.service'

export const metadata: Metadata = {
  title: 'Каталог подрядчиков | I GO WED',
  description: 'Свадебные фотографы, видеографы, площадки и другие подрядчики на I GO WED',
}

// Список подрядчиков читается из БД в рантайме: не пререндерим на build (в CI базы нет)
// и всегда отдаём свежих подрядчиков.
export const dynamic = 'force-dynamic'

export default async function CatalogPage() {
  const vendors = await listCatalogVendors(catalogVendorRepository)

  return <CatalogClient vendors={vendors} />
}
