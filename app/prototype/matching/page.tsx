'use client'

/**
 * 【プロトタイプ】支援者向け 支援マッチング
 *
 * 目的: 支援者が登録した「関心政策・提供できる支援・地域」と、候補者の募集を自動マッチング。
 *
 * 注意: 動く仕様書（プロトタイプ）。支援者プロフィール（proto_assist_profile_v1）× 募集サンプルで算出。
 */

import { SUPPORT_REQUESTS, themeEmoji, themeName } from '../_data'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

interface Profile {
  name?: string
  interests?: string[]
  supportTypes?: string[]
  areaMode?: 'all' | 'region'
  supportArea?: string
}

export default function MatchingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('proto_assist_profile_v1')
      if (raw) setProfile(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  const matches = useMemo(() => {
    if (!profile) return []
    const interests = profile.interests ?? []
    const types = profile.supportTypes ?? []
    return SUPPORT_REQUESTS.map((r) => {
      const reasons: string[] = []
      let score = 0
      if (interests.includes(r.themeId)) { score += 2; reasons.push(`関心のある「${themeName(r.themeId)}」`) }
      if (types.includes(r.need)) { score += 2; reasons.push(`提供できる「${r.need}」`) }
      if (profile.areaMode === 'all') { score += 1; reasons.push('全国で支援可能') }
      else if (profile.supportArea && r.region.includes(profile.supportArea.replace(/\s/g, '').slice(0, 3))) { score += 1; reasons.push('対象地域が近い') }
      return { r, score, reasons }
    }).filter((m) => m.score > 0).sort((a, b) => b.score - a.score)
  }, [profile])

  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-8'>
      <div className='mb-5'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>支援マッチング</h1>
        <p className='mt-1 text-sm text-gray-500'>あなたの登録内容に合う支援案件を自動でおすすめします。</p>
      </div>

      {!profile ? (
        <div className='rounded-xl border border-dashed border-gray-300 py-12 text-center'>
          <p className='text-sm text-gray-500'>まず支援者登録をすると、あなたに合う案件が表示されます。</p>
          <Link href='/prototype/register' className='mt-3 inline-block rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700'>支援者登録へ</Link>
        </div>
      ) : matches.length === 0 ? (
        <div className='rounded-xl border border-dashed border-gray-300 py-12 text-center'>
          <p className='text-sm text-gray-500'>条件に合う案件が見つかりませんでした。</p>
          <Link href='/prototype/register' className='mt-2 inline-block text-sm font-medium text-emerald-600'>関心政策・支援タイプを見直す</Link>
        </div>
      ) : (
        <>
          <p className='mb-3 text-sm text-gray-600'>{profile.name ? `${profile.name}さんに` : 'あなたに'}合う案件 {matches.length}件</p>
          <div className='space-y-3'>
            {matches.map(({ r, reasons }) => (
              <div key={r.id} className='rounded-xl border border-emerald-200 bg-white p-4'>
                <div className='flex items-start gap-3'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xl'>{themeEmoji(r.themeId)}</div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-bold text-gray-900'>{r.title}</p>
                    <p className='mt-0.5 text-xs text-gray-400'>{r.candidate}（{r.party}） · {r.region} · {r.reward}</p>
                    <div className='mt-2 flex flex-wrap gap-1.5'>
                      {reasons.map((re) => (
                        <span key={re} className='rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600'>✓ {re}</span>
                      ))}
                    </div>
                  </div>
                  <button className='shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700'>応募</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
