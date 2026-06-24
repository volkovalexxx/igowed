import type { CatalogCategory } from './catalog.types.js'

export const catalogCategories: CatalogCategory[] = [
  {
    id: 'suits',
    slug: 'kostyumy',
    title: 'Костюмы',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop',
    order: 10,
  },
  {
    id: 'cakes',
    slug: 'torty',
    title: 'Торты',
    imageUrl: 'https://images.unsplash.com/photo-1525257831700-183b9b8bf5cd?w=600&h=800&fit=crop',
    order: 20,
  },
  {
    id: 'catering',
    slug: 'kuhnya-i-keytering',
    title: 'Кухня и кейтеринг',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=800&fit=crop',
    order: 30,
  },
  {
    id: 'invitations',
    slug: 'pechatnaya-produktsiya',
    title: 'Печатная продукция',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=800&fit=crop',
    order: 40,
  },
  {
    id: 'transport',
    slug: 'transport',
    title: 'Транспорт',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=800&fit=crop',
    order: 50,
  },
  {
    id: 'dresses',
    slug: 'svadebnye-platya',
    title: 'Свадебные платья',
    imageUrl: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=600&h=800&fit=crop',
    order: 60,
  },
  {
    id: 'rings',
    slug: 'dlya-registratsii',
    title: 'Для регистрации',
    imageUrl: 'https://images.unsplash.com/photo-1515626553181-0f218cb03f14?w=600&h=800&fit=crop',
    order: 70,
  },
  {
    id: 'banquet',
    slug: 'dlya-banketa',
    title: 'Для банкета',
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=800&fit=crop',
    order: 80,
  },
  {
    id: 'flowers',
    slug: 'buket-nevesty',
    title: 'Букет невесты',
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&h=800&fit=crop',
    order: 90,
  },
  {
    id: 'photo',
    slug: 'fotosyomka',
    title: 'Фотосъемка',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=800&fit=crop',
    order: 100,
  },
]
