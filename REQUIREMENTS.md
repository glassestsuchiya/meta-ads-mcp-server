# Meta Ads MCP Server 要件定義書

## 1. 概要

### 1.1 目的
Meta Marketing API (Graph API) を利用したMCP (Model Context Protocol) サーバー。
Claude DesktopからFacebook/Instagram広告アカウントのデータ取得・管理を可能にする。

### 1.2 対象プラットフォーム
- Facebook Ads
- Instagram Ads
- Audience Network
- Messenger Ads

### 1.3 使用API
- **Meta Marketing API** (Graph API v24.0)
- ベースURL: `https://graph.facebook.com/v24.0/`
- ドキュメント: https://developers.facebook.com/docs/marketing-api

---

## 2. プロジェクト構成

### 2.1 ファイル配置
```
C:\dev\mcp-gads\meta-ads-mcp-server\
├── .git/
├── .env                           ← 認証情報（Git管理外）
├── .env.example                   ← 認証情報テンプレート
├── .gitignore
├── package.json
├── tsconfig.json
├── REQUIREMENTS.md                ← この要件定義書
├── src/
│   ├── index.ts                   ← MCPサーバーエントリーポイント
│   ├── types.ts                   ← 型定義
│   ├── schemas.ts                 ← Zodスキーマ定義
│   ├── constants.ts               ← 定数・フィールド定義
│   └── services/
│       ├── auth.ts                ← OAuth認証・トークン管理
│       ├── client.ts              ← Meta Graph APIクライアント
│       └── formatter.ts           ← レスポンスフォーマッター
├── dist/                          ← ビルド出力
└── node_modules/
```

### 2.2 技術スタック
- **言語**: TypeScript
- **ランタイム**: Node.js v18+
- **MCP SDK**: @modelcontextprotocol/sdk
- **バリデーション**: Zod
- **HTTP クライアント**: fetch (Node.js native)

---

## 3. 認証方式

### 3.1 OAuth 2.0 トークン

| トークンタイプ | 有効期限 | 用途 |
|---------------|---------|------|
| User Access Token | 約24時間 | Graph API Explorer で作成（開発用） |
| System User Access Token | 最大60日または無期限 | Business Manager のシステムユーザー発行（実運用向き） |

### 3.2 トークンの渡し方
```
# Authorization header（推奨）
Authorization: Bearer {access_token}

# Query parameter
?access_token={access_token}
```

### 3.3 必要な権限（Permissions）
```
ads_read              - インサイト取得、配信状況参照
ads_management        - campaign/adset/ad の作成・更新
```

**注意**: 他社アカウントを扱う場合は Advanced Access が必要（アプリ審査が必要）

### 3.4 環境変数
```bash
META_ADS_ACCESS_TOKEN=your_access_token
META_ADS_APP_ID=your_app_id                    # オプション
META_ADS_APP_SECRET=your_app_secret            # オプション
META_ADS_DEFAULT_ACCOUNT_ID=act_123456789      # オプション
```

---

## 4. ID体系

| 項目 | 形式 | 例 | 取得場所 |
|------|------|-----|----------|
| Ad Account ID | `act_{numeric_id}` | `act_123456789` | Ads Manager URL内 `act=...` |
| Campaign ID | `{campaign_id}` | `23850001234567890` | API応答 |
| Ad Set ID | `{adset_id}` | `23850001234567891` | API応答 |
| Ad ID | `{ad_id}` | `23850001234567892` | API応答 |
| Creative ID | `{creative_id}` | `23850001234567893` | API応答 |
| Report Run ID | `{report_run_id}` | `23850001234567894` | 非同期レポート |

---

## 5. 実装機能一覧

### 5.1 参照系ツール（Read Operations）

#### アカウント管理（4ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 1 | `meta_ads_list_ad_accounts` | 広告アカウント一覧取得 | `GET /me/adaccounts` |
| 2 | `meta_ads_get_ad_account` | 広告アカウント詳細取得 | `GET /act_{ad_account_id}` |
| 3 | `meta_ads_get_account_insights` | アカウントパフォーマンス取得 | `GET /act_{ad_account_id}/insights` |
| 4 | `meta_ads_get_instagram_accounts` | 連携Instagramアカウント | `GET /act_{ad_account_id}/instagram_accounts` |

