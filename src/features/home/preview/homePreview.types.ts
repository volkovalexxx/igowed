/** Подрядчик в витринных секциях главной («Подобрано для вас», «Фотографы»). */
export type HomeVendorPreview = {
  id: string
  slug: string
  name: string
  avatar: string
  img: string
  spec: string
  cat: string
  rating: number
  price: number
}

/** Пост в секции «Блог» на главной. */
export type HomeBlogPreview = {
  id: string
  slug: string
  cat: string
  title: string
  excerpt: string
  img: string
  date: string
}

export type HomePreview = {
  vendors: HomeVendorPreview[]
  blog: HomeBlogPreview[]
}
