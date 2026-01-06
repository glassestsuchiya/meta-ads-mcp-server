/**
 * Meta Marketing API Types
 */

// Response format
export type ResponseFormat = 'json' | 'markdown';

// Campaign objective
export type CampaignObjective =
  | 'OUTCOME_AWARENESS'
  | 'OUTCOME_ENGAGEMENT'
  | 'OUTCOME_LEADS'
  | 'OUTCOME_SALES'
  | 'OUTCOME_TRAFFIC'
  | 'OUTCOME_APP_PROMOTION';

// Campaign status
export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';

// Ad Set status
export type AdSetStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';

// Ad status
export type AdStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';

// Effective status (includes delivery status)
export type EffectiveStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'DELETED'
  | 'PENDING_REVIEW'
  | 'DISAPPROVED'
  | 'PREAPPROVED'
  | 'PENDING_BILLING_INFO'
  | 'CAMPAIGN_PAUSED'
  | 'ARCHIVED'
  | 'ADSET_PAUSED'
  | 'IN_PROCESS'
  | 'WITH_ISSUES';

// Bid strategy
export type BidStrategy =
  | 'LOWEST_COST_WITHOUT_CAP'
  | 'LOWEST_COST_WITH_BID_CAP'
  | 'COST_CAP'
  | 'LOWEST_COST_WITH_MIN_ROAS';

// Billing event
export type BillingEvent =
  | 'APP_INSTALLS'
  | 'CLICKS'
  | 'IMPRESSIONS'
  | 'LINK_CLICKS'
  | 'NONE'
  | 'OFFER_CLAIMS'
  | 'PAGE_LIKES'
  | 'POST_ENGAGEMENT'
  | 'THRUPLAY'
  | 'PURCHASE'
  | 'LISTING_INTERACTION';

// Optimization goal
export type OptimizationGoal =
  | 'NONE'
  | 'APP_INSTALLS'
  | 'AD_RECALL_LIFT'
  | 'ENGAGED_USERS'
  | 'EVENT_RESPONSES'
  | 'IMPRESSIONS'
  | 'LEAD_GENERATION'
  | 'QUALITY_LEAD'
  | 'LINK_CLICKS'
  | 'OFFSITE_CONVERSIONS'
  | 'PAGE_LIKES'
  | 'POST_ENGAGEMENT'
  | 'QUALITY_CALL'
  | 'REACH'
  | 'LANDING_PAGE_VIEWS'
  | 'VISIT_INSTAGRAM_PROFILE'
  | 'VALUE'
  | 'THRUPLAY'
  | 'DERIVED_EVENTS'
  | 'APP_INSTALLS_AND_OFFSITE_CONVERSIONS'
  | 'CONVERSATIONS'
  | 'IN_APP_VALUE'
  | 'MESSAGING_PURCHASE_CONVERSION'
  | 'MESSAGING_APPOINTMENT_CONVERSION';

// Special ad categories
export type SpecialAdCategory =
  | 'NONE'
  | 'EMPLOYMENT'
  | 'HOUSING'
  | 'CREDIT'
  | 'ISSUES_ELECTIONS_POLITICS'
  | 'ONLINE_GAMBLING_AND_GAMING';

// Date preset for insights
export type DatePreset =
  | 'today'
  | 'yesterday'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'maximum'
  | 'data_maximum'
  | 'last_3d'
  | 'last_7d'
  | 'last_14d'
  | 'last_28d'
  | 'last_30d'
  | 'last_90d'
  | 'last_week_mon_sun'
  | 'last_week_sun_sat'
  | 'last_quarter'
  | 'last_year'
  | 'this_week_mon_today'
  | 'this_week_sun_today'
  | 'this_year';

// Insights level
export type InsightsLevel = 'account' | 'campaign' | 'adset' | 'ad';