#### キャンペーン管理（3ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 5 | `meta_ads_list_campaigns` | キャンペーン一覧取得 | `GET /act_{ad_account_id}/campaigns` |
| 6 | `meta_ads_get_campaign` | キャンペーン詳細取得 | `GET /{campaign_id}` |
| 7 | `meta_ads_get_campaign_insights` | キャンペーンパフォーマンス | `GET /{campaign_id}/insights` |

#### 広告セット管理（3ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 8 | `meta_ads_list_adsets` | 広告セット一覧取得 | `GET /act_{ad_account_id}/adsets` |
| 9 | `meta_ads_get_adset` | 広告セット詳細取得 | `GET /{adset_id}` |
| 10 | `meta_ads_get_adset_insights` | 広告セットパフォーマンス | `GET /{adset_id}/insights` |

#### 広告管理（3ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 11 | `meta_ads_list_ads` | 広告一覧取得 | `GET /act_{ad_account_id}/ads` |
| 12 | `meta_ads_get_ad` | 広告詳細取得 | `GET /{ad_id}` |
| 13 | `meta_ads_get_ad_insights` | 広告パフォーマンス | `GET /{ad_id}/insights` |

#### クリエイティブ・分析（3ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 14 | `meta_ads_list_ad_creatives` | クリエイティブ一覧 | `GET /act_{ad_account_id}/adcreatives` |
| 15 | `meta_ads_get_ad_creative` | クリエイティブ詳細 | `GET /{creative_id}` |
| 16 | `meta_ads_analyze_ad_creative` | 広告クリエイティブ詳細分析 | `GET /{ad_id}` + `GET /{creative_id}` |

#### アクティビティ履歴（1ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 17 | `meta_ads_get_activities` | アカウント変更履歴取得 | `GET /act_{ad_account_id}/activities` |

#### バッチ・ユーティリティ（3ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 18 | `meta_ads_batch_get` | 複数IDまとめ取得 | `GET /?ids={id1},{id2},...` |
| 19 | `meta_ads_get_async_report_status` | 非同期レポートステータス | `GET /{report_run_id}` |
| 20 | `meta_ads_fetch_next_page` | 次ページ取得（ページネーション） | `GET {paging.next URL}` |

---

### 5.2 更新系ツール（Write Operations）

#### キャンペーン操作（3ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 21 | `meta_ads_create_campaign` | キャンペーン作成 | `POST /act_{ad_account_id}/campaigns` |
| 22 | `meta_ads_update_campaign` | キャンペーン更新 | `POST /{campaign_id}` |
| 23 | `meta_ads_delete_campaign` | キャンペーン削除 | `DELETE /{campaign_id}` |

#### 広告セット操作（3ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 24 | `meta_ads_create_adset` | 広告セット作成 | `POST /act_{ad_account_id}/adsets` |
| 25 | `meta_ads_update_adset` | 広告セット更新 | `POST /{adset_id}` |
| 26 | `meta_ads_delete_adset` | 広告セット削除 | `DELETE /{adset_id}` |

#### 広告操作（3ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 27 | `meta_ads_create_ad` | 広告作成 | `POST /act_{ad_account_id}/ads` |
| 28 | `meta_ads_update_ad` | 広告更新 | `POST /{ad_id}` |
| 29 | `meta_ads_delete_ad` | 広告削除 | `DELETE /{ad_id}` |

#### クリエイティブ操作（2ツール）

| # | ツール名 | 説明 | エンドポイント |
|---|----------|------|----------------|
| 30 | `meta_ads_create_ad_creative` | クリエイティブ作成 | `POST /act_{ad_account_id}/adcreatives` |
| 31 | `meta_ads_upload_ad_image` | 画像アップロード | `POST /act_{ad_account_id}/adimages` |

---

## 6. Insights API 詳細仕様

### 6.1 基本エンドポイント
```
GET /act_{ad_account_id}/insights
GET /{campaign_id}/insights
GET /{adset_id}/insights
GET /{ad_id}/insights
```

### 6.2 主要パラメータ

#### level（集計レベル）
```typescript
type Level = 'account' | 'campaign' | 'adset' | 'ad';
```

