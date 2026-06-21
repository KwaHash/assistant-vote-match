'use client'

/**
 * 【プロトタイプ】支援者向け リソース提供登録
 *
 * 目的: 支援者がお金以外の支援（物品・場所・スキル・人脈・SNS拡散など）を登録する。
 *       候補者の支援募集とマッチングされる想定。
 *
 * 注意: 動く仕様書（プロトタイプ）。保存は localStorage（proto_assist_resources_v1 / 本番: supports テーブル）。
 */

import { useEffect, useState } from 'react'

const RESOURCE_TYPES = ['物品貸与', '場所提供', 'スキル提供', '人的支援', '紹介', '情報提供', 'SNS拡散'] as const
type Cond = '無償' | '有償' | '要相談'

interface Resource {
  id: number
  type: string
  title: string
  detail: string
  area: string
  cond: Cond
}

const STORAGE_KEY = 'proto_assist_resources_v1'

export default function ResourcesPage() {
  const [items, setItems] = useState<Resource[]>([])
  const [type, setType] = useState<string>(RESOURCE_TYPES[0])
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [area, setArea] = useState('')
  const [cond, setCond] = useState<Cond>('無償')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw).items ?? [])
    } catch {
      /* ignore */
    }
  }, [])

  const persist = (next: Resource[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: next }))

  const canAdd = title.trim() !== ''
  const add = () => {
    if (!canAdd) return
    const next = [{ id: Math.max(0, ...items.map((i) => i.id)) + 1, type, title, detail, area, cond }, ...items]
    setItems(next); persist(next)
    setTitle(''); setDetail(''); setArea('')
  }
  const remove = (id: number) => { const next = items.filter((i) => i.id !== id); setItems(next); persist(next) }

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400'
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700'

  return (
    <div className='mx-auto w-full max-w-2xl px-4 py-8 pb-12'>
      <div className='mb-6'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>リソース提供登録</h1>
        <p className='mt-1 text-sm text-gray-500'>お金以外で提供できる支援（物品・場所・スキル・人脈・SNSなど）を登録します。</p>
      </div>

      <div className='mb-6 rounded-xl border border-gray-200 bg-white p-5'>
        <div className='mb-4 grid grid-cols-2 gap-3'>
          <div>
            <label className={labelCls}>種別</label>
            <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
              {RESOURCE_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div>
            <label className={labelCls}>提供条件</label>
            <select className={inputCls} value={cond} onChange={(e) => setCond(e.target.value as Cond)}>
              <option value='無償'>無償</option>
              <option value='有償'>有償</option>
              <option value='要相談'>要相談</option>
            </select>
          </div>
        </div>
        <div className='mb-4'>
          <label className={labelCls}>提供できるもの</label>
          <input className={inputCls} placeholder='例: ポータブル電源2台 / 会議室（20名）/ 動画編集' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='mb-4'>
          <label className={labelCls}>詳細（任意）</label>
          <textarea rows={2} className={`${inputCls} resize-none`} placeholder='例: 平日夜と土日に対応可能。1本3分程度まで。' value={detail} onChange={(e) => setDetail(e.target.value)} />
        </div>
        <div className='mb-4'>
          <label className={labelCls}>対象地域（任意）</label>
          <input className={inputCls} placeholder='例: 東京都 / オンライン' value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <button onClick={add} disabled={!canAdd} className='w-full rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300'>
          リソースを登録
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-5'>
        <h2 className='mb-3 text-sm font-bold text-gray-900'>登録したリソース（{items.length}件）</h2>
        {items.length === 0 ? (
          <p className='py-8 text-center text-sm text-gray-400'>まだ登録がありません</p>
        ) : (
          <div className='space-y-2'>
            {items.map((i) => (
              <div key={i.id} className='rounded-lg border border-gray-100 p-3'>
                <div className='flex items-start justify-between gap-2'>
                  <span className='text-sm font-semibold text-gray-900'>{i.title}</span>
                  <button onClick={() => remove(i.id)} className='shrink-0 rounded px-1.5 text-gray-300 hover:bg-gray-100 hover:text-rose-500' aria-label='削除'>✕</button>
                </div>
                <div className='mt-1 flex flex-wrap gap-1.5'>
                  <span className='rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600'>{i.type}</span>
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500'>{i.cond}</span>
                  {i.area && <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500'>📍 {i.area}</span>}
                </div>
                {i.detail && <p className='mt-1.5 text-xs text-gray-500'>{i.detail}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
