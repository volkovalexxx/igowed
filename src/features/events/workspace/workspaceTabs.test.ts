import { describe, expect, it } from 'vitest'
import { buildWorkspaceTabs, getWorkspaceTabLabels, WORKSPACE_TABS } from './workspaceTabs'

describe('buildWorkspaceTabs', () => {
  it('подставляет eventId во все ссылки мероприятия', () => {
    const tabs = buildWorkspaceTabs('evt-1')
    const byKey = Object.fromEntries(tabs.map((tab) => [tab.key, tab.href]))

    expect(byKey.wedding).toBe('/event/evt-1')
    expect(byKey.tasks).toBe('/event/evt-1/tasks')
    expect(byKey.guests).toBe('/event/evt-1/guests')
    expect(byKey.timing).toBe('/event/evt-1/timing')
    expect(byKey.budget).toBe('/event/evt-1/budget')
  })

  it('ведёт избранное в дашборд, а не в мероприятие', () => {
    const tabs = buildWorkspaceTabs('evt-1')
    expect(tabs.find((tab) => tab.key === 'favorites')?.href).toBe('/dashboard/favorites')
  })

  it('оставляет рассадку заглушкой: макета нет', () => {
    const tabs = buildWorkspaceTabs('evt-1')
    const seating = tabs.find((tab) => tab.key === 'seating')

    expect(seating?.href).toBe('#')
    expect(seating?.isPlaceholder).toBe(true)
  })

  it('сохраняет порядок вкладок из макета', () => {
    expect(buildWorkspaceTabs('evt-1').map((tab) => tab.key)).toEqual([
      'wedding',
      'favorites',
      'tasks',
      'guests',
      'seating',
      'timing',
      'budget',
    ])
  })

  it('не теряет вкладки при построении', () => {
    expect(buildWorkspaceTabs('evt-1')).toHaveLength(WORKSPACE_TABS.length)
  })
})

describe('getWorkspaceTabLabels', () => {
  it('отдаёт метки в порядке макета', () => {
    expect(getWorkspaceTabLabels()).toEqual([
      'Моя свадьба',
      'Избранное',
      'Список задач',
      'Список гостей',
      'Рассадка',
      'Тайминг',
      'Бюджет',
    ])
  })
})
