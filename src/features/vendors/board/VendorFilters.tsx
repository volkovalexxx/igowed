import Link from 'next/link'
import { vendorFilterGroups } from './vendorBoard.data'
import styles from './VendorBoardPage.module.css'

export function VendorFilters({ label }: { label: string }) {
  return (
    <aside className={styles.filters} aria-label={label}>
      <label className={styles.searchBox}>
        <span hidden>Поиск услуги</span>
        <input placeholder="Название услуги..." />
        <span>⌕</span>
      </label>
      <nav className={styles.categoryList} aria-label="Категории">
        <Link href="#">Все категории</Link>
        <Link href="#">Организация мероприятий⌄</Link>
        <Link href="#">Ведение мероприятий⌄</Link>
      </nav>
      {vendorFilterGroups.map((group, groupIndex) => (
        <section className={styles.filterGroup} key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map((item, index) => (
            <label className={styles.switchRow} key={item}>
              <span className={`${styles.switch} ${groupIndex === 0 && index === 0 ? styles.switchOn : ''}`} />
              <span>{item}</span>
            </label>
          ))}
        </section>
      ))}
    </aside>
  )
}
