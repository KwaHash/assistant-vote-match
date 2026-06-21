'use client'

/**
 * 【プロトタイプ】支援者向け 支援案件一覧
 *
 * 目的: candidate.seijiselect.jp で登録された支援募集を一覧・絞り込みする。
 *
 * 注意: 動く仕様書（プロトタイプ）。案件はサンプル（本番は support_requests テーブル）。
 */

import { POLICY_THEMES, SUPPORT_REQUESTS, SUPPORT_TYPES, themeEmoji, themeName } from '../_data'
import { useMemo, useState } from 'react'

export default function RequestsPage() {
  const [theme, setTheme] = useState('all')
  const [need, setNeed] = useState('all')
  const [reward, setReward] = useState('all')

  const list = useMemo(
    () =>
      SUPPORT_REQUESTS.filter((r) => {
        if (theme !== 'all' && r.themeId !== theme) return false
        if (need !== 'all' && r.need !== need) return false
        if (reward !== 'all' && r.reward !== reward) return false
        return true
      }),
    [theme, need, reward]
  )

  const selectCls = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none'

  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-8'>
      <div className='mb-5'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>支援案件一覧</h1>
        <p className='mt-1 text-sm text-gray-500'>候補者からの「お金以外の支援」の募集です。政策・支援種別・報酬で絞り込めます。</p>
      </div>

      <div className='mb-5 flex flex-wrap gap-2'>
        <select className={selectCls} value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value='all'>すべての政策</option>
          {POLICY_THEMES.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
        </select>
        <select className={selectCls} value={need} onChange={(e) => setNeed(e.target.value)}>
          <option value='all'>すべての支援種別</option>
          {SUPPORT_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
        <select className={selectCls} value={reward} onChange={(e) => setReward(e.target.value)}>
          <option value='all'>報酬すべて</option>
          <option value='無償'>無償</option>
          <option value='有償'>有償</option>
          <option value='要相談'>要相談</option>
        </select>
      </div>

      <p className='mb-3 text-xs text-gray-400'>{list.length}件の募集</p>

      <div className='space-y-3'>
        {list.map((r) => (
          <div key={r.id} className='rounded-xl border border-gray-200 bg-white p-4'>
            <div className='flex items-start gap-3'>
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 text-xl'>{themeEmoji(r.themeId)}</div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-bold text-gray-900'>{r.title}</p>
                <p className='mt-0.5 text-xs text-gray-400'>{r.candidate}（{r.party}） · {themeName(r.themeId)}</p>
                <div className='mt-2 flex flex-wrap gap-1.5'>
                  <span className='rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600'>{r.need}</span>
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500'>📍 {r.region}</span>
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500'>{r.reward}</span>
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500'>{r.period}</span>
                  {r.online && <span className='rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-600'>オンライン可</span>}
                </div>
              </div>
              <button className='shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700'>応募</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className='py-10 text-center text-sm text-gray-400'>条件に合う募集がありません</p>}
      </div>
    </div>
  )
}
