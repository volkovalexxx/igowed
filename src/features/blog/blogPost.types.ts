/** Пост в списке блога — форма карточки. */
export type BlogListItem = {
  id: string
  slug: string
  cat: string
  title: string
  excerpt: string
  img: string
  date: string
}

/** Полная статья со slug-страницы. */
export type BlogArticle = BlogListItem & {
  paragraphs: string[]
}

export const BLOG_CATEGORIES = ['Все', 'Гид', 'Бюджет', 'Декор', 'Истории', 'Советы'] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]
