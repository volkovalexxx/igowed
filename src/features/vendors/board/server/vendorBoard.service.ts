import type { BoardVendor, VendorBoardKind } from '../vendorBoard.types'

const FALLBACK_TAKE = 11
const RECOMMENDED_TAKE = 6

type VendorBoardDeps = {
  listFavorites(userId: string): Promise<BoardVendor[]>
  listShortlist(userId: string): Promise<BoardVendor[]>
  listPopular(take: number): Promise<BoardVendor[]>
}

export type VendorBoardData = {
  vendors: BoardVendor[]
  recommended: BoardVendor[]
  /** Список пуст, поэтому показываем популярных подрядчиков вместо пустого экрана. */
  isFallback: boolean
}

export async function loadVendorBoard(
  userId: string,
  kind: VendorBoardKind,
  deps: VendorBoardDeps,
): Promise<VendorBoardData> {
  if (!userId) {
    return { vendors: [], recommended: [], isFallback: false }
  }

  const [saved, recommended] = await Promise.all([
    kind === 'shortlist' ? deps.listShortlist(userId) : deps.listFavorites(userId),
    deps.listPopular(RECOMMENDED_TAKE),
  ])

  if (saved.length > 0) {
    return { vendors: saved, recommended, isFallback: false }
  }

  return { vendors: await deps.listPopular(FALLBACK_TAKE), recommended, isFallback: true }
}
