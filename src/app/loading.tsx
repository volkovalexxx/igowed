import React from 'react';

/* ── Shimmer base class shared across skeletons ──────────────────────────── */
// We use Tailwind's animate-pulse for the shimmer effect.

export default function Loading() {
  return (
    <div
      className="animate-pulse"
      style={{
        minHeight: '100vh',
        background: '#F4F4F4',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
      aria-label="Загрузка..."
      role="status"
    >
      {/* ── Skeleton Header ─────────────────────────────────────────── */}
      <div
        style={{
          height: 60,
          background: '#fff',
          borderBottom: '1px solid #E5E5E5',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 24,
        }}
      >
        {/* Logo placeholder */}
        <div
          style={{
            width: 120,
            height: 20,
            borderRadius: 6,
            background: '#E5E5E5',
            flexShrink: 0,
          }}
        />

        {/* Nav link placeholders */}
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          {[72, 80, 64, 56, 48].map((w, i) => (
            <div
              key={i}
              style={{
                width: w,
                height: 14,
                borderRadius: 4,
                background: '#EBEBEB',
              }}
            />
          ))}
        </div>

        {/* Right-side button placeholder */}
        <div
          style={{
            width: 148,
            height: 34,
            borderRadius: 8,
            background: '#E5E5E5',
            flexShrink: 0,
          }}
        />

        {/* Icon placeholders */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[36, 36, 36].map((_, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#EBEBEB',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Skeleton Hero ────────────────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          height: 480,
          background: '#E5E5E5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '0 24px',
        }}
      >
        {/* Hero headline */}
        <div
          style={{
            width: '40%',
            maxWidth: 480,
            height: 40,
            borderRadius: 8,
            background: '#D8D8D8',
          }}
        />
        {/* Hero subtitle */}
        <div
          style={{
            width: '28%',
            maxWidth: 320,
            height: 20,
            borderRadius: 6,
            background: '#D8D8D8',
          }}
        />
        {/* Hero button placeholder */}
        <div
          style={{
            width: 160,
            height: 44,
            borderRadius: 8,
            background: '#D0C0A8',
            marginTop: 8,
          }}
        />
      </div>

      {/* ── Skeleton Section Title ────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: '48px auto 24px',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 200,
            height: 28,
            borderRadius: 6,
            background: '#E0E0E0',
          }}
        />
        <div
          style={{
            width: 320,
            height: 16,
            borderRadius: 4,
            background: '#E8E8E8',
          }}
        />
      </div>

      {/* ── Skeleton Grid: 4 cards ────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px 64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid #E5E5E5',
            }}
          >
            {/* Card image placeholder */}
            <div
              style={{
                width: '100%',
                height: 200,
                background: '#E5E5E5',
              }}
            />
            {/* Card body */}
            <div style={{ padding: '16px' }}>
              {/* Title */}
              <div
                style={{
                  width: '75%',
                  height: 18,
                  borderRadius: 4,
                  background: '#E8E8E8',
                  marginBottom: 10,
                }}
              />
              {/* Subtitle */}
              <div
                style={{
                  width: '55%',
                  height: 14,
                  borderRadius: 4,
                  background: '#EEEEEE',
                  marginBottom: 14,
                }}
              />
              {/* Meta row */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div
                  style={{
                    width: 60,
                    height: 12,
                    borderRadius: 3,
                    background: '#EEEEEE',
                  }}
                />
                <div
                  style={{
                    width: 80,
                    height: 12,
                    borderRadius: 3,
                    background: '#EEEEEE',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