// Breakdowns
export type Breakdown =
  | 'ad_format_asset'
  | 'age'
  | 'body_asset'
  | 'call_to_action_asset'
  | 'country'
  | 'description_asset'
  | 'device_platform'
  | 'dma'
  | 'frequency_value'
  | 'gender'
  | 'hourly_stats_aggregated_by_advertiser_time_zone'
  | 'hourly_stats_aggregated_by_audience_time_zone'
  | 'image_asset'
  | 'impression_device'
  | 'link_url_asset'
  | 'place_page_id'
  | 'platform_position'
  | 'product_id'
  | 'publisher_platform'
  | 'region'
  | 'skan_conversion_id'
  | 'title_asset'
  | 'video_asset';

// Action breakdowns
export type ActionBreakdown =
  | 'action_canvas_component_name'
  | 'action_carousel_card_id'
  | 'action_carousel_card_name'
  | 'action_destination'
  | 'action_device'
  | 'action_reaction'
  | 'action_target_id'
  | 'action_type'
  | 'action_video_sound'
  | 'action_video_type';

// Activity category
export type ActivityCategory =
  | 'ACCOUNT'
  | 'AD'
  | 'AD_SET'
  | 'AUDIENCE'
  | 'BID'
  | 'BUDGET'
  | 'CAMPAIGN'
  | 'DATE'
  | 'STATUS'
  | 'TARGETING';

// Call to action type
export type CallToActionType =
  | 'ADD_TO_CART'
  | 'APPLY_NOW'
  | 'BOOK_TRAVEL'
  | 'BUY'
  | 'BUY_NOW'
  | 'BUY_TICKETS'
  | 'CALL'
  | 'CALL_ME'
  | 'CONTACT'
  | 'CONTACT_US'
  | 'DONATE'
  | 'DONATE_NOW'
  | 'DOWNLOAD'
  | 'EVENT_RSVP'
  | 'FIND_A_GROUP'
  | 'FIND_YOUR_GROUPS'
  | 'FOLLOW_NEWS_STORYLINE'
  | 'FOLLOW_PAGE'
  | 'FOLLOW_USER'
  | 'GET_DIRECTIONS'
  | 'GET_OFFER'
  | 'GET_OFFER_VIEW'
  | 'GET_QUOTE'
  | 'GET_SHOWTIMES'
  | 'INSTALL_APP'
  | 'INSTALL_MOBILE_APP'
  | 'LEARN_MORE'
  | 'LIKE_PAGE'
  | 'LISTEN_MUSIC'
  | 'LISTEN_NOW'
  | 'MESSAGE_PAGE'
  | 'MOBILE_DOWNLOAD'
  | 'MOMENTS'
  | 'NO_BUTTON'
  | 'OPEN_LINK'
  | 'ORDER_NOW'
  | 'PAY_TO_ACCESS'
  | 'PLAY_GAME'
  | 'PURCHASE_GIFT_CARDS'
  | 'RECORD_NOW'
  | 'REQUEST_TIME'
  | 'SAY_THANKS'
  | 'SEE_MORE'
  | 'SELL_NOW'
  | 'SEND_A_GIFT'
  | 'SHARE'
  | 'SHOP_NOW'
  | 'SIGN_UP'
  | 'SOTTO_SUBSCRIBE'
  | 'SUBSCRIBE'
  | 'UPDATE_APP'
  | 'USE_APP'
  | 'USE_MOBILE_APP'
  | 'VIDEO_ANNOTATION'
  | 'VISIT_PAGES_FEED'
  | 'WATCH_MORE'
  | 'WATCH_VIDEO'
  | 'WHATSAPP_MESSAGE'
  | 'WOODHENGE_SUPPORT';

// Creative type
export type CreativeType = 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'COLLECTION' | 'DYNAMIC';

// ============================================
// API Response Types
// ============================================

// Pagination
export interface Paging {
  cursors?: {
    before: string;
    after: string;
  };
  next?: string;
  previous?: string;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  paging?: Paging;
}

// Error response
export interface MetaApiError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  fbtrace_id?: string;
}

export interface MetaApiErrorResponse {
  error: MetaApiError;
}

