import Link from 'next/link'

const PROTOTYPES = [
  { href: '/prototype/register', title: '支援者登録', priority: '高', description: '関心政策・提供できる支援・地域・公開範囲を登録。支援マッチングの素になる。', notes: ['個人/法人・関心政策・支援タイプ・支援可能地域・公開範囲', '本番: supporters テーブル'] },
  { href: '/prototype/requests', title: '支援案件一覧', priority: '高', description: 'candidate で登録された支援募集を一覧・絞り込み（政策/支援種別/報酬）。', notes: ['政策テーマ・支援種別・報酬で絞り込み', '本番: support_requests テーブル'] },
  { href: '/prototype/matching', title: '支援マッチング', priority: '高', description: '登録した関心政策・支援タイプ・地域と募集を自動マッチングし、合う案件を提示。', notes: ['一致理由（関心政策/提供できる支援/地域）を表示', '支援者プロフィール × 募集で算出'] },
  { href: '/prototype/resources', title: 'リソース提供登録', priority: '高', description: 'お金以外の支援（物品・場所・スキル・人脈・SNS）を登録。', notes: ['種別・内容・対象地域・提供条件を登録', '本番: supports テーブル'] },
  { href: '/prototype/donations', title: '寄付履歴', priority: '高', description: '自分の寄付をDON-ID別に金額・使用済み・残高・成果で確認。', notes: ['寄付総額/使用済み/残高のサマリー', '本番: donations テーブル'] },
  { href: '/prototype/impact', title: '支援実績・バッジ', priority: '中', description: '支援がどう使われ成果になったかと、貢献内容で評価されるバッジを表示。', notes: ['支援実績（使用状況・成果）', 'バッジは金額でなく貢献内容で評価'] },
  { href: '/prototype/messages', title: '候補者とのメッセージ', priority: '中', description: '候補者・事務所とのやり取り（既存チャット資産を流用）。', notes: ['会話一覧・スレッド・送信', '本番: chat_conversations / chat_messages（WebSocket）'] },
]

export default function PrototypeIndexPage() {
  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-10'>
      <div className='mb-8'>
        <div className='mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ一覧 / 支援者向け assist.seijiselect.jp
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>実装前プロトタイプ</h1>
        <p className='mt-2 text-sm leading-relaxed text-gray-500'>
          支援者向け assist.seijiselect.jp の「動く仕様書」です。データはブラウザ内（localStorage）に保存されます。
          開発者はコードを参考に本番品質で実装し直してください。
        </p>
      </div>

      <div className='space-y-4'>
        {PROTOTYPES.map((proto) => (
          <Link key={proto.href} href={proto.href} className='block rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md'>
            <div className='mb-3 flex flex-wrap items-center gap-2'>
              <h2 className='text-base font-bold text-gray-900'>{proto.title}</h2>
              <span className='rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700'>支援者向け</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${proto.priority === '高' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>優先度{proto.priority}</span>
            </div>
            <p className='mb-3 text-sm leading-relaxed text-gray-600'>{proto.description}</p>
            <ul className='space-y-1'>
              {proto.notes.map((note) => (
                <li key={note} className='flex items-start gap-2 text-xs text-gray-500'>
                  <span className='mt-0.5 text-gray-300'>•</span>
                  {note}
                </li>
              ))}
            </ul>
            <div className='mt-4 text-xs font-medium text-emerald-600'>画面を見る →</div>
          </Link>
        ))}
      </div>

      <div className='mt-10 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-xs leading-relaxed text-gray-500'>
        <p className='mb-1 font-semibold text-gray-700'>開発者向けメモ</p>
        <p>プロトタイプ画面は <code className='rounded bg-gray-100 px-1 font-mono'>app/prototype/</code> 配下に集約。3サイト構成（国民=next-vote-match / 政治家=candidate-vote-match / 支援者=本リポジトリ）。共通DBで連携する想定。</p>
      </div>
    </div>
  )
}
