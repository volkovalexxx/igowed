'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from '@/components/ui/Icons'
import { ChatMessageBubble } from './ChatMessageBubble'
import { ConversationListItem } from './ConversationListItem'
import { formatConversationTime, withDateDividers } from './chat.format'
import type { ChatMessage, ChatMessageWithDivider, Conversation } from './chat.types'
import type { PeerProfile } from './server/chat.mapper'
import styles from './MessagesPage.module.css'

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face'

export type InitialThread = {
  peer: PeerProfile
  messages: ChatMessageWithDivider[]
}

type MessagesClientProps = {
  initialConversations: Conversation[]
  initialThread: InitialThread | null
}

async function readJsonOrThrow(response: Response) {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error ?? 'Не удалось обработать сообщение')
  return payload
}

function stripDividers(messages: ChatMessageWithDivider[]): ChatMessage[] {
  return messages.map(({ id, text, isOwn, createdAt }) => ({ id, text, isOwn, createdAt }))
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

export function MessagesClient({ initialConversations, initialThread }: MessagesClientProps) {
  const [conversations, setConversations] = useState(initialConversations)
  const [peer, setPeer] = useState<PeerProfile | null>(initialThread?.peer ?? null)
  const [messages, setMessages] = useState<ChatMessage[]>(initialThread ? stripDividers(initialThread.messages) : [])
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const rendered = withDateDividers(messages, new Date())
  const filtered = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchValue.toLowerCase()),
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, peer?.id])

  async function openConversation(userId: string) {
    setError('')
    setConversations((current) => current.map((conversation) => (conversation.userId === userId ? { ...conversation, unread: 0 } : conversation)))

    try {
      const payload = (await readJsonOrThrow(await fetch(`/api/messages/${userId}`))) as { thread?: InitialThread }
      if (payload.thread) {
        setPeer(payload.thread.peer)
        setMessages(stripDividers(payload.thread.messages))
      }
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : 'Не удалось открыть диалог')
    }
  }

  async function handleSend() {
    const text = inputValue.trim()
    if (!text || !peer || isSending) return

    setError('')
    setIsSending(true)
    setInputValue('')

    try {
      const payload = (await readJsonOrThrow(
        await fetch(`/api/messages/${peer.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        }),
      )) as { message?: ChatMessage }

      if (payload.message) {
        const sent = payload.message
        const sentTime = formatConversationTime(sent.createdAt, new Date())
        setMessages((current) => [...current, sent])
        setConversations((current) => {
          const rest = current.filter((conversation) => conversation.userId !== peer.id)
          const existing = current.find((conversation) => conversation.userId === peer.id)
          const head = {
            userId: peer.id,
            name: peer.name,
            avatar: peer.avatar,
            unread: existing?.unread ?? 0,
            lastMessage: sent.text,
            lastTime: sentTime,
          }
          return [head, ...rest]
        })
      }
    } catch (sendError) {
      setInputValue(text)
      setError(sendError instanceof Error ? sendError.message : 'Не удалось отправить сообщение')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={styles.messagesShell}>
      <div className={styles.conversationPanel} style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div className={styles.panelHeader} style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>Сообщения</h3>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }}>
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Поиск по чатам..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full outline-none"
              style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: 'var(--paper)', color: 'var(--ink)' }}
            />
          </div>
        </div>

        <div className={styles.conversationList}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>{conversations.length === 0 ? 'Диалогов пока нет' : 'Чаты не найдены'}</p>
            </div>
          ) : (
            filtered.map((conversation) => (
              <ConversationListItem
                conversation={conversation}
                isActive={conversation.userId === peer?.id}
                key={conversation.userId}
                onSelect={() => openConversation(conversation.userId)}
              />
            ))
          )}
        </div>
      </div>

      <div className={styles.chatPanel}>
        {peer ? (
          <>
            <div className={styles.chatHeader} style={{ background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={peer.avatar ?? FALLBACK_AVATAR} alt={peer.name} className="rounded-full object-cover" style={{ width: 40, height: 40 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{peer.name}</div>
            </div>

            <div className={styles.messagesArea} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {rendered.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>Напишите первое сообщение</p>
                </div>
              ) : (
                rendered.map((message) => <ChatMessageBubble key={message.id} message={message} />)
              )}
              <div ref={endRef} />
            </div>

            {error ? (
              <p role="alert" style={{ margin: 0, padding: '8px 16px', color: '#e53131', fontSize: 12 }}>
                {error}
              </p>
            ) : null}

            <div className={styles.inputBar} style={{ background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void handleSend()
                  }
                }}
                placeholder="Написать сообщение..."
                rows={1}
                style={{ flex: 1, resize: 'none', borderRadius: 12, border: '1px solid var(--border)', padding: '9px 14px', fontSize: 14, color: 'var(--ink)', background: 'var(--paper)', outline: 'none', lineHeight: 1.5, maxHeight: 120, overflow: 'auto', fontFamily: 'inherit' }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || !inputValue.trim()}
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: 38, height: 38, background: inputValue.trim() ? 'var(--gold)' : 'var(--border)', color: inputValue.trim() ? '#fff' : 'var(--muted)', border: 'none' }}
                aria-label="Отправить"
              >
                <SendIcon />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center" style={{ height: '100%' }}>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Выберите диалог, чтобы начать переписку</p>
          </div>
        )}
      </div>
    </div>
  )
}