#### fields（取得フィールド）
```typescript
// 推奨フィールドセット
const MINIMAL_HEALTHCHECK = [
  'date_start', 'date_stop', 'account_id', 'campaign_id',
  'adset_id', 'ad_id', 'impressions', 'clicks', 'spend', 'actions'
];

const PERFORMANCE_CORE = [
  'date_start', 'date_stop', 'campaign_id', 'campaign_name',
  'adset_id', 'adset_name', 'ad_id', 'ad_name',
  'impressions', 'reach', 'frequency', 'clicks', 'ctr', 'cpc', 'cpm',
  'spend', 'actions', 'action_values', 'cost_per_action_type'
];

const CREATIVE_EVAL = [
  'date_start', 'date_stop', 'ad_id', 'ad_name',
  'impressions', 'clicks', 'spend', 'ctr', 'cpc', 'actions'
];
```

#### 日付範囲
```typescript
// date_preset（プリセット）
type DatePreset =
  | 'today' | 'yesterday'
  | 'last_7d' | 'last_14d' | 'last_30d' | 'last_90d'
  | 'this_month' | 'last_month';

// time_range（カスタム範囲）
interface TimeRange {
  since: string;  // YYYY-MM-DD
  until: string;  // YYYY-MM-DD
}

// time_increment（日次等の粒度）
type TimeIncrement = 1 | 7 | 28 | 'monthly' | 'all_days';
```

#### breakdowns（ブレイクダウン）
```typescript
type Breakdown =
  | 'age' | 'gender'
  | 'country' | 'region' | 'dma'
  | 'hour' | 'day' | 'month'
  | 'publisher_platform' | 'platform_position'
  | 'device_platform' | 'impression_device'
  | 'placement' | 'product_id';

type ActionBreakdown =
  | 'action_type'
  | 'action_device'
  | 'action_destination';
```

### 6.3 非同期レポート

大量データ取得時は非同期モードを使用：

```typescript
// 1. ジョブ開始
GET /act_{ad_account_id}/insights?async=true&...
// Response: { report_run_id: "123..." }

// 2. ステータス確認
GET /{report_run_id}?fields=async_status,async_percent_completion
// Response: { async_status: "Job Completed", async_percent_completion: 100 }

// 3. 結果取得
GET /{report_run_id}/insights?fields=...&limit=1000
```

---

## 7. 広告クリエイティブ分析 (meta_ads_analyze_ad_creative)

### 7.1 概要
広告IDまたはクリエイティブIDから、クリエイティブの詳細情報を包括的に分析。
GoMarbleの`facebook_analyze_ad_creative_by_id_or_url`相当の機能。

### 7.2 取得情報

```typescript
interface AdCreativeAnalysis {
  // 基本情報
  ad_id: string;
  creative_id: string;
  name: string;
  status: string;

  // クリエイティブ種別
  creative_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'COLLECTION' | 'DYNAMIC';

  // 視覚的要素
  visual_elements: {
    // 画像の場合
    image_url?: string;
    image_hash?: string;
    thumbnail_url?: string;

    // 動画の場合
    video_id?: string;
    video_url?: string;
    video_thumbnail?: string;
    video_duration_seconds?: number;

    // カルーセルの場合
    carousel_cards?: {
      image_url: string;
      link: string;
      headline: string;
      description?: string;
    }[];
  };

  // テキスト・メッセージング
  messaging: {
    primary_text?: string;        // 本文
    headline?: string;            // 見出し
    description?: string;         // 説明文
    link_caption?: string;        // リンクキャプション
    call_to_action?: {
      type: string;               // SHOP_NOW, LEARN_MORE, etc.
      value?: string;             // リンク先
    };
  };

  // リンク情報
  link_info: {
    website_url?: string;
    display_url?: string;
    deeplink_url?: string;
  };

  // プレビューURL
  preview_urls: {
    facebook_feed?: string;
    instagram_feed?: string;
    stories?: string;
  };

  // パフォーマンスインサイト（オプション、insights付きで取得時）
  performance?: {
    impressions: number;
    clicks: number;
    spend: number;
    ctr: number;
    cpc: number;
    conversions?: number;
  };

  // メタデータ
  created_time: string;
  effective_status: string;
  page_id: string;
  instagram_actor_id?: string;
}
```

### 7.3 使用エンドポイント

```
# 広告IDから取得
GET /{ad_id}?fields=id,name,status,creative{id,name,thumbnail_url,image_url,video_id,object_story_spec,asset_feed_spec,effective_object_story_id},adcreatives{thumbnail_url,image_url,object_story_spec}

# クリエイティブIDから取得
GET /{creative_id}?fields=id,name,thumbnail_url,image_url,video_id,object_story_spec,asset_feed_spec,object_type,effective_object_story_id

# パフォーマンス込み
GET /{ad_id}/insights?fields=impressions,clicks,spend,ctr,cpc,actions
```

