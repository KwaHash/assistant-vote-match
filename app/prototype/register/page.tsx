'use client'

/**
 * 【プロトタイプ】支援者向け 支援者登録
 *
 * 目的: 支援者が関心政策・支援タイプ・支援可能地域・公開範囲などを登録する。
 *       ここで登録した内容が「支援マッチング」の素になる（Support ID / User ID）。
 *
 * 注意: 動く仕様書（プロトタイプ）。保存は localStorage（proto_assist_profile_v1 / 本番: supporters テーブル）。
 */

import { POLICY_THEMES, SUPPORT_TYPES } from '../_data'
import { useEffect, useState } from 'react'

type Kind = 'individual' | 'org'
type AreaMode = 'all' | 'region'
type Visibility = 'private' | 'candidate' | 'public'

const STORAGE_KEY = 'proto_assist_profile_v1'

export default function AssistRegisterPage() {
  const [name, setName] = useState('')
  const [kind, setKind] = useState<Kind>('individual')
  const [residence, setResidence] = useState('')
  const [areaMode, setAreaMode] = useState<AreaMode>('all')
  const [supportArea, setSupportArea] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [supportTypes, setSupportTypes] = useState<string[]>([])
  const [profession, setProfession] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('candidate')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const d = JSON.parse(raw)
      setName(d.name ?? ''); setKind(d.kind ?? 'individual'); setResidence(d.residence ?? '')
      setAreaMode(d.areaMode ?? 'all'); setSupportArea(d.supportArea ?? '')
      setInterests(d.interests ?? []); setSupportTypes(d.supportTypes ?? [])
      setProfession(d.profession ?? ''); setVisibility(d.visibility ?? 'candidate')
      setSavedAt(d.savedAt ?? null)
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  const canSave = name.trim() !== ''

  const save = () => {
    const now = new Date().toLocaleString('ja-JP')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      name, kind, residence, areaMode, supportArea, interests, supportTypes, profession, visibility, savedAt: now,
    }))
    setSavedAt(now)
  }

  const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400'
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700'
  const chip = (active: boolean) => `rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`

  return (
    <div className='mx-auto w-full max-w-2xl px-4 py-8 pb-32'>
      <div className='mb-6'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>支援者登録</h1>
        <p className='mt-1 text-sm text-gray-500'>
          関心のある政策や、提供できる支援を登録すると、あなたに合う支援案件が見つかります。
        </p>
      </div>

      <div className='space-y-5'>
        <div className='rounded-xl border border-gray-200 bg-white p-5'>
          <div className='mb-4 grid grid-cols-2 gap-3'>
            <div>
              <label className={labelCls}>お名前 / 表示名</label>
              <input className={inputCls} placeholder='例: 山田 花子' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>区分</label>
              <div className='flex gap-2'>
                {([['individual', '個人'], ['org', '法人・団体']] as const).map(([v, l]) => (
                  <button key={v} type='button' onClick={() => setKind(v)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${kind === v ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className={labelCls}>居住地域</label>
              <input className={inputCls} placeholder='例: 東京都渋谷区' value={residence} onChange={(e) => setResidence(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>職業 / 専門性（任意）</label>
              <input className={inputCls} placeholder='例: 動画編集 / 会計士' value={profession} onChange={(e) => setProfession(e.target.value)} />
            </div>
          </div>
          <div className='mt-4'>
            <label className={labelCls}>支援できる地域</label>
            <div className='flex gap-2'>
              {([['all', '全国'], ['region', '地域を指定']] as const).map(([v, l]) => (
                <button key={v} type='button' onClick={() => setAreaMode(v)} className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${areaMode === v ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{l}</button>
              ))}
            </div>
            {areaMode === 'region' && <input className={`${inputCls} mt-2`} placeholder='例: 東京都 / 渋谷区' value={supportArea} onChange={(e) => setSupportArea(e.target.value)} />}
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 bg-white p-5'>
          <label className={labelCls}>関心のある政策</label>
          <div className='flex flex-wrap gap-2'>
            {POLICY_THEMES.map((t) => (
              <button key={t.id} type='button' onClick={() => toggle(interests, setInterests, t.id)} className={chip(interests.includes(t.id))}>{t.emoji} {t.name}</button>
            ))}
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 bg-white p-5'>
          <label className={labelCls}>提供できる支援</label>
          <div className='flex flex-wrap gap-2'>
            {SUPPORT_TYPES.map((t) => (
              <button key={t} type='button' onClick={() => toggle(supportTypes, setSupportTypes, t)} className={chip(supportTypes.includes(t))}>{t}</button>
            ))}
          </div>
        </div>

        <div className='rounded-xl border border-gray-200 bg-white p-5'>
          <label className={labelCls}>公開範囲</label>
          <select className={inputCls} value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
            <option value='private'>非公開</option>
            <option value='candidate'>候補者にのみ公開</option>
            <option value='public'>公開</option>
          </select>
          <p className='mt-2 text-xs text-gray-400'>※ 公開範囲は個人情報保護の対象。本人同意なしに情報を共有しません。</p>
        </div>
      </div>

      <div className='fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur'>
        <div className='mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3'>
          <div className='text-xs text-gray-500'>{name || '（名前未入力）'}<span className='mx-1.5'>·</span>{savedAt ? `保存済 ${savedAt}` : '未保存'}</div>
          <button onClick={save} disabled={!canSave} className='rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300'>
            登録する
          </button>
        </div>
      </div>
    </div>
  )
}
