'use client'

/**
 * 【プロトタイプ】支援者向け 支援ダッシュボード（マイページ）
 *
 * 方針変更: assist は「自分から登録するサイト」ではなく、
 *   seijiselect / candidate / クラファン / LINE から支援表明した人が戻ってくる「支援後のマイページ」。
 *   今できる支援・支援履歴・寄付レポートを一覧する。
 *
 * 注意: 動く仕様書（プロトタイプ）。データはサンプル。本番は supports / donations / tasks を集計。
 */

import { DONATIONS, themeEmoji, themeName } from '../_data'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`

const TODO = [
  { id: 1, icon: '📣', text: '防災政策クラファンを X で拡散する', cta: '拡散' },
  { id: 2, icon: '📅', text: '7月3日の防災勉強会に参加する', cta: '参加' },
  { id: 3, icon: '📝', text: '候補者A の政策アンケートに回答する', cta: '回答' },
  { id: 4, icon: '🤝', text: '関心のありそうな友人に紹介する', cta: '紹介' },
]

const HISTORY = [
  { label: '寄付', value: '10,000円' },
  { label: 'SNS拡散', value: '3回' },
  { label: 'イベント参加', value: '2回' },
  { label: '紹介', value: '1人' },
  { label: '会場提供', value: '1回' },
]

export default function AssistDashboardPage() {
  const [done, setDone] = useState<number[]>([])

  const donation = useMemo(() => {
    const total = DONATIONS.reduce((s, d) => s + d.amount, 0)
    const used = DONATIONS.reduce((s, d) => s + d.used, 0)
    return { total, used, remain: total - used }
  }, [])

  return (
    <div className='mx-auto w-full max-w-2xl px-4 py-8 pb-12'>
      <div className='mb-5'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>あなたの支援ダッシュボード</h1>
        <p className='mt-1 text-sm text-gray-500'>政策・候補者・クラファン・LINE から表明した支援が、ここに集まります。</p>
      </div>

      {/* 今できる支援 */}
      <div className='mb-5 rounded-xl border border-gray-200 bg-white p-5'>
        <h2 className='mb-3 text-sm font-bold text-gray-900'>今できる支援</h2>
        <div className='space-y-2'>
          {TODO.map((t) => {
            const isDone = done.includes(t.id)
            return (
              <div key={t.id} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${isDone ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100'}`}>
                <span className='text-lg'>{t.icon}</span>
                <span className={`min-w-0 flex-1 text-sm ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{t.text}</span>
                <button
                  onClick={() => setDone((p) => isDone ? p.filter((x) => x !== t.id) : [...p, t.id])}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${isDone ? 'border border-gray-300 text-gray-500' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                  {isDone ? '完了' : t.cta}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* 支援履歴 */}
      <div className='mb-5 rounded-xl border border-gray-200 bg-white p-5'>
        <h2 className='mb-3 text-sm font-bold text-gray-900'>あなたの支援履歴</h2>
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-5'>
          {HISTORY.map((h) => (
            <div key={h.label} className='rounded-lg bg-gray-50 p-3 text-center'>
              <p className='text-[11px] text-gray-500'>{h.label}</p>
              <p className='mt-0.5 text-sm font-bold text-gray-900'>{h.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 寄付レポート */}
      <div className='rounded-xl border border-gray-200 bg-white p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-sm font-bold text-gray-900'>あなたの寄付レポート</h2>
          <Link href='/prototype/donations' className='text-xs font-medium text-emerald-600'>詳しく →</Link>
        </div>
        <div className='mb-3 grid grid-cols-3 gap-2'>
          <div className='rounded-lg bg-gray-50 p-3 text-center'><p className='text-[11px] text-gray-500'>寄付総額</p><p className='mt-0.5 text-sm font-bold text-gray-900'>{yen(donation.total)}</p></div>
          <div className='rounded-lg bg-gray-50 p-3 text-center'><p className='text-[11px] text-gray-500'>使用済み</p><p className='mt-0.5 text-sm font-bold text-blue-600'>{yen(donation.used)}</p></div>
          <div className='rounded-lg bg-gray-50 p-3 text-center'><p className='text-[11px] text-gray-500'>残高</p><p className='mt-0.5 text-sm font-bold text-emerald-600'>{yen(donation.remain)}</p></div>
        </div>
        <div className='space-y-1.5'>
          {DONATIONS.map((d) => (
            <div key={d.id} className='flex items-center gap-2 text-xs text-gray-600'>
              <span>{themeEmoji(d.themeId)}</span>
              <span className='min-w-0 flex-1 truncate'>{themeName(d.themeId)} — {d.outcome}</span>
              <span className='shrink-0 text-gray-400'>{yen(d.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
