import type { Conversation } from './chat.types'

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face'

type ConversationListItemProps = {
  conversation: Conversation
  isActive: boolean
  onSelect(): void
}

export function ConversationListItem({ conversation, isActive, onSelect }: ConversationListItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-4 py-3 text-left"
      style={{
        background: isActive ? 'var(--paper)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
      }}
    >
      <div className="relative shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={conversation.avatar ?? FALLBACK_AVATAR} alt={conversation.name} className="rounded-full object-cover" style={{ width: 42, height: 42 }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{conversation.name}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0, marginLeft: 4 }}>{conversation.lastTime}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
            {conversation.lastMessage}
          </span>
          {conversation.unread > 0 ? (
            <span
              className="inline-flex items-center justify-center rounded-full ml-2 shrink-0"
              style={{ width: 18, height: 18, background: 'var(--gold)', color: '#fff', fontSize: 10, fontWeight: 700 }}
            >
              {conversation.unread}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}
