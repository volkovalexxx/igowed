import Link from 'next/link'
import type { VendorBoardData } from './server/vendorBoard.service'
import { VendorBoardChrome } from './VendorBoardChrome'
import { VendorBoardMobileFilters, VendorBoardToolbar } from './VendorBoardToolbar'
import { VendorFilters } from './VendorFilters'
import { VendorMessagePanel } from './VendorMessagePanel'
import { VendorMiniCard } from './VendorMiniCard'
import { VendorRecommendationCard } from './VendorRecommendationCard'
import { vendorBoardCopy } from './vendorBoard.data'
import type { VendorBoardKind } from './vendorBoard.types'
import styles from './VendorBoardPage.module.css'

type VendorBoardPageProps = {
  kind: VendorBoardKind
  board: VendorBoardData
}

/**
 * Общий экран для избранного и шорт-листа: макеты `Избранное.png` и `Шорт-лист.png`
 * совпадают, расходятся только заголовком, крошками и активной вкладкой.
 */
export function VendorBoardPage({ kind, board }: VendorBoardPageProps) {
  const copy = vendorBoardCopy[kind]

  return (
    <VendorBoardChrome activeHref={copy.href}>
      <main className={styles.content}>
        <div className={styles.mobileContext}>
          <Link href="/" aria-label="Назад">
            ‹
          </Link>
          <span>{copy.title}</span>
        </div>
        <div className={styles.breadcrumbs}>
          <Link href="/">Главная</Link>
          <span>›</span>
          <span>{copy.title}</span>
        </div>
        <div className={styles.titleRow}>
          <h1>{copy.title}</h1>
          <VendorBoardToolbar />
        </div>
        <VendorBoardMobileFilters />

        <section className={styles.layout}>
          <VendorFilters label={`Фильтры: ${copy.title}`} />
          <div className={styles.results}>
            <VendorMessagePanel />
            {board.vendors.map((vendor, index) => (
              <VendorMiniCard index={index} key={vendor.id} removeLabel={copy.removeLabel} vendor={vendor} />
            ))}
          </div>
        </section>

        <section className={styles.recommendations}>
          <div className={styles.sectionHeader}>
            <h2>Подобрано для вас</h2>
            <Link href="/catalog">Перейти в каталог</Link>
          </div>
          <div className={styles.recommendationGrid}>
            {board.recommended.map((vendor, index) => (
              <VendorRecommendationCard index={index} key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </section>
      </main>
    </VendorBoardChrome>
  )
}
