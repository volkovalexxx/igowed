'use client'

import Link from 'next/link'
import type { FormEvent, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { getAllTasks, priorityLabels } from './eventTasks.data'
import { filterTasksByStatus, getTaskStatusLabel } from './eventTasks.format'
import type { EventTask, TaskGroup, TaskPriority, TaskStatus } from './eventTasks.types'
import { EventWorkspaceChrome } from '@/features/events/workspace/EventWorkspaceChrome'
import styles from './EventTasksPage.module.css'

type ModalState = 'task' | 'list' | null

function PriorityDot({ priority }: { priority: TaskPriority }) {
  return <span className={`${styles.priorityDot} ${styles[priority]}`} aria-label={priorityLabels[priority]} />
}

function TaskCheckbox({ task, onToggle }: { task: EventTask; onToggle(task: EventTask, status: TaskStatus): void }) {
  return (
    <label className={styles.taskCheck}>
      <input type="checkbox" checked={task.status === 'done'} onChange={(event) => onToggle(task, event.target.checked ? 'done' : 'open')} />
      <span>{task.title}</span>
    </label>
  )
}

function DesktopTaskRow({ task, onToggle }: { task: EventTask; onToggle(task: EventTask, status: TaskStatus): void }) {
  return (
    <div className={styles.desktopTaskRow}>
      <TaskCheckbox task={task} onToggle={onToggle} />
      <PriorityDot priority={task.priority} />
      <span>Дедлайн: {task.deadline ?? 'не указан'}</span>
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

function TaskModal({
  groups,
  onClose,
  onSave,
}: {
  groups: TaskGroup[]
  onClose(): void
  onSave(input: { listId: string; title: string; priority: TaskPriority; deadline: string }): Promise<void>
}) {
  const [listId, setListId] = useState(groups[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await onSave({ listId, title, priority, deadline })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить задачу')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <form className={`${styles.modal} ${styles.taskModal}`} role="dialog" aria-modal="true" aria-labelledby="create-task-title" onSubmit={handleSubmit}>
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <h2 id="create-task-title">Создать задачу</h2>
        <label>
          Название задачи
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <label>
          Приоритетность
          <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
            <option value="high">Высокая ●</option>
            <option value="medium">Средняя ●</option>
            <option value="low">Низкая ●</option>
          </select>
        </label>
        <label>
          Дедлайн
          <input type="text" value={deadline} onChange={(event) => setDeadline(event.target.value)} placeholder="ДД.ММ.ГГГГ" />
        </label>
        <label>
          Добавить в список по теме
          <select value={listId} onChange={(event) => setListId(event.target.value)} required>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <button className={styles.saveButton} type="submit" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить задачу'}
        </button>
      </form>
    </div>
  )
}

function ListModal({ onClose, onSave }: { onClose(): void; onSave(title: string): Promise<void> }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await onSave(title)
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось сохранить список')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <form className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="create-list-title" onSubmit={handleSubmit}>
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <h2 id="create-list-title">Создать список задач</h2>
        <label>
          Название списка
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <button className={styles.saveButton} type="submit" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить список'}
        </button>
      </form>
    </div>
  )
}

async function readJsonOrThrow(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as { error?: string }
  if (!response.ok) {
    throw new Error(payload.error ?? 'Не удалось сохранить изменения')
  }

  return payload
}

export function EventTasksPage({ eventId, initialGroups }: { eventId: string; initialGroups: TaskGroup[] }) {
  const [groups, setGroups] = useState(initialGroups)
  const [status, setStatus] = useState<'all' | TaskStatus>('all')
  const [priority, setPriority] = useState<'all' | TaskPriority>('all')
  const [modal, setModal] = useState<ModalState>(null)
  const allTasks = useMemo(() => getAllTasks(groups), [groups])
  const filteredTasks = useMemo(() => {
    const byStatus = filterTasksByStatus(allTasks, status)
    return priority === 'all' ? byStatus : byStatus.filter((task) => task.priority === priority)
  }, [allTasks, priority, status])

  async function handleCreateList(title: string) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/task-lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      }),
    )) as { list?: TaskGroup }

    if (payload.list) {
      setGroups((current) => [...current, payload.list as TaskGroup])
    }
  }

  async function handleCreateTask(input: { listId: string; title: string; priority: TaskPriority; deadline: string }) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    )) as { task?: EventTask }

    if (payload.task) {
      setGroups((current) =>
        current.map((group) => (group.id === input.listId ? { ...group, tasks: [...group.tasks, payload.task as EventTask] } : group)),
      )
    }
  }

  async function handleToggleTask(task: EventTask, nextStatus: TaskStatus) {
    const previousGroups = groups
    setGroups((current) =>
      current.map((group) => ({
        ...group,
        tasks: group.tasks.map((item) => (item.id === task.id ? { ...item, status: nextStatus } : item)),
      })),
    )

    try {
      const payload = (await readJsonOrThrow(
        await fetch(`/api/events/${eventId}/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        }),
      )) as { task?: EventTask }

      if (payload.task) {
        setGroups((current) =>
          current.map((group) => ({
            ...group,
            tasks: group.tasks.map((item) => (item.id === task.id ? (payload.task as EventTask) : item)),
          })),
        )
      }
    } catch {
      setGroups(previousGroups)
    }
  }

  function resetFilters() {
    setPriority('all')
    setStatus('all')
  }

  return (
    <EventWorkspaceChrome active="tasks" eventId={eventId}>
      <main className={styles.content}>
        <div className={styles.mobileContext}>
          <Link href={`/event/${eventId}`} aria-label="Назад к мероприятию">
            ‹
          </Link>
          <span>Список задач</span>
        </div>
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
          <button className={styles.resetButton} type="button" onClick={resetFilters}>
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
              {groups.map((group, index) => (
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
                        <DesktopTaskRow key={task.id} task={task} onToggle={handleToggleTask} />
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
              <button className={styles.resetButton} type="button" onClick={resetFilters}>
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
                <DesktopTaskRow key={task.id} task={task} onToggle={handleToggleTask} />
              ))}
            </div>
            <button className={styles.expandButton} type="button">
              Развернуть
            </button>
          </div>
        </section>
      </main>
      {modal === 'task' ? <TaskModal groups={groups} onClose={() => setModal(null)} onSave={handleCreateTask} /> : null}
      {modal === 'list' ? <ListModal onClose={() => setModal(null)} onSave={handleCreateList} /> : null}
    </EventWorkspaceChrome>
  )
}
