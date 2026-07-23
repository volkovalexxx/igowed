import styles from './VendorBoardPage.module.css'

export function VendorMessagePanel() {
  return (
    <section className={styles.messagePanel}>
      <h2>✉ Отправить сообщение подрядчикам</h2>
      <textarea placeholder="Введите сообщение" />
      <div className={styles.messageFooter}>
        <label>
          <span className={styles.radio} />
          Отправить всем
        </label>
        <label>
          <span className={`${styles.radio} ${styles.radioActive}`} />
          Выбрать подрядчиков
        </label>
        <button type="button">Отправить</button>
      </div>
    </section>
  )
}
