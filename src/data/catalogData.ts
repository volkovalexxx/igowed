import { Vendor } from '@/components/ui/VendorCard';

/* ── Categories ─────────────────────────────────────────────────────── */

export interface Category {
  id: string;
  slug: string;
  name: string;
  children?: { id: string; slug: string; name: string }[];
}

export const CATALOG_CATEGORIES: Category[] = [
  { id: 'org', slug: 'organizaciya-meropriyatiy', name: 'Организация мероприятий' },
  {
    id: 'photo',
    slug: 'fotosyomka',
    name: 'Фотосъёмка',
    children: [
      { id: 'photo-wedding',    slug: 'svadba',        name: 'Свадьба' },
      { id: 'photo-corp',       slug: 'korporativ',    name: 'Корпоратив' },
      { id: 'photo-birthday',   slug: 'den-rozhdeniya',name: 'День рождения' },
      { id: 'photo-portrait',   slug: 'portret',       name: 'Портрет' },
      { id: 'photo-pregnancy',  slug: 'beremennost',   name: 'Беременность' },
      { id: 'photo-christening',slug: 'krestiny',      name: 'Крестины' },
      { id: 'photo-eve',        slug: 'nakanuне',      name: 'Накануне' },
      { id: 'photo-report',     slug: 'reportazh',     name: 'Репортаж' },
      { id: 'photo-interior',   slug: 'interer',       name: 'Интерьер' },
      { id: 'photo-edit',       slug: 'obrabotka',     name: 'Обработка' },
    ],
  },
  { id: 'video', slug: 'videosyomka', name: 'Видеосъёмка' },
  { id: 'men',   slug: 'muzhskoy-obraz', name: 'Мужской образ' },
  { id: 'women', slug: 'zhenskiy-obraz', name: 'Женский образ' },
  { id: 'decor', slug: 'dekor-oformlenie', name: 'Декор / Оформление' },
  { id: 'print', slug: 'pechatnaya-produkciya', name: 'Печатная продукция' },
  { id: 'show',  slug: 'shou-programma', name: 'Шоу программа' },
  { id: 'transport', slug: 'transport', name: 'Транспорт' },
  { id: 'rent',  slug: 'arenda-oborudovaniya', name: 'Аренда оборудования' },
  { id: 'other', slug: 'drugoe', name: 'Другое' },
];

/* ── Specialist types ────────────────────────────────────────────────── */

export interface SpecialistType {
  id: string;
  name: string;
}

export const SPECIALIST_TYPES: SpecialistType[] = [
  { id: 'all',        name: 'Все специалисты' },
  { id: 'photo',      name: 'Фотограф' },
  { id: 'video',      name: 'Видеограф' },
  { id: 'designer',   name: 'Дизайнер' },
  { id: 'decorator',  name: 'Декоратор' },
  { id: 'driver',     name: 'Водитель' },
  { id: 'dj',         name: 'Диджей' },
  { id: 'conductor',  name: 'Дирижер' },
  { id: 'organizer',  name: 'Организатор' },
  { id: 'other',      name: 'Другое' },
];

/* ── Mock vendors ────────────────────────────────────────────────────── */

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 1,
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
    description: 'Профессиональный свадебный фотограф с 8-летним опытом. Работаю в жанрах лайфстайл и репортаж. Создаю живые, эмоциональные истории вашего дня.',
  },
  {
    id: 2,
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
    description: 'Свадебный и семейный фотограф. Специализируюсь на нежных, светлых историях. Каждая съёмка — это не просто фото, это воспоминания на всю жизнь.',
  },
  {
    id: 3,
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
    description: 'Репортажный и корпоративный фотограф. Незаметно фиксирую каждый важный момент вашего события. Быстрая обработка и сдача материала.',
  },
  {
    id: 4,
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
    description: 'Художественный свадебный фотограф. Снимаю в стиле fine art: воздушные образы, мягкий свет, глубокие эмоции. Работаю по всей Беларуси.',
  },
  {
    id: 5,
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
    description: 'Фотограф мероприятий. Специализируюсь на корпоративах, днях рождения и тематических вечеринках. Работаю с любым освещением.',
  },
  {
    id: 6,
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
    description: 'Свадебный и интерьерный фотограф. Помогаю запечатлеть красоту пространства и момента. 10 лет в профессии, портфолио более 200 проектов.',
  },
  {
    id: 7,
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
    description: 'Профессиональный репортажный фотограф. Работаю на свадьбах, крестинах и частных мероприятиях по всей Беларуси.',
  },
  {
    id: 8,
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
    description: 'Нежный семейный и портретный фотограф. Специализация — беременность, новорождённые, детские и семейные съёмки. Создаю тёплые истории.',
  },
];

/* ── Banner ads ──────────────────────────────────────────────────────── */

export interface BannerAd {
  id: string;
  title: string;
  image: string;
  link: string;
}

export const BANNER_ADS: BannerAd[] = [
  {
    id: 'banner-1',
    title: 'Декор для вашего торжества',
    image: 'https://images.unsplash.com/photo-1478146059778-26b8c31c9981?w=800&h=300&fit=crop',
    link: '/catalog/dekor-oformlenie',
  },
  {
    id: 'banner-2',
    title: 'Выездная регистрация',
    image: 'https://images.unsplash.com/photo-1543373014-cfe4f4bc1cdf?w=800&h=300&fit=crop',
    link: '/catalog/organizaciya-meropriyatiy',
  },
];

/* ── Video tutorials ─────────────────────────────────────────────────── */

export interface VideoTutorial {
  id: string;
  title: string;
  thumb: string;
}

export const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: 'vt-1',
    title: 'Как выбрать фотографа',
    thumb: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=400&h=225&fit=crop',
  },
  {
    id: 'vt-2',
    title: 'Как выбрать видеографа',
    thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=225&fit=crop',
  },
  {
    id: 'vt-3',
    title: 'Как подобрать свадебные платья',
    thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop',
  },
  {
    id: 'vt-4',
    title: 'Как подобрать свадебные украшения',
    thumb: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=225&fit=crop',
  },
  {
    id: 'vt-5',
    title: 'Как выбрать площадку для свадьбы',
    thumb: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=225&fit=crop',
  },
  {
    id: 'vt-6',
    title: 'Как выбрать организатора',
    thumb: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=225&fit=crop',
  },
];
