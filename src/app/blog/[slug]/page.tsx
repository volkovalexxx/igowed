'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Cal, Check } from '@/components/ui/Icons';
import { BLOG } from '@/data/homeData';

/* ── Extended article content map ───────────────────────────────────── */

interface ArticleFull {
  id: number;
  cat: string;
  title: string;
  excerpt: string;
  img: string;
  date: string;
  readTime: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  body: ArticleBlock[];
}

type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'blockquote'; text: string };

const ARTICLES: ArticleFull[] = [
  {
    id: 1,
    cat: 'Советы',
    title: 'Как выбрать идеального фотографа на свадьбу',
    excerpt: 'Рассказываем, на что обратить внимание при выборе фотографа и какие вопросы задать перед заключением договора.',
    img: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=480&fit=crop',
    date: '24 апреля 2026',
    readTime: '5 мин чтения',
    authorName: 'Анна Королева',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    authorRole: 'Свадебный фотограф',
    body: [
      {
        type: 'p',
        text: 'Фотограф — один из самых важных людей на вашей свадьбе. Именно его работа позволит вам снова и снова переживать самый счастливый день в жизни. Неправильный выбор может обернуться разочарованием, поэтому к поиску специалиста стоит подойти серьёзно.',
      },
      {
        type: 'h2',
        text: 'С чего начать поиск',
      },
      {
        type: 'p',
        text: 'Начните изучение рынка минимум за 8–12 месяцев до свадьбы — хорошие фотографы бронируются заранее. Попросите рекомендации у друзей и коллег, просмотрите профили в социальных сетях и на профессиональных платформах. Обращайте внимание не только на отдельные снимки, но и на полные репортажи: так вы увидите, умеет ли фотограф работать с освещением в разных условиях, передавать эмоции и строить целостную историю.',
      },
      {
        type: 'blockquote',
        text: '«Хороший свадебный фотограф должен уметь быть незаметным — чтобы запечатлеть настоящие эмоции, а не постановочные улыбки»',
      },
      {
        type: 'h2',
        text: 'Вопросы на встрече',
      },
      {
        type: 'p',
        text: 'Перед заключением договора обязательно встретьтесь лично или проведите видеозвонок. Выясните, сколько свадеб фотограф уже отснял, насколько он знаком с вашей площадкой, какое оборудование использует и есть ли резервное. Уточните, сколько времени займёт обработка снимков, и попросите показать полный репортаж с недавней свадьбы — не только лучшие кадры из портфолио.',
      },
      {
        type: 'p',
        text: 'Обсудите детали договора: что входит в стоимость, предусмотрена ли предоплата, каковы условия отмены съёмки. Не забудьте договориться о правах на использование фотографий: имеет ли фотограф право публиковать снимки в своих социальных сетях до того, как вы их увидите.',
      },
      {
        type: 'h2',
        text: 'На что обратить внимание в портфолио',
      },
      {
        type: 'p',
        text: 'Портфолио — это лицо фотографа, и здесь важно смотреть не только на технику, но и на стиль. Убедитесь, что вам близка его манера съёмки: репортажная или постановочная, светлая и воздушная или тёмная и контрастная. Сравните съёмки в разных условиях — на природе, в помещении, в пасмурный и солнечный день. Разнообразие и стабильное качество свидетельствуют о профессионализме.',
      },
    ],
  },
  {
    id: 2,
    cat: 'Тренды',
    title: 'Свадебные тренды 2026: минимализм и натуральность',
    excerpt: 'Больше природных материалов, меньше пышных декораций. Рассматриваем главные тенденции этого сезона.',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=480&fit=crop',
    date: '18 апреля 2026',
    readTime: '4 мин чтения',
    authorName: 'Мария Светлова',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
    authorRole: 'Свадебный стилист',
    body: [
      {
        type: 'p',
        text: 'Если ещё несколько лет назад главным свадебным трендом были пышные букеты из роз и золотые канделябры, то в 2026 году всё иначе. Современные пары выбирают природную эстетику, осознанное потребление и персонализированные детали.',
      },
      {
        type: 'h2',
        text: 'Природные материалы',
      },
      {
        type: 'p',
        text: 'Льняные скатерти, деревянные таблички, лозяные корзины и керамика ручной работы — вот что украшает самые стильные свадьбы этого года. В флористике на смену пышным розам пришли сухоцветы, пампасная трава и полевые цветы. Этот стиль смотрится уместно как на открытом воздухе, так и в лофтах или загородных усадьбах.',
      },
      {
        type: 'blockquote',
        text: '«Натуральность — это не скучно. Это честно. Гости запоминают атмосферу, а не количество лепестков роз»',
      },
      {
        type: 'h2',
        text: 'Минималистичные образы',
      },
      {
        type: 'p',
        text: 'Платья 2026 года — это элегантная простота: приталенные силуэты, атласные ткани, минимум декора. Многоярусные пышные платья уступают место лаконичным моделям с открытой спиной или тонкими бретелями. В макияже — лёгкий акцент на коже, естественные оттенки и waterproof-формулы для слёз радости.',
      },
      {
        type: 'p',
        text: 'Мужские образы тоже становятся более смелыми: классический чёрный костюм сменяется бежевым, светло-серым или глубоким синим. В тренде — льняные костюмы для летних свадеб на природе.',
      },
      {
        type: 'h2',
        text: 'Персонализация и осознанность',
      },
      {
        type: 'p',
        text: 'Главный тренд 2026 — это свадьба как отражение личности пары. Гостей угощают фирменным коктейлем с именем жениха и невесты, на столах стоят фотографии из путешествий, а музыкальная программа составлена из любимых песен. Осознанный подход к выбору подрядчиков — местные производители, цветы с белорусских ферм, свадебный торт от малого кондитерского бизнеса.',
      },
    ],
  },
  {
    id: 3,
    cat: 'Бюджет',
    title: 'Планирование свадьбы на 5000$: реально ли это?',
    excerpt: 'Делимся пошаговым планом и советами по оптимизации расходов без потери качества.',
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200&h=480&fit=crop',
    date: '12 апреля 2026',
    readTime: '6 мин чтения',
    authorName: 'Дмитрий Воронов',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    authorRole: 'Свадебный организатор',
    body: [
      {
        type: 'p',
        text: 'Свадьба мечты не обязательно должна стоить целое состояние. При грамотном планировании можно организовать тёплое, красивое торжество за 5000 долларов — особенно если речь идёт о небольшом камерном мероприятии на 30–50 гостей.',
      },
      {
        type: 'h2',
        text: 'Как распределить бюджет',
      },
      {
        type: 'p',
        text: 'Главное правило бюджетного планирования — сначала выделить деньги на приоритеты, а уже потом думать об остальном. Для большинства пар главные статьи расходов — это площадка и кейтеринг (40–45% бюджета), фотограф (15–18%), платье и костюм (10–12%), декор и флористика (10–12%), а также музыкальное сопровождение (8–10%). На всё остальное — торт, приглашения, транспорт — уйдёт оставшееся.',
      },
      {
        type: 'blockquote',
        text: '«Лучший способ сэкономить — это не резать качество, а сокращать количество. Меньше гостей = лучшая еда, лучший фотограф, больше внимания каждому»',
      },
      {
        type: 'h2',
        text: 'Где реально сэкономить',
      },
      {
        type: 'p',
        text: 'Свадьба в будний день или в пятницу обходится значительно дешевле, чем в субботу. Многие площадки дают скидку 20–30% за бронирование в межсезонье (ноябрь–март). Пригласительные можно заказать в цифровом формате — это сэкономит 100–200 долларов и сократит бумажные отходы. Торт можно купить в пекарне, а не у специализированных свадебных кондитеров — разница в цене порой двукратная.',
      },
      {
        type: 'p',
        text: 'Не экономьте на фотографе и еде — это то, что гости запомнят на всю жизнь. Зато можно отказаться от живой музыки в пользу хорошего ди-джея, выбрать более простые приглашения или арендовать декор вместо покупки.',
      },
      {
        type: 'h2',
        text: 'Контроль расходов',
      },
      {
        type: 'p',
        text: 'Ведите таблицу с каждой позицией бюджета: плановая сумма, реальная стоимость, статус оплаты. Заложите резерв 10–15% на непредвиденные расходы — они обязательно появятся. Просите у подрядчиков детальные сметы с разбивкой по позициям: это поможет сравнивать предложения честно и понимать, за что именно вы платите.',
      },
    ],
  },
  {
    id: 4,
    cat: 'Площадки',
    title: 'Топ-10 площадок Минска для незабываемой свадьбы',
    excerpt: 'Подборка лучших залов и усадеб Минска с ценами, вместимостью и контактами.',
    img: 'https://images.unsplash.com/photo-1544085701-4d1b7e43b7a7?w=1200&h=480&fit=crop',
    date: '5 апреля 2026',
    readTime: '7 мин чтения',
    authorName: 'Елена Лазарева',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    authorRole: 'Редактор I GO WED',
    body: [
      {
        type: 'p',
        text: 'Минск — город с удивительным разнообразием свадебных площадок: от исторических особняков и современных лофтов до загородных усадеб в 20 минутах от центра. Мы отобрали 10 мест, которые неизменно пользуются популярностью у пар из Беларуси.',
      },
      {
        type: 'h2',
        text: 'Классические банкетные залы',
      },
      {
        type: 'p',
        text: 'Для тех, кто ценит традиции, классические банкетные залы остаются оптимальным выбором. Они оснащены всем необходимым: профессиональной кухней, системой освещения, зонами для выездной регистрации и парковкой. Стоимость аренды зала вместимостью 60–80 человек в Минске начинается от 800$ на вечер.',
      },
      {
        type: 'blockquote',
        text: '«Площадка — это не просто стены. Это атмосфера, которую вы создаёте вместе с вашими гостями»',
      },
      {
        type: 'h2',
        text: 'Загородные усадьбы',
      },
      {
        type: 'p',
        text: 'Усадьбы в пригороде Минска — идеальный выбор для свадьбы в стиле рустик или бохо. Многие из них предлагают ночёвку для гостей, что позволяет превратить торжество в двухдневное событие. Популярные направления: Логойский, Минский и Дзержинский районы. Цены стартуют от 1200$ за аренду на сутки.',
      },
      {
        type: 'p',
        text: 'При выборе площадки обязательно уточните: есть ли у них право на продажу алкоголя, разрешена ли живая музыка после 22:00, входит ли уборка в стоимость аренды и как организована парковка для гостей. Эти детали часто влияют на итоговый бюджет больше, чем кажется на первый взгляд.',
      },
      {
        type: 'h2',
        text: 'Современные лофты',
      },
      {
        type: 'p',
        text: 'Если вам близок индустриальный или минималистичный стиль, обратите внимание на лофты в исторических зданиях центра Минска. Открытая планировка, высокие потолки и панорамные окна создают эффектный фон для свадебных фотографий. Такие площадки, как правило, не предоставляют кейтеринг и мебель, поэтому учитывайте эти расходы в бюджете.',
      },
    ],
  },
];

