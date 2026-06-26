import type { Vendor } from '@/components/ui/VendorCard'

/* ─────────────────────────────────────────────────────────────
   MOCK VENDORS  (8 items, full Vendor shape + slug)
───────────────────────────────────────────────────────────── */

export const MOCK_VENDORS: (Vendor & { slug: string })[] = [
  {
    id: '1',
    slug: 'dmitry-loginov',
    name: 'Дмитрий Логинов',
    username: 'loginov_pho',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face',
    cities: ['Беларусь', 'Минск', 'Гродно'],
    rating: 4.8,
    reviewCount: 127,
    pricePerHour: 2500,
    currency: 'RUB',
    tags: ['Свадьба', 'Портрет', 'Репортаж'],
    photos: [
      'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&h=200&fit=crop',
    ],
    description:
      'Профессиональный свадебный фотограф с 8-летним опытом. Работаю в жанрах лайфстайл и репортаж. Создаю живые, эмоциональные истории вашего дня.',
  },
  {
    id: '2',
    slug: 'ekaterina-filippova',
    name: 'Екатерина Филиппова',
    username: 'filippova_photo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face',
    cities: ['Беларусь', 'Минск'],
    rating: 4.9,
    reviewCount: 214,
    pricePerHour: 3200,
    currency: 'RUB',
    tags: ['Свадьба', 'Беременность', 'Крестины'],
    photos: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&h=200&fit=crop',
    ],
    description:
      'Свадебный и семейный фотограф. Специализируюсь на нежных, светлых историях. Каждая съёмка — это воспоминания на всю жизнь.',
  },
  {
    id: '3',
    slug: 'petr-ivanov',
    name: 'Петр Иванов',
    username: 'ivanov_films',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face',
    cities: ['Беларусь', 'Брест', 'Минск'],
    rating: 4.5,
    reviewCount: 89,
    pricePerHour: 1800,
    currency: 'RUB',
    tags: ['Репортаж', 'Корпоратив', 'Обработка'],
    photos: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=200&h=200&fit=crop',
    ],
    description:
      'Репортажный и корпоративный фотограф. Незаметно фиксирую каждый важный момент вашего события. Быстрая обработка и сдача материала.',
  },
  {
    id: '4',
    slug: 'elizaveta-komarova',
    name: 'Елизавета Комарова',
    username: 'komarova_wed',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face',
    cities: ['Беларусь', 'Гомель', 'Минск'],
    rating: 5.0,
    reviewCount: 63,
    pricePerHour: 4000,
    currency: 'RUB',
    tags: ['Свадьба', 'Портрет', 'Накануне'],
    photos: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1529636798458-92182e662485?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop',
    ],
    description:
      'Художественный свадебный фотограф. Снимаю в стиле fine art: воздушные образы, мягкий свет, глубокие эмоции. Работаю по всей Беларуси.',
  },
  {
    id: '5',
    slug: 'pavel-shevchenko',
    name: 'Павел Шевченко',
    username: 'shevchenko_p',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face',
    cities: ['Беларусь', 'Витебск'],
    rating: 4.3,
    reviewCount: 41,
    pricePerHour: 1500,
    currency: 'RUB',
    tags: ['День рождения', 'Корпоратив', 'Репортаж'],
    photos: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=200&h=200&fit=crop',
    ],
    description:
      'Фотограф мероприятий. Специализируюсь на корпоративах, днях рождения и тематических вечеринках. Работаю с любым освещением.',
  },
  {
    id: '6',
    slug: 'olga-romanova',
    name: 'Ольга Романова',
    username: 'romanova_art',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=128&h=128&fit=crop&crop=face',
    cities: ['Беларусь', 'Минск', 'Могилёв'],
    rating: 4.7,
    reviewCount: 156,
    pricePerHour: 2800,
    currency: 'RUB',
    tags: ['Свадьба', 'Интерьер', 'Портрет'],
    photos: [
      'https://images.unsplash.com/photo-1525258801274-d9d92c7eb397?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=200&h=200&fit=crop',
    ],
    description:
      'Свадебный и интерьерный фотограф. Помогаю запечатлеть красоту пространства и момента. 10 лет в профессии, портфолио более 200 проектов.',
  },
  {
    id: '7',
    slug: 'andrey-sokolov',
    name: 'Андрей Соколов',
    username: 'sokolov_foto',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=face',
    cities: ['Беларусь', 'Минск'],
    rating: 4.6,
    reviewCount: 98,
    pricePerHour: 2200,
    currency: 'RUB',
    tags: ['Свадьба', 'Крестины', 'Репортаж'],
    photos: [
      'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1519657337289-077653f724ed?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=200&h=200&fit=crop',
    ],
    description:
      'Профессиональный репортажный фотограф. Работаю на свадьбах, крестинах и частных мероприятиях по всей Беларуси.',
  },
  {
    id: '8',
    slug: 'marina-kozlova',
    name: 'Марина Козлова',
    username: 'kozlova_wed',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=128&h=128&fit=crop&crop=face',
    cities: ['Беларусь', 'Гродно'],
    rating: 4.4,
    reviewCount: 72,
    pricePerHour: 2000,
    currency: 'RUB',
    tags: ['Беременность', 'День рождения', 'Портрет'],
    photos: [
      'https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=200&h=200&fit=crop',
    ],
    description:
      'Нежный семейный и портретный фотограф. Специализация — беременность, новорождённые, детские и семейные съёмки. Создаю тёплые истории.',
  },
]

