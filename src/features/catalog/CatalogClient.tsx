'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import VendorCard from '@/components/ui/VendorCard';
import { Search, Grid, List, ChevDown } from '@/components/ui/Icons';
import {
  CATALOG_CATEGORIES,
  SPECIALIST_TYPES,
  BANNER_ADS,
  VIDEO_TUTORIALS,
  BannerAd,
} from '@/data/catalogData';
import { filterAndSortVendors } from '@/features/catalog/catalogFilter';
import type { CatalogSortOption, CatalogVendor } from '@/features/catalog/catalogVendor.types';

/* ── Toggle switch ───────────────────────────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-checked={on}
      role="switch"
      style={{
        width: 40,
        height: 22,
        borderRadius: 999,
        border: 'none',
        background: on ? 'var(--gold)' : '#D1D1D1',
        position: 'relative',
        transition: 'background 180ms',
        flexShrink: 0,
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 180ms',
          display: 'block',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

/* ── Full-width banner insert ────────────────────────────────────────── */
function BannerInsert({ banner }: { banner: BannerAd }) {
  return (
    <a
      href={banner.link}
      className="block relative overflow-hidden"
      style={{ borderRadius: 10, height: 120 }}
    >
      <img
        src={banner.image}
        alt={banner.title}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 flex items-center justify-between px-6"
        style={{ background: 'rgba(20,20,20,0.52)' }}
      >
        <span className="font-semibold text-white" style={{ fontSize: 18 }}>
          {banner.title}
        </span>
        <span
          className="btn btn-gold btn-pill btn-sm"
          style={{ fontSize: 13 }}
        >
          Перейти »
        </span>
      </div>
    </a>
  );
}

/* ── Sidebar banner tile ─────────────────────────────────────────────── */
function SidebarBanner({ banner }: { banner: BannerAd }) {
  return (
    <a
      href={banner.link}
      className="block relative overflow-hidden"
      style={{ borderRadius: 8, height: 90, marginBottom: 10 }}
    >
      <img
        src={banner.image}
        alt={banner.title}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 flex flex-col justify-end p-3"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 60%, transparent)' }}
      >
        <span className="text-white font-medium block" style={{ fontSize: 12, lineHeight: 1.3, marginBottom: 4 }}>
          {banner.title}
        </span>
        <span
          className="btn btn-gold btn-pill"
          style={{ fontSize: 11, padding: '3px 10px', alignSelf: 'flex-start' }}
        >
          Перейти »
        </span>
      </div>
    </a>
  );
}

