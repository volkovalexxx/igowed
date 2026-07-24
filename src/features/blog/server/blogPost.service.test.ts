import { describe, expect, it, vi } from 'vitest'
import { getBlogArticle, listBlogPosts } from './blogPost.service'

function postRecord(overrides = {}) {
  return {
    id: 'p1',
    slug: 'kak-vybrat',
    title: 'Как выбрать фотографа',
    excerpt: 'На что смотреть',
    content: 'Первый абзац.\n\nВторой абзац.',
    image: 'a.jpg',
    category: 'Советы',
    publishedAt: new Date('2026-03-20T00:00:00Z'),
    ...overrides,
  }
}

function deps(overrides = {}) {
  return {
    listPosts: vi.fn().mockResolvedValue([postRecord()]),
    findPostBySlug: vi.fn().mockResolvedValue(postRecord()),
    ...overrides,
  }
}

describe('listBlogPosts', () => {
  it('маппит записи в карточки списка', async () => {
    const posts = await listBlogPosts(deps())

    expect(posts[0].slug).toBe('kak-vybrat')
    expect(posts[0].date).toBe('20 марта 2026')
    expect(posts[0].cat).toBe('Советы')
  })

  it('на пустом блоге отдаёт пустой список', async () => {
    expect(await listBlogPosts(deps({ listPosts: vi.fn().mockResolvedValue([]) }))).toEqual([])
  })
})

describe('getBlogArticle', () => {
  it('null без слага', async () => {
    const dependencies = deps()

    expect(await getBlogArticle('', dependencies)).toBeNull()
    expect(dependencies.findPostBySlug).not.toHaveBeenCalled()
  })

  it('null, если статья не найдена', async () => {
    expect(await getBlogArticle('нет', deps({ findPostBySlug: vi.fn().mockResolvedValue(null) }))).toBeNull()
  })

  it('отдаёт статью с абзацами', async () => {
    const article = await getBlogArticle('kak-vybrat', deps())

    expect(article?.title).toBe('Как выбрать фотографа')
    expect(article?.paragraphs).toEqual(['Первый абзац.', 'Второй абзац.'])
  })
})
