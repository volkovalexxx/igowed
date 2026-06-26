'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Camera, Chat } from '@/components/ui/Icons';
import styles from './MessagesPage.module.css';

/* ── Types ───────────────────────────────────────────────────────────── */

interface Message {
  id: number;
  text: string;
  time: string;
  isOwn: boolean;
  date?: string; // date divider label if this is first message of a new day
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  isOnline: boolean;
  messages: Message[];
}

/* ── Mock data ───────────────────────────────────────────────────────── */

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: 'Ольга Иванова',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'Отлично, тогда до встречи в пятницу!',
    lastTime: '12:45',
    unread: 2,
    isOnline: true,
    messages: [
      { id: 1, text: 'Здравствуйте! Хочу уточнить детали фотосессии на 14 июня.', time: '10:12', isOwn: false, date: '2 мая' },
      { id: 2, text: 'Добрый день, Ольга! Конечно, слушаю вас.', time: '10:15', isOwn: true },
      { id: 3, text: 'Нас будет 2 человека + 5 гостей. Планируем начать в 11:00 на площадке Замка Мир.', time: '10:18', isOwn: false },
      { id: 4, text: 'Отлично! Я уже знаком с этой площадкой. Свет там прекрасный утром. Возьмите с собой дополнительный образ для вечерних снимков.', time: '10:22', isOwn: true },
      { id: 5, text: 'Хорошо, спасибо за совет! Нужно ли что-то дополнительно согласовать заранее?', time: '11:05', isOwn: false, date: 'Сегодня' },
      { id: 6, text: 'Всё уже обговорено в договоре. Напомню: встречаемся у главных ворот в 10:45.', time: '12:30', isOwn: true },
      { id: 7, text: 'Отлично, тогда до встречи в пятницу!', time: '12:45', isOwn: false },
    ],
  },
  {
    id: 2,
    name: 'Максим Петров',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'Можете прислать договор на email?',
    lastTime: 'Вчера',
    unread: 0,
    isOnline: false,
    messages: [
      { id: 1, text: 'Добрый вечер! Видел ваше портфолио — очень понравилось. Хотим забронировать на 7 августа.', time: '18:30', isOwn: false, date: '1 мая' },
      { id: 2, text: 'Добрый вечер, Максим! Рад, что понравилось. 7 августа у меня свободно.', time: '19:00', isOwn: true },
      { id: 3, text: 'Замечательно! У нас будет торжество на примерно 60 человек в ресторане Минска. Весь день до 23:00.', time: '19:05', isOwn: false },
      { id: 4, text: 'Для полного дня (10 часов) стоимость составит $850. Включает обработку и альбом 100 фото.', time: '19:20', isOwn: true },
      { id: 5, text: 'Звучит разумно. Нас устраивает. Как оформить бронирование?', time: '20:10', isOwn: false, date: 'Вчера' },
      { id: 6, text: 'Нужно внести предоплату 30% и подписать договор. Реквизиты пришлю отдельно.', time: '09:30', isOwn: true },
      { id: 7, text: 'Можете прислать договор на email?', time: '11:15', isOwn: false },
    ],
  },
  {
    id: 3,
    name: 'Светлана Козлова',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'Спасибо огромное, всё получилось!',
    lastTime: '28 апр',
    unread: 0,
    isOnline: false,
    messages: [
      { id: 1, text: 'Аня, доброе утро! Мы получили все фотографии.', time: '09:00', isOwn: false, date: '28 апреля' },
      { id: 2, text: 'Доброе утро, Света! Как вам результат?', time: '09:15', isOwn: true },
      { id: 3, text: 'Мы просто в восторге! Это именно то, о чём мечтали. Каждый кадр — это история.', time: '09:18', isOwn: false },
      { id: 4, text: 'Очень рада! Работать с вами было одно удовольствие. Такая тёплая атмосфера на свадьбе.', time: '09:25', isOwn: true },
      { id: 5, text: 'Обязательно порекомендуем вас всем друзьям! Уже несколько подруг попросили ваш контакт.', time: '09:30', isOwn: false },
      { id: 6, text: 'Буду рада новым знакомствам! Если что — обращайтесь за love-story или следующими событиями.', time: '09:35', isOwn: true },
      { id: 7, text: 'Спасибо огромное, всё получилось!', time: '09:40', isOwn: false },
    ],
  },
];

/* ── Send icon ───────────────────────────────────────────────────────── */

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ── Chat list item ──────────────────────────────────────────────────── */