---

## 8. アクティビティ履歴 (meta_ads_get_activities)

### 8.1 概要
広告アカウントの変更履歴を取得。誰が、いつ、何を変更したかを追跡。

### 8.2 エンドポイント

```
GET /act_{ad_account_id}/activities
```

### 8.3 パラメータ

```typescript
interface GetActivitiesParams {
  ad_account_id: string;

  // フィルタリング
  since?: string;                 // 開始日時（Unix timestamp or ISO 8601）
  until?: string;                 // 終了日時
  category?: ActivityCategory[];  // カテゴリでフィルタ
  uid?: string;                   // 特定ユーザーの変更のみ
  oid?: string;                   // 特定オブジェクトの変更のみ

  // ページネーション
  limit?: number;                 // デフォルト: 25
  after?: string;                 // カーソル
}

type ActivityCategory =
  | 'ACCOUNT'                     // アカウント設定変更
  | 'AD'                          // 広告の変更
  | 'AD_SET'                      // 広告セットの変更
  | 'CAMPAIGN'                    // キャンペーンの変更
  | 'AUDIENCE'                    // オーディエンス変更
  | 'BID'                         // 入札変更
  | 'BUDGET'                      // 予算変更
  | 'TARGETING'                   // ターゲティング変更
  | 'CREATIVE'                    // クリエイティブ変更
  | 'SCHEDULE'                    // スケジュール変更
  | 'STATUS';                     // ステータス変更
```

### 8.4 レスポンス

```typescript
interface Activity {
  actor_id: string;               // 変更したユーザーID
  actor_name: string;             // 変更したユーザー名
  object_id: string;              // 変更されたオブジェクトID
  object_name: string;            // 変更されたオブジェクト名
  object_type: string;            // CAMPAIGN, AD_SET, AD, etc.

  event_type: string;             // CREATE, UPDATE, DELETE, etc.
  event_time: string;             // 変更日時（ISO 8601）

  // 変更内容
  extra_data?: {
    old_value?: string;           // 変更前の値
    new_value?: string;           // 変更後の値
    field_name?: string;          // 変更されたフィールド名
  };

  // 翻訳済み説明
  translated_event_type?: string;
}
```

### 8.5 使用例

```bash
# 過去7日間のすべての変更
GET /act_123456789/activities?since=2025-01-01&until=2025-01-07

# 予算変更のみ
GET /act_123456789/activities?category=BUDGET

# 特定キャンペーンの変更履歴
GET /act_123456789/activities?oid=23850001234567890
```

---

## 9. ページネーション (meta_ads_fetch_next_page)

### 9.1 概要
Meta Graph APIのcursor-basedページネーションで次ページを取得。
`paging.next`に含まれるURLをそのまま呼び出す。

### 9.2 パラメータ

```typescript
interface FetchNextPageParams {
  // 前回のレスポンスに含まれるpaging.next URL
  next_page_url: string;
}
```

### 9.3 使用例

```typescript
// 1. 最初のリクエスト
const response1 = await listCampaigns({ ad_account_id: 'act_123', limit: 100 });
// response1.paging.next = "https://graph.facebook.com/v24.0/act_123/campaigns?after=QVFIUm..."

// 2. 次ページ取得
const response2 = await fetchNextPage({
  next_page_url: response1.paging.next
});

// 3. paging.nextがなくなるまで繰り返し
```

### 9.4 レスポンス
元のAPIと同じ形式（data + paging）を返す

---

## 10. キャンペーン作成パラメータ

