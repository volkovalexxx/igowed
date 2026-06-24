/* ── Home page mock data ─────────────────────────────────────────── */

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface PickedItem {
  id: number;
  name: string;
  cat: string;
  rating: number;
  price: number;
  img: string;
}

export interface AdvantageItem {
  icon: string;
  title: string;
  desc: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  img: string;
}

export interface VenueItem {
  id: number;
  name: string;
  city: string;
  rating: number;
  price: number;
  img: string;
}

export interface PhotoOfDayItem {
  id: number;
  img: string;
  title: string;
  place: string;
}

export interface BlogItem {
  id: number;
  cat: string;
  title: string;
  excerpt: string;
  img: string;
  date: string;
}

export interface PhotographerItem {
  id: number;
  name: string;
  spec: string;
  rating: number;
  avatar: string;
}

export interface DressItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  img: string;
}

export interface SeoTags {
  [key: string]: string[];
}

export interface VideoCard {
  id: number;
  title: string;
  thumb: string;
}

/* ── STATS ─────────────────────────────────────────────────────────── */

export const STATS: StatItem[] = [
  { icon: 'users',   value: '150+',  label: 'Специалистов' },
  { icon: 'search',  value: '2500+', label: 'Мероприятий' },
  { icon: 'heart',   value: '1000+', label: 'Счастливых клиентов' },
  { icon: 'chart',   value: '30%',   label: 'Экономии бюджета' },
];

/* ── FEATURES ──────────────────────────────────────────────────────── */

export const FEATURES: FeatureItem[] = [
  {
    icon: 'diamond',
    title: 'Лучшие профессионалы в одном месте',
    desc: 'Только проверенные специалисты с реальными отзывами и портфолио.',
  },
  {
    icon: 'search',
    title: 'Удобный поиск подрядчиков',
    desc: 'Фильтры по городу, бюджету, рейтингу и категории услуг.',
  },
  {
    icon: 'chat',
    title: 'Прямое общение со специалистами',
    desc: 'Переписка, видеозвонки и согласование деталей прямо на платформе.',
  },
  {
    icon: 'wallet',
    title: 'Экономия времени и бюджета',
    desc: 'Сравнивайте цены и выбирайте лучшее предложение за несколько минут.',
  },
  {
    icon: 'shield',
    title: 'Контроль на всех этапах',
    desc: 'Удобная система задач и напоминаний для вашего мероприятия.',
  },
];

/* ── PICKED ────────────────────────────────────────────────────────── */

export const PICKED: PickedItem[] = [
  {
    id: 1,
    name: 'Анна Королева',
    cat: 'Фотограф',
    rating: 4.9,
    price: 450,
    img: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Элегант Декор',
    cat: 'Декор',
    rating: 4.8,
    price: 800,
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Сладкий Праздник',
    cat: 'Торты',
    rating: 5.0,
    price: 200,
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'Мелодия Любви',
    cat: 'Музыканты',
    rating: 4.7,
    price: 600,
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    name: 'Grand Florals',
    cat: 'Флористика',
    rating: 4.9,
    price: 350,
    img: 'https://images.unsplash.com/photo-1487530811015-780de78ca5f5?w=400&h=400&fit=crop',
  },
];

/* ── ADVANTAGES ────────────────────────────────────────────────────── */

export const ADVANTAGES: AdvantageItem[] = [
  {
    icon: 'verified',
    title: 'Только проверенные подрядчики',
    desc: 'Каждый специалист проходит верификацию документов и проверку отзывов перед публикацией.',
  },
  {
    icon: 'lock',
    title: 'Безопасная сделка',
    desc: 'Оплата хранится на эскроу-счёте и переводится исполнителю только после вашего подтверждения.',
  },
  {
    icon: 'bell',
    title: 'Личный консультант 24/7',
    desc: 'Наш менеджер поможет с выбором подрядчиков, бюджетом и решением любых вопросов.',
  },
];

