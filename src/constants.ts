/**
 * Meta Marketing API Constants
 */

// API Configuration
export const META_API_VERSION = 'v24.0';
export const META_API_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

// Default pagination
export const DEFAULT_PAGE_LIMIT = 100;
export const MAX_PAGE_LIMIT = 500;

// Insights field sets
export const INSIGHTS_FIELDS = {
  // Minimal fields for health check
  MINIMAL: [
    'date_start',
    'date_stop',
    'account_id',
    'campaign_id',
    'adset_id',
    'ad_id',
    'impressions',
    'clicks',
    'spend',
    'actions',
  ],

  // Core performance fields
  PERFORMANCE: [
    'date_start',
    'date_stop',
    'account_id',
    'account_name',
    'campaign_id',
    'campaign_name',
    'adset_id',
    'adset_name',
    'ad_id',
    'ad_name',
    'impressions',
    'reach',
    'frequency',
    'clicks',
    'unique_clicks',
    'ctr',
    'unique_ctr',
    'cpc',
    'cpm',
    'cpp',
    'spend',
    'actions',
    'action_values',
    'cost_per_action_type',
    'conversions',
    'conversion_values',
    'cost_per_conversion',
  ],

  // Creative evaluation fields
  CREATIVE: [
    'date_start',
    'date_stop',
    'ad_id',
    'ad_name',
    'impressions',
    'clicks',
    'spend',
    'ctr',
    'cpc',
    'actions',
  ],

  // Video metrics
  VIDEO: [
    'date_start',
    'date_stop',
    'ad_id',
    'ad_name',
    'impressions',
    'reach',
    'video_play_actions',
    'video_p25_watched_actions',
    'video_p50_watched_actions',
    'video_p75_watched_actions',
    'video_p100_watched_actions',
    'spend',
  ],
} as const;

// Ad Account fields
export const AD_ACCOUNT_FIELDS = [
  'id',
  'account_id',
  'name',
  'account_status',
  'age',
  'amount_spent',
  'balance',
  'business_city',
  'business_country_code',
  'business_name',
  'business_state',
  'business_street',
  'business_street2',
  'business_zip',
  'currency',
  'disable_reason',
  'end_advertiser',
  'end_advertiser_name',
  'min_campaign_group_spend_cap',
  'min_daily_budget',
  'owner',
  'spend_cap',
  'timezone_id',
  'timezone_name',
  'timezone_offset_hours_utc',
  'created_time',
] as const;

// Campaign fields
export const CAMPAIGN_FIELDS = [
  'id',
  'account_id',
  'name',
  'objective',
  'status',
  'effective_status',
  'bid_strategy',
  'buying_type',
  'daily_budget',
  'lifetime_budget',
  'budget_remaining',
  'special_ad_categories',
  'special_ad_category',
  'special_ad_category_country',
  'start_time',
  'stop_time',
  'created_time',
  'updated_time',
] as const;

// Ad Set fields
export const ADSET_FIELDS = [
  'id',
  'account_id',
  'campaign_id',
  'name',
  'status',
  'effective_status',
  'billing_event',
  'optimization_goal',
  'bid_amount',
  'bid_strategy',
  'daily_budget',
  'lifetime_budget',
  'budget_remaining',
  'targeting',
  'start_time',
  'end_time',
  'created_time',
  'updated_time',
] as const;

// Ad fields
export const AD_FIELDS = [
  'id',
  'account_id',
  'campaign_id',
  'adset_id',
  'name',
  'status',
  'effective_status',
  'creative',
  'tracking_specs',
  'conversion_specs',
  'created_time',
  'updated_time',
] as const;

// Ad Creative fields
export const AD_CREATIVE_FIELDS = [
  'id',
  'account_id',
  'name',
  'title',
  'body',
  'image_hash',
  'image_url',
  'thumbnail_url',
  'video_id',
  'object_type',
  'object_story_id',
  'object_story_spec',
  'asset_feed_spec',
  'effective_object_story_id',
  'call_to_action_type',
  'link_url',
  'object_url',
  'url_tags',
  'status',
] as const;

// Activity fields
export const ACTIVITY_FIELDS = [
  'actor_id',
  'actor_name',
  'object_id',
  'object_name',
  'object_type',
  'event_type',
  'event_time',
  'extra_data',
  'translated_event_type',
] as const;

// Instagram Account fields
export const INSTAGRAM_ACCOUNT_FIELDS = [
  'id',
  'username',
  'name',
  'profile_pic',
  'is_private',
  'is_published',
  'followers_count',
  'follows_count',
  'media_count',
] as const;

// Account status mapping
export const ACCOUNT_STATUS_MAP: Record<number, string> = {
  1: 'ACTIVE',
  2: 'DISABLED',
  3: 'UNSETTLED',
  7: 'PENDING_RISK_REVIEW',
  8: 'PENDING_SETTLEMENT',
  9: 'IN_GRACE_PERIOD',
  100: 'PENDING_CLOSURE',
  101: 'CLOSED',
  201: 'ANY_ACTIVE',
  202: 'ANY_CLOSED',
};

// Disable reason mapping
export const DISABLE_REASON_MAP: Record<number, string> = {
  0: 'NONE',
  1: 'ADS_INTEGRITY_POLICY',
  2: 'ADS_IP_REVIEW',
  3: 'RISK_PAYMENT',
  4: 'GRAY_ACCOUNT_SHUT_DOWN',
  5: 'ADS_AFC_REVIEW',
  6: 'BUSINESS_INTEGRITY_RAR',
  7: 'PERMANENT_CLOSE',
  8: 'UNUSED_RESELLER_ACCOUNT',
  9: 'UNUSED_ACCOUNT',
};

// Error codes that should trigger retry
export const RETRY_ERROR_CODES = [1, 2, 4, 17, 341, 368, 613];

// Rate limit wait times (in ms)
export const RATE_LIMIT_WAIT = {
  DEFAULT: 60000,      // 1 minute
  LIGHT: 30000,        // 30 seconds
  HEAVY: 300000,       // 5 minutes
};

// READ_ONLY_MODE: env が "0" のときのみ write 解禁。それ以外（未設定 / "1" / 不明値）は全て read-only に倒す（fail closed）
export const READ_ONLY_TOOLS: readonly string[] = [
  'meta_ads_list_ad_accounts',
  'meta_ads_get_ad_account',
  'meta_ads_get_account_insights',
  'meta_ads_get_instagram_accounts',
  'meta_ads_list_campaigns',
  'meta_ads_get_campaign',
  'meta_ads_get_campaign_insights',
  'meta_ads_list_adsets',
  'meta_ads_get_adset',
  'meta_ads_get_adset_insights',
  'meta_ads_list_ads',
  'meta_ads_get_ad',
  'meta_ads_get_ad_insights',
  'meta_ads_list_ad_creatives',
  'meta_ads_get_ad_creative',
  'meta_ads_analyze_ad_creative',
  'meta_ads_get_activities',
  'meta_ads_batch_get',
  'meta_ads_get_async_report_status',
  'meta_ads_fetch_next_page',
] as const;

export function isReadOnlyMode(): boolean {
  return process.env.READ_ONLY_MODE !== '0';
}

export function isAllowedInReadOnly(toolName: string): boolean {
  return READ_ONLY_TOOLS.includes(toolName);
}
