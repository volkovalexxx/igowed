'use client';

import React, { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const icon = (
  path: React.ReactNode,
  defaultSize = 20,
  opts?: { strokeWidth?: number; fill?: string }
) => {
  const sw = opts?.strokeWidth ?? 1.6;
  const defaultFill = opts?.fill ?? 'none';

  const Icon = ({
    size,
    width,
    height,
    className,
    style,
    ...rest
  }: IconProps) => {
    const w = size ?? width ?? defaultSize;
    const h = size ?? height ?? defaultSize;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={w}
        height={h}
        viewBox="0 0 24 24"
        fill={defaultFill}
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        {...rest}
      >
        {path}
      </svg>
    );
  };
  Icon.displayName = 'Icon';
  return Icon;
};

/* ── Navigation / Search ─────────────────────────────────────────── */

export const Search = icon(
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
);

export const Close = icon(
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
);

export const Arrow = icon(
  <line x1="5" y1="12" x2="19" y2="12" />,
  20,
  { strokeWidth: 1.6 }
);

export const ChevDown = icon(
  <polyline points="6 9 12 15 18 9" />
);

export const ChevRight = icon(
  <polyline points="9 18 15 12 9 6" />
);

export const ChevLeft = icon(
  <polyline points="15 18 9 12 15 6" />
);

/* ── Heart ───────────────────────────────────────────────────────── */

export const Heart = icon(
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
);

export const HeartFilled = ({
  size,
  width,
  height,
  className,
  style,
  ...rest
}: IconProps) => {
  const w = size ?? width ?? 20;
  const h = size ?? height ?? 20;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="var(--gold)"
      stroke="var(--gold)"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      {...rest}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};

/* ── Star ────────────────────────────────────────────────────────── */

export const Star = ({
  size,
  width,
  height,
  className,
  style,
  fill = 'none',
  ...rest
}: IconProps) => {
  const w = size ?? width ?? 20;
  const h = size ?? height ?? 20;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      {...rest}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

/* ── Notifications / Communication ──────────────────────────────── */

export const Bell = icon(
  <>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </>
);

export const Mail = icon(
  <>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </>
);

export const Chat = icon(
  <>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </>
);

export const Phone = icon(
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.36 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
);

export const Globe = icon(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </>
);

/* ── Users / People ──────────────────────────────────────────────── */

export const Users = icon(
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

/* ── Luxury / Wedding ────────────────────────────────────────────── */

export const Diamond = icon(
  <>
    <path d="M6 3h12l4 6-10 13L2 9z" />
    <path d="M2 9h20" />
    <path d="M6 3l4 6M18 3l-4 6" />
  </>
);

/* ── Finance ─────────────────────────────────────────────────────── */

export const Wallet = icon(
  <>
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 3.13V7" />
    <path d="M8 3.13V7" />
    <circle cx="17" cy="13" r="1" fill="currentColor" strokeWidth={0} />
  </>
);

/* ── Trust / Security ────────────────────────────────────────────── */

export const Shield = icon(
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);

export const Verified = icon(
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </>
);

export const Lock = icon(
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>
);

/* ── Analytics ───────────────────────────────────────────────────── */

export const Chart = icon(
  <>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </>
);

/* ── Layout ──────────────────────────────────────────────────────── */

export const Grid = icon(
  <>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </>
);

export const List = icon(
  <>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth={2.5} />
    <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth={2.5} />
    <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth={2.5} />
  </>
);

/* ── Location / Date ─────────────────────────────────────────────── */

export const Pin = icon(
  <>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </>
);

export const Cal = icon(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>
);

/* ── Actions ─────────────────────────────────────────────────────── */

export const Check = icon(
  <polyline points="20 6 9 17 4 12" />
);

export const Share = icon(
  <>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </>
);

export const Bookmark = icon(
  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
);

export const Plus = icon(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
);

export const Camera = icon(
  <>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </>
);
