'use client';

import React, { useState, useRef } from 'react';
import { Camera, Check, Close, ChevDown } from '@/components/ui/Icons';
import styles from './ProfilePage.module.css';

/* ── Types ──────────────────────────────────────────────────────────────── */

type DisplayMode = 'VERTICAL' | 'HORIZONTAL' | 'SQUARE';
type CardMode = 'VERTICAL' | 'HORIZONTAL' | 'SQUARE';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  activity: string;
  languages: string[];
  login: string;
  country: string;
  cities: string[];
  phone: string;
  phone2: string;
  specializations: string[];
  website: string;
  instagram: string;
  descriptionPhotographer: string;
  descriptionTransport: string;
  displayMode: DisplayMode;
  cardMode: CardMode;
  address: string;
  contactPhone: string;
  bankDetails: string;
  activityType: 'IP' | 'OOO' | 'INDIVIDUAL';
  workFrom: string;
  workTo: string;
}

/* ── Constants ──────────────────────────────────────────────────────────── */

const ACTIVITIES = [
  'Фотограф', 'Видеограф', 'Дизайнер', 'Декоратор',
  'Водитель', 'Диджей', 'Дирижер', 'Организатор',
];

const LANGUAGES = ['Русский', 'English', 'Deutsch', 'Français', 'Español', 'Italiano', 'Português', 'Türkçe'];

const SPECIALIZATIONS = [
  'Свадьба', 'Юбилей', 'Корпоратив', 'День рождения',
  'Выпускной', 'Крестины', 'Помолвка', 'Другое',
];

const SERVICE_TABS = ['Фотограф', 'Транспорт'];

/* ── Shared input style ─────────────────────────────────────────────────── */

const inputStyle: React.CSSProperties = {
  border: '1px solid var(--border-field)',
  borderRadius: 6,
  padding: '9px 12px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  background: '#fff',
  color: 'var(--dark)',
  transition: 'border-color 150ms',
  fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='1.6'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: 32,
  cursor: 'pointer',
};

function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'var(--gold)';
}
function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'var(--border-field)';
}

/* ── Section header ─────────────────────────────────────────────────────── */

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h2 className={styles.sectionHeader}>{children}</h2>;
}

/* ── Field label ────────────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return <label className={styles.fieldLabel}>{children}</label>;
}

/* ── Grid 2col ──────────────────────────────────────────────────────────── */

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid2}>{children}</div>;
}

/* ── Multi-select tags ──────────────────────────────────────────────────── */

function MultiTagSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          ...inputStyle,
          display: 'flex', flexWrap: 'wrap', gap: 4,
          minHeight: 40, cursor: 'pointer', alignItems: 'center',
          paddingRight: 32,
        }}
      >
        {value.length === 0 && (
          <span style={{ color: 'var(--muted)' }}>{placeholder ?? 'Выберите...'}</span>
        )}
        {value.map((v) => (
          <span key={v} style={{
            background: 'var(--gold-soft)', color: 'var(--gold)',
            borderRadius: 4, padding: '2px 6px', fontSize: 12,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            {v}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggle(v); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: 'var(--gold)' }}
            >
              <Close size={10} />
            </button>
          </span>
        ))}
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)' }}>
          <ChevDown size={16} />
        </span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: '#fff', border: '1px solid var(--border)',
          borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          marginTop: 4, overflow: 'hidden',
        }}>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                padding: '9px 14px', fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: value.includes(opt) ? 'var(--gold-soft)' : '#fff',
                color: value.includes(opt) ? 'var(--gold)' : 'var(--dark)',
              }}
              onMouseEnter={(e) => { if (!value.includes(opt)) (e.currentTarget as HTMLElement).style.background = 'var(--paper)'; }}
              onMouseLeave={(e) => { if (!value.includes(opt)) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
            >
              {opt}
              {value.includes(opt) && <Check size={14} style={{ color: 'var(--gold)' }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Display mode preview card ──────────────────────────────────────────── */

function DisplayModeCard({
  mode,
  label,
  selected,
  onClick,
  variant,
}: {
  mode: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  variant: 'gallery' | 'card';
}) {
  const previewContent = () => {
    if (variant === 'gallery') {
      if (mode === 'VERTICAL') {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3, height: 52 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ background: '#D5D5D5', borderRadius: 2 }} />)}
          </div>
        );
      }
      if (mode === 'HORIZONTAL') {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, height: 52 }}>
            {[0, 1].map((i) => <div key={i} style={{ background: '#D5D5D5', borderRadius: 2 }} />)}
          </div>
        );
      }
      if (mode === 'SQUARE') {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 3, height: 52 }}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ background: '#D5D5D5', borderRadius: 2 }} />)}
          </div>
        );
      }
    } else {
      // card variant
      if (mode === 'VERTICAL') {
        return (
          <div style={{ height: 52 }}>
            <div style={{ background: '#D5D5D5', borderRadius: 2, height: 36, marginBottom: 4 }} />
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ background: '#E5E5E5', borderRadius: 2, height: 10, flex: 2 }} />
              <div style={{ background: '#E5E5E5', borderRadius: 2, height: 10, flex: 1 }} />
            </div>
          </div>
        );
      }
      if (mode === 'HORIZONTAL') {
        return (
          <div style={{ height: 52, display: 'flex', gap: 4 }}>
            <div style={{ background: '#D5D5D5', borderRadius: 2, width: 60 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{ background: '#E5E5E5', borderRadius: 2, height: 10 }} />
              <div style={{ background: '#E5E5E5', borderRadius: 2, height: 8, width: '60%' }} />
            </div>
          </div>
        );
      }
      if (mode === 'SQUARE') {
        return (
          <div style={{ height: 52 }}>
            <div style={{ background: '#D5D5D5', borderRadius: 2, height: 40, marginBottom: 4, width: '100%' }} />
            <div style={{ background: '#E5E5E5', borderRadius: 2, height: 8, width: '70%' }} />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <label
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer',
        padding: 14, borderRadius: 8,
        border: `2px solid ${selected ? 'var(--gold)' : 'var(--border)'}`,
        background: selected ? 'var(--gold-soft)' : '#fff',
        transition: '150ms ease',
        userSelect: 'none',
      }}
    >
      <div style={{ flex: 1 }}>
        {previewContent()}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%',
          border: `2px solid ${selected ? 'var(--gold)' : 'var(--border)'}`,
          background: selected ? 'var(--gold)' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: '150ms',
          flexShrink: 0,
        }}>
          {selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
        </div>
        <span style={{ fontSize: 13, fontWeight: selected ? 600 : 400, color: selected ? 'var(--gold)' : 'var(--dark)' }}>
          {label}
        </span>
      </div>
    </label>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */

export default function DashboardProfilePage() {
  const [form, setForm] = useState<ProfileFormData>({
    firstName: 'Анна',
    lastName: 'Смирнова',
    activity: 'Фотограф',
    languages: ['Русский', 'English'],
    login: 'anna.photo',
    country: 'Россия',
    cities: ['Москва'],
    phone: '+7 (926) 123-45-67',
    phone2: '',
    specializations: ['Свадьба', 'Юбилей', 'Корпоратив'],
    website: 'anna-photo.ru',
    instagram: '@anna.photo',
    descriptionPhotographer: 'Профессиональный свадебный фотограф с 8-летним опытом.',
    descriptionTransport: '',
    displayMode: 'VERTICAL',
    cardMode: 'VERTICAL',
    address: 'г. Москва, ул. Тверская, 15',
    contactPhone: '+7 (926) 123-45-67',
    bankDetails: 'ИП Смирнова А.В. | ИНН 7701234567',
    activityType: 'IP',
    workFrom: '10:00',
    workTo: '20:00',
  });

  const [cityInput, setCityInput] = useState('');
  const [activeServiceTab, setActiveServiceTab] = useState(0);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addCity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && cityInput.trim()) {
      e.preventDefault();
      if (!form.cities.includes(cityInput.trim())) {
        set('cities', [...form.cities, cityInput.trim()]);
      }
      setCityInput('');
    }
  };
  const removeCity = (c: string) => set('cities', form.cities.filter((ci) => ci !== c));

  const toggleSpec = (s: string) => {
    set('specializations', form.specializations.includes(s)
      ? form.specializations.filter((x) => x !== s)
      : [...form.specializations, s]);
  };

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', margin: 0 }}>Профиль подрядчика</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 13 }}>Управляйте публичным профилем и настройками</p>
        </div>
        <a href="/vendor/anna-photographer" target="_blank" style={{
          fontSize: 13, color: 'var(--gold)', border: '1px solid var(--gold)',
          borderRadius: 6, padding: '7px 14px', textDecoration: 'none',
          transition: '150ms',
        }}>
          Просмотр профиля →
        </a>
      </div>

      {/* ── Section 1: General ── */}
      <div className={styles.section}>
        <div className={styles.sectionTop}>
          <SectionHeader>Общая информация</SectionHeader>
          <button className="btn btn-gold btn-sm" style={{ flexShrink: 0, marginTop: -4 }}>
            → PRO
          </button>
        </div>

        {/* Avatar */}
        <div className={styles.avatarRow}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--gold-soft)',
              overflow: 'hidden', border: '3px solid var(--gold)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
                alt="Аватар"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <button style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--gold)', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Camera size={12} style={{ color: '#fff' }} />
            </button>
          </div>
          <div>
            <button style={{
              fontSize: 13, color: 'var(--gold)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'inherit',
            }}>
              <Camera size={14} />
              Изменить фото
            </button>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>JPG, PNG — до 5 МБ</div>
          </div>
        </div>

        {/* Form grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1: Name */}
          <Grid2>
            <div>
              <Label>Имя</Label>
              <input
                style={inputStyle}
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div>
              <Label>Фамилия</Label>
              <input
                style={inputStyle}
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          </Grid2>

          {/* Row 2: Activity + Languages */}
          <Grid2>
            <div>
              <Label>Деятельность</Label>
              <div style={{ position: 'relative' }}>
                <select
                  style={selectStyle}
                  value={form.activity}
                  onChange={(e) => set('activity', e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                >
                  {ACTIVITIES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Владение языками</Label>
              <MultiTagSelect
                options={LANGUAGES}
                value={form.languages}
                onChange={(v) => set('languages', v)}
                placeholder="Выберите языки"
              />
            </div>
          </Grid2>

          {/* Row 3: Login with service tags */}
          <div>
            <Label>Логин</Label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingLeft: 12 }}
                value={form.login}
                onChange={(e) => set('login', e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {['Фотограф', 'Транспорт'].map((tag) => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'var(--gold-soft)', color: 'var(--gold)',
                  borderRadius: 4, padding: '3px 8px', fontSize: 12, fontWeight: 500,
                }}>
                  {tag}
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--gold)', lineHeight: 1 }}>
                    <span style={{ fontSize: 11 }}>ⓘ</span>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Row 4: Country + Cities */}
          <Grid2>
            <div>
              <Label>Страна</Label>
              <input
                style={inputStyle}
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div>
              <Label>Город (несколько)</Label>
              <div style={{
                ...inputStyle,
                display: 'flex', flexWrap: 'wrap', gap: 4,
                minHeight: 40, alignItems: 'center', padding: '5px 10px',
              }}>
                {form.cities.map((c) => (
                  <span key={c} style={{
                    background: 'var(--gold-soft)', color: 'var(--gold)',
                    borderRadius: 4, padding: '2px 6px', fontSize: 12,
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    {c}
                    <button
                      type="button"
                      onClick={() => removeCity(c)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--gold)', lineHeight: 1 }}
                    >
                      <Close size={10} />
                    </button>
                  </span>
                ))}
                <input
                  style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, minWidth: 80, background: 'transparent', fontFamily: 'inherit' }}
                  placeholder="Добавить город..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={addCity}
                />
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Enter для добавления</div>
            </div>
          </Grid2>

          {/* Row 5: Phone + Specializations */}
          <Grid2>
            <div>
              <Label>Телефон</Label>
              <div style={{ display: 'flex', gap: 0 }}>
                <div style={{
                  border: '1px solid var(--border-field)', borderRight: 'none',
                  borderRadius: '6px 0 0 6px', padding: '9px 10px',
                  background: 'var(--paper)', fontSize: 14,
                  display: 'flex', alignItems: 'center', gap: 4,
                  color: 'var(--dark)', flexShrink: 0,
                }}>
                  🇷🇺 +7
                </div>
                <input
                  style={{ ...inputStyle, borderRadius: '0 6px 6px 0', flex: 1 }}
                  value={form.phone.replace(/^\+7\s?/, '')}
                  onChange={(e) => set('phone', '+7 ' + e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  placeholder="(926) 000-00-00"
                />
              </div>
            </div>
            <div>
              <Label>Специализация</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SPECIALIZATIONS.map((s) => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13 }}>
                    <div
                      onClick={() => toggleSpec(s)}
                      style={{
                        width: 16, height: 16, borderRadius: 3,
                        border: `1.5px solid ${form.specializations.includes(s) ? 'var(--gold)' : 'var(--border-field)'}`,
                        background: form.specializations.includes(s) ? 'var(--gold)' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: '150ms', cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      {form.specializations.includes(s) && <Check size={10} style={{ color: '#fff' }} />}
                    </div>
                    <span onClick={() => toggleSpec(s)}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </Grid2>

          {/* Phone 2 */}
          <div className={styles.halfField}>
            <Label>Телефон 2</Label>
            <input
              style={inputStyle}
              value={form.phone2}
              onChange={(e) => set('phone2', e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
              placeholder="+7 (000) 000-00-00"
            />
          </div>

          {/* Row 6: Website + Instagram */}
          <Grid2>
            <div>
              <Label>Сайт</Label>
              <input
                style={inputStyle}
                value={form.website}
                onChange={(e) => set('website', e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
                placeholder="yoursite.ru"
              />
            </div>
            <div>
              <Label>Инстаграм</Label>
              <input
                style={inputStyle}
                value={form.instagram}
                onChange={(e) => set('instagram', e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
                placeholder="@username"
              />
            </div>
          </Grid2>

          {/* Description with service tabs */}
          <div>
            <Label>Описание услуги</Label>
            {/* Service tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 0 }}>
              {SERVICE_TABS.map((tab, idx) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveServiceTab(idx)}
                  style={{
                    padding: '7px 16px', fontSize: 13,
                    fontWeight: activeServiceTab === idx ? 600 : 400,
                    color: activeServiceTab === idx ? 'var(--gold)' : 'var(--muted)',
                    background: 'none', border: 'none',
                    borderBottom: activeServiceTab === idx ? '2px solid var(--gold)' : '2px solid transparent',
                    cursor: 'pointer', marginBottom: -1,
                    fontFamily: 'inherit',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <textarea
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: 100,
                borderRadius: '0 0 6px 6px',
                borderTop: 'none',
              }}
              rows={4}
              value={activeServiceTab === 0 ? form.descriptionPhotographer : form.descriptionTransport}
              onChange={(e) => set(activeServiceTab === 0 ? 'descriptionPhotographer' : 'descriptionTransport', e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
              placeholder="Расскажите о своих услугах..."
            />
          </div>
        </div>
      </div>

      {/* ── Section 2: Gallery display mode ── */}
      <div className={styles.section}>
        <SectionHeader>Отображение фото в галерее профиля</SectionHeader>
        <div className={styles.cardsGrid}>
          {[
            { mode: 'VERTICAL' as DisplayMode, label: 'Вертикальные' },
            { mode: 'HORIZONTAL' as DisplayMode, label: 'Горизонтальные' },
            { mode: 'SQUARE' as DisplayMode, label: 'Квадратные' },
          ].map(({ mode, label }) => (
            <DisplayModeCard
              key={mode}
              mode={mode}
              label={label}
              selected={form.displayMode === mode}
              onClick={() => set('displayMode', mode)}
              variant="gallery"
            />
          ))}
        </div>
      </div>

      {/* ── Section 3: Card display mode ── */}
      <div className={styles.section}>
        <SectionHeader>Отображение карточек на странице профиля</SectionHeader>
        <div className={styles.cardsGrid}>
          {[
            { mode: 'VERTICAL' as CardMode, label: 'Вертикальные' },
            { mode: 'HORIZONTAL' as CardMode, label: 'Горизонтальные' },
            { mode: 'SQUARE' as CardMode, label: 'Квадратные' },
          ].map(({ mode, label }) => (
            <DisplayModeCard
              key={mode}
              mode={mode}
              label={label}
              selected={form.cardMode === mode}
              onClick={() => set('cardMode', mode)}
              variant="card"
            />
          ))}
        </div>
      </div>

      {/* ── Section 4: Contacts ── */}
      <div className={styles.section}>
        <SectionHeader>Контакты</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Address */}
          <div>
            <Label>Адрес</Label>
            <input
              style={inputStyle}
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
              placeholder="г. Москва, ул. ..."
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Телефон</Label>
            <input
              style={inputStyle}
              value={form.contactPhone}
              onChange={(e) => set('contactPhone', e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* Bank details */}
          <div>
            <Label>Реквизиты</Label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              rows={3}
              value={form.bankDetails}
              onChange={(e) => set('bankDetails', e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
              placeholder="ИНН, расчётный счёт, банк..."
            />
          </div>

          {/* Activity type */}
          <div>
            <Label>Вид деятельности</Label>
            <div className={styles.radioRow}>
              {[
                { value: 'IP', label: 'ИП' },
                { value: 'OOO', label: 'ООО' },
                { value: 'INDIVIDUAL', label: 'Физическое лицо' },
              ].map(({ value, label }) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 14 }}>
                  <div
                    onClick={() => set('activityType', value as ProfileFormData['activityType'])}
                    style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: `2px solid ${form.activityType === value ? 'var(--gold)' : 'var(--border-field)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: '150ms', flexShrink: 0,
                    }}
                  >
                    {form.activityType === value && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
                    )}
                  </div>
                  <span onClick={() => set('activityType', value as ProfileFormData['activityType'])}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Working hours */}
          <div>
            <Label>Время работы</Label>
            <div className={styles.timeRow}>
              <input
                type="time"
                style={{ ...inputStyle, width: 130 }}
                value={form.workFrom}
                onChange={(e) => set('workFrom', e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <span style={{ color: 'var(--muted)', fontSize: 14 }}>—</span>
              <input
                type="time"
                style={{ ...inputStyle, width: 130 }}
                value={form.workTo}
                onChange={(e) => set('workTo', e.target.value)}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{
            height: 200, borderRadius: 8,
            background: 'var(--paper)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)', fontSize: 14,
          }}>
            Карта
          </div>
        </div>
      </div>

      {/* ── Save button ── */}
      <div style={{ paddingBottom: 40 }}>
        <button
          onClick={handleSave}
          className="btn btn-gold"
          style={{ width: '100%', padding: '13px 24px', fontSize: 15, fontWeight: 600, borderRadius: 8 }}
        >
          {saved
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}><Check size={16} /> Сохранено!</span>
            : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  );
}
