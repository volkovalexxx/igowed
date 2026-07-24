
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
