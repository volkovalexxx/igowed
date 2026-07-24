import type { Metadata } from 'next'
import { BlogListClient } from '@/features/blog/BlogListClient'
import { blogPostRepository } from '@/features/blog/server/blogPost.repository'
import { listBlogPosts } from '@/features/blog/server/blogPost.service'

export const metadata: Metadata = {
  title: 'Блог | I GO WED',
  description: 'Советы экспертов, вдохновляющие истории и тренды свадебной индустрии',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await listBlogPosts(blogPostRepository)

  return <BlogListClient posts={posts} />
}
