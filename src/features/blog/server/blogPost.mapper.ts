import { formatBlogDate, splitParagraphs } from '../blog.format'
import type { BlogArticle, BlogListItem } from '../blogPost.types'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'

type BlogPostRecord = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  image: string | null
  category: string | null
  publishedAt: Date
}

export function mapBlogListItem(post: BlogPostRecord): BlogListItem {
  return {
    id: post.id,
    slug: post.slug,
    cat: post.category ?? 'Гид',
    title: post.title,
    excerpt: post.excerpt ?? '',
    img: post.image ?? FALLBACK_IMAGE,
    date: formatBlogDate(post.publishedAt),
  }
}

export function mapBlogArticle(post: BlogPostRecord): BlogArticle {
  return {
    ...mapBlogListItem(post),
    paragraphs: splitParagraphs(post.content),
  }
}