/* ─────────────────────────────────────────────────────────────
   MOCK BLOG  (8 posts)
───────────────────────────────────────────────────────────── */

export interface MockBlogPost {
  id: number
  slug: string
  cat: string
  title: string
  excerpt: string
  img: string
  date: string
  content?: string
}

export const MOCK_BLOG: MockBlogPost[] = [
  {
    id: 1,
    slug: 'kak-vybrat-fotografa',
    cat: 'Советы',
    title: 'Как выбрать идеального фотографа на свадьбу',
    excerpt:
      'Рассказываем, на что обратить внимание при выборе фотографа и какие вопросы задать перед заключением договора.',
    img: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&h=375&fit=crop',
    date: '24 апреля 2026',
    content:
      'Выбор фотографа — один из ключевых шагов в подготовке свадьбы. Просматривайте портфолио, читайте отзывы и обязательно встречайтесь лично.',
  },
  {
    id: 2,
    slug: 'svadebnye-trendy-2026',
    cat: 'Тренды',
    title: 'Свадебные тренды 2026: минимализм и натуральность',
    excerpt:
      'Больше природных материалов, меньше пышных декораций. Рассматриваем главные тенденции этого сезона.',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=375&fit=crop',
    date: '18 апреля 2026',
    content:
      'Тренды этого года диктуют лаконичность и близость к природе. Цветы полевые, декор — деревянный или льняной, цветовая гамма — пастельная.',
  },
  {
    id: 3,
    slug: 'svadba-na-5000',
    cat: 'Бюджет',
    title: 'Планирование свадьбы на 5000$: реально ли это?',
    excerpt:
      'Делимся пошаговым планом и советами по оптимизации расходов без потери качества.',
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&h=375&fit=crop',
    date: '12 апреля 2026',
    content:
      'Планирование бюджета — не самая романтичная часть подготовки, но одна из важнейших. Расставьте приоритеты и сосредоточьтесь на том, что действительно важно.',
  },
  {
    id: 4,
    slug: 'top-ploshchadok-minska',
    cat: 'Площадки',
    title: 'Топ-10 площадок Минска для незабываемой свадьбы',
    excerpt:
      'Подборка лучших залов и усадеб Минска с ценами, вместимостью и контактами.',
    img: 'https://images.unsplash.com/photo-1544085701-4d1b7e43b7a7?w=500&h=375&fit=crop',
    date: '5 апреля 2026',
    content:
      'Минск предлагает множество площадок на любой вкус и бюджет — от уютных ресторанов до грандиозных усадебных комплексов.',
  },
  {
    id: 5,
    slug: 'floristika-na-svadbe',
    cat: 'Декор',
    title: 'Флористика на свадьбе: тренды и идеи для оформления зала',
    excerpt:
      'Живые цветы, сухоцветы или арки из пампасной травы — помогаем выбрать стиль декора.',
    img: 'https://images.unsplash.com/photo-1487530811015-780de78ca5f5?w=500&h=375&fit=crop',
    date: '28 марта 2026',
    content:
      'Флористика задаёт настроение всему торжеству. Выбирайте цветы в соответствии с общей концепцией и сезоном.',
  },
  {
    id: 6,
    slug: 'svadba-aliny-i-maksima',
    cat: 'Истории',
    title: 'История Алины и Максима: свадьба в замке за один день',
    excerpt:
      'Как пара из Минска спланировала свадьбу на 80 человек в историческом замке всего за 30 дней.',
    img: 'https://images.unsplash.com/photo-1544085701-4d1b7e43b7a7?w=500&h=375&fit=crop',
    date: '20 марта 2026',
    content:
      'История о том, как решительность и правильная команда подрядчиков помогли создать сказочную свадьбу без лишней суеты.',
  },
  {
    id: 7,
    slug: 'gid-po-vyboru-platya',
    cat: 'Гид',
    title: 'Полный гид по выбору свадебного платья: от первой примерки до покупки',
    excerpt:
      'Пошаговое руководство: когда начинать искать платье, сколько закладывать бюджет и как не ошибиться с выбором.',
    img: 'https://images.unsplash.com/photo-1519657831940-66f55f8e6a06?w=500&h=375&fit=crop',
    date: '14 марта 2026',
    content:
      'Поиск идеального платья — захватывающий процесс. Начинайте не менее чем за год, берите с собой близких людей и доверяйте своему чутью.',
  },
  {
    id: 8,
    slug: 'klyatvy-svoimi-slovami',
    cat: 'Советы',
    title: 'Как написать клятвы своими словами: советы и примеры',
    excerpt:
      'Искренние клятвы запоминаются на всю жизнь. Рассказываем, как собраться с мыслями и найти нужные слова.',
    img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&h=375&fit=crop',
    date: '7 марта 2026',
    content:
      'Напишите список из 10 вещей, которые любите в партнёре. Выберите три самых важных и превратите их в обещание — искренне и от сердца.',
  },
]

