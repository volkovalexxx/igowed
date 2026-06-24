import { PrismaClient, Role, DisplayMode } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const u = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

async function main() {
  console.log('🌱 Seeding...')

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'photo' }, update: {}, create: { slug: 'photo', name: 'Фотосъёмка', order: 1, image: u('1606800052052-a08af7148866') } }),
    prisma.category.upsert({ where: { slug: 'video' }, update: {}, create: { slug: 'video', name: 'Видеосъёмка', order: 2, image: u('1492691527719-9d1e07e534b4') } }),
    prisma.category.upsert({ where: { slug: 'decor' }, update: {}, create: { slug: 'decor', name: 'Декор / Оформление', order: 3, image: u('1519225421980-715cb0215aed') } }),
    prisma.category.upsert({ where: { slug: 'cake' }, update: {}, create: { slug: 'cake', name: 'Торты', order: 4, image: u('1535254973040-607b474cb50d') } }),
    prisma.category.upsert({ where: { slug: 'transport' }, update: {}, create: { slug: 'transport', name: 'Транспорт', order: 5, image: u('1502877338535-766e1452684a') } }),
    prisma.category.upsert({ where: { slug: 'dresses' }, update: {}, create: { slug: 'dresses', name: 'Свадебные платья', order: 6, image: u('1594744803329-e58b31de8bf5') } }),
    prisma.category.upsert({ where: { slug: 'suits' }, update: {}, create: { slug: 'suits', name: 'Мужские костюмы', order: 7, image: u('1507679799987-c73779587ccf') } }),
    prisma.category.upsert({ where: { slug: 'catering' }, update: {}, create: { slug: 'catering', name: 'Кейтеринг', order: 8, image: u('1555244162-803834f70033') } }),
    prisma.category.upsert({ where: { slug: 'venue' }, update: {}, create: { slug: 'venue', name: 'Площадки', order: 9, image: u('1519167758481-83f550bb49b3') } }),
    prisma.category.upsert({ where: { slug: 'music' }, update: {}, create: { slug: 'music', name: 'Музыка / DJ', order: 10, image: u('1514525253161-7a46d19cd819') } }),
    prisma.category.upsert({ where: { slug: 'print' }, update: {}, create: { slug: 'print', name: 'Печатная продукция', order: 11 } }),
    prisma.category.upsert({ where: { slug: 'show' }, update: {}, create: { slug: 'show', name: 'Шоу программа', order: 12 } }),
  ])

  const photoCategory = categories[0]

  // Services
  await Promise.all([
    prisma.service.upsert({ where: { slug: 'wedding-photo' }, update: {}, create: { slug: 'wedding-photo', name: 'Свадьба', categoryId: photoCategory.id } }),
    prisma.service.upsert({ where: { slug: 'corporate-photo' }, update: {}, create: { slug: 'corporate-photo', name: 'Корпоратив', categoryId: photoCategory.id } }),
    prisma.service.upsert({ where: { slug: 'birthday-photo' }, update: {}, create: { slug: 'birthday-photo', name: 'День рождения', categoryId: photoCategory.id } }),
    prisma.service.upsert({ where: { slug: 'portrait-photo' }, update: {}, create: { slug: 'portrait-photo', name: 'Портрет', categoryId: photoCategory.id } }),
  ])

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@igowed.by' },
    update: {},
    create: { email: 'admin@igowed.by', password: adminPassword, name: 'Admin', role: Role.ADMIN },
  })

  // Vendor users
  const vendorData = [
    { email: 'loginov@igowed.by', firstName: 'Дмитрий', lastName: 'Логинов', username: 'loginov_pho', cities: ['Минск', 'Гродно'], rating: 4.0, pricePerHour: 2500, avatar: u('1507003211169-0a1dd7228f2d', 300, 300) },
    { email: 'filippova@igowed.by', firstName: 'Екатерина', lastName: 'Филиппова', username: 'kate_photography', cities: ['Минск'], rating: 4.0, pricePerHour: 2500, avatar: u('1494790108377-be9c29b29330', 300, 300) },
    { email: 'ivanov@igowed.by', firstName: 'Петр', lastName: 'Иванов', username: 'petrivanov_pho', cities: ['Минск', 'Гродно'], rating: 4.0, pricePerHour: 2500, avatar: u('1438761681033-6461ffad8d80', 300, 300) },
    { email: 'komarova@igowed.by', firstName: 'Елизавета', lastName: 'Комарова', username: 'eliz_photo', cities: ['Минск', 'Гродно'], rating: 4.0, pricePerHour: 2500, avatar: u('1544005313-94ddf0286df2', 300, 300) },
    { email: 'shevchenko@igowed.by', firstName: 'Павел', lastName: 'Шевченко', username: 'pavel_shevchenko', cities: ['Минск'], rating: 4.0, pricePerHour: 2500, avatar: u('1502685104226-ee32379fefbe', 300, 300) },
  ]

  const photoGallery = [
    u('1511285560929-80b456fea0bc', 400, 400),
    u('1606800052052-a08af7148866', 400, 400),
    u('1583939003579-730e3918a45a', 400, 400),
    u('1537633552985-df8429e8048b', 400, 400),
  ]

  for (const vd of vendorData) {
    const pw = await bcrypt.hash('vendor123', 12)
    const user = await prisma.user.upsert({
      where: { email: vd.email },
      update: {},
      create: { email: vd.email, password: pw, name: `${vd.firstName} ${vd.lastName}`, role: Role.VENDOR },
    })

    const vendor = await prisma.vendor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        slug: vd.username,
        firstName: vd.firstName,
        lastName: vd.lastName,
        username: vd.username,
        avatar: vd.avatar,
        bio: 'Профессиональная съёмка мероприятий. Сохраняю атмосферу вашего события в каждом кадре.',
        country: 'Беларусь',
        cities: vd.cities,
        rating: vd.rating,
        pricePerHour: vd.pricePerHour,
        currency: 'RUB',
        phone: '+375291123456',
        languages: ['Русский', 'Английский'],
        galleryDisplay: DisplayMode.VERTICAL,
        cardDisplay: DisplayMode.VERTICAL,
        isActive: true,
        workingHours: 'Ежедневно с 9:00 до 19:00',
      },
    })

    // Photos
    for (let i = 0; i < photoGallery.length; i++) {
      await prisma.photo.upsert({
        where: { id: `${vendor.id}-photo-${i}` },
        update: {},
        create: { id: `${vendor.id}-photo-${i}`, vendorId: vendor.id, url: photoGallery[i], order: i },
      })
    }

    // Service link
    await prisma.vendorService.upsert({
      where: { vendorId_serviceId: { vendorId: vendor.id, serviceId: (await prisma.service.findUnique({ where: { slug: 'wedding-photo' } }))!.id } },
      update: {},
      create: { vendorId: vendor.id, categoryId: photoCategory.id, serviceId: (await prisma.service.findUnique({ where: { slug: 'wedding-photo' } }))!.id, price: vd.pricePerHour, currency: 'RUB', unit: 'час' },
    })
  }

  // Blog posts
  const blogPosts = [
    { slug: 'usadby-podmoskovie', title: '5 усадеб в Беларуси для свадьбы', excerpt: 'Камерные локации с террасами и парками', image: u('1505373877841-8d25f7d46678'), category: 'Гид' },
    { slug: 'budget-wedding-1m', title: 'Свадьба за 15 000 BYN', excerpt: 'Реальная смета на 60 гостей: на чём экономили', image: u('1606216794074-735e91aa2c92'), category: 'Бюджет' },
    { slug: 'decor-2026', title: 'Палитра 2026: пыльная роза и олива', excerpt: 'Тренды флористики и сервировки на сезон', image: u('1519225421980-715cb0215aed'), category: 'Декор' },
    { slug: 'wedding-sea-anna-oleg', title: 'Свадьба на природе: история Анны и Олега', excerpt: 'Как пара провела камерное торжество', image: u('1519741497674-611481863552'), category: 'Истории' },
  ]

  for (const bp of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: bp.slug },
      update: {},
      create: { ...bp, content: bp.excerpt + '\n\nПолный текст статьи...' },
    })
  }

  console.log('✅ Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
