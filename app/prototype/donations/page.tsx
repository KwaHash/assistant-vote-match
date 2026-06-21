'use client'

/**
 * 【プロトタイプ】支援者向け 寄付履歴管理
 *
 * 目的: 支援者が自分の寄付を一覧で確認する。DON-ID別に金額・使用済み・未使用・成果を表示。
 *
 * 注意: 動く仕様書（プロトタイプ）。寄付はサンプル（本番は donations テーブル）。
 */

import { DONATIONS, themeEmoji, themeName } from '../_data'
import { useMemo } from 'react'

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`

export default function DonationsPage() {
  const totals = useMemo(() => {
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
        <h1 className='text-2xl font-bold text-gray-900'>寄付履歴</h1>
        <p className='mt-1 text-sm text-gray-500'>あなたの寄付ごとに、使用状況と成果を確認できます。</p>
      </div>

      {/* サマリー */}
      <div className='mb-5 grid grid-cols-3 gap-3'>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <p className='text-xs text-gray-500'>寄付総額</p>
          <p className='mt-1 text-base font-bold text-gray-900'>{yen(totals.total)}</p>
        </div>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <p className='text-xs text-gray-500'>使用済み</p>
          <p className='mt-1 text-base font-bold text-blue-600'>{yen(totals.used)}</p>
        </div>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <p className='text-xs text-gray-500'>未使用残高</p>
          <p className='mt-1 text-base font-bold text-emerald-600'>{yen(totals.remain)}</p>
        </div>
      </div>

      <div className='space-y-3'>
        {DONATIONS.map((d) => {
          const pct = Math.round((d.used / d.amount) * 100)
          return (
            <div key={d.id} className='rounded-2xl border border-gray-200 bg-white p-5'>
              <div className='mb-3 flex items-start justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl'>{themeEmoji(d.themeId)}</span>
                  <div>
                    <p className='text-sm font-bold text-gray-900'>{themeName(d.themeId)}</p>
                    <p className='font-mono text-[11px] text-gray-400'>{d.id}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-base font-bold text-gray-900'>{yen(d.amount)}</p>
                  <p className='text-[11px] text-gray-400'>{d.date}</p>
                </div>
              </div>
              <div className='mb-2'>
                <div className='mb-1 flex items-center justify-between text-xs text-gray-500'>
                  <span>使用済み {yen(d.used)}</span>
                  <span>残高 {yen(d.amount - d.used)}</span>
                </div>
                <div className='h-2 w-full overflow-hidden rounded-full bg-gray-100'>
                  <div className='h-full bg-blue-500' style={{ width: `${pct}%` }} />
                </div>
              </div>
              <p className='text-xs text-gray-600'><span className='font-medium text-gray-700'>成果:</span> {d.outcome}</p>
            </div>
          )
        })}
      </div>

      <p className='mt-5 text-center text-xs text-gray-400'>※ サンプル。本番は 寄付ID(DON)→支出(EXP)→成果(IMP) を紐づけて表示。</p>
    </div>
  )
}
