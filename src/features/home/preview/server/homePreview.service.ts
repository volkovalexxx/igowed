import { mapHomeBlogPreview, mapHomeVendorPreview } from './homePreview.mapper'
import type { HomePreview } from '../homePreview.types'

type HomePreviewDeps = {
  listTopVendors(): Promise<Parameters<typeof mapHomeVendorPreview>[0][]>
  listRecentPosts(): Promise<Parameters<typeof mapHomeBlogPreview>[0][]>
}

export async function loadHomePreview(deps: HomePreviewDeps): Promise<HomePreview> {
  const [vendors, posts] = await Promise.all([deps.listTopVendors(), deps.listRecentPosts()])

  return {
    vendors: vendors.map(mapHomeVendorPreview),
    blog: posts.map(mapHomeBlogPreview),
  }
}
