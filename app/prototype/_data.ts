/**
 * 【プロトタイプ共通データ】支援者向け assist.seijiselect.jp
 * 政策テーマ・支援案件（candidate募集のサンプル）・寄付履歴・支援種別・バッジ。
 * 本番は共通DB（policies / support_requests / donations / supports / badges）から。
 */

export interface PolicyTheme {
  id: string
  name: string
  emoji: string
}

export const POLICY_THEMES: PolicyTheme[] = [
  { id: 'bosai', name: '防災・災害死ゼロ', emoji: '🛟' },
  { id: 'nettyusho', name: '高齢者熱中症対策', emoji: '🌡️' },
  { id: 'kotsu', name: '交通事故削減', emoji: '🚸' },
  { id: 'kosodate', name: '子育て・教育', emoji: '🎒' },
  { id: 'nyusatsu', name: '入札透明化', emoji: '🔍' },
  { id: 'ai-gyosei', name: 'AI行政改革', emoji: '🤖' },
  { id: 'jinken', name: '人権外交', emoji: '🕊️' },
  { id: 'energy', name: 'エネルギー・蓄電池', emoji: '🔋' },
  { id: 'chiho-zaisei', name: '地方財政改革', emoji: '🏛️' },
  { id: 'kanko', name: '観光・温泉振興', emoji: '♨️' },
]

export const themeName = (id: string) => POLICY_THEMES.find((t) => t.id === id)?.name ?? id
export const themeEmoji = (id: string) => POLICY_THEMES.find((t) => t.id === id)?.emoji ?? '•'

// 支援の種別（リソース提供・支援者登録で共通）
export const SUPPORT_TYPES = ['寄付', '物品貸与', '場所提供', 'スキル提供', '人的支援', '紹介', 'SNS拡散'] as const

export type Reward = '無償' | '有償' | '要相談'

// 支援案件（candidate.seijiselect.jp で登録された募集のサンプル）
export interface SupportRequest {
  id: number
  title: string
  candidate: string
  party: string
  themeId: string
  need: string // 必要な支援種別
  region: string
  reward: Reward
  period: string
  online: boolean
}

export const SUPPORT_REQUESTS: SupportRequest[] = [
  { id: 1, title: '防災政策の紹介動画の編集者を募集', candidate: '田中 一郎', party: '自民党', themeId: 'bosai', need: 'スキル提供', region: '東京都', reward: '要相談', period: '2週間', online: true },
  { id: 2, title: '子育て政策の街頭演説の場所を貸してほしい', candidate: '鈴木 美咲', party: '中道改革', themeId: 'kosodate', need: '場所提供', region: '東京都 世田谷区', reward: '無償', period: '1日', online: false },
  { id: 3, title: '入札透明化レポートの作成補助（資料調査）', candidate: '木村 彩', party: '中道改革', themeId: 'nyusatsu', need: 'スキル提供', region: 'オンライン', reward: '有償', period: '3週間', online: true },
  { id: 4, title: '高齢者向け熱中症対策イベントの受付ボランティア', candidate: '小林 誠', party: '参政党', themeId: 'nettyusho', need: '人的支援', region: '静岡県 熱海市', reward: '無償', period: '1日', online: false },
  { id: 5, title: 'エネルギー政策の勉強会の会場を提供してほしい', candidate: '佐藤 健太', party: '国民民主党', themeId: 'energy', need: '場所提供', region: '東京都', reward: '無償', period: '半日', online: false },
  { id: 6, title: 'SNSでの政策発信を拡散してほしい', candidate: '中村 香織', party: 'れいわ新選', themeId: 'jinken', need: 'SNS拡散', region: 'オンライン', reward: '無償', period: '随時', online: true },
  { id: 7, title: '地域説明会の音響機材を貸してほしい', candidate: '山本 大輔', party: '自民党', themeId: 'bosai', need: '物品貸与', region: '愛知県 名古屋市', reward: '要相談', period: '1日', online: false },
  { id: 8, title: '政策チラシのデザイン制作', candidate: '高橋 由美', party: 'みらい', themeId: 'kosodate', need: 'スキル提供', region: 'オンライン', reward: '有償', period: '2週間', online: true },
]

// 寄付履歴（サンプル）
export interface Donation {
  id: string
  themeId: string
  amount: number
  used: number
  date: string
  outcome: string
}

export const DONATIONS: Donation[] = [
  { id: 'DON-2026-000001', themeId: 'bosai', amount: 10000, used: 4500, date: '2026-05-12', outcome: '都議会向け質問案を作成中' },
  { id: 'DON-2026-000002', themeId: 'nyusatsu', amount: 5000, used: 1200, date: '2026-04-20', outcome: '自治体入札調査レポートを作成中' },
  { id: 'DON-2026-000003', themeId: 'kosodate', amount: 3000, used: 3000, date: '2026-03-08', outcome: '給食無償化の提言書に反映' },
]

// 支援者バッジ（金額でなく貢献内容で評価）
export interface Badge {
  id: string
  label: string
  emoji: string
  desc: string
  earned: boolean
}

export const BADGES: Badge[] = [
  { id: 'bosai', label: '防災サポーター', emoji: '🛟', desc: '防災政策を支援', earned: true },
  { id: 'impl', label: '政策実装メンバー', emoji: '🏗️', desc: '政策の実装に貢献', earned: true },
  { id: 'region', label: '地域支援リーダー', emoji: '📍', desc: '地域の活動を支援', earned: false },
  { id: 'clean', label: '透明化協力者', emoji: '🔍', desc: '透明化の取り組みに協力', earned: true },
  { id: 'monthly', label: '月額支援者', emoji: '🔁', desc: '継続的に応援', earned: false },
  { id: 'volunteer', label: '100時間ボランティア', emoji: '⏱️', desc: '累計100時間の支援', earned: false },
]
