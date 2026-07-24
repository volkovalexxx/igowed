import { mapBlogArticle, mapBlogListItem } from './blogPost.mapper'
import type { BlogArticle, BlogListItem } from '../blogPost.types'

type BlogDeps = {
  listPosts(): Promise<Parameters<typeof mapBlogListItem>[0][]>
  findPostBySlug(slug: string): Promise<Parameters<typeof mapBlogArticle>[0] | null>
}

export async function listBlogPosts(deps: BlogDeps): Promise<BlogListItem[]> {
  const records = await deps.listPosts()
  return records.map(mapBlogListItem)
}

export async function getBlogArticle(slug: string, deps: BlogDeps): Promise<BlogArticle | null> {
  if (!slug) return null

  const record = await deps.findPostBySlug(slug)
  return record ? mapBlogArticle(record) : null
}