/* ── SERVICES ──────────────────────────────────────────────────────── */

export const SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: 'Костюмы',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Торты',
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Кейтеринг',
    img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Печатная продукция',
    img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'Транспорт',
    img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=400&fit=crop',
  },
  {
    id: 6,
    title: 'Флористика',
    img: 'https://images.unsplash.com/photo-1487530811015-780de78ca5f5?w=400&h=400&fit=crop',
  },
  {
    id: 7,
    title: 'Фотограф',
    img: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop',
  },
  {
    id: 8,
    title: 'Видеограф',
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
  },
  {
    id: 9,
    title: 'Ведущий',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
  },
  {
    id: 10,
    title: 'Макияж и прическа',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
  },
  {
    id: 11,
    title: 'Декор и оформление',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
  },
  {
    id: 12,
    title: 'Музыканты',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
  },
];

/* ── VENUES ────────────────────────────────────────────────────────── */

export const VENUES: VenueItem[] = [
  {
    id: 1,
    name: 'Замок Мир',
    city: 'Мир, Беларусь',
    rating: 4.9,
    price: 2500,
    img: 'https://images.unsplash.com/photo-1544085701-4d1b7e43b7a7?w=600&h=450&fit=crop',
  },
  {
    id: 2,
    name: 'Усадьба Лебяжий',
    city: 'Минск, Беларусь',
    rating: 4.8,
    price: 1800,
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=450&fit=crop',
  },
  {
    id: 3,
    name: 'Royal Gardens',
    city: 'Гродно, Беларусь',
    rating: 4.7,
    price: 2100,
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=450&fit=crop',
  },
  {
    id: 4,
    name: 'Panorama Hall',
    city: 'Брест, Беларусь',
    rating: 4.6,
    price: 1500,
    img: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=450&fit=crop',
  },
  {
    id: 5,
    name: 'Riverside Estate',
    city: 'Витебск, Беларусь',
    rating: 4.8,
    price: 1950,
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=450&fit=crop',
  },
];

/* ── PHOTO OF DAY ───────────────────────────────────────────────────── */

export const PHOTO_OF_DAY: PhotoOfDayItem[] = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=667&fit=crop',
    title: 'Момент счастья',
    place: 'Замок Мир, Беларусь',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&h=667&fit=crop',
    title: 'Нежность',
    place: 'Минск, Беларусь',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&h=667&fit=crop',
    title: 'Первый танец',
    place: 'Гродно, Беларусь',
  },
];

/* ── BLOG ──────────────────────────────────────────────────────────── */

export const BLOG: BlogItem[] = [
  {
    id: 1,
    cat: 'Советы',
    title: 'Как выбрать идеального фотографа на свадьбу',
    excerpt: 'Рассказываем, на что обратить внимание при выборе фотографа и какие вопросы задать перед заключением договора.',
    img: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&h=375&fit=crop',
    date: '24 апреля 2026',
  },
  {
    id: 2,
    cat: 'Тренды',
    title: 'Свадебные тренды 2026: минимализм и натуральность',
    excerpt: 'Больше природных материалов, меньше пышных декораций. Рассматриваем главные тенденции этого сезона.',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=375&fit=crop',
    date: '18 апреля 2026',
  },
  {
    id: 3,
    cat: 'Бюджет',
    title: 'Планирование свадьбы на 5000$: реально ли это?',
    excerpt: 'Делимся пошаговым планом и советами по оптимизации расходов без потери качества.',
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&h=375&fit=crop',
    date: '12 апреля 2026',
  },
  {
    id: 4,
    cat: 'Площадки',
    title: 'Топ-10 площадок Минска для незабываемой свадьбы',
    excerpt: 'Подборка лучших залов и усадеб Минска с ценами, вместимостью и контактами.',
    img: 'https://images.unsplash.com/photo-1544085701-4d1b7e43b7a7?w=500&h=375&fit=crop',
    date: '5 апреля 2026',
  },
];

