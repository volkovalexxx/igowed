import type { HomePagePayload, ImageAsset } from './home.types.js'

function image(url: string, alt: string, width = 640, height = 480): ImageAsset {
  return { url, alt, width, height }
}

export const homePageData: HomePagePayload = {
  hero: {
    title: 'Найдите лучших подрядчиков для вашего мероприятия в любой точке мира',
    subtitle: 'Организуйте мероприятие мечты вместе с I GO WED',
    background: image(
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&h=900&fit=crop',
      'Невеста на лестнице',
      1800,
      900
    ),
    primaryAction: {
      label: 'Перейти в каталог',
      href: '/catalog',
    },
  },
  stats: [
    { id: 'specialists', label: 'Специалистов', value: '150+', icon: 'users' },
    { id: 'events', label: 'Мероприятий', value: '2500+', icon: 'search' },
    { id: 'happy-couples', label: 'Счастливых клиентов', value: '1000+', icon: 'heart' },
    { id: 'discounts', label: 'Скидки подрядчиков', value: '30%', icon: 'wallet' },
  ],
  quickBenefits: [
    {
      id: 'professionals',
      title: 'Лучшие профессиональные свадебные места',
      description: 'Фотографы, декораторы, ведущие и другие специалисты.',
      icon: 'award',
    },
    {
      id: 'vendors',
      title: 'Удобный поиск подрядчиков',
      description: 'Выбирайте исполнителей по рейтингу, отзывам и портфолио.',
      icon: 'search',
    },
    {
      id: 'communication',
      title: 'Прямое общение со специалистами',
      description: 'Договаривайтесь без посредников и лишних переписок.',
      icon: 'chat',
    },
    {
      id: 'budget',
      title: 'Экономия времени и бюджета',
      description: 'Сравнивайте предложения и планируйте расходы заранее.',
      icon: 'wallet',
    },
    {
      id: 'control',
      title: 'Контроль на всех этапах',
      description: 'Сохраняйте контакты, идеи и выбранных подрядчиков.',
      icon: 'checklist',
    },
  ],
  serviceAdvantages: [
    {
      id: 'plan',
      title: 'Поможем спланировать и организовать свадьбу',
      description: 'Бесплатный онлайн-органайзер сведет бюджет, задачи и гостей в одном месте.',
      icon: 'layers',
    },
    {
      id: 'choice',
      title: 'Большой выбор профессиональных подрядчиков',
      description: 'Выбирайте проверенных специалистов по отзывам и портфолио.',
      icon: 'users',
    },
    {
      id: 'ideas',
      title: 'Вдохновение и идеи для вашей свадьбы',
      description: 'Фото дня, блог и подборки помогут быстрее собрать стиль события.',
      icon: 'sparkles',
    },
  ],
  pickedForYou: [
    {
      id: 'venue-palace',
      title: 'Великие холмы',
      subtitle: 'Усадьба',
      href: '/vendor/velikie-holmy',
      image: image('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=640&h=420&fit=crop', 'Свадебная усадьба'),
      priceFrom: { amount: 500, currency: 'RUB' },
    },
    {
      id: 'venue-hall',
      title: 'Великие холмы',
      subtitle: 'Усадьба',
      href: '/vendor/velikie-holmy-hall',
      image: image('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=640&h=420&fit=crop', 'Банкетный зал'),
      priceFrom: { amount: 800, currency: 'RUB' },
    },
    {
      id: 'decor-table',
      title: 'Великие холмы',
      subtitle: 'Декор',
      href: '/vendor/decor-table',
      image: image('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=640&h=420&fit=crop', 'Свадебная сервировка'),
      priceFrom: { amount: 600, currency: 'RUB' },
    },
    {
      id: 'event-light',
      title: 'Великие холмы',
      subtitle: 'Ведущий',
      href: '/vendor/event-light',
      image: image('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=640&h=420&fit=crop', 'Свадебный вечер'),
      priceFrom: { amount: 900, currency: 'RUB' },
    },
  ],
  serviceCatalog: [
    {
      id: 'suits',
      title: 'Костюмы',
      href: '/catalog/kostyumy',
      image: image('https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=420&h=560&fit=crop', 'Мужской костюм', 420, 560),
    },
    {
      id: 'cakes',
      title: 'Торты',
      href: '/catalog/torty',
      image: image('https://images.unsplash.com/photo-1525257831700-183b9b8bf5cd?w=420&h=560&fit=crop', 'Свадебный торт', 420, 560),
    },
    {
      id: 'catering',
      title: 'Кухня и кейтеринг',
      href: '/catalog/kuhnya-i-keytering',
      image: image('https://images.unsplash.com/photo-1555244162-803834f70033?w=420&h=560&fit=crop', 'Кейтеринг', 420, 560),
    },
    {
      id: 'print',
      title: 'Печатная продукция',
      href: '/catalog/pechatnaya-produktsiya',
      image: image('https://images.unsplash.com/photo-1606800052052-a08af7148866?w=420&h=560&fit=crop', 'Приглашения', 420, 560),
    },
    {
      id: 'transport',
      title: 'Транспорт',
      href: '/catalog/transport',
      image: image('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=420&h=560&fit=crop', 'Автомобиль', 420, 560),
    },
    {
      id: 'dresses',
      title: 'Свадебные платья',
      href: '/catalog/svadebnye-platya',
      image: image('https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=420&h=560&fit=crop', 'Свадебное платье', 420, 560),
    },
  ],
  venues: [
    {
      id: 'venue-1',
      title: 'Великие холмы',
      subtitle: 'Усадьба',
      href: '/vendor/venue-1',
      image: image('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=640&h=420&fit=crop', 'Площадка для свадьбы'),
      priceFrom: { amount: 500, currency: 'RUB' },
    },
    {
      id: 'venue-2',
      title: 'Великие холмы',
      subtitle: 'Ресторан',
      href: '/vendor/venue-2',
      image: image('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=640&h=420&fit=crop', 'Ресторан для свадьбы'),
      priceFrom: { amount: 800, currency: 'RUB' },
    },
  ],
  photoOfDay: [
    {
      id: 'photo-vertical',
      title: 'Фото дня',
      subtitle: 'Свадебная съемка',
      href: '/blog/photo-of-day',
      image: image('https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=720&h=960&fit=crop', 'Невеста у стены', 720, 960),
    },
    {
      id: 'photo-couple',
      title: 'История пары',
      subtitle: 'Свадебная съемка',
      href: '/blog/photo-couple',
      image: image('https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=720&h=960&fit=crop', 'Пара вечером', 720, 960),
    },
  ],
  blog: [
    {
      id: 'dress-accessories',
      title: 'Украшать ли свадебное платье и аксессуары после свадьбы',
      excerpt: 'Разбираем идеи хранения, продажи и переиспользования свадебного образа.',
      category: 'Советы',
      href: '/blog/dress-accessories',
      image: image('https://images.unsplash.com/photo-1519741497674-611481863552?w=640&h=480&fit=crop', 'Невеста с букетом'),
      publishedAt: '2026-03-12T00:00:00.000Z',
    },
    {
      id: 'wedding-dress-care',
      title: 'Как сохранить свадебное платье после торжества',
      excerpt: 'Что сделать в первые дни после свадьбы и как подготовить платье к хранению.',
      category: 'Гид',
      href: '/blog/wedding-dress-care',
      image: image('https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=640&h=480&fit=crop', 'Свадебная пара'),
      publishedAt: '2026-03-10T00:00:00.000Z',
    },
  ],
  photographers: [
    {
      id: 'photo-olga',
      title: 'Ковалева Ольга',
      subtitle: 'Фотограф',
      href: '/vendor/kovaleva-olga',
      image: image('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=520&h=520&fit=crop', 'Фотограф Ольга', 520, 520),
      priceFrom: { amount: 500, currency: 'RUB' },
    },
    {
      id: 'photo-darya',
      title: 'Ковалева Дарья',
      subtitle: 'Фотограф',
      href: '/vendor/kovaleva-darya',
      image: image('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=520&h=520&fit=crop', 'Фотограф Дарья', 520, 520),
      priceFrom: { amount: 500, currency: 'RUB' },
    },
  ],
  bridalLooks: [
    {
      id: 'look-1',
      title: 'BRIDE',
      subtitle: 'Свадебный салон',
      href: '/vendor/bride-1',
      image: image('https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=520&h=700&fit=crop', 'Свадебный образ', 520, 700),
      priceFrom: { amount: 25000, currency: 'RUB' },
    },
    {
      id: 'look-2',
      title: 'BRIDE',
      subtitle: 'Свадебный салон',
      href: '/vendor/bride-2',
      image: image('https://images.unsplash.com/photo-1519657831940-66f55f8e6a06?w=520&h=700&fit=crop', 'Платье невесты', 520, 700),
      priceFrom: { amount: 25000, currency: 'RUB' },
    },
  ],
  seoGroups: [
    {
      id: 'belarus',
      title: 'Организация свадьбы в Беларуси',
      links: [
        { label: 'Барановичи', href: '/catalog?city=baranovichi' },
        { label: 'Бобруйск', href: '/catalog?city=bobruisk' },
        { label: 'Брест', href: '/catalog?city=brest' },
        { label: 'Витебск', href: '/catalog?city=vitebsk' },
        { label: 'Гомель', href: '/catalog?city=gomel' },
        { label: 'Минск', href: '/catalog?city=minsk' },
      ],
    },
    {
      id: 'popular-countries',
      title: 'Популярные страны',
      links: [
        { label: 'Аргентина', href: '/catalog?country=argentina' },
        { label: 'Испания', href: '/catalog?country=spain' },
        { label: 'Италия', href: '/catalog?country=italy' },
        { label: 'Франция', href: '/catalog?country=france' },
        { label: 'Польша', href: '/catalog?country=poland' },
      ],
    },
  ],
}
