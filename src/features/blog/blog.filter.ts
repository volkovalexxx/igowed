import type { BlogCategory, BlogListItem } from './blogPost.types'

export function filterBlogPosts(posts: readonly BlogListItem[], category: BlogCategory, search: string): BlogListItem[] {
  let list = [...posts]

  if (category !== 'Все') {
    list = list.filter((post) => post.cat === category)
  }

  const query = search.trim().toLowerCase()
  if (query) {
    list = list.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.cat.toLowerCase().includes(query),
    )
  }

  return list
}