/* ── PHOTOGRAPHERS ──────────────────────────────────────────────────── */

export const PHOTOGRAPHERS: PhotographerItem[] = [
  {
    id: 1,
    name: 'Анна Королева',
    spec: 'Свадебная фотосъёмка',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Дмитрий Воронов',
    spec: 'Репортажная съёмка',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Мария Светлова',
    spec: 'Love story & свадьба',
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Игорь Павлов',
    spec: 'Аэросъёмка & видео',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    id: 5,
    name: 'Елена Лазарева',
    spec: 'Фото + видеограф',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
];

/* ── DRESSES ────────────────────────────────────────────────────────── */

export const DRESSES: DressItem[] = [
  {
    id: 1,
    name: 'Платье "Роза"',
    brand: 'Vera Wang',
    price: 1200,
    img: 'https://images.unsplash.com/photo-1519657831940-66f55f8e6a06?w=400&h=533&fit=crop',
  },
  {
    id: 2,
    name: 'Платье "Нежность"',
    brand: 'Pronovias',
    price: 980,
    img: 'https://images.unsplash.com/photo-1594552072238-b8a33785b6cd?w=400&h=533&fit=crop',
  },
  {
    id: 3,
    name: 'Платье "Белая ночь"',
    brand: 'Milla Nova',
    price: 750,
    img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=533&fit=crop',
  },
  {
    id: 4,
    name: 'Платье "Лебедь"',
    brand: 'Rosa Clara',
    price: 1450,
    img: 'https://images.unsplash.com/photo-1563778084459-859099e48677?w=400&h=533&fit=crop',
  },
  {
    id: 5,
    name: 'Платье "Рассвет"',
    brand: 'Justin Alexander',
    price: 870,
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=533&fit=crop',
  },
];

/* ── SEO TAGS ───────────────────────────────────────────────────────── */

export const SEO_TAGS: SeoTags = {
  'ОРГАНИЗАЦИЯ СВАДЬБЫ В БЕЛАРУСИ': [
    'Минск', 'Брест', 'Гродно', 'Витебск', 'Гомель', 'Могилев',
    'Барановичи', 'Бобруйск', 'Борисов', 'Пинск', 'Орша', 'Мозырь',
    'Солигорск', 'Молодечно', 'Лида', 'Жодино', 'Новополоцк', 'Полоцк',
  ],
  'ВЕДУЩИЕ МЕРОПРИЯТИЙ В БЕЛАРУСИ': [
    'Минск', 'Брест', 'Гродно', 'Витебск', 'Гомель', 'Могилев',
    'Барановичи', 'Бобруйск', 'Борисов', 'Пинск', 'Молодечно', 'Лида',
  ],
  'ПОПУЛЯРНЫЕ СТРАНЫ': [
    'Беларусь', 'Россия', 'Украина', 'Польша', 'Германия', 'Франция',
    'Италия', 'Испания', 'Греция', 'Турция', 'ОАЭ', 'Таиланд',
  ],
};

/* ── VIDEO CARDS ────────────────────────────────────────────────────── */

export const VIDEO_CARDS: VideoCard[] = [
  {
    id: 1,
    title: 'Как организовать свадьбу с нуля',
    thumb: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&h=281&fit=crop',
  },
  {
    id: 2,
    title: 'Выбор ресторана для свадебного банкета',
    thumb: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=281&fit=crop',
  },
  {
    id: 3,
    title: 'Свадебный бюджет: советы экспертов',
    thumb: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&h=281&fit=crop',
  },
  {
    id: 4,
    title: 'Как выбрать платье невесты',
    thumb: 'https://images.unsplash.com/photo-1519657831940-66f55f8e6a06?w=500&h=281&fit=crop',
  },
  {
    id: 5,
    title: 'Топ-5 ошибок при организации свадьбы',
    thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=281&fit=crop',
  },
];