// Ad Account
export interface AdAccount {
  id: string;
  account_id: string;
  name: string;
  account_status: number;
  age: number;
  amount_spent: string;
  balance: string;
  business_city?: string;
  business_country_code?: string;
  business_name?: string;
  business_state?: string;
  business_street?: string;
  business_street2?: string;
  business_zip?: string;
  currency: string;
  disable_reason?: number;
  end_advertiser?: string;
  end_advertiser_name?: string;
  funding_source?: string;
  funding_source_details?: Record<string, unknown>;
  min_campaign_group_spend_cap?: string;
  min_daily_budget?: number;
  owner?: string;
  spend_cap?: string;
  timezone_id: number;
  timezone_name: string;
  timezone_offset_hours_utc: number;
  created_time?: string;
}

// Campaign
export interface Campaign {
  id: string;
  account_id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  effective_status: EffectiveStatus;
  bid_strategy?: BidStrategy;
  buying_type?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  special_ad_categories?: SpecialAdCategory[];
  special_ad_category?: SpecialAdCategory;
  special_ad_category_country?: string[];
  start_time?: string;
  stop_time?: string;
  created_time?: string;
  updated_time?: string;
}

// Ad Set
export interface AdSet {
  id: string;
  account_id: string;
  campaign_id: string;
  name: string;
  status: AdSetStatus;
  effective_status: EffectiveStatus;
  billing_event: BillingEvent;
  optimization_goal: OptimizationGoal;
  bid_amount?: number;
  bid_strategy?: BidStrategy;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  targeting?: Targeting;
  start_time?: string;
  end_time?: string;
  created_time?: string;
  updated_time?: string;
}

// Targeting
export interface Targeting {
  age_min?: number;
  age_max?: number;
  genders?: number[];
  geo_locations?: {
    countries?: string[];
    regions?: { key: string; name?: string }[];
    cities?: { key: string; name?: string; radius?: number; distance_unit?: string }[];
    zips?: { key: string }[];
    location_types?: string[];
  };
  interests?: { id: string; name?: string }[];
  behaviors?: { id: string; name?: string }[];
  custom_audiences?: { id: string; name?: string }[];
  excluded_custom_audiences?: { id: string; name?: string }[];
  publisher_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
  messenger_positions?: string[];
  audience_network_positions?: string[];
  device_platforms?: string[];
  flexible_spec?: Record<string, unknown>[];
  exclusions?: Record<string, unknown>;
}

// Ad
export interface Ad {
  id: string;
  account_id: string;
  campaign_id: string;
  adset_id: string;
  name: string;
  status: AdStatus;
  effective_status: EffectiveStatus;
  creative?: {
    id: string;
    name?: string;
  };
  tracking_specs?: Record<string, unknown>[];
  conversion_specs?: Record<string, unknown>[];
  created_time?: string;
  updated_time?: string;
}

// Ad Creative
export interface AdCreative {
  id: string;
  account_id?: string;
  name?: string;
  title?: string;
  body?: string;
  image_hash?: string;
  image_url?: string;
  thumbnail_url?: string;
  video_id?: string;
  object_type?: string;
  object_story_id?: string;
  object_story_spec?: ObjectStorySpec;
  asset_feed_spec?: AssetFeedSpec;
  effective_object_story_id?: string;
  call_to_action_type?: CallToActionType;
  link_url?: string;
  object_url?: string;
  url_tags?: string;
  status?: string;
}

// Object story spec
export interface ObjectStorySpec {
  page_id: string;
  instagram_actor_id?: string;
  link_data?: LinkData;
  photo_data?: PhotoData;
  video_data?: VideoData;
  template_data?: TemplateData;
}

// Link data
export interface LinkData {
  link: string;
  message?: string;
  name?: string;
  description?: string;
  caption?: string;
  image_hash?: string;
  picture?: string;
  call_to_action?: {
    type: CallToActionType;
    value?: {
      link?: string;
      link_caption?: string;
    };
  };
  child_attachments?: ChildAttachment[];
}

