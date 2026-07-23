import styles from './VendorBoardPage.module.css'

export function VendorBoardToolbar() {
  return (
    <div className={styles.toolbar}>
      <label className={styles.citySearch}>
        <span hidden>Страна, город</span>
        <input placeholder="Страна, город" />
        <span>⌕</span>
      </label>
      <button type="button">Фильтр⌄</button>
      <button type="button">Сортировка⌄</button>
      <button type="button">Сбросить все ⊗</button>
    </div>
  )
}

export function VendorBoardMobileFilters() {
  return (
    <div className={styles.mobileFilters}>
      <button type="button">Страна, город ⌕</button>
      <button type="button">Свадебный фотограф⌄</button>
      <button type="button">Фильтр⌄</button>
      <button type="button">Сортировка⌄</button>
      <button type="button">Сбросить ⊗</button>
    </div>
  )
}
