'use client'

/**
 * 【プロトタイプ】支援者向け 支援実績レポート・バッジ
 *
 * 目的: 支援者が「自分の支援がどう使われ、どんな成果になったか」を確認する。
 *       バッジは金額でなく「貢献内容」で評価する（構想の方針）。
 *
 * 注意: 動く仕様書（プロトタイプ）。実績はサンプル（本番は supports × impacts）。
 */

import { BADGES } from '../_data'

const RECORDS = [
  { support: '会議室提供', use: '2026年7月の勉強会で使用', outcome: '参加者23名・議員2名' },
  { support: '動画編集', use: '防災政策の紹介動画1本を公開', outcome: '再生数 12,000回' },
  { support: '5万円の寄付', use: '政策レポート作成費に充当', outcome: '都議会質問案に反映' },
  { support: 'ポータブル電源の貸与', use: '防災イベントで使用', outcome: '参加者80名' },
]

export default function ImpactPage() {
  const earned = BADGES.filter((b) => b.earned).length

  return (
    <div className='mx-auto w-full max-w-2xl px-4 py-8 pb-12'>
      <div className='mb-5'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>支援実績・バッジ</h1>
        <p className='mt-1 text-sm text-gray-500'>あなたの支援がどう使われ、どんな成果につながったかを確認できます。</p>
      </div>

      {/* バッジ */}
      <div className='mb-6 rounded-xl border border-gray-200 bg-white p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-sm font-bold text-gray-900'>獲得バッジ</h2>
          <span className='text-xs text-gray-400'>{earned} / {BADGES.length}</span>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          {BADGES.map((b) => (
            <div key={b.id} className={`rounded-xl border p-3 text-center ${b.earned ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
              <div className='text-2xl'>{b.emoji}</div>
              <p className={`mt-1 text-xs font-semibold ${b.earned ? 'text-emerald-700' : 'text-gray-400'}`}>{b.label}</p>
              <p className='mt-0.5 text-[10px] text-gray-400'>{b.desc}</p>
            </div>
          ))}
        </div>
        <p className='mt-3 text-center text-[11px] text-gray-400'>※ バッジは金額でなく「貢献内容」で評価します。</p>
      </div>

      {/* 実績 */}
      <div className='rounded-xl border border-gray-200 bg-white p-5'>
        <h2 className='mb-3 text-sm font-bold text-gray-900'>支援の実績</h2>
        <div className='space-y-2'>
          {RECORDS.map((r, i) => (
            <div key={i} className='rounded-lg border border-gray-100 p-3'>
              <p className='text-sm font-semibold text-gray-900'>{r.support}</p>
              <div className='mt-1 flex flex-col gap-0.5 text-xs text-gray-500'>
                <span>使用: {r.use}</span>
                <span className='text-emerald-600'>成果: {r.outcome}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