/* ─────────────────────────────────────────────────────────────
   MOCK CATEGORIES
───────────────────────────────────────────────────────────── */

export interface MockCategory {
  id: string
  slug: string
  name: string
  icon?: string
  children?: { id: string; slug: string; name: string }[]
}

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: 'org',       slug: 'organizaciya-meropriyatiy', name: 'Организация мероприятий' },
  {
    id: 'photo',
    slug: 'fotosyomka',
    name: 'Фотосъёмка',
    children: [
      { id: 'photo-wedding',     slug: 'svadba',          name: 'Свадьба' },
      { id: 'photo-corp',        slug: 'korporativ',      name: 'Корпоратив' },
      { id: 'photo-birthday',    slug: 'den-rozhdeniya',  name: 'День рождения' },
      { id: 'photo-portrait',    slug: 'portret',         name: 'Портрет' },
      { id: 'photo-pregnancy',   slug: 'beremennost',     name: 'Беременность' },
      { id: 'photo-christening', slug: 'krestiny',        name: 'Крестины' },
      { id: 'photo-report',      slug: 'reportazh',       name: 'Репортаж' },
    ],
  },
  { id: 'video',     slug: 'videosyomka',            name: 'Видеосъёмка' },
  { id: 'men',       slug: 'muzhskoy-obraz',         name: 'Мужской образ' },
  { id: 'women',     slug: 'zhenskiy-obraz',         name: 'Женский образ' },
  { id: 'decor',     slug: 'dekor-oformlenie',       name: 'Декор / Оформление' },
  { id: 'florist',   slug: 'floristika',             name: 'Флористика' },
  { id: 'confect',   slug: 'konditery',              name: 'Кондитеры' },
  { id: 'makeup',    slug: 'vizazh',                 name: 'Визаж и прическа' },
  { id: 'music',     slug: 'muzykanty',              name: 'Музыканты' },
  { id: 'venue',     slug: 'ploshchadki',            name: 'Площадки' },
  { id: 'print',     slug: 'pechatnaya-produkciya',  name: 'Печатная продукция' },
  { id: 'show',      slug: 'shou-programma',         name: 'Шоу программа' },
  { id: 'transport', slug: 'transport',              name: 'Транспорт' },
  { id: 'rent',      slug: 'arenda-oborudovaniya',   name: 'Аренда оборудования' },
  { id: 'other',     slug: 'drugoe',                 name: 'Другое' },
]
