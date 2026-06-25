'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { getAllTasks, priorityLabels, taskGroups } from './eventTasks.data'
import { filterTasksByStatus, getTaskStatusLabel } from './eventTasks.format'
import type { EventTask, TaskPriority, TaskStatus } from './eventTasks.types'
import styles from './EventTasksPage.module.css'

type ModalState = 'task' | 'list' | null

function Header({ eventId }: { eventId: string }) {
  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link className={styles.logo} href="/">
            I GO WED
          </Link>
          <nav className={styles.mainNav} aria-label="Основная навигация">
            <Link href="/">Главная</Link>
            <Link href="/catalog?cat=venues">Площадки</Link>
            <Link href="/catalog">Каталог</Link>
            <Link href="/catalog?cat=photo">Фото</Link>
            <Link href="/blog">Блог</Link>
          </nav>
          <div className={styles.headerActions}>
            <Link className={styles.goldButton} href="/event/new">
              Создать мероприятие
            </Link>
            <span className={styles.currency}>RUB⌄</span>
            <span className={styles.currency}>RU⌄</span>
            <button className={styles.iconButton} type="button" aria-label="Поиск">
              ⌕
            </button>
            <button className={styles.iconButton} type="button" aria-label="Уведомления">
              ♡<span className={styles.badge}>123</span>
            </button>
            <button className={styles.iconButton} type="button" aria-label="Сообщения">
              ✉<span className={styles.badge}>1</span>
            </button>
            <span className={styles.user}>Анна</span>
            <button className={styles.menuButton} type="button" aria-label="Меню">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className={styles.workspaceNav} aria-label="Разделы мероприятия">
        <Link href={`/event/${eventId}`}>Моя свадьба</Link>
        <Link href="/dashboard/favorites">Избранное</Link>
        <Link className={styles.activeTab} href={`/event/${eventId}/tasks`}>
          Список задач
        </Link>
        <Link href="#">Список гостей</Link>
        <Link href="#">Рассадка</Link>
        <Link href="#">Тайминг</Link>
        <Link href="#">Бюджет</Link>
      </nav>
    </>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <p className={styles.footerLogo}>I GO WED</p>
          <div className={styles.footerLinks}>
            <Link href="#">Правила</Link>
            <Link href="#">Обратная связь</Link>
            <Link href="#">О нас</Link>
          </div>
        </div>
        <div className={styles.footerLinks}>
          <Link href="#">Реклама</Link>
          <Link href="#">Логотипы I GO WED</Link>
          <Link href="#">Политика конфиденциальности</Link>
        </div>
        <div className={styles.footerPills}>
          <span className={styles.footerPill}>USD&nbsp;&nbsp; Доллар США⌄</span>
          <span className={styles.footerPill}>🇷🇺&nbsp;&nbsp; Русский⌄</span>
        </div>
        <div className={styles.age}>18+</div>
      </div>
      <div className={styles.copyright}>©2025 Сообщество свадебных и семейных фотографов | I GO WED</div>
    </footer>
  )
}

function PriorityDot({ priority }: { priority: TaskPriority }) {
  return <span className={`${styles.priorityDot} ${styles[priority]}`} aria-label={priorityLabels[priority]} />
}

function TaskCheckbox({ task }: { task: EventTask }) {
  return (
    <label className={styles.taskCheck}>
      <input type="checkbox" defaultChecked={task.status === 'done'} />
      <span>{task.title}</span>
    </label>
  )
}

function DesktopTaskRow({ task }: { task: EventTask }) {
  return (
    <div className={styles.desktopTaskRow}>
      <TaskCheckbox task={task} />
      <PriorityDot priority={task.priority} />
      <span>Дедлайн: {task.deadline}</span>
      <span>Статус: {getTaskStatusLabel(task.status)}</span>
    </div>
  )
}

function SelectPill({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange(value: string): void
  children: ReactNode
}) {
  return (
    <label className={styles.selectPill}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  )
}

function TaskModal({ onClose }: { onClose(): void }) {
  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section className={`${styles.modal} ${styles.taskModal}`} role="dialog" aria-modal="true" aria-labelledby="create-task-title">
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <h2 id="create-task-title">Создать задачу</h2>
        <label>
          Название задачи
          <input type="text" />
        </label>
        <label>
          Приоритетность
          <select defaultValue="high">
            <option value="high">Высокая ●</option>
            <option value="medium">Средняя ●</option>
            <option value="low">Низкая ●</option>
          </select>
        </label>
        <label>
          Дедлайн
          <input type="text" />
        </label>
        <label>
          Добавить в список по теме
          <select defaultValue="all">
            <option value="all">Общий список</option>
            {taskGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </label>
        <button className={styles.saveButton} type="button" onClick={onClose}>
          Сохранить задачу
        </button>
      </section>
    </div>
  )
}

