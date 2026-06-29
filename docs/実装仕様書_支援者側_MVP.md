# 実装仕様書（支援者向け assist.seijiselect.jp / MVP）

完成済みプロトタイプ（`prototype` ブランチ）を流用して本実装するための仕様書です。
**支援リソース台帳ではなく、政治家・候補者と支援者（個人/企業/専門家）をつなぐ「政治活動支援マッチングサイト」** として実装します。

- 対象リポジトリ: 本リポジトリ `assistant-vote-match`
- ベース: ブランチ `prototype`
- 関連: 画面ごとの仕様=`PROTOTYPE_LOG.md`、コンプラ=`docs/コンプライアンス・リスク一覧.md`

---

## 1. コンセプト・MVP方針
- **「あなたのスキル・人脈・場所・機材が、政治を動かす力になる。」**
- 「登録すると何が得られるか／自分は何を支援できるか／政治家側のニーズ」が一目で分かるLP型トップ。
- いきなり寄付・有償契約を前面に出さない。**お金を動かす機能（寄付・有償決済）は本実装では入れない**（記録のみ・法務確認後）。
- 政治・選挙・寄付に関わるため**法令注意・国籍/属性確認**を各所に表示。

## 2. 画面構成（MVP）
| 画面 / ルート | 内容 |
|---|---|
| トップ `/prototype` | LP型（メインコピー／3メリット／メインメニュー／支援カテゴリー10／法令注意） |
| 支援できること診断 `/prototype/diagnosis` | 30秒・登録不要。個人/法人・地域・支援形態・得意分野・公開可否・**国籍/属性** → サポータータイプ＋おすすめ案件→登録誘導 |
| 募集中の支援 `/prototype/requests` | 政治家・候補者が登録した「支援してほしいこと」一覧（地域/支援タイプ/オンライン可否/必要スキル/期限/応募） |
| 支援者登録 `/prototype/register` | 選択式中心（基本情報・支援タイプ・提供内容・公開設定・希望条件） |
| 支援マッチング `/prototype/matching` | あなたに合う募集案件・地域の政治家・スキルに合う案件を提案 |
| 支援実績・バッジ `/prototype/impact` | 支援した候補者/政策テーマ/完了案件数/貢献バッジ |
| メッセージ `/prototype/messages` | 候補者とのやりとり |
| マイページ `/prototype/dashboard` | 登録リソース/応募中の案件/支援実績/プロフィール |
| 寄付履歴 `/prototype/donations` | 記録のみ（実決済は法務確認後） |

## 3. 進め方（重要：作り直さない）
1. 画面は完成済みプロトを流用（作り直さない）。
2. バックエンドは作らず **Supabase**（DB＋認証＋ファイル）、公開は **Vercel**。
3. **保存処理を1ファイルに集約**してから Supabase 化（現状 assist は各画面が localStorage を直接利用 → `app/prototype/_store.ts` に集約し、その中身を Supabase の select/upsert に差し替える）。

## 4. Supabase テーブル（MVP優先）
```sql
create table supporters (
  id uuid primary key references auth.users on delete cascade,
  name text, kind text,                    -- 個人/法人/団体/士業/NPO
  contact_name text, email text, phone text, area text, scope text, web text,
  support_types text[],                    -- 無償ボランティア/有償業務/物品提供/場所提供/専門助言/政策づくり協力/人脈紹介/寄付・献金
  skills text[],                           -- デザイン/動画/SNS/会計/法務/防災/子育て… 
  visibility text,                         -- 一般公開/政治家にのみ公開/承認制/非公開
  nationality text,                        -- 日本/外国籍・外国法人（国籍確認）
  verified_id boolean default false, verified_org boolean default false, verified_admin boolean default false,
  updated_at timestamptz default now()
);
create table support_requests (             -- 政治家側が登録する「支援してほしいこと」
  id bigint generated always as identity primary key,
  candidate_id uuid, title text, region text, support_type text, -- 無償/有償/要相談
  online_ok boolean, required_skills text[], theme_key text, deadline date,
  compliance_class text,                   -- 無償ボランティア/有償業務/物品提供/場所提供/寄付・献金/専門助言/人脈紹介/政策づくり協力
  status text, is_published boolean default false
);
create table support_applications (         -- 支援者の応募
  id bigint generated always as identity primary key,
  request_id bigint references support_requests, supporter_id uuid references supporters,
  message text, status text, created_at timestamptz default now()
);
create table support_badges (
  id bigint generated always as identity primary key,
  supporter_id uuid references supporters, badge_key text, label text, granted_at timestamptz default now()
);
```
- RLS: `supporters` は本人＋（公開範囲に応じて）政治家/運営。`support_requests` は公開分を全員閲覧、編集は登録した政治家。応募は本人＋対象政治家＋運営。
- Storage: `portfolios`（実績資料）。

## 5. 他サイト・運営adminとの連携
- **募集案件（support_requests）は政治家側が登録**（candidate 側の機能 or admin 経由）。assist は公開分を表示・応募。
- **支援リソースの本人/法人/運営確認・公開可否の審査は運営admin**（運営OS「支援リソース管理」タブ）。
- 同一Supabaseを共有。

## 6. コンプライアンス（必須表示・docs/コンプライアンス・リスク一覧.md）
- 登録・応募・依頼画面に法令注意文（公職選挙法・政治資金規正法等で取り扱いが異なる旨）。
- **国籍・属性を申告・確認**（外国籍・外国法人等からの寄付・物品提供は禁止）。
- **「有償業務」は選挙運動を除く**（選挙運動の対価＝買収のおそれ）。選挙運動の有償依頼は扱わない。
- 公開範囲（一般公開/政治家のみ/承認制/非公開）を必ず選べる。要配慮個人情報（思想信条・支援内容）は RLS で保護。

## 7. 実装順序（Phase）
- **Phase 1（プロトで完了）**: トップをLP型に・支援メリット・CTA・カテゴリー・現一覧は下層へ。
- **Phase 2（プロトで完了）**: 支援できること診断・選択式登録フォーム・国籍/属性確認。
- **Phase 3**: 募集案件一覧・応募導線・政治家側からの案件登録。
- **Phase 4**: マッチング（支援者⇄案件・地域・スキル）。
- **Phase 5**: 支援実績・貢献バッジ／法人・専門家LP・テーマ別LP。
- **Phase 6**: 本人/法人/運営確認バッジ・レビュー・感謝メッセージ・契約/支払い連携（法務確認後）。

## 8. 完了条件（MVP）
- [ ] トップで支援者のメリットが伝わる／支援できること診断がある
- [ ] 支援タイプ・得意分野を選択式で登録でき、公開/非公開/承認制を選べる
- [ ] 募集中の支援案件が見え、支援者が応募できる
- [ ] 政治家側が募集案件を登録できる（または admin 経由）
- [ ] 支援内容が法令上の区分で分類され、注意文・国籍/属性確認が表示される
- [ ] 支援実績・貢献バッジの枠がある／スマホで見やすい
- [ ] お金を動かす機能（寄付・有償決済）は記録のみ（法務確認後）

## 9. 期間・前提
- 約1ヶ月（プロト流用・Supabase・お金は記録のみ）。本人/法人確認・契約/支払いは別フェーズ＋リーガルレビュー。