// Child attachment (for carousel)
export interface ChildAttachment {
  link: string;
  name?: string;
  description?: string;
  image_hash?: string;
  picture?: string;
  video_id?: string;
  call_to_action?: {
    type: CallToActionType;
    value?: {
      link?: string;
    };
  };
}

// Photo data
export interface PhotoData {
  image_hash?: string;
  url?: string;
  caption?: string;
}

// Video data
export interface VideoData {
  video_id: string;
  title?: string;
  message?: string;
  image_hash?: string;
  image_url?: string;
  call_to_action?: {
    type: CallToActionType;
    value?: {
      link?: string;
    };
  };
}

// Template data
export interface TemplateData {
  description?: string;
  link?: string;
  message?: string;
  name?: string;
}

// Asset feed spec (for dynamic creative)
export interface AssetFeedSpec {
  images?: { hash: string; url?: string }[];
  videos?: { video_id: string; thumbnail_url?: string }[];
  bodies?: { text: string }[];
  titles?: { text: string }[];
  descriptions?: { text: string }[];
  link_urls?: { website_url: string }[];
  call_to_action_types?: CallToActionType[];
  ad_formats?: string[];
}

// Insights
export interface Insights {
  account_id?: string;
  account_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;
  date_start: string;
  date_stop: string;
  impressions?: string;
  reach?: string;
  frequency?: string;
  clicks?: string;
  unique_clicks?: string;
  spend?: string;
  cpc?: string;
  cpm?: string;
  cpp?: string;
  ctr?: string;
  unique_ctr?: string;
  actions?: Action[];
  action_values?: ActionValue[];
  cost_per_action_type?: CostPerAction[];
  conversions?: Action[];
  conversion_values?: ActionValue[];
  cost_per_conversion?: CostPerAction[];
  video_p25_watched_actions?: Action[];
  video_p50_watched_actions?: Action[];
  video_p75_watched_actions?: Action[];
  video_p100_watched_actions?: Action[];
  video_play_actions?: Action[];
  website_ctr?: WebsiteCtr[];
}

// Action
export interface Action {
  action_type: string;
  value: string;
}

// Action value
export interface ActionValue {
  action_type: string;
  value: string;
}

// Cost per action
export interface CostPerAction {
  action_type: string;
  value: string;
}

// Website CTR
export interface WebsiteCtr {
  action_type: string;
  value: string;
}

// Activity
export interface Activity {
  actor_id?: string;
  actor_name?: string;
  object_id?: string;
  object_name?: string;
  object_type?: string;
  event_type?: string;
  event_time?: string;
  extra_data?: string;
  translated_event_type?: string;
}

// Instagram Account
export interface InstagramAccount {
  id: string;
  username?: string;
  name?: string;
  profile_pic?: string;
  is_private?: boolean;
  is_published?: boolean;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}

// Ad Creative Analysis
export interface AdCreativeAnalysis {
  ad_id: string;
  creative_id: string;
  name: string;
  status: string;
  creative_type: CreativeType;
  visual_elements: {
    image_url?: string;
    image_hash?: string;
    thumbnail_url?: string;
    video_id?: string;
    video_url?: string;
    video_thumbnail?: string;
    carousel_cards?: {
      image_url: string;
      link: string;
      headline?: string;
      description?: string;
    }[];
  };
  messaging: {
    primary_text?: string;
    headline?: string;
    description?: string;
    link_caption?: string;
    call_to_action?: {
      type: string;
      value?: string;
    };
  };
  link_info: {
    website_url?: string;
    display_url?: string;
    deeplink_url?: string;
  };
  preview_urls?: {
    facebook_feed?: string;
    instagram_feed?: string;
    stories?: string;
  };
  performance?: {
    impressions: number;
    clicks: number;
    spend: number;
    ctr: number;
    cpc: number;
    conversions?: number;
  };
  created_time?: string;
  effective_status: string;
  page_id?: string;
  instagram_actor_id?: string;
}
