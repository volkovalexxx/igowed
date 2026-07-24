import { mapCatalogVendor } from './catalogVendor.mapper'
import type { CatalogVendor } from '../catalogVendor.types'

type CatalogDeps = {
  listActiveVendors(): Promise<Parameters<typeof mapCatalogVendor>[0][]>
}

export async function listCatalogVendors(deps: CatalogDeps): Promise<CatalogVendor[]> {
  const records = await deps.listActiveVendors()
  return records.map(mapCatalogVendor)
}