/* Fallback article */
const DEFAULT_ARTICLE: ArticleFull = ARTICLES[0];

/* ── Related posts ───────────────────────────────────────────────────── */

function RelatedCard({ post }: { post: ArticleFull }) {
  return (
    <a
      href={`/blog/${post.id}`}
      className="flex gap-3 group"
      style={{ textDecoration: 'none' }}
    >
      <img
        src={post.img}
        alt={post.title}
        className="rounded-lg object-cover shrink-0"
        style={{ width: 72, height: 56 }}
        loading="lazy"
      />
      <div className="flex flex-col gap-0.5">
        <span
          className="font-medium leading-snug group-hover:text-[var(--gold)] transition-colors"
          style={{ fontSize: 13, color: 'var(--ink)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {post.title}
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{post.date}</span>
      </div>
    </a>
  );
}

/* ── Social share buttons ────────────────────────────────────────────── */

function ShareButtons({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareLinks = [
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
      color: '#2AABEE',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: `https://www.instagram.com/`,
      color: '#E1306C',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth={0} />
        </svg>
      ),
    },
    {
      label: 'ВКонтакте',
      href: `https://vk.com/share.php?url=${encodeURIComponent(url)}`,
      color: '#0077FF',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-.9-1.49-.9s-.44.26-.44 1.32v1.047c0 .33-.106.434-1.046.434-1.553 0-3.285-.938-4.496-2.676-1.83-2.57-2.33-4.49-2.33-4.84 0-.215.082-.414.41-.414h1.742c.307 0 .42.14.54.463 0 0 1.414 3.826 1.914 4.455.1.13.17.147.236.147.077 0 .165-.05.165-.384V11.27c0-.537-.19-.777-.19-.777-.1-.127-.25-.143-.25-.143h-1.064c-.26 0-.457-.078-.457-.362 0-.177.157-.356.476-.356h2.27c.384 0 .512.205.512.512v3.218c0 .076.037.115.07.115.072 0 .126-.048.25-.205 0 0 1.344-2.11 1.814-3.278.073-.195.244-.297.49-.297h1.743c.523 0 .67.267.523.534-.266.622-1.778 2.768-1.778 2.768-.134.186-.185.27 0 .48.133.162.567.582.867.94.533.62.94 1.142.94 1.56 0 .358-.177.536-.553.536z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>Поделиться:</span>
      {shareLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ background: s.color, color: '#fff' }}
        >
          {s.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 btn btn-outline btn-sm btn-pill transition-all"
      >
        {copied ? (
          <>
            <Check size={13} />
            Скопировано
          </>
        ) : (
          'Копировать ссылку'
        )}
      </button>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const article = ARTICLES.find((a) => String(a.id) === slug) ?? DEFAULT_ARTICLE;
  const related = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://igowed.by/blog/${slug}`;

  return (
    <>
      <Header activePage="Блог" />

      <main className="py-8">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8" aria-label="Breadcrumb">
            <Link href="/" style={{ fontSize: 13, color: 'var(--muted)' }} className="hover:text-[var(--gold)] transition-colors">
              Главная
            </Link>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>/</span>
            <Link href="/blog" style={{ fontSize: 13, color: 'var(--muted)' }} className="hover:text-[var(--gold)] transition-colors">
              Блог
            </Link>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>/</span>
            <span
              style={{
                fontSize: 13,
                color: 'var(--ink)',
                maxWidth: 260,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {article.title}
            </span>
          </nav>

          <div className="flex gap-10 items-start">
            {/* ── Article ─────────────────────────────────────────── */}
            <article style={{ flex: 1, minWidth: 0 }}>
              {/* Article header */}
              <div className="mb-6 flex flex-col gap-3">
                <span
                  className="inline-block self-start rounded-full px-3 py-1 font-medium"
                  style={{ fontSize: 12, background: 'var(--gold-soft)', color: 'var(--gold)' }}
                >
                  {article.cat}
                </span>

                <h1
                  className="font-bold leading-tight"
                  style={{ fontSize: 32, color: 'var(--dark)', letterSpacing: '-0.3px' }}
                >
                  {article.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5" style={{ fontSize: 13, color: 'var(--muted)' }}>
                    <Cal size={14} />
                    {article.date}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>· {article.readTime}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mt-1">
                  <img
                    src={article.authorAvatar}
                    alt={article.authorName}
                    className="rounded-full object-cover"
                    style={{ width: 40, height: 40 }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{article.authorName}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{article.authorRole}</div>
                  </div>
                </div>
              </div>

              {/* Hero image */}
              <div className="mb-8 rounded-xl overflow-hidden" style={{ maxHeight: 480 }}>
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full object-cover"
                  style={{ maxHeight: 480 }}
                />
              </div>

              {/* Body */}
              <div style={{ maxWidth: 720 }}>
                {article.body.map((block, i) => {
                  if (block.type === 'h2') {
                    return (
                      <h2
                        key={i}
                        style={{
                          fontSize: 24,
                          fontWeight: 600,
                          color: 'var(--dark)',
                          margin: '32px 0 16px',
                        }}
                      >
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === 'blockquote') {
                    return (
                      <blockquote
                        key={i}
                        style={{
                          borderLeft: '3px solid var(--gold)',
                          padding: '16px 24px',
                          background: 'var(--paper)',
                          borderRadius: '0 8px 8px 0',
                          fontStyle: 'italic',
                          fontSize: 15,
                          color: 'var(--muted)',
                          margin: '24px 0',
                          lineHeight: 1.7,
                        }}
                      >
                        {block.text}
                      </blockquote>
                    );
                  }
                  return (
                    <p
                      key={i}
                      style={{
                        fontSize: 16,
                        lineHeight: 1.75,
                        color: 'var(--ink)',
                        marginBottom: 20,
                      }}
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>

              {/* Share */}
              <div
                className="mt-10 pt-8"
                style={{ borderTop: '1px solid var(--border)', maxWidth: 720 }}
              >
                <ShareButtons url={pageUrl} />
              </div>
            </article>

            {/* ── Sidebar ──────────────────────────────────────────── */}
            <aside
              className="hidden lg:block shrink-0"
              style={{ width: 280, position: 'sticky', top: 24 }}
            >
              <div
                className="rounded-xl p-5"
                style={{ background: '#fff', border: '1px solid var(--border)' }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{ fontSize: 14, color: 'var(--dark)' }}
                >
                  Похожие статьи
                </h3>
                <div className="flex flex-col gap-4">
                  {related.map((post) => (
                    <RelatedCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
