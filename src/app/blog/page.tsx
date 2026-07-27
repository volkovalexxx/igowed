import type { Metadata } from 'next'
import { toHeaderViewer } from '@/components/layout/header.helpers'
import { BlogListClient } from '@/features/blog/BlogListClient'
import { blogPostRepository } from '@/features/blog/server/blogPost.repository'
import { listBlogPosts } from '@/features/blog/server/blogPost.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Блог | I GO WED',
  description: 'Советы экспертов, вдохновляющие истории и тренды свадебной индустрии',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const [posts, session] = await Promise.all([listBlogPosts(blogPostRepository), auth()])

  return <BlogListClient posts={posts} viewer={toHeaderViewer(session)} />
}
