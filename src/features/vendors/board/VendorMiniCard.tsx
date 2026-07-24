import Link from 'next/link'
import { getVendorImage, getVendorName, getVendorRole } from './vendorBoard.format'
import type { BoardVendor } from './vendorBoard.types'
import styles from './VendorBoardPage.module.css'

type VendorMiniCardProps = {
  vendor: BoardVendor
  index: number
  removeLabel: string
}

export function VendorMiniCard({ vendor, index, removeLabel }: VendorMiniCardProps) {
  const name = getVendorName(vendor)

  return (
    <article className={styles.vendorCard}>
      <div className={styles.cardTop}>
        <label aria-label={`Выбрать подрядчика: ${name}`}>
          <input type="checkbox" />
        </label>
        <strong>{getVendorRole(vendor).toUpperCase()}</strong>
        <button type="button" aria-label={`${removeLabel}: ${name}`}>
          ×
        </button>
      </div>
      <div className={styles.vendorBody}>
        <h3>{name}</h3>
        <p>@{vendor.username}</p>
        <span className={styles.avatarWrap}>
          <span className={styles.vendorAvatar} style={{ backgroundImage: `url(${getVendorImage(vendor, index)})` }} />
          {vendor.isPro ? <span className={styles.pro}>PRO</span> : null}
        </span>
        <div className={styles.rating}>
          <span>★ ★ ★ ★ ☆</span>
          <b>{vendor.rating.toFixed(1)}</b>
        </div>
        <Link className={styles.profileButton} href={`/vendor/${vendor.slug}`}>
          Перейти в профиль
        </Link>
        <Link className={styles.messageButton} href={`/dashboard/messages?to=${vendor.userId}`}>
          Отправить сообщение
        </Link>
      </div>
    </article>
  )
}
