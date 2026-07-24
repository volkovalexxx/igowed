const DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatBlogDate(date: Date): string {
  return DATE_FORMATTER.format(date).replace(/\s*г\.$/, '')
}

/** Режет плоский `content` на абзацы по пустым строкам для рендера статьи. */
export function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
}