function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
      style={{
        background: isActive ? 'var(--paper)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#FAFAFA';
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
    >
      {/* Avatar with online dot */}
      <div className="relative shrink-0">
        <img
          src={conv.avatar}
          alt={conv.name}
          className="rounded-full object-cover"
          style={{ width: 42, height: 42 }}
        />
        {conv.isOnline && (
          <span
            className="absolute bottom-0 right-0 rounded-full"
            style={{ width: 10, height: 10, background: '#16A34A', border: '2px solid #fff' }}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>{conv.name}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0, marginLeft: 4 }}>{conv.lastTime}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span
            style={{
              fontSize: 12,
              color: 'var(--muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 160,
            }}
          >
            {conv.lastMessage}
          </span>
          {conv.unread > 0 && (
            <span
              className="inline-flex items-center justify-center rounded-full ml-2 shrink-0"
              style={{ width: 18, height: 18, background: 'var(--gold)', color: '#fff', fontSize: 10, fontWeight: 700 }}
            >
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── Message bubble ──────────────────────────────────────────────────── */

function MessageBubble({ message }: { message: Message }) {
  const { text, time, isOwn, date } = message;

  return (
    <>
      {date && (
        <div className="flex justify-center my-4">
          <span
            className="rounded-full px-3 py-1"
            style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--paper)' }}
          >
            {date}
          </span>
        </div>
      )}
      <div className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div
          className="rounded-2xl px-4 py-2.5 max-w-[75%]"
          style={{
            background: isOwn ? 'var(--gold)' : '#fff',
            border: isOwn ? 'none' : '1px solid var(--border)',
            borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          }}
        >
          <p style={{ fontSize: 14, color: isOwn ? '#fff' : 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
            {text}
          </p>
          <p
            style={{
              fontSize: 11,
              color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--muted)',
              marginTop: 4,
              textAlign: isOwn ? 'right' : 'left',
            }}
          >
            {time}
          </p>
        </div>
      </div>
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<number>(CONVERSATIONS[0].id);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, activeConv.messages.length]);

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: text,
              lastTime: time,
              messages: [
                ...c.messages,
                { id: Date.now(), text, time, isOwn: true },
              ],
            }
          : c
      )
    );
    setInputValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSelectConv(id: number) {
    setSelectedId(id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }

  return (
    <div className={styles.messagesShell}>
      {/* ── Left panel: chat list ──────────────────────────────── */}
      <div
        className={styles.conversationPanel}
        style={{
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
        }}
      >
        {/* Panel header */}
        <div className={styles.panelHeader} style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>
            Сообщения
          </h3>
          {/* Search */}
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--muted)' }}
            >
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Поиск по чатам..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full outline-none"
              style={{
                paddingLeft: 34,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                borderRadius: 8,
                border: '1px solid var(--border)',
                fontSize: 13,
                background: 'var(--paper)',
                color: 'var(--ink)',
              }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--gold)'; }}
              onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border)'; }}
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className={styles.conversationList}>
          {filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2">
              <Chat size={28} style={{ color: 'var(--muted)' }} />
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Чаты не найдены</p>
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === selectedId}
                onClick={() => handleSelectConv(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: active chat ───────────────────────────── */}
      <div className={styles.chatPanel}>
        {/* Chat header */}
        <div
          className={styles.chatHeader}
          style={{
            background: '#fff',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}
        >
          {/* Avatar */}
          <div className="relative">
            <img
              src={activeConv.avatar}
              alt={activeConv.name}
              className="rounded-full object-cover"
              style={{ width: 40, height: 40 }}
            />
            {activeConv.isOnline && (
              <span
                className="absolute bottom-0 right-0 rounded-full"
                style={{ width: 10, height: 10, background: '#16A34A', border: '2px solid #fff' }}
              />
            )}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{activeConv.name}</div>
            {activeConv.isOnline ? (
              <div className="flex items-center gap-1">
                <span className="rounded-full inline-block" style={{ width: 6, height: 6, background: '#16A34A' }} />
                <span style={{ fontSize: 12, color: '#16A34A' }}>онлайн</span>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>не в сети</div>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div
          className={styles.messagesArea}
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeConv.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className={styles.inputBar}
          style={{
            background: '#fff',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            flexShrink: 0,
          }}
        >
          {/* Camera / attachment */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center rounded-full transition-colors shrink-0"
            style={{
              width: 38, height: 38,
              background: 'var(--paper)',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
            }}
            aria-label="Прикрепить фото"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; }}
          >
            <Camera size={17} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

          {/* Text input */}
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Написать сообщение..."
            rows={1}
            style={{
              flex: 1,
              resize: 'none',
              borderRadius: 12,
              border: '1px solid var(--border)',
              padding: '9px 14px',
              fontSize: 14,
              color: 'var(--ink)',
              background: 'var(--paper)',
              outline: 'none',
              lineHeight: 1.5,
              maxHeight: 120,
              overflow: 'auto',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--gold)'; }}
            onBlur={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--border)'; }}
            onInput={(e) => {
              const el = e.currentTarget as HTMLTextAreaElement;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 120) + 'px';
            }}
          />

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            className="flex items-center justify-center rounded-full transition-colors shrink-0"
            style={{
              width: 38, height: 38,
              background: inputValue.trim() ? 'var(--gold)' : 'var(--border)',
              color: inputValue.trim() ? '#fff' : 'var(--muted)',
              border: 'none',
            }}
            aria-label="Отправить"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
