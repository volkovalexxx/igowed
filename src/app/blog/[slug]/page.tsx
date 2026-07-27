import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import { toHeaderViewer } from '@/components/layout/header.helpers'
import Footer from '@/components/layout/Footer'
import { auth } from '@/lib/auth'
import { Cal } from '@/components/ui/Icons'
import { blogPostRepository } from '@/features/blog/server/blogPost.repository'
import { getBlogArticle, listBlogPosts } from '@/features/blog/server/blogPost.service'
import type { BlogListItem } from '@/features/blog/blogPost.types'

type ArticleRouteProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getBlogArticle(slug, blogPostRepository)

  if (!article) {
    return { title: 'Статья не найдена | I GO WED' }
  }

  return {
    title: `${article.title} | I GO WED`,
    description: article.excerpt || undefined,
  }
}

function RelatedCard({ post }: { post: BlogListItem }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex gap-3 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.img} alt={post.title} className="rounded-lg object-cover shrink-0" style={{ width: 64, height: 64 }} />
      <div className="min-w-0">
        <p
          className="font-medium leading-snug group-hover:text-[var(--gold)] transition-colors"
          style={{ fontSize: 13, color: 'var(--ink)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {post.title}
        </p>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{post.date}</span>
      </div>
    </Link>
  )
}

export default async function ArticlePage({ params }: ArticleRouteProps) {
  const { slug } = await params
  const article = await getBlogArticle(slug, blogPostRepository)

  if (!article) {
    notFound()
  }

  const [related, session] = await Promise.all([
    listBlogPosts(blogPostRepository).then((posts) => posts.filter((post) => post.slug !== article.slug).slice(0, 3)),
    auth(),
  ])

  return (
    <>
      <Header activePage="Блог" viewer={toHeaderViewer(session)} />

      <main className="py-8">
        <div className="container">
          <nav className="flex items-center gap-2 mb-8" aria-label="Хлебные крошки">
            <Link href="/" style={{ fontSize: 13, color: 'var(--muted)' }} className="hover:text-[var(--gold)] transition-colors">
              Главная
            </Link>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>/</span>
            <Link href="/blog" style={{ fontSize: 13, color: 'var(--muted)' }} className="hover:text-[var(--gold)] transition-colors">
              Блог
            </Link>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: 'var(--ink)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {article.title}
            </span>
          </nav>

          <div className="flex gap-10 items-start">
            <article style={{ flex: 1, minWidth: 0 }}>
              <div className="mb-6 flex flex-col gap-3">
                <span
                  className="inline-block self-start rounded-full px-3 py-1 font-medium"
                  style={{ fontSize: 12, background: 'var(--gold-soft)', color: 'var(--gold)' }}
                >
                  {article.cat}
                </span>

                <h1 className="font-bold leading-tight" style={{ fontSize: 32, color: 'var(--dark)', letterSpacing: '-0.3px' }}>
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: 'var(--muted)' }}>
                    <Cal size={14} />
                    {article.date}
                  </span>
                </div>
              </div>

              <div className="mb-8 rounded-xl overflow-hidden" style={{ maxHeight: 480 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.img} alt={article.title} className="w-full object-cover" style={{ maxHeight: 480 }} />
              </div>

              <div style={{ maxWidth: 720 }}>
                {article.excerpt ? (
                  <p style={{ fontSize: 18, lineHeight: 1.7, color: 'var(--dark)', fontWeight: 500, marginBottom: 24 }}>{article.excerpt}</p>
                ) : null}
                {article.paragraphs.map((paragraph, index) => (
                  <p key={index} style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--ink)', marginBottom: 20 }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <aside className="hidden lg:block shrink-0" style={{ width: 280, position: 'sticky', top: 24 }}>
              {related.length > 0 ? (
                <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid var(--border)' }}>
                  <h3 className="font-semibold mb-4" style={{ fontSize: 14, color: 'var(--dark)' }}>
                    Похожие статьи
                  </h3>
                  <div className="flex flex-col gap-4">
                    {related.map((post) => (
                      <RelatedCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
