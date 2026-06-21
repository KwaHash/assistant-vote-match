'use client'

/**
 * 【プロトタイプ】支援者向け 候補者とのメッセージ
 *
 * 目的: 支援者が候補者・事務所とやり取りする。既存のチャットサーバー（chat-vote-match）資産を流用する想定。
 *
 * 注意: 動く仕様書（プロトタイプ）。会話はサンプル。本番は chat_conversations / chat_messages（WebSocket）。
 */

import { useState } from 'react'

interface Msg { from: 'me' | 'them'; text: string; time: string }
interface Conv { id: number; name: string; party: string; emoji: string; messages: Msg[] }

const INITIAL: Conv[] = [
  {
    id: 1, name: '田中 一郎', party: '自民党', emoji: '🛟',
    messages: [
      { from: 'them', text: '防災政策の動画編集にご協力いただけるとのこと、ありがとうございます！', time: '10:02' },
      { from: 'me', text: 'はい、平日夜と土日で対応できます。素材はありますか？', time: '10:15' },
      { from: 'them', text: '来週、撮影素材をお送りします。よろしくお願いします。', time: '10:20' },
    ],
  },
  {
    id: 2, name: '佐藤 健太', party: '国民民主党', emoji: '🔋',
    messages: [
      { from: 'them', text: 'エネルギー政策の勉強会、会場のご提供ありがとうございます。', time: '昨日' },
    ],
  },
]

export default function MessagesPage() {
  const [convs, setConvs] = useState<Conv[]>(INITIAL)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')

  const active = convs.find((c) => c.id === activeId) ?? null

  const send = () => {
    if (!draft.trim() || !active) return
    setConvs((prev) => prev.map((c) => c.id === active.id ? { ...c, messages: [...c.messages, { from: 'me', text: draft.trim(), time: 'たった今' }] } : c))
    setDraft('')
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 py-8'>
      <div className='mb-5'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>候補者とのメッセージ</h1>
        <p className='mt-1 text-sm text-gray-500'>候補者・事務所とやり取りできます（既存のチャット機能を流用）。</p>
      </div>

      {!active ? (
        <div className='rounded-xl border border-gray-200 bg-white'>
          {convs.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className='flex w-full items-center gap-3 border-b border-gray-50 p-4 text-left transition-colors last:border-0 hover:bg-gray-50'>
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 text-xl'>{c.emoji}</div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-bold text-gray-900'>{c.name}</span>
                  <span className='text-[11px] text-gray-400'>{c.messages[c.messages.length - 1]?.time}</span>
                </div>
                <p className='truncate text-xs text-gray-500'>{c.messages[c.messages.length - 1]?.text}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className='rounded-xl border border-gray-200 bg-white'>
          {/* スレッドヘッダー */}
          <div className='flex items-center gap-2 border-b border-gray-100 p-3'>
            <button onClick={() => setActiveId(null)} className='text-sm text-gray-400 hover:text-gray-600'>←</button>
            <span className='text-lg'>{active.emoji}</span>
            <span className='text-sm font-bold text-gray-900'>{active.name}</span>
            <span className='text-xs text-gray-400'>{active.party}</span>
          </div>
          {/* メッセージ */}
          <div className='space-y-3 p-4'>
            {active.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.from === 'me' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {m.text}
                  <div className={`mt-0.5 text-[10px] ${m.from === 'me' ? 'text-emerald-100' : 'text-gray-400'}`}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 入力 */}
          <div className='flex gap-2 border-t border-gray-100 p-3'>
            <input
              className='flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-emerald-400 focus:outline-none'
              placeholder='メッセージを入力'
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
            />
            <button onClick={send} className='rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700'>送信</button>
          </div>
        </div>
      )}
    </div>
  )
}
