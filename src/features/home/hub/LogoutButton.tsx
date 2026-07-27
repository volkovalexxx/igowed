'use client'

import { signOut } from 'next-auth/react'
import { useState } from 'react'

export function LogoutButton({ className }: { className?: string }) {
  const [busy, setBusy] = useState(false)

  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={() => {
        setBusy(true)
        void signOut({ redirectTo: '/' })
      }}
    >
      {busy ? 'Выход...' : 'Выйти'}
    </button>
  )
}
