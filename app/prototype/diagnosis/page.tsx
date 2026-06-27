'use client'

/**
 * 【プロトタイプ】支援者向け 支援できること診断（30秒）
 *
 * 目的: 支援者が「自分は何を提供できるか」を入口で言語化し、サポータータイプ＋おすすめ募集案件へ。
 *       そのまま支援者登録に進める。
 *
 * 注意: 動く仕様書（プロトタイプ）。保存は localStorage（proto_assist_diagnosis_v1）。
 */

import { SUPPORT_REQUESTS, themeName } from '../_data'
import Link from 'next/link'
import { useState } from 'react'

const KINDS = ['個人', '法人', '団体', '士業', 'NPO'] as const
const SUPPORT_TYPES = ['無償ボランティア', '有償業務', '物品提供', '場所提供', '専門助言', '人脈紹介', '政策づくり協力'] as const
const SKILLS = ['デザイン', '動画編集', '撮影', 'SNS運用', 'Web制作', 'イベント運営', '会計', '法務', '広報', 'データ分析', '政策調査', '防災', '子育て', '福祉', '行政DX', '地域経済'] as const
const SCOPES = ['オンライン', '現地対応', '全国対応', '地域限定'] as const
const VIS = ['一般公開', '政治家にのみ公開', '承認制', '非公開'] as const

// サポータータイプ判定（ルールベース）
const RESULT_RULES: { type: string; emoji: string; skills?: string[]; supportTypes?: string[]; need?: string; theme?: string }[] = [
  { type: '広報・発信サポーター', emoji: '📣', skills: ['デザイン', '動画編集', '撮影', 'SNS運用', 'Web制作', '広報'], need: 'スキル提供' },
  { type: '政策アドバイザー', emoji: '🧠', skills: ['政策調査', 'データ分析'], supportTypes: ['政策づくり協力'], need: 'スキル提供' },
  { type: '専門家サポーター', emoji: '⚖️', skills: ['法務', '会計'], need: 'スキル提供' },
  { type: 'イベント運営サポーター', emoji: '🎪', skills: ['イベント運営'], need: '人的支援' },
  { type: '場所・物品提供パートナー', emoji: '🏠', supportTypes: ['場所提供', '物品提供'], need: '場所提供' },
  { type: '防災政策サポーター', emoji: '🛟', skills: ['防災'], theme: 'bosai' },
  { type: '子育て政策サポーター', emoji: '🎒', skills: ['子育て'], theme: 'kosodate' },
  { type: '地域課題レポーター', emoji: '📍', skills: ['地域経済', '福祉', '行政DX'] },
]

export default function AssistDiagnosisPage() {
  const [kind, setKind] = useState<string>('個人')
  const [area, setArea] = useState('')
  const [scope, setScope] = useState<string>('オンライン')
  const [supportTypes, setSupportTypes] = useState<string[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [visibility, setVisibility] = useState<string>('政治家にのみ公開')
  const [done, setDone] = useState(false)

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  const result = (() => {
    const scored = RESULT_RULES.map((r) => {
      let s = 0
      if (r.skills) s += r.skills.filter((x) => skills.includes(x)).length * 2
      if (r.supportTypes) s += r.supportTypes.filter((x) => supportTypes.includes(x)).length * 2
      return { r, s }
    }).sort((a, b) => b.s - a.s)
    return scored[0].s > 0 ? scored[0].r : RESULT_RULES[0]
  })()

  // おすすめ募集案件（判定タイプの need / theme に合うもの）
  const recommended = SUPPORT_REQUESTS.filter((q) =>
    (result.need && q.need === result.need) || (result.theme && q.themeId === result.theme)
  ).slice(0, 3)

  const run = () => {
    try { localStorage.setItem('proto_assist_diagnosis_v1', JSON.stringify({ kind, area, scope, supportTypes, skills, visibility, type: result.type })) } catch { /* ignore */ }
    setDone(true)
  }

  const chip = (active: boolean) => `rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
  const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700'

  if (done) {
    return (
      <div className='mx-auto w-full max-w-xl px-4 py-10'>
        <div className='rounded-2xl border border-emerald-200 bg-white p-6 text-center'>
          <div className='text-5xl'>{result.emoji}</div>
          <p className='mt-2 text-xs font-medium text-emerald-600'>あなたは</p>
          <h1 className='text-2xl font-bold text-gray-900'>「{result.type}」タイプ</h1>
          <p className='mt-2 text-sm text-gray-500'>あなたの得意は、政治・地域課題の解決に活かせます。</p>
        </div>

        {recommended.length > 0 && (
          <div className='mt-5'>
            <h2 className='mb-2 text-sm font-bold text-gray-900'>あなたに合う募集案件</h2>
            <div className='space-y-2'>
              {recommended.map((q) => (
                <div key={q.id} className='rounded-xl border border-gray-200 bg-white p-3'>
                  <p className='text-sm font-semibold text-gray-900'>{q.title}</p>
                  <p className='mt-0.5 text-xs text-gray-400'>{q.candidate}（{q.party}） · {themeName(q.themeId)} · {q.reward}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
          <Link href='/prototype/register' className='flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700'>この内容で支援者登録する</Link>
          <Link href='/prototype/requests' className='flex-1 rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50'>募集中の支援を見る</Link>
        </div>
        <button onClick={() => setDone(false)} className='mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600'>診断をやり直す</button>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-xl px-4 py-8 pb-12'>
      <div className='mb-6'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>支援できること診断</h1>
        <p className='mt-1 text-sm text-gray-500'>30秒で「あなたのサポータータイプ」と、合う募集案件が分かります。登録不要。</p>
      </div>

      <div className='space-y-4'>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <label className={labelCls}>あなたは</label>
          <div className='flex flex-wrap gap-2'>{KINDS.map((k) => <button key={k} onClick={() => setKind(k)} className={chip(kind === k)}>{k}</button>)}</div>
        </div>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <label className={labelCls}>支援できる地域・範囲</label>
          <input className='mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none' placeholder='例: 東京都杉並区' value={area} onChange={(e) => setArea(e.target.value)} />
          <div className='flex flex-wrap gap-2'>{SCOPES.map((s) => <button key={s} onClick={() => setScope(s)} className={chip(scope === s)}>{s}</button>)}</div>
        </div>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <label className={labelCls}>支援できる形態（複数可）</label>
          <div className='flex flex-wrap gap-2'>{SUPPORT_TYPES.map((s) => <button key={s} onClick={() => toggle(supportTypes, setSupportTypes, s)} className={chip(supportTypes.includes(s))}>{s}</button>)}</div>
        </div>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <label className={labelCls}>得意分野（複数可）</label>
          <div className='flex flex-wrap gap-2'>{SKILLS.map((s) => <button key={s} onClick={() => toggle(skills, setSkills, s)} className={chip(skills.includes(s))}>{s}</button>)}</div>
        </div>
        <div className='rounded-xl border border-gray-200 bg-white p-4'>
          <label className={labelCls}>公開可否</label>
          <div className='flex flex-wrap gap-2'>{VIS.map((v) => <button key={v} onClick={() => setVisibility(v)} className={chip(visibility === v)}>{v}</button>)}</div>
        </div>
      </div>

      <button onClick={run} className='mt-5 w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700'>診断する（30秒）</button>
      <p className='mt-3 text-center text-[11px] text-gray-400'>※ 支援・依頼・寄付・物品提供等は、公職選挙法・政治資金規正法等の取り扱いが異なる場合があります。実際の支援時は候補者・専門家等にご確認ください。</p>
    </div>
  )
}
