import Link from 'next/link'

interface Item { name: string; href: string; note?: string }
interface Menu { icon: string; title: string; desc: string; href: string }

const MERITS = [
  { icon: '🎯', title: '得意を社会に活かせる', desc: 'デザイン・動画・SNS・専門知識・場所・機材などが、政治・地域課題の解決に役立ちます。' },
  { icon: '📨', title: '相談・依頼が届く', desc: '政治家・候補者から、あなたのスキルに合った相談や依頼が届きます。' },
  { icon: '🏅', title: '支援実績が残る', desc: '支援した内容・成果が見える形で残り、貢献バッジになります。' },
]

const MENU: Menu[] = [
  { icon: '🧭', title: '支援できること診断', desc: '30秒で自分のサポータータイプと合う案件が分かる', href: '/prototype/diagnosis' },
  { icon: '📋', title: '募集中の支援', desc: '政治家・候補者が「支援してほしいこと」を見る', href: '/prototype/requests' },
  { icon: '🤝', title: '支援者として登録', desc: '提供できる支援を選択式で登録（公開範囲も選べる）', href: '/prototype/register' },
  { icon: '🔎', title: '支援マッチング', desc: 'あなたに合う募集案件・地域の政治家を自動で提案', href: '/prototype/matching' },
  { icon: '🏢', title: '法人・専門家の方へ', desc: '企業・士業の力を地域政治と社会課題の解決へ', href: '/prototype/register' },
  { icon: '🏅', title: '支援実績・バッジ', desc: '支援した内容・成果・貢献バッジを確認', href: '/prototype/impact' },
]

const CATEGORIES = [
  '広報・SNS支援', '動画・写真・デザイン支援', '政策づくり支援', 'イベント・街頭活動支援', '場所・物品・機材提供',
  '士業・専門家支援', '地域課題の声・現場情報', '企業・団体による地域貢献', 'テーマ別支援（防災・福祉・子育て）', '資金透明化・活動報告支援',
]

const MYPAGE: Item[] = [
  { name: 'マイページ', href: '/prototype/dashboard' },
  { name: '登録した支援リソース', href: '/prototype/resources' },
  { name: '寄付履歴', href: '/prototype/donations' },
  { name: '候補者とのメッセージ', href: '/prototype/messages' },
]

export default function PrototypeIndexPage() {
  return (
    <div className='mx-auto w-full max-w-3xl px-4 py-10'>
      {/* Hero */}
      <div className='mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6'>
        <div className='mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-600'>
          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
          プロトタイプ / 支援者向け assist.seijiselect.jp（マッチング再設計版）
        </div>
        <h1 className='text-2xl font-bold leading-snug text-gray-900'>あなたのスキル・人脈・場所・機材が、<br className='hidden sm:block' />政治を動かす力になる。</h1>
        <p className='mt-2 text-sm leading-relaxed text-gray-600'>
          政治家・候補者が必要としている支援と、支援できる人・会社・専門家をつなぐプラットフォームです。
          デザイン、動画、SNS、政策づくり、会場提供、専門助言、ボランティアなど、あなたの得意を社会課題の解決に活かせます。
        </p>
        <div className='mt-5 flex flex-col gap-2 sm:flex-row'>
          <Link href='/prototype/diagnosis' className='rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700'>支援できることを診断する</Link>
          <Link href='/prototype/requests' className='rounded-xl border border-emerald-300 bg-white px-5 py-3 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50'>募集中の支援を見る</Link>
        </div>
      </div>

      {/* メリット */}
      <div className='mb-6 grid gap-3 sm:grid-cols-3'>
        {MERITS.map((m) => (
          <div key={m.title} className='rounded-xl border border-gray-200 bg-white p-4'>
            <div className='text-2xl'>{m.icon}</div>
            <h3 className='mt-1 text-sm font-bold text-gray-900'>{m.title}</h3>
            <p className='mt-0.5 text-xs leading-relaxed text-gray-500'>{m.desc}</p>
          </div>
        ))}
      </div>

      {/* メインメニュー */}
      <h2 className='mb-2 text-xs font-bold uppercase tracking-wide text-gray-400'>できること</h2>
      <div className='mb-6 grid gap-3 sm:grid-cols-2'>
        {MENU.map((m) => (
          <Link key={m.href + m.title} href={m.href} className='group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md'>
            <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl'>{m.icon}</span>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-bold text-gray-900'>{m.title}</p>
              <p className='mt-0.5 text-[11px] leading-relaxed text-gray-500'>{m.desc}</p>
            </div>
            <span className='shrink-0 text-xs text-gray-300 group-hover:text-emerald-500'>→</span>
          </Link>
        ))}
      </div>

      {/* 支援カテゴリー */}
      <h2 className='mb-2 text-xs font-bold uppercase tracking-wide text-gray-400'>支援カテゴリー</h2>
      <div className='mb-6 flex flex-wrap gap-2'>
        {CATEGORIES.map((c) => (
          <Link key={c} href='/prototype/requests' className='rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50'>{c}</Link>
        ))}
      </div>

      {/* ログイン後マイページ */}
      <h2 className='mb-2 text-xs font-bold uppercase tracking-wide text-gray-400'>ログイン後（マイページ）</h2>
      <div className='mb-6 flex flex-wrap gap-2'>
        {MYPAGE.map((it) => (
          <Link key={it.href} href={it.href} className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50'>{it.name}</Link>
        ))}
      </div>

      {/* 法令・注意 */}
      <div className='rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-800'>
        <span className='font-semibold'>法令・注意事項:</span>{' '}
        政治活動・選挙運動・寄付・物品提供・有償業務は、公職選挙法、政治資金規正法その他関連法令上の取り扱いが異なる場合があります。
        実際の支援・依頼・契約・寄付にあたっては、候補者・政治団体・専門家等にご確認ください。
        （有償での選挙運動、有権者による電子メールでの選挙運動、匿名寄付、外国人・外国法人が関係する支援等は特に注意が必要です。）
      </div>

      <p className='mt-6 text-center text-[11px] text-gray-400'>支援者登録は「支援できること診断」からそのまま進めます。本人確認・法人確認・運営確認バッジ、契約・支払い連携は法務確認後に実装。</p>
    </div>
  )
}