/* ── Video tutorial card ─────────────────────────────────────────────── */
function VideoCard({ tutorial }: { tutorial: (typeof VIDEO_TUTORIALS)[0] }) {
  return (
    <div
      className="shrink-0 overflow-hidden bg-white cursor-pointer group"
      style={{ width: 200, borderRadius: 10, border: '1px solid var(--border)' }}
    >
      <div className="relative" style={{ height: 112 }}>
        <img src={tutorial.thumb} alt={tutorial.title} className="w-full h-full object-cover" />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex items-center justify-center group-hover:scale-105 transition-transform"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.82)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 2L12 7L3 12V2Z" fill="var(--dark)" />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <p
          className="font-medium leading-snug"
          style={{ fontSize: 12, color: 'var(--ink)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {tutorial.title}
        </p>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────── */

type SortOption = CatalogSortOption;

export function CatalogClient({ vendors }: { vendors: CatalogVendor[] }) {
  /* view / layout */
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  /* top-bar filters */
  const [citySearch, setCitySearch] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  /* sidebar left */
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('photo');
  const [categoryOn, setCategoryOn] = useState<Record<string, boolean>>({ photo: true });
  const [activeSubCat, setActiveSubCat] = useState<string>('photo-wedding');
  const [allSpecialistsOn, setAllSpecialistsOn] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('all');

  /* sidebar right */
  const [allDatesOn, setAllDatesOn] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'any' | '5' | '4' | '3'>('any');

  /* load more */
  const [visibleCount, setVisibleCount] = useState(5);

  /* ── Filtering & sorting ── */
  const filtered = useMemo(
    () => filterAndSortVendors(vendors, { searchText, priceFrom, priceTo, ratingFilter, sortBy }),
    [vendors, searchText, priceFrom, priceTo, ratingFilter, sortBy],
  );

  const visible = filtered.slice(0, visibleCount);

  const sortLabels: Record<SortOption, string> = {
    rating:     'По рейтингу',
    popular:    'По популярности',
    price_asc:  'По возрастанию цены',
    price_desc: 'По убыванию цены',
  };

  /* ── Category toggle handler ── */
  function handleCategoryClick(catId: string) {
    setActiveCategory(catId);
    setCategoryOn((prev) => ({ ...prev, [catId]: !prev[catId] }));
  }

  /* ── Apply filters (right sidebar) ── */
  function handleApply() {
    setVisibleCount(5); // reset pagination when filters applied
  }

  /* ── Reset all ── */
  function handleResetAll() {
    setCitySearch('');
    setSearchText('');
    setPriceFrom('');
    setPriceTo('');
    setRatingFilter('any');
    setAllDatesOn(true);
    setDateFrom('');
    setDateTo('');
    setSelectedSpecialist('all');
    setAllSpecialistsOn(true);
    setSortBy('rating');
    setVisibleCount(5);
  }

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 bg-white"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="container flex items-center gap-3"
          style={{ height: 56, flexWrap: 'nowrap', overflowX: 'auto' }}
        >
          {/* Left: event type pill */}
          <button
            className="btn btn-outline btn-pill btn-sm flex items-center gap-1 shrink-0"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            Свадьба <ChevDown size={14} />
          </button>

          {/* Center: view mode toggle */}
          <div className="flex items-center gap-1 mx-auto shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className="w-8 h-8 flex items-center justify-center rounded transition-colors"
              style={{
                background: viewMode === 'grid' ? 'var(--gold)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}
              aria-label="Сетка"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="w-8 h-8 flex items-center justify-center rounded transition-colors"
              style={{
                background: viewMode === 'list' ? 'var(--gold)' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}
              aria-label="Список"
            >
              <List size={16} />
            </button>
          </div>

          {/* Right: search + dropdowns */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* City search */}
            <div className="relative">
              <Search
                size={14}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
              />
              <input
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Страна, город"
                style={{
                  height: 34,
                  paddingLeft: 30,
                  paddingRight: 12,
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 13,
                  width: 160,
                  outline: 'none',
                  color: 'var(--ink)',
                }}
              />
            </div>

            {/* Event dropdown */}
            <button
              className="btn btn-outline btn-sm flex items-center gap-1"
              style={{ fontSize: 13 }}
            >
              Свадьба <ChevDown size={13} />
            </button>

            {/* Filter button */}
            <button
              className="btn btn-outline btn-sm flex items-center gap-1"
              style={{ fontSize: 13 }}
            >
              Фильтр <ChevDown size={13} />
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu((v) => !v)}
                className="btn btn-outline btn-sm flex items-center gap-1"
                style={{ fontSize: 13 }}
              >
                {sortLabels[sortBy]} <ChevDown size={13} />
              </button>
              {showSortMenu && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white z-40"
                  style={{ border: '1px solid var(--border)', borderRadius: 8, minWidth: 210, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                >
                  {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortBy(key); setShowSortMenu(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#F4F4F4] transition-colors"
                      style={{
                        fontSize: 13,
                        color: sortBy === key ? 'var(--gold)' : 'var(--ink)',
                        fontWeight: sortBy === key ? 600 : 400,
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={handleResetAll}
              style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Сбросить всё
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>

        {/* ── Video tutorials row ──────────────────────────────────── */}
        <div
          className="flex gap-3 pb-1 mb-5"
          style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.no-scroll::-webkit-scrollbar { display: none; }`}</style>
          {VIDEO_TUTORIALS.map((vt) => (
            <VideoCard key={vt.id} tutorial={vt} />
          ))}
        </div>

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 mb-4" style={{ fontSize: 13, color: 'var(--muted)' }}>
          <Link href="/" style={{ color: 'var(--muted)' }} className="hover:underline">Главная</Link>
          <span>/</span>
          <a href="/catalog" style={{ color: 'var(--muted)' }} className="hover:underline">Каталог</a>
          <span>/</span>
          <a href="/catalog/fotosyomka" style={{ color: 'var(--muted)' }} className="hover:underline">Фотосъёмка</a>
          <span>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Свадебный фотограф</span>
        </nav>

        {/* ── 3-column layout ──────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '240px 1fr 220px',
            gap: 20,
            alignItems: 'start',
          }}
        >

          {/* ── LEFT SIDEBAR ──────────────────────────────────────── */}
          <aside style={{ position: 'sticky', top: 76 }}>
            <div
              style={{
                background: '#fff',
                borderRadius: 10,
                border: '1px solid var(--border)',
                padding: 16,
              }}
            >
              {/* Search input */}
              <div className="relative mb-4">
                <Search
                  size={14}
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
                />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Название услуги..."
                  style={{
                    width: '100%',
                    height: 36,
                    paddingLeft: 32,
                    paddingRight: 10,
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    fontSize: 13,
                    outline: 'none',
                    color: 'var(--ink)',
                  }}
                />
              </div>

              {/* Categories */}
              <div className="mb-4">
                <p
                  className="font-semibold mb-2"
                  style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}
                >
                  Все категории
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {CATALOG_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const isOn = !!categoryOn[cat.id];
                    return (
                      <li key={cat.id} style={{ marginBottom: 2 }}>
                        <div
                          className="flex items-center justify-between rounded px-2 py-1.5 cursor-pointer"
                          style={{
                            background: isActive ? 'rgba(211,157,85,0.08)' : 'transparent',
                          }}
                          onClick={() => handleCategoryClick(cat.id)}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color: isActive ? 'var(--gold)' : 'var(--ink)',
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {cat.name}
                          </span>
                          {cat.children && (
                            <Toggle on={isOn} onChange={() => handleCategoryClick(cat.id)} />
                          )}
                        </div>

                        {/* Sub-items */}
                        {cat.children && isActive && isOn && (
                          <ul style={{ listStyle: 'none', margin: 0, padding: '2px 0 4px 12px' }}>
                            {cat.children.map((child) => {
                              const isChildActive = activeSubCat === child.id;
                              return (
                                <li
                                  key={child.id}
                                  onClick={(e) => { e.stopPropagation(); setActiveSubCat(child.id); }}
                                  className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer"
                                  style={{ background: isChildActive ? 'rgba(211,157,85,0.1)' : 'transparent' }}
                                >
                                  {/* radio dot */}
                                  <span
                                    style={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      border: '2px solid',
                                      borderColor: isChildActive ? 'var(--gold)' : '#ccc',
                                      background: isChildActive ? 'var(--gold)' : 'transparent',
                                      flexShrink: 0,
                                      display: 'inline-block',
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontSize: 12,
                                      color: isChildActive ? 'var(--gold)' : 'var(--ink)',
                                      fontWeight: isChildActive ? 600 : 400,
                                    }}
                                  >
                                    {child.name}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Separator */}
              <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

              {/* Specialists */}
              <div className="mb-4">
                <p
                  className="font-semibold mb-2"
                  style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}
                >
                  Специалисты
                </p>
                {/* All toggle */}
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: allSpecialistsOn ? 600 : 400 }}>
                    Все специалисты
                  </span>
                  <Toggle
                    on={allSpecialistsOn}
                    onChange={() => {
                      setAllSpecialistsOn((v) => !v);
                      setSelectedSpecialist('all');
                    }}
                  />
                </div>
                {/* List */}
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {SPECIALIST_TYPES.slice(1).map((sp) => {
                    const checked = selectedSpecialist === sp.id;
                    return (
                      <li
                        key={sp.id}
                        className="flex items-center gap-2 py-1 cursor-pointer"
                        onClick={() => {
                          setSelectedSpecialist(sp.id);
                          setAllSpecialistsOn(false);
                        }}
                      >
                        {/* checkbox-style radio */}
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: 3,
                            border: '1.5px solid',
                            borderColor: checked ? 'var(--gold)' : '#ccc',
                            background: checked ? 'var(--gold)' : '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {checked && (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3.5 6L6.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span style={{ fontSize: 13, color: checked ? 'var(--gold)' : 'var(--ink)', fontWeight: checked ? 600 : 400 }}>
                          {sp.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Separator */}
              <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

              {/* Sidebar banners */}
              {BANNER_ADS.map((b) => (
                <SidebarBanner key={b.id} banner={b} />
              ))}
            </div>
          </aside>

          {/* ── CENTER CONTENT ────────────────────────────────────── */}
          <main>
            {/* Results header */}
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-bold" style={{ fontSize: 22, color: 'var(--ink)', margin: 0 }}>
                Свадебный фотограф
              </h2>
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>
                {filtered.length} специалистов
              </span>
            </div>

            {/* Vendor list */}
            <div className="flex flex-col gap-3">
              {visible.map((vendor, index) => (
                <React.Fragment key={vendor.id}>
                  <VendorCard vendor={vendor} />
                  {/* Insert banner after every 3rd card */}
                  {(index + 1) % 3 === 0 && BANNER_ADS[(index / 3) % BANNER_ADS.length] && (
                    <BannerInsert banner={BANNER_ADS[Math.floor(index / 3) % BANNER_ADS.length]} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-16"
                style={{ color: 'var(--muted)' }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginBottom: 12, opacity: 0.4 }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p style={{ fontSize: 15 }}>Специалисты не найдены</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Попробуйте изменить параметры фильтрации</p>
              </div>
            )}

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount((v) => v + 5)}
                  className="btn btn-outline btn-pill"
                  style={{ fontSize: 14, padding: '10px 36px' }}
                >
                  Загрузить ещё
                </button>
              </div>
            )}
          </main>

          {/* ── RIGHT SIDEBAR ─────────────────────────────────────── */}
          <aside style={{ position: 'sticky', top: 76 }}>
            <div
              style={{
                background: '#fff',
                borderRadius: 10,
                border: '1px solid var(--border)',
                padding: 16,
              }}
            >

              {/* Рамки (placeholder) */}
              <div className="mb-5">
                <p
                  className="font-semibold mb-2"
                  style={{ fontSize: 13, color: 'var(--ink)' }}
                >
                  Рамки
                </p>
                <div
                  style={{
                    height: 60,
                    borderRadius: 6,
                    border: '1px dashed var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--muted)',
                    fontSize: 12,
                  }}
                >
                  Скоро
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

              {/* Доступные даты */}
              <div className="mb-5">
                <p
                  className="font-semibold mb-2"
                  style={{ fontSize: 13, color: 'var(--ink)' }}
                >
                  Доступные даты
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Все даты</span>
                  <Toggle on={allDatesOn} onChange={() => setAllDatesOn((v) => !v)} />
                </div>
                {!allDatesOn && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="От"
                      style={{
                        width: '100%',
                        height: 34,
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        padding: '0 10px',
                        fontSize: 13,
                        outline: 'none',
                        color: 'var(--ink)',
                      }}
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder="До"
                      style={{
                        width: '100%',
                        height: 34,
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        padding: '0 10px',
                        fontSize: 13,
                        outline: 'none',
                        color: 'var(--ink)',
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

              {/* Стоимость */}
              <div className="mb-5">
                <p
                  className="font-semibold mb-2"
                  style={{ fontSize: 13, color: 'var(--ink)' }}
                >
                  Стоимость <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>RUB/час</span>
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    placeholder="От"
                    min={0}
                    style={{
                      flex: 1,
                      height: 34,
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '0 10px',
                      fontSize: 13,
                      outline: 'none',
                      color: 'var(--ink)',
                      width: 0,
                    }}
                  />
                  <input
                    type="number"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    placeholder="До"
                    min={0}
                    style={{
                      flex: 1,
                      height: 34,
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '0 10px',
                      fontSize: 13,
                      outline: 'none',
                      color: 'var(--ink)',
                      width: 0,
                    }}
                  />
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

              {/* Рейтинг */}
              <div className="mb-5">
                <p
                  className="font-semibold mb-2"
                  style={{ fontSize: 13, color: 'var(--ink)' }}
                >
                  Рейтинг
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {[
                    { value: 'any', label: 'Любой' },
                    { value: '5',   label: '5 и выше' },
                    { value: '4',   label: '4 и выше' },
                    { value: '3',   label: '3 и выше' },
                  ].map((opt) => {
                    const checked = ratingFilter === opt.value;
                    return (
                      <li
                        key={opt.value}
                        className="flex items-center gap-2 py-1 cursor-pointer"
                        onClick={() => setRatingFilter(opt.value as typeof ratingFilter)}
                      >
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            border: '1.5px solid',
                            borderColor: checked ? 'var(--gold)' : '#ccc',
                            background: checked ? 'var(--gold)' : '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {checked && (
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                background: '#fff',
                                display: 'block',
                              }}
                            />
                          )}
                        </span>
                        <span style={{ fontSize: 13, color: checked ? 'var(--gold)' : 'var(--ink)', fontWeight: checked ? 600 : 400 }}>
                          {opt.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />

              {/* Apply button */}
              <button
                onClick={handleApply}
                className="btn btn-gold w-full"
                style={{ borderRadius: 8, fontSize: 14, fontWeight: 600, width: '100%' }}
              >
                Применить
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