```typescript
interface CreateCampaignParams {
  // 必須
  name: string;                    // キャンペーン名
  objective: CampaignObjective;    // 目的
  status: CampaignStatus;          // ステータス
  special_ad_categories: string[]; // 特別広告カテゴリ（空配列[]可）

  // オプション
  daily_budget?: number;           // 日予算（セント単位）
  lifetime_budget?: number;        // 総予算（セント単位）
  bid_strategy?: BidStrategy;      // 入札戦略
  start_time?: string;             // 開始日時（ISO 8601）
  stop_time?: string;              // 終了日時（ISO 8601）
}

// キャンペーン目的（Objective）
type CampaignObjective =
  | 'OUTCOME_AWARENESS'           // 認知
  | 'OUTCOME_ENGAGEMENT'          // エンゲージメント
  | 'OUTCOME_LEADS'               // リード獲得
  | 'OUTCOME_SALES'               // 売上
  | 'OUTCOME_TRAFFIC'             // トラフィック
  | 'OUTCOME_APP_PROMOTION';      // アプリ宣伝

// ステータス
type CampaignStatus = 'ACTIVE' | 'PAUSED';

// 入札戦略
type BidStrategy =
  | 'LOWEST_COST_WITHOUT_CAP'     // 最小コスト
  | 'LOWEST_COST_WITH_BID_CAP'    // 入札上限付き
  | 'COST_CAP';                   // コスト上限
```

---

## 11. 広告セット作成パラメータ

```typescript
interface CreateAdSetParams {
  // 必須
  name: string;
  campaign_id: string;
  billing_event: BillingEvent;
  optimization_goal: OptimizationGoal;
  targeting: TargetingSpec;
  status: AdSetStatus;

  // 予算（どちらか必須）
  daily_budget?: number;           // 日予算（セント単位）
  lifetime_budget?: number;        // 総予算（セント単位）

  // オプション
  bid_amount?: number;             // 入札額（セント単位）
  start_time?: string;
  end_time?: string;
  promoted_object?: PromotedObject;
}

// 課金イベント
type BillingEvent = 'IMPRESSIONS' | 'LINK_CLICKS' | 'APP_INSTALLS' | 'THRUPLAY';

// 最適化目標
type OptimizationGoal =
  | 'IMPRESSIONS' | 'REACH'
  | 'LINK_CLICKS' | 'LANDING_PAGE_VIEWS'
  | 'CONVERSIONS' | 'LEAD_GENERATION'
  | 'APP_INSTALLS';

// ターゲティング仕様
interface TargetingSpec {
  geo_locations?: {
    countries?: string[];          // 国コード（JP, US等）
    regions?: { key: string }[];
    cities?: { key: string }[];
  };
  age_min?: number;                // 18-65
  age_max?: number;                // 18-65
  genders?: number[];              // 1=男性, 2=女性
  interests?: { id: string }[];
  behaviors?: { id: string }[];
  custom_audiences?: { id: string }[];
  excluded_custom_audiences?: { id: string }[];
  publisher_platforms?: ('facebook' | 'instagram' | 'messenger' | 'audience_network')[];
  facebook_positions?: string[];
  instagram_positions?: string[];
  device_platforms?: ('mobile' | 'desktop')[];
}
```

---

## 12. 広告作成パラメータ

```typescript
interface CreateAdParams {
  // 必須
  name: string;
  adset_id: string;
  creative: AdCreativeSpec;
  status: AdStatus;

  // オプション
  tracking_specs?: TrackingSpec[];
}

// 広告クリエイティブ仕様
interface AdCreativeSpec {
  // 既存クリエイティブを使用
  creative_id?: string;

  // または新規作成
  name?: string;
  object_story_spec?: ObjectStorySpec;
}

// 投稿仕様
interface ObjectStorySpec {
  page_id: string;
  link_data?: {
    link: string;
    message?: string;
    name?: string;                  // 見出し
    description?: string;
    image_hash?: string;
    call_to_action?: {
      type: CallToActionType;
      value?: { link: string };
    };
  };
  video_data?: {
    video_id: string;
    title?: string;
    message?: string;
    image_hash?: string;            // サムネイル
    call_to_action?: {
      type: CallToActionType;
      value?: { link: string };
    };
  };
}

type CallToActionType =
  | 'SHOP_NOW' | 'LEARN_MORE' | 'SIGN_UP'
  | 'BOOK_TRAVEL' | 'CONTACT_US' | 'DOWNLOAD'
  | 'GET_OFFER' | 'GET_QUOTE' | 'SUBSCRIBE';
```

---

## 13. ページネーション詳細

### カーソルベース方式
```typescript
interface PaginatedResponse<T> {
  data: T[];
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;      // 次ページURL
    previous?: string;  // 前ページURL
  };
}
```

### クライアントルール
- `paging.next` を追って全件取得
- `limit` は大きくしすぎない（タイムアウト・レート制限の原因）
- 推奨: `limit=100`〜`500`

---

## 14. エラーハンドリング

### 14.1 主要エラーコード