function ListModal({ onClose }: { onClose(): void }) {
  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="create-list-title">
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <h2 id="create-list-title">Создать список задач</h2>
        <label>
          Название списка
          <input type="text" />
        </label>
        <button className={styles.saveButton} type="button" onClick={onClose}>
          Сохранить список
        </button>
      </section>
    </div>
  )
}

export function EventTasksPage({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<'all' | TaskStatus>('all')
  const [priority, setPriority] = useState<'all' | TaskPriority>('all')
  const [modal, setModal] = useState<ModalState>(null)
  const allTasks = useMemo(() => getAllTasks(), [])
  const filteredTasks = useMemo(() => {
    const byStatus = filterTasksByStatus(allTasks, status)
    return priority === 'all' ? byStatus : byStatus.filter((task) => task.priority === priority)
  }, [allTasks, priority, status])

  return (
    <div className={styles.page}>
      <Header eventId={eventId} />
      <main className={styles.content}>
        <div className={styles.breadcrumbs}>Главная › Моя свадьба › Список задач</div>
        <div className={styles.mobileFilters}>
          <SelectPill label="Приоритетность" value={priority} onChange={(value) => setPriority(value as 'all' | TaskPriority)}>
            <option value="all">Приоритетность</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </SelectPill>
          <SelectPill label="Дедлайн" value="all" onChange={() => undefined}>
            <option value="all">Дедлайн</option>
          </SelectPill>
          <SelectPill label="Статус" value={status} onChange={(value) => setStatus(value as 'all' | TaskStatus)}>
            <option value="all">Статус</option>
            <option value="open">Не завершена</option>
            <option value="done">Завершена</option>
          </SelectPill>
          <button className={styles.resetButton} type="button" onClick={() => { setPriority('all'); setStatus('all') }}>
            Сбросить ⓧ
          </button>
        </div>

        <section className={styles.taskLayout}>
          <div className={styles.topicColumn}>
            <div className={styles.titleRow}>
              <h1>Список задач</h1>
            </div>
            <div className={styles.subhead}>
              <h2>Списки по темам</h2>
              <button type="button" onClick={() => setModal('list')}>
                Добавить список <span>+</span>
              </button>
            </div>

            <div className={styles.topicCards}>
              {taskGroups.map((group, index) => (
                <section className={styles.topicCard} key={group.id}>
                  <button className={styles.topicHeader} type="button">
                    <span className={styles.dragIcon}>≡</span>
                    <strong>{group.title}</strong>
                    <span>{index === 0 ? '⌃' : '⌄'}</span>
                  </button>
                  {index === 0 ? (
                    <div className={styles.topicTasks}>
                      <button className={styles.inlineAdd} type="button" onClick={() => setModal('task')}>
                        Добавить задачу <span>+</span>
                      </button>
                      {group.tasks.map((task) => (
                        <DesktopTaskRow key={task.id} task={task} />
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </div>

          <div className={styles.allTasksColumn}>
            <div className={styles.desktopFilters}>
              <SelectPill label="Приоритетность" value={priority} onChange={(value) => setPriority(value as 'all' | TaskPriority)}>
                <option value="all">Приоритетность</option>
                <option value="high">Высокий приоритет</option>
                <option value="medium">Средний приоритет</option>
                <option value="low">Низкий приоритет</option>
              </SelectPill>
              <SelectPill label="Дедлайн" value="all" onChange={() => undefined}>
                <option value="all">Дедлайн</option>
              </SelectPill>
              <SelectPill label="Статус" value={status} onChange={(value) => setStatus(value as 'all' | TaskStatus)}>
                <option value="all">Статус</option>
                <option value="open">Не завершена</option>
                <option value="done">Завершена</option>
              </SelectPill>
              <button className={styles.resetButton} type="button" onClick={() => { setPriority('all'); setStatus('all') }}>
                Сбросить все ⓧ
              </button>
            </div>
            <div className={styles.subhead}>
              <h2>Общий список задач</h2>
              <button type="button" onClick={() => setModal('task')}>
                Добавить задачу <span>+</span>
              </button>
            </div>
            <div className={styles.allTasksList}>
              {filteredTasks.map((task) => (
                <DesktopTaskRow key={task.id} task={task} />
              ))}
            </div>
            <button className={styles.expandButton} type="button">
              Развернуть
            </button>
          </div>
        </section>
      </main>
      <Footer />
      {modal === 'task' ? <TaskModal onClose={() => setModal(null)} /> : null}
      {modal === 'list' ? <ListModal onClose={() => setModal(null)} /> : null}
    </div>
  )
}
