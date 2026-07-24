import 'dotenv/config'
import { PrismaClient, Role, DisplayMode } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' })
const prisma = new PrismaClient({ adapter })

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

  // Products (карточки товаров)
  const firstVendor = await prisma.vendor.findFirst({ where: { username: 'loginov_pho' } })

  if (firstVendor) {
    const transportCategory = categories.find((c) => c.slug === 'transport') ?? null
    const dressCategory = categories.find((c) => c.slug === 'dresses') ?? null

    const products = [
      {
        slug: 'mercedes-sprinter-lux',
        categoryId: transportCategory?.id ?? null,
        title: 'Мерседес Спринтер ЛЮКС 20 мест белый салон',
        description:
          'Идеальный выбор для трансфера на мероприятие, деловой встречи или праздника. Микроавтобус премиум-класса с белоснежным салоном, мягкими сиденьями и современной системой климат-контроля.',
        price: 2800,
        currency: 'RUB',
        unit: 'час',
        pricePrefix: true,
        ctaLabel: 'Связаться',
        city: 'Гродно',
        photos: [u('1549317661-bd32c8ce0db2'), u('1503376780353-7e6692767b70'), u('1502877338535-766e1452684a'), u('1494976388531-d1058494cdd8')],
        attributes: [
          { label: 'Цвет', value: 'белый' },
          { label: 'Год выпуска', value: '2020' },
          { label: 'Вместимость', value: 'до 20 человек' },
        ],
      },
      {
        slug: 'wedding-dress-elza',
        categoryId: dressCategory?.id ?? null,
        title: 'Свадебное платье А-силуэт «Эльза»',
        description:
          'Элегантное и утончённое свадебное платье классического А-силуэта — идеальный выбор для невесты, мечтающей о сказочной свадьбе. Лёгкий акцент на талии мягко подчёркивает фигуру, а плавно расширяющаяся юбка создаёт женственный и романтичный образ.',
        price: 80000,
        currency: 'RUB',
        unit: null,
        pricePrefix: false,
        ctaLabel: 'Записаться на примерку',
        city: 'Гродно',
        photos: [u('1594744803329-e58b31de8bf5'), u('1519741497674-611481863552'), u('1525258946800-98cfd641d0de'), u('1583939003579-730e3918a45a')],
        attributes: [
          { label: 'Доступность', value: 'продажа' },
          { label: 'Размер', value: '36, 38' },
          { label: 'Силуэт', value: 'А-силуэт' },
          { label: 'Цвет', value: 'айвори' },
          { label: 'Бренд', value: 'victiry' },
          { label: 'Страна производства', value: 'Италия' },
        ],
      },
    ]

    for (const pd of products) {
      const { photos, attributes, ...productData } = pd
      const product = await prisma.product.upsert({
        where: { slug: pd.slug },
        update: {},
        create: { ...productData, vendorId: firstVendor.id },
      })

      await prisma.productPhoto.deleteMany({ where: { productId: product.id } })
      await prisma.productPhoto.createMany({
        data: photos.map((url, index) => ({ productId: product.id, url, order: index })),
      })

      await prisma.productAttribute.deleteMany({ where: { productId: product.id } })
      await prisma.productAttribute.createMany({
        data: attributes.map((attribute, index) => ({ productId: product.id, ...attribute, order: index })),
      })
    }
  }

  // Blog posts
  const blogPosts = [
    {
      slug: 'usadby-podmoskovie',
      title: '5 усадеб в Беларуси для свадьбы',
      excerpt: 'Камерные локации с террасами и парками',
      image: u('1505373877841-8d25f7d46678'),
      category: 'Гид',
      content:
        'Загородная усадьба — идеальный выбор для пары, которая мечтает о камерном торжестве вдали от городского шума. В Беларуси таких мест немало: от исторических особняков с парками до современных эко-отелей у озёр.\n\nПри выборе площадки обращайте внимание не только на красоту фасада, но и на инфраструктуру: есть ли крытый павильон на случай дождя, сколько гостей вмещает банкетный зал, предусмотрено ли размещение на ночь. Уточните, входит ли в стоимость аренда мебели и декора.\n\nЛучшие усадьбы бронируются за 8–12 месяцев до сезона. Приезжайте на осмотр лично и в то же время суток, когда планируете торжество, — так вы оцените освещение и атмосферу.',
    },
    {
      slug: 'budget-wedding-1m',
      title: 'Свадьба за 15 000 BYN',
      excerpt: 'Реальная смета на 60 гостей: на чём экономили',
      image: u('1606216794074-735e91aa2c92'),
      category: 'Бюджет',
      content:
        'Красивая свадьба не обязательно стоит целое состояние. При грамотном планировании камерное торжество на 60 гостей реально организовать за 15 000 BYN без потери качества.\n\nГлавное правило — сначала выделить деньги на приоритеты. Площадка и кейтеринг обычно забирают 40–45% бюджета, фотограф — 15–18%, наряды — 10–12%, декор — 10–12%. На всё остальное уходит остаток.\n\nРеально сэкономить помогает свадьба в будний день или межсезонье: площадки дают скидку 20–30%. Цифровые приглашения экономят сотни рублей, а аренда декора вместо покупки снижает расходы вдвое. Но не экономьте на фотографе и еде — именно это гости запомнят надолго.',
    },
    {
      slug: 'decor-2026',
      title: 'Палитра 2026: пыльная роза и олива',
      excerpt: 'Тренды флористики и сервировки на сезон',
      image: u('1519225421980-715cb0215aed'),
      category: 'Декор',
      content:
        'Свадебный декор 2026 года уходит от пышности к естественности. В моде природные материалы, приглушённые оттенки и живая зелень вместо избыточных композиций.\n\nГлавные цвета сезона — пыльная роза и олива. Эта пара выглядит благородно и одинаково хорошо смотрится на выездной церемонии в саду и в классическом банкетном зале. Дополняйте их фактурами: лён, ротанг, матовое стекло.\n\nВ сервировке набирает популярность минимализм: меньше декора на столе, больше внимания к качеству посуды и текстиля. Свечи разной высоты и низкие вазы с полевыми цветами создают тёплую атмосферу без лишних затрат.',
    },
    {
      slug: 'wedding-sea-anna-oleg',
      title: 'Свадьба на природе: история Анны и Олега',
      excerpt: 'Как пара провела камерное торжество',
      image: u('1519741497674-611481863552'),
      category: 'Истории',
      content:
        'Анна и Олег мечтали о свадьбе без пафоса — только близкие люди, живая музыка и природа. Они выбрали усадьбу у озера и собрали 35 гостей.\n\nЦеремонию провели на закате у воды, а банкет — под открытым небом в шатре с гирляндами. Вместо тамады пригласили друга-музыканта, который весь вечер играл на гитаре. Пара призналась, что именно живое, неформальное настроение сделало день по-настоящему своим.\n\nГлавный совет от Анны и Олега будущим молодожёнам: не гонитесь за чужими сценариями. Свадьба, которая отражает именно вашу историю, всегда запоминается лучше самой дорогой постановки.',
    },
  ]

  for (const bp of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: bp.slug },
      update: { content: bp.content, excerpt: bp.excerpt, title: bp.title, image: bp.image, category: bp.category },
      create: bp,
    })
  }

  // Messages (диалог между заказчиком-админом и подрядчиком)
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@igowed.by' } })
  const loginovUser = await prisma.user.findFirst({ where: { email: 'loginov@igowed.by' } })

  if (adminUser && loginovUser) {
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: adminUser.id, receiverId: loginovUser.id },
          { senderId: loginovUser.id, receiverId: adminUser.id },
        ],
      },
    })

    const base = Date.UTC(2026, 6, 22, 10, 0, 0)
    const thread = [
      { from: adminUser.id, to: loginovUser.id, text: 'Здравствуйте! Хочу уточнить детали фотосъёмки на 14 июня.', minutes: 0 },
      { from: loginovUser.id, to: adminUser.id, text: 'Добрый день! Конечно, слушаю вас.', minutes: 3 },
      { from: adminUser.id, to: loginovUser.id, text: 'Нас будет 2 человека + 5 гостей. Планируем начать в 11:00 на площадке Замка Мир.', minutes: 6 },
      { from: loginovUser.id, to: adminUser.id, text: 'Отлично! Я знаком с этой площадкой, свет там прекрасный утром.', minutes: 10 },
      { from: adminUser.id, to: loginovUser.id, text: 'Спасибо за совет! Что-то нужно согласовать заранее?', minutes: 60 * 25 },
      { from: loginovUser.id, to: adminUser.id, text: 'Всё уже в договоре. Встречаемся у главных ворот в 10:45.', minutes: 60 * 25 + 30 },
    ]

    for (const m of thread) {
      await prisma.message.create({
        data: {
          senderId: m.from,
          receiverId: m.to,
          text: m.text,
          isRead: m.from === adminUser.id,
          createdAt: new Date(base + m.minutes * 60 * 1000),
        },
      })
    }
  }

  console.log('✅ Seed complete')
}

main().catch(console.error).finally(() => prisma.$disconnect())