| コード | ラベル | 対処法 |
|--------|--------|--------|
| 4 | Application request limit reached | exponential backoff |
| 17 | User request limit reached | exponential backoff + pacing |
| 613 | Calls to this api have exceeded the rate limit | exponential backoff + 同時実行数を絞る |
| 100 | Invalid parameter | パラメータ確認 |
| 190 | Invalid OAuth access token | トークン更新 |
| 200 | Requires permission | 権限確認 |

### 14.2 レート制限対策
- 429/613系はリトライ前提で設計
- 同時実行数とQPSを絞る
- 日次バッチは分割（アカウント×期間×level）して失敗点を局所化

---

## 15. Google/Yahoo MCPとの差異

| 項目 | Google Ads | Yahoo Ads | Meta Ads |
|------|-----------|-----------|----------|
| API形式 | REST + GAQL | REST | Graph API |
| 認証 | OAuth 2.0 + Developer Token | OAuth 2.0 | OAuth 2.0 |
| 金額単位 | micros (1/1,000,000) | 円 | cents (1/100) |
| 階層構造 | Account > Campaign > AdGroup > Ad | 同左 | Account > Campaign > AdSet > Ad |
| キーワードターゲティング | あり | あり | なし（オーディエンスベース） |
| クエリ言語 | GAQL | なし | なし |
| ページネーション | pageToken | startIndex + numberResults | cursor-based |

---

## 16. 実装優先度

### Phase 1: 基本参照機能（MVP）- 8ツール
1. `meta_ads_list_ad_accounts`
2. `meta_ads_get_ad_account`
3. `meta_ads_list_campaigns`
4. `meta_ads_get_campaign`
5. `meta_ads_list_adsets`
6. `meta_ads_list_ads`
7. `meta_ads_get_account_insights`
8. `meta_ads_fetch_next_page`（ページネーション）

### Phase 2: 詳細参照・分析機能 - 12ツール
9. `meta_ads_get_adset`
10. `meta_ads_get_ad`
11. `meta_ads_get_campaign_insights`
12. `meta_ads_get_adset_insights`
13. `meta_ads_get_ad_insights`
14. `meta_ads_list_ad_creatives`
15. `meta_ads_get_ad_creative`
16. `meta_ads_analyze_ad_creative`（クリエイティブ詳細分析）
17. `meta_ads_get_activities`（変更履歴）
18. `meta_ads_get_async_report_status`
19. `meta_ads_batch_get`
20. `meta_ads_get_instagram_accounts`

### Phase 3: 更新機能 - 11ツール
21. `meta_ads_create_campaign`
22. `meta_ads_update_campaign`
23. `meta_ads_delete_campaign`
24. `meta_ads_create_adset`
25. `meta_ads_update_adset`
26. `meta_ads_delete_adset`
27. `meta_ads_create_ad`
28. `meta_ads_update_ad`
29. `meta_ads_delete_ad`
30. `meta_ads_create_ad_creative`
31. `meta_ads_upload_ad_image`

**合計: 31ツール**（参照系20 + 更新系11）

---

## 17. 注意事項

### 17.1 アクセストークン
- Graph API Explorer で作成する短期トークン（24時間）は開発用
- 本番運用は Business Manager のシステムユーザートークン推奨（最大60日or無期限）

### 17.2 特別広告カテゴリ
以下の広告は `special_ad_categories` の指定が必須：
- `CREDIT` - 信用・ローン
- `EMPLOYMENT` - 雇用・求人
- `HOUSING` - 不動産・住宅
- `SOCIAL_ISSUES_ELECTIONS_OR_POLITICS` - 政治

空配列 `[]` でも必須パラメータとして送信が必要。

### 17.3 金額単位
- Meta APIは **セント単位**（1/100）
- 例: $10.00 = 1000 cents
- 日本円アカウントでも内部的にはセント相当で処理

### 17.4 APIバージョン
- 現在の推奨バージョン: v24.0
- バージョンは約2年でdeprecated
- 定期的なアップデートが必要

---

## 18. 参考リンク

- [Meta Marketing API Documentation](https://developers.facebook.com/docs/marketing-api)
- [Graph API Reference](https://developers.facebook.com/docs/graph-api/reference)
- [Insights API Reference](https://developers.facebook.com/docs/marketing-api/insights)
- [Rate Limiting](https://developers.facebook.com/docs/marketing-api/overview/rate-limiting)
