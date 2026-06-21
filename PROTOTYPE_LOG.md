# プロトタイプ開発ログ（支援者向け / assistant-vote-match = assist.seijiselect.jp）

横森（プロトタイプ担当）が `prototype` ブランチで作成した、支援者向けサイトのプロトタイプ履歴です。
3サイト構成：国民=next-vote-match / 政治家=candidate-vote-match / 支援者=本リポジトリ。

## 運用ルール（開発者向け）
- ブランチ: プロトタイプは `prototype` ブランチ（`main` は触りません）。
- 置き場所: `app/prototype/` 配下。本番ルートとは分離。
- データ: DBを使わず `localStorage` で動かします（本番はDB）。
- 認証: 本サイトはログイン制。プロトタイプは閲覧用に `/prototype` を認証ガードから除外（`providers/auth-provider.tsx`）。本番は戻すこと。
- 位置づけ: 「動く仕様書」。本番は本品質で実装し直してください。

## 変更履歴（2026-06-20）
| 画面 | 優先 | 場所 |
|---|---|---|
| 支援者登録 | 高 | `app/prototype/register/page.tsx` |
| 支援案件一覧 | 高 | `app/prototype/requests/page.tsx` |
| 支援マッチング | 高 | `app/prototype/matching/page.tsx` |
| リソース提供登録 | 高 | `app/prototype/resources/page.tsx` |
| 寄付履歴 | 高 | `app/prototype/donations/page.tsx` |
| 支援実績・バッジ | 中 | `app/prototype/impact/page.tsx` |
| 候補者とのメッセージ | 中 | `app/prototype/messages/page.tsx` |
| プロトタイプ共通データ | - | `app/prototype/_data.ts` |

## 詳細・本番メモ
- **支援者登録 → 支援マッチング**: 登録した関心政策・支援タイプ・地域（`proto_assist_profile_v1`）を、支援案件サンプルと突き合わせて一致理由つきで提示。本番は supporters × support_requests。
- **支援案件一覧**: candidate.seijiselect.jp の支援募集（support_requests）を表示。プロトはサンプル。
- **リソース提供登録**: お金以外の支援（物品/場所/スキル/人脈/SNS）。本番は supports テーブル。
- **寄付履歴 / 支援実績**: 本番は donations / supports → impacts を紐づけ。バッジは金額でなく貢献内容で評価。
- **メッセージ**: 既存 chat-vote-match（WebSocket）を流用する想定。プロトはサンプル会話。
- 公開設定は個人情報保護の対象。本人同意なしに資金・会員情報を共有しない（BACKLOG 8/11章）。

## Phase3 マイページ化（2026-06-20）
- 支援ダッシュボード `/prototype/dashboard`: assist を「登録入口」から「支援後のマイページ」に再定義。今できる支援・支援履歴・寄付レポートを集約。支援者登録は優先度を下げ、各サイトの支援導線に埋め込む方針。
