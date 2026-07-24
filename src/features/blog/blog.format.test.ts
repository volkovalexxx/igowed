import { describe, expect, it } from 'vitest'
import { filterBlogPosts } from './blog.filter'
import { formatBlogDate, splitParagraphs } from './blog.format'
import type { BlogListItem } from './blogPost.types'

function post(overrides: Partial<BlogListItem> = {}): BlogListItem {
  return {
    id: 'p1',
    slug: 'kak-vybrat',
    cat: 'Советы',
    title: 'Как выбрать фотографа',
    excerpt: 'На что смотреть',
    img: 'a.jpg',
    date: '20 марта 2026',
    ...overrides,
  }
}

describe('formatBlogDate', () => {
  it('форматирует дату по-русски без « г.»', () => {
    expect(formatBlogDate(new Date('2026-03-20T00:00:00Z'))).toBe('20 марта 2026')
  })
})

describe('splitParagraphs', () => {
  it('режет текст на абзацы по пустым строкам', () => {
    expect(splitParagraphs('Первый абзац.\n\nВторой абзац.')).toEqual(['Первый абзац.', 'Второй абзац.'])
  })

  it('отбрасывает пустые фрагменты и крайние пробелы', () => {
    expect(splitParagraphs('  Один.  \n\n\n\n  Два.  ')).toEqual(['Один.', 'Два.'])
  })

  it('пустой текст даёт пустой список', () => {
    expect(splitParagraphs('   ')).toEqual([])
  })
})

describe('filterBlogPosts', () => {
  it('«Все» возвращает всё', () => {
    const list = filterBlogPosts([post(), post({ id: 'p2', cat: 'Бюджет' })], 'Все', '')
    expect(list).toHaveLength(2)
  })

  it('фильтрует по категории', () => {
    const list = filterBlogPosts([post({ cat: 'Советы' }), post({ id: 'p2', cat: 'Бюджет' })], 'Бюджет', '')
    expect(list.map((p) => p.id)).toEqual(['p2'])
  })

  it('ищет по заголовку, отрывку и категории', () => {
    const posts = [
      post({ id: 'title', title: 'Свадебный торт' }),
      post({ id: 'excerpt', title: 'Иное', excerpt: 'про декор стола' }),
      post({ id: 'cat', title: 'Иное', excerpt: 'иное', cat: 'Истории' }),
    ]

    expect(filterBlogPosts(posts, 'Все', 'торт').map((p) => p.id)).toEqual(['title'])
    expect(filterBlogPosts(posts, 'Все', 'декор').map((p) => p.id)).toEqual(['excerpt'])
    expect(filterBlogPosts(posts, 'Все', 'истории').map((p) => p.id)).toEqual(['cat'])
  })

  it('совмещает категорию и поиск', () => {
    const posts = [
      post({ id: 'a', cat: 'Бюджет', title: 'Смета свадьбы' }),
      post({ id: 'b', cat: 'Бюджет', title: 'Площадки' }),
      post({ id: 'c', cat: 'Советы', title: 'Смета' }),
    ]

    expect(filterBlogPosts(posts, 'Бюджет', 'смета').map((p) => p.id)).toEqual(['a'])
  })
})
