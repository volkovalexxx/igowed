import Link from 'next/link'

function WeddingRings() {
  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="44"
        cy="40"
        r="26"
        stroke="#D39D55"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        style={{ paintOrder: 'stroke fill' }}
      />
      <circle
        cx="76"
        cy="40"
        r="26"
        stroke="#D39D55"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        style={{ paintOrder: 'stroke fill' }}
      />
      <path
        d="M40 14 L44 8 L48 14 L44 20 Z"
        stroke="#D39D55"
        strokeWidth="1.5"
        fill="#F5E6CC"
        strokeLinejoin="round"
      />
      <line x1="40" y1="14" x2="48" y2="14" stroke="#D39D55" strokeWidth="1" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <span
          style={{
            fontWeight: 800,
            fontSize: 24,
            color: '#1A1A1A',
          }}
        >
          I GO <span style={{ color: '#D39D55' }}>WED</span>
        </span>
      </div>

      <WeddingRings />

      <div style={{ position: 'relative', margin: '8px 0 4px' }}>
        <div
          aria-hidden="true"
          style={{
            fontSize: 120,
            fontWeight: 800,
            lineHeight: 1,
            color: '#D39D55',
            opacity: 0.15,
            userSelect: 'none',
          }}
        >
          404
        </div>
      </div>

      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#1A1A1A',
          margin: '4px 0 12px',
          lineHeight: 1.3,
        }}
      >
        Страница не найдена
      </h1>

      <p
        style={{
          fontSize: 15,
          color: '#6B6B6B',
          margin: '0 0 36px',
          maxWidth: 340,
          lineHeight: 1.6,
        }}
      >
        Возможно, она была перемещена или удалена
      </p>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '11px 28px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#fff',
            background: '#D39D55',
            textDecoration: 'none',
            border: '2px solid #D39D55',
          }}
        >
          На главную
        </Link>
        <Link
          href="/catalog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '11px 28px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#D39D55',
            background: 'transparent',
            textDecoration: 'none',
            border: '2px solid #D39D55',
          }}
        >
          Каталог
        </Link>
      </div>
    </div>
  )
}
