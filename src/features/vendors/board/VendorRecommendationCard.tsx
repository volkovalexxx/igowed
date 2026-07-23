import Link from 'next/link'
import { formatVendorPrice, getVendorImage, getVendorName, getVendorRole } from './vendorBoard.format'
import type { BoardVendor } from './vendorBoard.types'
import styles from './VendorBoardPage.module.css'

export function VendorRecommendationCard({ vendor, index }: { vendor: BoardVendor; index: number }) {
  return (
    <Link className={styles.recommendationCard} href={`/vendor/${vendor.slug}`}>
      <span className={styles.recommendationImage} style={{ backgroundImage: `url(${getVendorImage(vendor, index)})` }} />
      <span>{getVendorRole(vendor).toLowerCase()}</span>
      <strong>{getVendorName(vendor).toUpperCase()}</strong>
      <small>{formatVendorPrice(vendor.pricePerHour)}</small>
    </Link>
  )
}
