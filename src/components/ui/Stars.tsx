'use client';

import React from 'react';

interface StarsProps {
  value: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

/* Single star — filled, half, or empty */
function StarSVG({
  type,
  size,
}: {
  type: 'filled' | 'half' | 'empty';
  size: number;
}) {
  const id = React.useId();
  const halfId = `half-${id}`;

  if (type === 'half') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={halfId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="var(--gold)" />
            <stop offset="50%" stopColor="#E5E5E5" />
          </linearGradient>
        </defs>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={`url(#${halfId})`}
          stroke={`url(#${halfId})`}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const fillColor = type === 'filled' ? 'var(--gold)' : '#E5E5E5';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={fillColor}
        stroke={fillColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Stars({
  value,
  size = 14,
  showValue = true,
  reviewCount,
  className = '',
}: StarsProps) {
  // Clamp value between 0 and 5
  const clamped = Math.max(0, Math.min(5, value));

  const stars = Array.from({ length: 5 }, (_, i) => {
    const pos = i + 1;
    if (clamped >= pos) return 'filled';
    if (clamped >= pos - 0.5) return 'half';
    return 'empty';
  }) as Array<'filled' | 'half' | 'empty'>;

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={`Rating: ${clamped} out of 5 stars`}
    >
      <span className="inline-flex items-center gap-0.5">
        {stars.map((type, i) => (
          <StarSVG key={i} type={type} size={size} />
        ))}
      </span>

      {showValue && (
        <span
          className="font-semibold tabular-nums"
          style={{ fontSize: size, color: 'var(--ink)', lineHeight: 1 }}
        >
          {clamped.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span
          style={{
            fontSize: Math.max(10, size - 2),
            color: 'var(--muted)',
            lineHeight: 1,
          }}
        >
          ({reviewCount})
        </span>
      )}
    </span>
  );
}
