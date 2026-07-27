'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import type { HeaderViewer } from '@/components/layout/header.helpers';
import Footer from '@/components/layout/Footer';
import { Search } from '@/components/ui/Icons';
import { filterBlogPosts } from '@/features/blog/blog.filter';
import { BLOG_CATEGORIES, type BlogCategory, type BlogListItem } from '@/features/blog/blogPost.types';

/* ── Extended blog data ──────────────────────────────────────────────── */

const CATEGORIES = BLOG_CATEGORIES;
type Category = BlogCategory;

/* ── Blog card ───────────────────────────────────────────────────────── */

function BlogCard({ post }: { post: BlogListItem }) {
  return (
    <article
      className="group flex flex-col rounded-xl overflow-hidden bg-white transition-shadow"
      style={{ border: '1px solid var(--border)' }}
    >
      {/* Image */}
      <a href={`/blog/${post.slug}`} className="block overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </a>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category pill */}
        <span
          className="inline-block self-start rounded-full px-2.5 py-0.5 font-medium"
          style={{
            fontSize: 11,
            background: 'var(--gold-soft)',
            color: 'var(--gold)',
          }}
        >
          {post.cat}
        </span>

        {/* Title */}
        <a href={`/blog/${post.slug}`}>
          <h3
            className="font-semibold leading-snug transition-colors hover:text-[var(--gold)]"
            style={{
              fontSize: 16,
              color: 'var(--ink)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </h3>
        </a>

        {/* Excerpt */}
        <p
          style={{
            fontSize: 13,
            color: 'var(--muted)',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{post.date}</span>
          <a
            href={`/blog/${post.slug}`}
            className="font-medium transition-colors hover:opacity-80"
            style={{ fontSize: 13, color: 'var(--gold)' }}
          >
            Читать →
          </a>
        </div>
      </div>
    </article>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export function BlogListClient({ posts, viewer }: { posts: BlogListItem[]; viewer?: HeaderViewer | null }) {
  const [activeCategory, setActiveCategory] = useState<Category>('Все');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => filterBlogPosts(posts, activeCategory, search), [posts, activeCategory, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <Header activePage="Блог" viewer={viewer} />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="py-14" style={{ background: 'var(--paper)' }}>
          <div className="container flex flex-col items-center text-center gap-5">
            <h1
              className="font-bold"
              style={{ fontSize: 40, color: 'var(--dark)', letterSpacing: '-0.5px' }}
            >
              Блог
            </h1>
            <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 460 }}>
              Советы экспертов, вдохновляющие истории и актуальные тренды свадебной индустрии
            </p>

            {/* Search */}
            <div className="w-full" style={{ maxWidth: 600 }}>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--muted)' }}
                >
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Поиск по блогу..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(8);
                  }}
                  className="w-full outline-none transition-all"
                  style={{
                    paddingLeft: 44,
                    paddingRight: 20,
                    paddingTop: 13,
                    paddingBottom: 13,
                    borderRadius: 999,
                    border: '1px solid var(--border)',
                    fontSize: 14,
                    background: '#fff',
                    color: 'var(--ink)',
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gold)';
                    (e.currentTarget as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(211,157,85,0.12)';
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLInputElement).style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Category tabs ─────────────────────────────────────────── */}
        <section className="py-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setVisibleCount(8);
                    }}
                    className="btn btn-sm btn-pill transition-all"
                    style={{
                      background: isActive ? 'var(--gold)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--ink)',
                      border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`,
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Grid ──────────────────────────────────────────────────── */}
        <section className="py-12">
          <div className="container">
            {visible.length > 0 ? (
              <div
                className="grid gap-6"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                }}
              >
                {visible.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20 gap-3">
                <p style={{ fontSize: 16, color: 'var(--muted)' }}>
                  По вашему запросу ничего не найдено
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-pill btn-sm"
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('Все');
                  }}
                >
                  Сбросить фильтры
                </button>
              </div>
            )}

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  type="button"
                  className="btn btn-outline btn-pill"
                  style={{ padding: '11px 36px', fontSize: 14 }}
                  onClick={() => setVisibleCount((v) => v + 4)}
                >
                  Загрузить ещё
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
