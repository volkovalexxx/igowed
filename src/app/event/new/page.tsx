import type { Metadata } from 'next'
import { CreateEventPage } from '@/features/events/create/CreateEventPage'

export const metadata: Metadata = {
  title: 'Создать мероприятие | I GO WED',
  description: 'Создание свадебного мероприятия в I GO WED',
}

export default function NewEventPage() {
  return <CreateEventPage />
}
