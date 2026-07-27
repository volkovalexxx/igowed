'use client'

import { useRef, useState } from 'react'
import { Camera, Close, Plus } from '@/components/ui/Icons'
import { httpUploadDeps } from '@/features/media/upload/mediaUpload.http'
import { uploadImage } from '@/features/media/upload/mediaUpload'
import type { GalleryPhoto } from './gallery.types'
import styles from './GalleryPage.module.css'

type DisplayMode = 'vertical' | 'horizontal' | 'square'

const MODES: { key: DisplayMode; label: string }[] = [
  { key: 'vertical', label: 'Вертикальные' },
  { key: 'horizontal', label: 'Горизонтальные' },
  { key: 'square', label: 'Квадратные' },
]

const ASPECT: Record<DisplayMode, string> = { vertical: '3/4', horizontal: '4/3', square: '1/1' }

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#D39D55' : 'none'} stroke={filled ? '#D39D55' : '#fff'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function PhotoCard({
  photo,
  aspectRatio,
  busy,
  onDelete,
  onSetMain,
}: {
  photo: GalleryPhoto
  aspectRatio: string
  busy: boolean
  onDelete(id: string): void
  onSetMain(id: string): void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{ aspectRatio, outline: '2px solid transparent', opacity: busy ? 0.5 : 1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt="" className="w-full h-full object-cover" />

      {photo.isAvatar ? (
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: 'var(--gold)', fontSize: 10, color: '#fff', fontWeight: 600 }}>
          <StarIcon filled />
          Главное
        </div>
      ) : null}

      <div
        className="absolute inset-0 flex flex-col justify-between p-2 transition-opacity duration-200"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.4) 100%)', opacity: hovered ? 1 : 0 }}
      >
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => onDelete(photo.id)}
            disabled={busy}
            className="flex items-center justify-center w-7 h-7 rounded-full"
            style={{ background: 'rgba(224,44,44,0.85)', color: '#fff' }}
            title="Удалить"
          >
            <Close size={13} />
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSetMain(photo.id)}
            disabled={busy || photo.isAvatar}
            className="flex items-center gap-1 rounded-full px-2 py-1"
            style={{ background: photo.isAvatar ? 'var(--gold)' : 'rgba(255,255,255,0.2)', fontSize: 11, color: '#fff', fontWeight: 500 }}
            title={photo.isAvatar ? 'Главное фото' : 'Сделать главным'}
          >
            <StarIcon filled={photo.isAvatar} />
            {photo.isAvatar ? 'Главное' : 'Сделать главным'}
          </button>
        </div>
      </div>
    </div>
  )
}

async function readJsonOrThrow(response: Response) {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error ?? 'Не удалось обработать фото')
  return payload
}

export function GalleryClient({ vendorId, initialPhotos }: { vendorId: string; initialPhotos: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [mode, setMode] = useState<DisplayMode>('vertical')
  const [busyId, setBusyId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    setError('')
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const { publicUrl } = await uploadImage(file, { ownerType: 'vendor', ownerId: vendorId }, httpUploadDeps)
        const payload = (await readJsonOrThrow(
          await fetch('/api/vendor/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: publicUrl }),
          }),
        )) as { photo?: GalleryPhoto }
        if (payload.photo) {
          const created = payload.photo
          setPhotos((current) => reconcileMain([...current, created], created))
        }
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Не удалось загрузить фото')
    } finally {
      setUploading(false)
    }
  }

  function reconcileMain(list: GalleryPhoto[], maybeMain: GalleryPhoto): GalleryPhoto[] {
    if (!maybeMain.isAvatar) return list
    return list.map((photo) => ({ ...photo, isAvatar: photo.id === maybeMain.id }))
  }

  async function handleDelete(id: string) {
    const previous = photos
    setError('')
    setBusyId(id)
    setPhotos((current) => current.filter((photo) => photo.id !== id))
    try {
      await readJsonOrThrow(await fetch(`/api/vendor/photos/${id}`, { method: 'DELETE' }))
    } catch (deleteError) {
      setPhotos(previous)
      setError(deleteError instanceof Error ? deleteError.message : 'Не удалось удалить фото')
    } finally {
      setBusyId('')
    }
  }

  async function handleSetMain(id: string) {
    const previous = photos
    setError('')
    setBusyId(id)
    setPhotos((current) => current.map((photo) => ({ ...photo, isAvatar: photo.id === id })))
    try {
      await readJsonOrThrow(await fetch(`/api/vendor/photos/${id}`, { method: 'PATCH' }))
    } catch (mainError) {
      setPhotos(previous)
      setError(mainError instanceof Error ? mainError.message : 'Не удалось назначить главное фото')
    } finally {
      setBusyId('')
    }
  }

  const aspect = ASPECT[mode]
  const gridModeClass = { vertical: styles.photoGridVertical, horizontal: styles.photoGridHorizontal, square: styles.photoGridSquare }[mode]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)' }}>Моя галерея</h2>
        <button type="button" className={styles.addButton} disabled={uploading} onClick={() => fileInputRef.current?.click()}>
          <Plus size={15} />
          {uploading ? 'Загрузка...' : 'Добавить фото'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(event) => handleFiles(event.target.files)} />
      </div>

      <div
        className={styles.uploadZone}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          void handleFiles(event.dataTransfer.files)
        }}
      >
        <span style={{ color: 'var(--gold)' }}>
          <Camera size={32} />
        </span>
        <p style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>Перетащите фото сюда или нажмите</p>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>JPG, PNG, WebP — до 10 МБ</p>
      </div>

      {error ? (
        <p role="alert" style={{ margin: '0 0 12px', color: '#e53131', fontSize: 13 }}>
          {error}
        </p>
      ) : null}

      <div className={styles.modeScroller}>
        <div className={styles.modeTabs}>
          {MODES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`${styles.modeTab} ${mode === key ? styles.modeTabActive : ''}`}
              style={{ color: mode === key ? 'var(--dark)' : 'var(--muted)' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <Camera size={40} style={{ color: 'var(--muted)' }} />
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>Галерея пуста. Загрузите ваши фото.</p>
        </div>
      ) : (
        <div className={`${styles.photoGrid} ${gridModeClass}`}>
          {photos.map((photo) => (
            <PhotoCard aspectRatio={aspect} busy={busyId === photo.id} key={photo.id} onDelete={handleDelete} onSetMain={handleSetMain} photo={photo} />
          ))}
        </div>
      )}
    </div>
  )
}
