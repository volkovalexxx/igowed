'use client'

import { useRef, useState } from 'react'
import { Camera } from '@/components/ui/Icons'
import { httpUploadDeps } from './mediaUpload.http'
import { uploadImage } from './mediaUpload'

type AvatarUploadProps = {
  ownerId: string
  initialUrl: string | null
  onUploaded(url: string): Promise<void> | void
}

const FALLBACK =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop'

export function AvatarUpload({ ownerId, initialUrl, onUploaded }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState(initialUrl)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File | undefined) {
    if (!file) return

    setError('')
    setBusy(true)
    try {
      const result = await uploadImage(file, { ownerType: 'vendor', ownerId }, httpUploadDeps)
      setUrl(result.publicUrl)
      await onUploaded(result.publicUrl)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Не удалось загрузить фото')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span
        role="img"
        aria-label="Аватар"
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundImage: `url(${url ?? FALLBACK})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
          border: '1px solid var(--border)',
        }}
      />
      <div style={{ display: 'grid', gap: 6 }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="btn btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: busy ? 0.7 : 1 }}
        >
          <Camera size={15} />
          {busy ? 'Загрузка...' : 'Загрузить фото'}
        </button>
        {error ? (
          <span role="alert" style={{ color: '#e53131', fontSize: 12 }}>
            {error}
          </span>
        ) : (
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>JPG, PNG или WebP, до 10 МБ</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  )
}
