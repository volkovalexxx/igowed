'use client';

import React, { useState, useRef } from 'react';
import { Camera, Plus, Close } from '@/components/ui/Icons';

/* ── Types ───────────────────────────────────────────────────────────── */

type DisplayMode = 'vertical' | 'horizontal' | 'square';

interface Photo {
  id: number;
  src: string;
  isMain: boolean;
  isDragging?: boolean;
}

/* ── Mock photos ─────────────────────────────────────────────────────── */

const INITIAL_PHOTOS: Photo[] = [
  { id: 1,  src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=800&fit=crop', isMain: true },
  { id: 2,  src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop', isMain: false },
  { id: 3,  src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=800&fit=crop', isMain: false },
  { id: 4,  src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=800&fit=crop', isMain: false },
  { id: 5,  src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=800&fit=crop', isMain: false },
  { id: 6,  src: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=800&fit=crop', isMain: false },
  { id: 7,  src: 'https://images.unsplash.com/photo-1544085701-4d1b7e43b7a7?w=600&h=800&fit=crop', isMain: false },
  { id: 8,  src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=800&fit=crop', isMain: false },
  { id: 9,  src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&fit=crop', isMain: false },
  { id: 10, src: 'https://images.unsplash.com/photo-1487530811015-780de78ca5f5?w=600&h=800&fit=crop', isMain: false },
  { id: 11, src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=800&fit=crop', isMain: false },
  { id: 12, src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=800&fit=crop', isMain: false },
];

/* ── Star icon ───────────────────────────────────────────────────────── */

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#D39D55' : 'none'} stroke={filled ? '#D39D55' : '#fff'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/* ── Photo card ──────────────────────────────────────────────────────── */

function PhotoCard({
  photo,
  aspectRatio,
  onDelete,
  onToggleMain,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  photo: Photo;
  aspectRatio: string;
  onDelete: (id: number) => void;
  onToggleMain: (id: number) => void;
  isDragOver: boolean;
  onDragStart: (id: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(photo.id)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(e); }}
      onDrop={() => onDrop(photo.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        aspectRatio,
        outline: isDragOver ? '2px dashed var(--gold)' : '2px solid transparent',
        outlineOffset: 2,
        transition: 'outline 150ms ease',
        opacity: photo.isDragging ? 0.4 : 1,
      }}
    >
      <img
        src={photo.src}
        alt=""
        draggable={false}
        className="w-full h-full object-cover"
      />

      {/* Main badge */}
      {photo.isMain && (
        <div
          className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5"
          style={{ background: 'var(--gold)', fontSize: 10, color: '#fff', fontWeight: 600 }}
        >
          <StarIcon filled />
          Главное
        </div>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-2 transition-opacity duration-200"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.4) 100%)',
          opacity: hovered ? 1 : 0,
        }}
      >
        {/* Top row: drag handle + delete */}
        <div className="flex items-center justify-between">
          {/* Drag handle */}
          <div
            className="flex items-center justify-center w-7 h-7 rounded-md"
            style={{ background: 'rgba(255,255,255,0.2)', cursor: 'grab', fontSize: 16, color: '#fff', lineHeight: 1 }}
            title="Перетащить"
          >
            ⠿
          </div>
          {/* Delete */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
            className="flex items-center justify-center w-7 h-7 rounded-full transition-colors"
            style={{ background: 'rgba(224,44,44,0.85)', color: '#fff' }}
            title="Удалить"
          >
            <Close size={13} />
          </button>
        </div>

        {/* Bottom: star toggle */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleMain(photo.id); }}
            className="flex items-center gap-1 rounded-full px-2 py-1 transition-colors"
            style={{
              background: photo.isMain ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
              fontSize: 11,
              color: '#fff',
              fontWeight: 500,
            }}
            title={photo.isMain ? 'Убрать главное' : 'Сделать главным'}
          >
            <StarIcon filled={photo.isMain} />
            {photo.isMain ? 'Главное' : 'Сделать главным'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [mode, setMode] = useState<DisplayMode>('vertical');
  const [dragSourceId, setDragSourceId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MODES: { key: DisplayMode; label: string }[] = [
    { key: 'vertical',   label: 'Вертикальные' },
    { key: 'horizontal', label: 'Горизонтальные' },
    { key: 'square',     label: 'Квадратные' },
  ];

  const COLS: Record<DisplayMode, number> = { vertical: 3, horizontal: 2, square: 4 };
  const ASPECT: Record<DisplayMode, string> = { vertical: '3/4', horizontal: '4/3', square: '1/1' };

  function handleDelete(id: number) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function handleToggleMain(id: number) {
    setPhotos((prev) =>
      prev.map((p) => ({ ...p, isMain: p.id === id ? !p.isMain : p.isMain && p.id !== id ? false : p.isMain }))
    );
  }

  function handleDragStart(id: number) {
    setDragSourceId(id);
    setPhotos((prev) => prev.map((p) => ({ ...p, isDragging: p.id === id })));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(targetId: number) {
    if (dragSourceId === null || dragSourceId === targetId) {
      setDragSourceId(null);
      setDragOverId(null);
      setPhotos((prev) => prev.map((p) => ({ ...p, isDragging: false })));
      return;
    }
    setPhotos((prev) => {
      const arr = [...prev.map((p) => ({ ...p, isDragging: false }))];
      const sourceIdx = arr.findIndex((p) => p.id === dragSourceId);
      const targetIdx = arr.findIndex((p) => p.id === targetId);
      const [item] = arr.splice(sourceIdx, 1);
      arr.splice(targetIdx, 0, item);
      return arr;
    });
    setDragSourceId(null);
    setDragOverId(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setPhotos((prev) => [
          ...prev,
          { id: Date.now() + i, src, isMain: false },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const cols = COLS[mode];
  const aspect = ASPECT[mode];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)' }}>Моя галерея</h2>
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus size={15} />
          Добавить фото
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload zone */}
      <div
        className="flex flex-col items-center justify-center gap-3 mb-8 rounded-xl cursor-pointer transition-colors"
        style={{
          border: '2px dashed var(--border)',
          padding: '36px 24px',
          background: '#fff',
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files).filter((f) =>
            ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
          );
          files.forEach((file, i) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const src = ev.target?.result as string;
              setPhotos((prev) => [...prev, { id: Date.now() + i, src, isMain: false }]);
            };
            reader.readAsDataURL(file);
          });
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold)';
          (e.currentTarget as HTMLDivElement).style.background = 'var(--gold-soft)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLDivElement).style.background = '#fff';
        }}
      >
        <span style={{ color: 'var(--gold)' }}>
          <Camera size={32} />
        </span>
        <p style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
          Перетащите фото сюда или нажмите
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          Поддерживаемые форматы: JPG, PNG, WebP
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex items-center gap-0 mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        {MODES.map(({ key, label }) => {
          const isActive = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className="px-4 py-2.5 font-medium transition-colors"
              style={{
                fontSize: 13,
                color: isActive ? 'var(--gold)' : 'var(--muted)',
                borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                background: 'transparent',
                marginBottom: -1,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <Camera size={40} style={{ color: 'var(--muted)' }} />
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>Галерея пуста. Загрузите ваши фото.</p>
        </div>
      ) : (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              aspectRatio={aspect}
              onDelete={handleDelete}
              onToggleMain={handleToggleMain}
              isDragOver={dragOverId === photo.id}
              onDragStart={handleDragStart}
              onDragOver={(e) => { e.preventDefault(); setDragOverId(photo.id); }}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}

      {/* Save button */}
      {photos.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="btn btn-gold"
            style={{ minWidth: 180, fontSize: 14 }}
            onClick={handleSave}
          >
            {saved ? '✓ Порядок сохранён' : 'Сохранить порядок'}
          </button>
        </div>
      )}
    </div>
  );
}
