import type { Metadata } from 'next';
import VendorProfileClient, { type VendorData } from './VendorProfileClient';

/* ── Mock data (server-side) ────────────────────────────────────────────── */

const MOCK_VENDOR: VendorData = {
  slug: 'anna-photographer',
  name: 'Анна Смирнова',
  username: '@anna.photo',
  city: 'Москва',
  isPro: true,
  rating: 4.9,
  reviewCount: 128,
  photosCount: 247,
  price: 'от 50 000 ₽',
  coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  displayMode: 'VERTICAL',
  bio: 'Профессиональный свадебный фотограф с 8-летним опытом. Снимаю истории любви, создаю воспоминания на всю жизнь.',
  address: 'г. Москва, ул. Тверская, 15',
  phone: '+7 (926) 123-45-67',
  website: 'anna-photo.ru',
  instagram: '@anna.photo',
  languages: ['Русский', 'English', 'Deutsch'],
  workingHours: 'Пн–Пт: 10:00–20:00, Сб–Вс: по договорённости',
  bankDetails: 'ИП Смирнова А.В. | ИНН 7701234567 | р/с 40802810012345678901 | Сбербанк',
  photos: Array.from({ length: 12 }, (_, i) => ({
    id: String(i),
    src: `https://images.unsplash.com/photo-${[
      '1519741497674-611481863552',
      '1606216794074-735e91aa2c92',
      '1511285560929-80b5b1f1b3bd',
      '1465495976277-4387d4b0b4c6',
      '1520854221256-17451cc331bf',
      '1583939003579-730e3918a45a',
      '1507003211169-0a1dd7228f2d',
      '1472396961693-142e6e269027',
      '1490818387583-1d2813014203',
      '1550005809-91ad75fb9f29',
      '1519225421980-e87dc72b8f13',
      '1524504388940-b1c1722653e1',
    ][i]}?w=600&q=80`,
    alt: `Фото ${i + 1}`,
  })),
  services: [
    { id: '1', category: 'Базовый пакет', price: '50 000 ₽', description: '8 часов съёмки, 300 обработанных фото, онлайн-галерея' },
    { id: '2', category: 'Стандарт', price: '80 000 ₽', description: '10 часов съёмки, 500 фото, фотокнига 30x30 см, онлайн-галерея' },
    { id: '3', category: 'Премиум', price: '120 000 ₽', description: 'Весь день съёмки, 700+ фото, 2 фотокниги, видеоролик, онлайн-галерея' },
  ],
  reviews: [
    { id: '1', userName: 'Мария К.', userAvatar: 'https://i.pravatar.cc/40?img=1', date: '15 марта 2025', rating: 5, text: 'Анна — невероятный фотограф! Фотографии получились потрясающими. Очень профессиональный подход и внимание к деталям.' },
    { id: '2', userName: 'Дмитрий В.', userAvatar: 'https://i.pravatar.cc/40?img=3', date: '2 февраля 2025', rating: 5, text: 'Работали с Анной на нашей свадьбе. Результат превзошёл все ожидания! Рекомендуем всем.' },
    { id: '3', userName: 'Ольга П.', userAvatar: 'https://i.pravatar.cc/40?img=5', date: '20 января 2025', rating: 4, text: 'Отличная работа, фото красивые. Немного долго ждали готовые снимки, но качество стоит того.' },
    { id: '4', userName: 'Алексей М.', userAvatar: 'https://i.pravatar.cc/40?img=8', date: '5 декабря 2024', rating: 5, text: 'Лучший фотограф из тех, с кем приходилось работать. Очень рекомендую!' },
  ],
};

/* ── Metadata ───────────────────────────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${MOCK_VENDOR.name} — Свадебный фотограф | I GO WED`,
    description: MOCK_VENDOR.bio,
  };
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function VendorProfilePage() {
  return <VendorProfileClient vendor={MOCK_VENDOR} />;
}
