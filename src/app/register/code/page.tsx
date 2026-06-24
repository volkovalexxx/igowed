import { AuthShell } from '@/features/auth/AuthShell'
import styles from '@/features/auth/AuthShell.module.css'

export default function RegisterCodePage() {
  return (
    <AuthShell>
      <section className={styles.formArea}>
        <h1 className={styles.codeTitle}>Введите полученный код</h1>
        <form className={styles.codeBoxes} aria-label="Код подтверждения">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              aria-label={`Цифра ${index + 1}`}
              className={styles.codeInput}
              inputMode="numeric"
              key={index}
              maxLength={1}
              name={`code-${index + 1}`}
              pattern="[0-9]*"
            />
          ))}
        </form>
        <p className={styles.codeHint}>
          Новый код можно запросить через <span>60 секунд</span>
        </p>
      </section>
    </AuthShell>
  )
}
