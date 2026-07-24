import { formatMessageTime } from './chat.format'
import type { ChatMessageWithDivider } from './chat.types'

export function ChatMessageBubble({ message }: { message: ChatMessageWithDivider }) {
  const { text, isOwn, dayLabel, createdAt } = message

  return (
    <>
      {dayLabel ? (
        <div className="flex justify-center my-4">
          <span className="rounded-full px-3 py-1" style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--paper)' }}>
            {dayLabel}
          </span>
        </div>
      ) : null}
      <div className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div
          className="px-4 py-2.5 max-w-[75%]"
          style={{
            background: isOwn ? 'var(--gold)' : '#fff',
            border: isOwn ? 'none' : '1px solid var(--border)',
            borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          }}
        >
          <p style={{ fontSize: 14, color: isOwn ? '#fff' : 'var(--ink)', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
          <p
            style={{
              fontSize: 11,
              color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--muted)',
              marginTop: 4,
              textAlign: isOwn ? 'right' : 'left',
            }}
          >
            {formatMessageTime(createdAt)}
          </p>
        </div>
      </div>
    </>
  )
}
