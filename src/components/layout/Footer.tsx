'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ── Types ───────────────────────────────────────────────────────── */

type Locale = 'RU' | 'EN';
type Currency = 'RUB' | 'USD';

/* ── Logo ────────────────────────────────────────────────────────── */

function Logo() {
  return (
    <span
      className="font-extrabold tracking-tight select-none"
      style={{ fontSize: 17, letterSpacing: '-0.3px', color: '#fff' }}
    >
      I GO{' '}
      <span style={{ color: 'var(--gold)' }}>WED</span>
    </span>
  );
}

/* ── Social icon button ──────────────────────────────────────────── */

function SocialBtn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
      style={{
        border: '1px solid rgba(255,255,255,0.4)',
        background: hovered ? 'var(--gold)' : 'transparent',
        color: '#fff',
      }}
    >
      {children}
    </button>
  );
}

/* ── Telegram SVG ────────────────────────────────────────────────── */
function TGIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
    </svg>
  );
}

/* ── Instagram SVG ───────────────────────────────────────────────── */
function IGIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth={0} />
    </svg>
  );
}

/* ── YouTube SVG ─────────────────────────────────────────────────── */
function YTIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/* ── VK SVG ──────────────────────────────────────────────────────── */
function VKIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-.9-1.49-.9s-.44.26-.44 1.32v1.047c0 .33-.106.434-1.046.434-1.553 0-3.285-.938-4.496-2.676-1.83-2.57-2.33-4.49-2.33-4.84 0-.215.082-.414.41-.414h1.742c.307 0 .42.14.54.463 0 0 1.414 3.826 1.914 4.455.1.13.17.147.236.147.077 0 .165-.05.165-.384V11.27c0-.537-.19-.777-.19-.777-.1-.127-.25-.143-.25-.143h-1.064c-.26 0-.457-.078-.457-.362 0-.177.157-.356.476-.356h2.27c.384 0 .512.205.512.512v3.218c0 .076.037.115.07.115.072 0 .126-.048.25-.205 0 0 1.344-2.11 1.814-3.278.073-.195.244-.297.49-.297h1.743c.523 0 .67.267.523.534-.266.622-1.778 2.768-1.778 2.768-.134.186-.185.27 0 .48.133.162.567.582.867.94.533.62.94 1.142.94 1.56 0 .358-.177.536-.553.536z" />
    </svg>
  );
}

/* ── Footer column heading ───────────────────────────────────────── */

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-semibold uppercase tracking-widest mb-4"
      style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em' }}
    >
      {children}
    </p>
  );
}

/* ── Footer link ─────────────────────────────────────────────────── */

function FooterLink({
  href = '#',
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="block transition-colors py-0.5"
      style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
      }}
    >
      {children}
    </a>
  );
}

/* ── Selector pill ───────────────────────────────────────────────── */

function SelectorPill<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="inline-flex items-center rounded-full overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.25)' }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="px-3 py-1 text-xs font-medium transition-colors"
          style={{
            fontSize: 12,
            background: opt === value ? 'var(--gold)' : 'transparent',
            color: opt === value ? '#fff' : 'rgba(255,255,255,0.6)',
            border: 'none',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ── Main Footer ─────────────────────────────────────────────────── */

export default function Footer() {
  const [email, setEmail] = useState('');
  const [locale, setLocale] = useState<Locale>('RU');
  const [currency, setCurrency] = useState<Currency>('RUB');
  const year = new Date().getFullYear();

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up to API
    setEmail('');
  }

  return (
    <footer style={{ background: 'var(--dark)' }}>
      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Col 1 – Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="I GO WED — на главную">
              <Logo />
            </Link>
            <p
              className="mt-4 leading-relaxed"
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', maxWidth: 220 }}
            >
              Сервис поиска свадебных подрядчиков и площадок для проведения мероприятий в Беларуси.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              <SocialBtn label="Telegram">
                <TGIcon />
              </SocialBtn>
              <SocialBtn label="Instagram">
                <IGIcon />
              </SocialBtn>
              <SocialBtn label="YouTube">
                <YTIcon />
              </SocialBtn>
              <SocialBtn label="ВКонтакте">
                <VKIcon />
              </SocialBtn>
            </div>
          </div>

          {/* Col 2 – For vendors */}
          <div>
            <ColHeading>Подрядчикам</ColHeading>
            <nav className="flex flex-col">
              <FooterLink>Разместить анкету</FooterLink>
              <FooterLink>Тарифы</FooterLink>
              <FooterLink>Кейсы</FooterLink>
              <FooterLink>Академия</FooterLink>
            </nav>
          </div>

          {/* Col 3 – For couples */}
          <div>
            <ColHeading>Парам</ColHeading>
            <nav className="flex flex-col">
              <FooterLink>Каталог</FooterLink>
              <FooterLink>Блог</FooterLink>
              <FooterLink>Конструктор</FooterLink>
              <FooterLink>Личный кабинет</FooterLink>
            </nav>
          </div>

          {/* Col 4 – Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <ColHeading>Подписка</ColHeading>
            <p
              className="mb-4 leading-relaxed"
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}
            >
              Получайте свежие подборки площадок и полезные советы по организации свадьбы.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#fff',
                  fontSize: 13,
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gold)';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.18)';
                }}
              />
              <button
                type="submit"
                className="btn btn-gold w-full"
                style={{ borderRadius: 8, fontSize: 13 }}
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(255,255,255,0.12)' }}
      >
        <div className="container py-5 flex flex-wrap items-center justify-between gap-4">

          {/* Left: copyright + legal */}
          <div className="flex flex-wrap items-center gap-4">
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              © {year} I GO WED
            </span>
            <a
              href="#"
              className="transition-colors"
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)';
              }}
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              className="transition-colors"
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)';
              }}
            >
              Условия использования
            </a>
          </div>

          {/* Right: selectors + 18+ */}
          <div className="flex items-center gap-3">
            <SelectorPill<Currency>
              options={['USD', 'RUB']}
              value={currency}
              onChange={setCurrency}
            />
            <SelectorPill<Locale>
              options={['RU', 'EN']}
              value={locale}
              onChange={setLocale}
            />
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-md font-bold"
              style={{
                fontSize: 10,
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              18+
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
