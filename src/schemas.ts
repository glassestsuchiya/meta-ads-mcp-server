/**
 * Zod Schemas for Meta Ads MCP Server
 */

import { z } from 'zod';

// Common schemas
const AdAccountIdSchema = z.string()
  .regex(/^act_\d+$/, 'Ad Account ID must start with "act_" followed by numbers')
  .describe('Ad Account ID (e.g., act_123456789)');

const OptionalAdAccountIdSchema = z.string()
  .regex(/^act_\d+$/, 'Ad Account ID must start with "act_" followed by numbers')
  .optional()
  .describe('Ad Account ID (e.g., act_123456789). If not provided, uses default.');

const CampaignIdSchema = z.string()
  .regex(/^\d+$/, 'Campaign ID must be numeric')
  .describe('Campaign ID');

const AdSetIdSchema = z.string()
  .regex(/^\d+$/, 'Ad Set ID must be numeric')
  .describe('Ad Set ID');

const AdIdSchema = z.string()
  .regex(/^\d+$/, 'Ad ID must be numeric')
  .describe('Ad ID');

const CreativeIdSchema = z.string()
  .regex(/^\d+$/, 'Creative ID must be numeric')
  .describe('Ad Creative ID');

const LimitSchema = z.number()
  .int()
  .min(1)
  .max(500)
  .default(100)
  .describe('Maximum number of results to return (1-500)');

const AfterCursorSchema = z.string()
  .optional()
  .describe('Cursor for pagination (from paging.cursors.after)');

// Date presets
const DatePresetSchema = z.enum([
  'today',
  'yesterday',
  'this_month',
  'last_month',
  'this_quarter',
  'last_3d',
  'last_7d',
  'last_14d',
  'last_28d',
  'last_30d',
  'last_90d',
  'last_week_mon_sun',
  'last_week_sun_sat',
  'last_quarter',
  'last_year',
  'this_week_mon_today',
  'this_week_sun_today',
  'this_year',
]).describe('Predefined date range');

// Time range
const TimeRangeSchema = z.object({
  since: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
}).describe('Custom date range');

// Insights level
const LevelSchema = z.enum(['account', 'campaign', 'adset', 'ad'])
  .default('ad')
  .describe('Aggregation level for insights');

// Status filter
const StatusFilterSchema = z.array(
  z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'])
).optional().describe('Filter by status');

const EffectiveStatusFilterSchema = z.array(
  z.enum([
    'ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED',
    'PENDING_REVIEW', 'DISAPPROVED', 'PREAPPROVED',
    'PENDING_BILLING_INFO', 'CAMPAIGN_PAUSED', 'ADSET_PAUSED',
    'IN_PROCESS', 'WITH_ISSUES'
  ])
).optional().describe('Filter by effective status');

// ============================================
// Tool Schemas - Read Operations
// ============================================

// 1. List Ad Accounts
export const ListAdAccountsSchema = z.object({
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 2. Get Ad Account
export const GetAdAccountSchema = z.object({
  ad_account_id: AdAccountIdSchema,
}).strict();

// 3. Get Account Insights
export const GetAccountInsightsSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  date_preset: DatePresetSchema.optional(),
  time_range: TimeRangeSchema.optional(),
  time_increment: z.union([
    z.literal(1),
    z.literal(7),
    z.literal(28),
    z.literal('monthly'),
    z.literal('all_days'),
  ]).optional().describe('Time granularity (1=daily, 7=weekly, etc.)'),
  level: LevelSchema.optional(),
  fields: z.array(z.string()).optional().describe('Specific fields to retrieve'),
  breakdowns: z.array(z.string()).optional().describe('Breakdowns for data segmentation'),
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 4. Get Instagram Accounts
export const GetInstagramAccountsSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 5. List Campaigns
export const ListCampaignsSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  status: StatusFilterSchema,
  effective_status: EffectiveStatusFilterSchema,
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 6. Get Campaign
export const GetCampaignSchema = z.object({
  campaign_id: CampaignIdSchema,
}).strict();

// 7. Get Campaign Insights
export const GetCampaignInsightsSchema = z.object({
  campaign_id: CampaignIdSchema,
  date_preset: DatePresetSchema.optional(),
  time_range: TimeRangeSchema.optional(),
  time_increment: z.union([
    z.literal(1),
    z.literal(7),
    z.literal(28),
    z.literal('monthly'),
    z.literal('all_days'),
  ]).optional(),
  fields: z.array(z.string()).optional(),
  breakdowns: z.array(z.string()).optional(),
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 8. List Ad Sets
export const ListAdSetsSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  campaign_id: CampaignIdSchema.optional(),
  status: StatusFilterSchema,
  effective_status: EffectiveStatusFilterSchema,
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 9. Get Ad Set
export const GetAdSetSchema = z.object({
  adset_id: AdSetIdSchema,
}).strict();

// 10. Get Ad Set Insights
export const GetAdSetInsightsSchema = z.object({
  adset_id: AdSetIdSchema,
  date_preset: DatePresetSchema.optional(),
  time_range: TimeRangeSchema.optional(),
  time_increment: z.union([
    z.literal(1),
    z.literal(7),
    z.literal(28),
    z.literal('monthly'),
    z.literal('all_days'),
  ]).optional(),
  fields: z.array(z.string()).optional(),
  breakdowns: z.array(z.string()).optional(),
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 11. List Ads
export const ListAdsSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  adset_id: AdSetIdSchema.optional(),
  campaign_id: CampaignIdSchema.optional(),
  status: StatusFilterSchema,
  effective_status: EffectiveStatusFilterSchema,
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 12. Get Ad
export const GetAdSchema = z.object({
  ad_id: AdIdSchema,
}).strict();

// 13. Get Ad Insights
export const GetAdInsightsSchema = z.object({
  ad_id: AdIdSchema,
  date_preset: DatePresetSchema.optional(),
  time_range: TimeRangeSchema.optional(),
  time_increment: z.union([
    z.literal(1),
    z.literal(7),
    z.literal(28),
    z.literal('monthly'),
    z.literal('all_days'),
  ]).optional(),
  fields: z.array(z.string()).optional(),
  breakdowns: z.array(z.string()).optional(),
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 14. List Ad Creatives
export const ListAdCreativesSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 15. Get Ad Creative
export const GetAdCreativeSchema = z.object({
  creative_id: CreativeIdSchema,
}).strict();

// 16. Analyze Ad Creative
export const AnalyzeAdCreativeSchema = z.object({
  ad_id: AdIdSchema.optional(),
  creative_id: CreativeIdSchema.optional(),
  include_performance: z.boolean().default(false).describe('Include performance metrics'),
  date_preset: DatePresetSchema.optional(),
  time_range: TimeRangeSchema.optional(),
}).refine(
  (data) => data.ad_id || data.creative_id,
  { message: 'Either ad_id or creative_id must be provided' }
);

// 17. Get Activities
export const GetActivitiesSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  since: z.string().optional().describe('Start time (Unix timestamp or ISO 8601)'),
  until: z.string().optional().describe('End time (Unix timestamp or ISO 8601)'),
  category: z.array(z.enum([
    'ACCOUNT', 'AD', 'AD_SET', 'AUDIENCE', 'BID',
    'BUDGET', 'CAMPAIGN', 'DATE', 'STATUS', 'TARGETING'
  ])).optional().describe('Filter by activity category'),
  uid: z.string().optional().describe('Filter by user ID who made the change'),
  oid: z.string().optional().describe('Filter by object ID that was changed'),
  limit: LimitSchema,
  after: AfterCursorSchema,
}).strict();

// 18. Batch Get
export const BatchGetSchema = z.object({
  ids: z.array(z.string()).min(1).max(50).describe('List of object IDs to fetch'),
  fields: z.array(z.string()).optional().describe('Fields to retrieve'),
}).strict();

// 19. Get Async Report Status
export const GetAsyncReportStatusSchema = z.object({
  report_run_id: z.string().describe('Report Run ID from async insights request'),
}).strict();

// 20. Fetch Next Page
export const FetchNextPageSchema = z.object({
  next_page_url: z.string().url().describe('The paging.next URL from previous response'),
}).strict();

// ============================================
// Tool Schemas - Write Operations
// ============================================

// Campaign objective
const CampaignObjectiveSchema = z.enum([
  'OUTCOME_AWARENESS',
  'OUTCOME_ENGAGEMENT',
  'OUTCOME_LEADS',
  'OUTCOME_SALES',
  'OUTCOME_TRAFFIC',
  'OUTCOME_APP_PROMOTION',
]).describe('Campaign objective');

// Campaign status
const CampaignStatusSchema = z.enum(['ACTIVE', 'PAUSED'])
  .default('PAUSED')
  .describe('Campaign status');

// Special ad categories
const SpecialAdCategoriesSchema = z.array(
  z.enum(['NONE', 'EMPLOYMENT', 'HOUSING', 'CREDIT', 'ISSUES_ELECTIONS_POLITICS', 'ONLINE_GAMBLING_AND_GAMING'])
).default([]).describe('Special ad categories (required, can be empty array)');

// Bid strategy
const BidStrategySchema = z.enum([
  'LOWEST_COST_WITHOUT_CAP',
  'LOWEST_COST_WITH_BID_CAP',
  'COST_CAP',
  'LOWEST_COST_WITH_MIN_ROAS',
]).optional().describe('Bid strategy');

// 21. Create Campaign
export const CreateCampaignSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  name: z.string().min(1).max(400).describe('Campaign name'),
  objective: CampaignObjectiveSchema,
  status: CampaignStatusSchema,
  special_ad_categories: SpecialAdCategoriesSchema,
  daily_budget: z.number().int().min(100).optional().describe('Daily budget in cents'),
  lifetime_budget: z.number().int().min(100).optional().describe('Lifetime budget in cents'),
  bid_strategy: BidStrategySchema,
  start_time: z.string().optional().describe('Start time (ISO 8601)'),
  stop_time: z.string().optional().describe('Stop time (ISO 8601)'),
}).strict();

// 22. Update Campaign
export const UpdateCampaignSchema = z.object({
  campaign_id: CampaignIdSchema,
  name: z.string().min(1).max(400).optional().describe('New campaign name'),
  status: z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']).optional().describe('New status'),
  daily_budget: z.number().int().min(100).optional().describe('New daily budget in cents'),
  lifetime_budget: z.number().int().min(100).optional().describe('New lifetime budget in cents'),
  bid_strategy: BidStrategySchema,
  stop_time: z.string().optional().describe('New stop time (ISO 8601)'),
}).strict();

// 23. Delete Campaign
export const DeleteCampaignSchema = z.object({
  campaign_id: CampaignIdSchema,
}).strict();

// Billing event
const BillingEventSchema = z.enum([
  'APP_INSTALLS', 'CLICKS', 'IMPRESSIONS', 'LINK_CLICKS',
  'NONE', 'OFFER_CLAIMS', 'PAGE_LIKES', 'POST_ENGAGEMENT',
  'THRUPLAY', 'PURCHASE', 'LISTING_INTERACTION',
]).describe('Billing event');

// Optimization goal
const OptimizationGoalSchema = z.enum([
  'NONE', 'APP_INSTALLS', 'AD_RECALL_LIFT', 'ENGAGED_USERS',
  'EVENT_RESPONSES', 'IMPRESSIONS', 'LEAD_GENERATION', 'QUALITY_LEAD',
  'LINK_CLICKS', 'OFFSITE_CONVERSIONS', 'PAGE_LIKES', 'POST_ENGAGEMENT',
  'QUALITY_CALL', 'REACH', 'LANDING_PAGE_VIEWS', 'VISIT_INSTAGRAM_PROFILE',
  'VALUE', 'THRUPLAY', 'DERIVED_EVENTS', 'CONVERSATIONS',
]).describe('Optimization goal');

// Targeting spec
const TargetingSchema = z.object({
  geo_locations: z.object({
    countries: z.array(z.string()).optional(),
    regions: z.array(z.object({ key: z.string() })).optional(),
    cities: z.array(z.object({
      key: z.string(),
      radius: z.number().optional(),
      distance_unit: z.enum(['mile', 'kilometer']).optional(),
    })).optional(),
  }).optional(),
  age_min: z.number().int().min(18).max(65).optional(),
  age_max: z.number().int().min(18).max(65).optional(),
  genders: z.array(z.union([z.literal(1), z.literal(2)])).optional().describe('1=male, 2=female'),
  interests: z.array(z.object({ id: z.string() })).optional(),
  behaviors: z.array(z.object({ id: z.string() })).optional(),
  custom_audiences: z.array(z.object({ id: z.string() })).optional(),
  excluded_custom_audiences: z.array(z.object({ id: z.string() })).optional(),
  publisher_platforms: z.array(z.enum(['facebook', 'instagram', 'messenger', 'audience_network'])).optional(),
  facebook_positions: z.array(z.string()).optional(),
  instagram_positions: z.array(z.string()).optional(),
  device_platforms: z.array(z.enum(['mobile', 'desktop'])).optional(),
}).optional().describe('Targeting specification');

// 24. Create Ad Set
export const CreateAdSetSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  campaign_id: CampaignIdSchema,
  name: z.string().min(1).max(400).describe('Ad Set name'),
  status: z.enum(['ACTIVE', 'PAUSED']).default('PAUSED').describe('Ad Set status'),
  billing_event: BillingEventSchema,
  optimization_goal: OptimizationGoalSchema,
  targeting: TargetingSchema,
  daily_budget: z.number().int().min(100).optional().describe('Daily budget in cents'),
  lifetime_budget: z.number().int().min(100).optional().describe('Lifetime budget in cents'),
  bid_amount: z.number().int().min(1).optional().describe('Bid amount in cents'),
  start_time: z.string().optional().describe('Start time (ISO 8601)'),
  end_time: z.string().optional().describe('End time (ISO 8601)'),
  promoted_object: z.object({
    page_id: z.string().optional(),
    pixel_id: z.string().optional(),
    application_id: z.string().optional(),
    object_store_url: z.string().optional(),
    custom_event_type: z.string().optional(),
  }).optional().describe('Promoted object configuration'),
}).strict();

// 25. Update Ad Set
export const UpdateAdSetSchema = z.object({
  adset_id: AdSetIdSchema,
  name: z.string().min(1).max(400).optional().describe('New Ad Set name'),
  status: z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']).optional().describe('New status'),
  targeting: TargetingSchema,
  daily_budget: z.number().int().min(100).optional().describe('New daily budget in cents'),
  lifetime_budget: z.number().int().min(100).optional().describe('New lifetime budget in cents'),
  bid_amount: z.number().int().min(1).optional().describe('New bid amount in cents'),
  end_time: z.string().optional().describe('New end time (ISO 8601)'),
}).strict();

// 26. Delete Ad Set
export const DeleteAdSetSchema = z.object({
  adset_id: AdSetIdSchema,
}).strict();

// Call to action
const CallToActionSchema = z.object({
  type: z.enum([
    'SHOP_NOW', 'LEARN_MORE', 'SIGN_UP', 'BOOK_TRAVEL', 'CONTACT_US',
    'DOWNLOAD', 'GET_OFFER', 'GET_QUOTE', 'SUBSCRIBE', 'BUY_NOW',
    'APPLY_NOW', 'DONATE_NOW', 'ORDER_NOW', 'WATCH_MORE', 'CALL_NOW',
  ]),
  value: z.object({
    link: z.string().url().optional(),
    link_caption: z.string().optional(),
  }).optional(),
}).optional().describe('Call to action button');

// Creative spec
const CreativeSpecSchema = z.object({
  creative_id: z.string().optional().describe('Existing creative ID to use'),
  name: z.string().optional().describe('Creative name for new creative'),
  object_story_spec: z.object({
    page_id: z.string().describe('Facebook Page ID'),
    instagram_actor_id: z.string().optional().describe('Instagram account ID'),
    link_data: z.object({
      link: z.string().url().describe('Destination URL'),
      message: z.string().optional().describe('Primary text'),
      name: z.string().optional().describe('Headline'),
      description: z.string().optional().describe('Description'),
      image_hash: z.string().optional().describe('Image hash'),
      picture: z.string().url().optional().describe('Image URL'),
      call_to_action: CallToActionSchema,
    }).optional(),
    video_data: z.object({
      video_id: z.string().describe('Video ID'),
      title: z.string().optional().describe('Video title'),
      message: z.string().optional().describe('Primary text'),
      image_hash: z.string().optional().describe('Thumbnail image hash'),
      call_to_action: CallToActionSchema,
    }).optional(),
  }).optional(),
}).describe('Creative specification');

// 27. Create Ad
export const CreateAdSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  adset_id: AdSetIdSchema,
  name: z.string().min(1).max(400).describe('Ad name'),
  status: z.enum(['ACTIVE', 'PAUSED']).default('PAUSED').describe('Ad status'),
  creative: CreativeSpecSchema,
  tracking_specs: z.array(z.object({
    action_type: z.array(z.string()),
    fb_pixel: z.array(z.string()).optional(),
  })).optional().describe('Tracking specifications'),
}).strict();

// 28. Update Ad
export const UpdateAdSchema = z.object({
  ad_id: AdIdSchema,
  name: z.string().min(1).max(400).optional().describe('New Ad name'),
  status: z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']).optional().describe('New status'),
  creative: z.object({
    creative_id: z.string().describe('New creative ID to use'),
  }).optional().describe('New creative'),
}).strict();

// 29. Delete Ad
export const DeleteAdSchema = z.object({
  ad_id: AdIdSchema,
}).strict();

// 30. Create Ad Creative
export const CreateAdCreativeSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  name: z.string().min(1).max(400).describe('Creative name'),
  object_story_spec: z.object({
    page_id: z.string().describe('Facebook Page ID'),
    instagram_actor_id: z.string().optional().describe('Instagram account ID'),
    link_data: z.object({
      link: z.string().url().describe('Destination URL'),
      message: z.string().optional().describe('Primary text'),
      name: z.string().optional().describe('Headline'),
      description: z.string().optional().describe('Description'),
      image_hash: z.string().optional().describe('Image hash'),
      picture: z.string().url().optional().describe('Image URL'),
      call_to_action: CallToActionSchema,
      child_attachments: z.array(z.object({
        link: z.string().url(),
        name: z.string().optional(),
        description: z.string().optional(),
        image_hash: z.string().optional(),
        picture: z.string().url().optional(),
        call_to_action: CallToActionSchema,
      })).optional().describe('Carousel cards'),
    }).optional(),
    video_data: z.object({
      video_id: z.string().describe('Video ID'),
      title: z.string().optional().describe('Video title'),
      message: z.string().optional().describe('Primary text'),
      image_hash: z.string().optional().describe('Thumbnail image hash'),
      call_to_action: CallToActionSchema,
    }).optional(),
  }).describe('Story specification'),
  url_tags: z.string().optional().describe('URL tags for tracking'),
}).strict();

// 31. Upload Ad Image
export const UploadAdImageSchema = z.object({
  ad_account_id: AdAccountIdSchema,
  image_url: z.string().url().optional().describe('URL of image to upload'),
  image_file: z.string().optional().describe('Base64 encoded image data'),
  name: z.string().optional().describe('Image name'),
}).refine(
  (data) => data.image_url || data.image_file,
  { message: 'Either image_url or image_file must be provided' }
);

// ============================================
// Tool Definitions for MCP
// ============================================

export const TOOL_DEFINITIONS = [
  // Read Operations
  {
    name: 'meta_ads_list_ad_accounts',
    description: 'List all ad accounts accessible to the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum results (1-500)', default: 100 },
        after: { type: 'string', description: 'Pagination cursor' },
      },
    },
  },
  {
    name: 'meta_ads_get_ad_account',
    description: 'Get detailed information about a specific ad account',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID (e.g., act_123456789)' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_get_account_insights',
    description: 'Get performance insights for an ad account',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        date_preset: { type: 'string', description: 'Date preset (today, yesterday, last_7d, last_30d, etc.)' },
        time_range: {
          type: 'object',
          properties: {
            since: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
            until: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          },
        },
        level: { type: 'string', enum: ['account', 'campaign', 'adset', 'ad'], default: 'ad' },
        fields: { type: 'array', items: { type: 'string' }, description: 'Fields to retrieve' },
        breakdowns: { type: 'array', items: { type: 'string' }, description: 'Data breakdowns' },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_get_instagram_accounts',
    description: 'Get Instagram accounts connected to an ad account',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_list_campaigns',
    description: 'List campaigns in an ad account',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        status: { type: 'array', items: { type: 'string' }, description: 'Filter by status' },
        effective_status: { type: 'array', items: { type: 'string' }, description: 'Filter by effective status' },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_get_campaign',
    description: 'Get details of a specific campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'meta_ads_get_campaign_insights',
    description: 'Get performance insights for a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID' },
        date_preset: { type: 'string' },
        time_range: { type: 'object' },
        fields: { type: 'array', items: { type: 'string' } },
        breakdowns: { type: 'array', items: { type: 'string' } },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'meta_ads_list_adsets',
    description: 'List ad sets in an ad account',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        campaign_id: { type: 'string', description: 'Filter by campaign ID' },
        status: { type: 'array', items: { type: 'string' } },
        effective_status: { type: 'array', items: { type: 'string' } },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_get_adset',
    description: 'Get details of a specific ad set',
    inputSchema: {
      type: 'object',
      properties: {
        adset_id: { type: 'string', description: 'Ad Set ID' },
      },
      required: ['adset_id'],
    },
  },
  {
    name: 'meta_ads_get_adset_insights',
    description: 'Get performance insights for an ad set',
    inputSchema: {
      type: 'object',
      properties: {
        adset_id: { type: 'string', description: 'Ad Set ID' },
        date_preset: { type: 'string' },
        time_range: { type: 'object' },
        fields: { type: 'array', items: { type: 'string' } },
        breakdowns: { type: 'array', items: { type: 'string' } },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['adset_id'],
    },
  },
  {
    name: 'meta_ads_list_ads',
    description: 'List ads in an ad account',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        adset_id: { type: 'string', description: 'Filter by ad set ID' },
        campaign_id: { type: 'string', description: 'Filter by campaign ID' },
        status: { type: 'array', items: { type: 'string' } },
        effective_status: { type: 'array', items: { type: 'string' } },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_get_ad',
    description: 'Get details of a specific ad',
    inputSchema: {
      type: 'object',
      properties: {
        ad_id: { type: 'string', description: 'Ad ID' },
      },
      required: ['ad_id'],
    },
  },
  {
    name: 'meta_ads_get_ad_insights',
    description: 'Get performance insights for an ad',
    inputSchema: {
      type: 'object',
      properties: {
        ad_id: { type: 'string', description: 'Ad ID' },
        date_preset: { type: 'string' },
        time_range: { type: 'object' },
        fields: { type: 'array', items: { type: 'string' } },
        breakdowns: { type: 'array', items: { type: 'string' } },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['ad_id'],
    },
  },
  {
    name: 'meta_ads_list_ad_creatives',
    description: 'List ad creatives in an ad account',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_get_ad_creative',
    description: 'Get details of a specific ad creative',
    inputSchema: {
      type: 'object',
      properties: {
        creative_id: { type: 'string', description: 'Creative ID' },
      },
      required: ['creative_id'],
    },
  },
  {
    name: 'meta_ads_analyze_ad_creative',
    description: 'Analyze an ad creative in detail including visual elements, messaging, and performance',
    inputSchema: {
      type: 'object',
      properties: {
        ad_id: { type: 'string', description: 'Ad ID to analyze' },
        creative_id: { type: 'string', description: 'Creative ID to analyze' },
        include_performance: { type: 'boolean', default: false, description: 'Include performance metrics' },
        date_preset: { type: 'string', description: 'Date preset for performance data' },
        time_range: { type: 'object', description: 'Custom date range for performance' },
      },
    },
  },
  {
    name: 'meta_ads_get_activities',
    description: 'Get activity/change history for an ad account',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        since: { type: 'string', description: 'Start time (Unix timestamp or ISO 8601)' },
        until: { type: 'string', description: 'End time' },
        category: { type: 'array', items: { type: 'string' }, description: 'Filter by category (ACCOUNT, AD, CAMPAIGN, etc.)' },
        uid: { type: 'string', description: 'Filter by user ID' },
        oid: { type: 'string', description: 'Filter by object ID' },
        limit: { type: 'number', default: 100 },
        after: { type: 'string' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_batch_get',
    description: 'Get multiple objects by their IDs in a single request',
    inputSchema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'string' }, description: 'List of object IDs (max 50)' },
        fields: { type: 'array', items: { type: 'string' }, description: 'Fields to retrieve' },
      },
      required: ['ids'],
    },
  },
  {
    name: 'meta_ads_get_async_report_status',
    description: 'Check the status of an async insights report',
    inputSchema: {
      type: 'object',
      properties: {
        report_run_id: { type: 'string', description: 'Report Run ID' },
      },
      required: ['report_run_id'],
    },
  },
  {
    name: 'meta_ads_fetch_next_page',
    description: 'Fetch the next page of results using a pagination URL',
    inputSchema: {
      type: 'object',
      properties: {
        next_page_url: { type: 'string', description: 'The paging.next URL from previous response' },
      },
      required: ['next_page_url'],
    },
  },
  // Write Operations
  {
    name: 'meta_ads_create_campaign',
    description: 'Create a new campaign',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        name: { type: 'string', description: 'Campaign name' },
        objective: { type: 'string', description: 'Campaign objective (OUTCOME_AWARENESS, OUTCOME_TRAFFIC, etc.)' },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED'], default: 'PAUSED' },
        special_ad_categories: { type: 'array', items: { type: 'string' }, default: [] },
        daily_budget: { type: 'number', description: 'Daily budget in cents' },
        lifetime_budget: { type: 'number', description: 'Lifetime budget in cents' },
        bid_strategy: { type: 'string' },
        start_time: { type: 'string' },
        stop_time: { type: 'string' },
      },
      required: ['ad_account_id', 'name', 'objective', 'special_ad_categories'],
    },
  },
  {
    name: 'meta_ads_update_campaign',
    description: 'Update an existing campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID' },
        name: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'] },
        daily_budget: { type: 'number' },
        lifetime_budget: { type: 'number' },
        bid_strategy: { type: 'string' },
        stop_time: { type: 'string' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'meta_ads_delete_campaign',
    description: 'Delete a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'meta_ads_create_adset',
    description: 'Create a new ad set',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string' },
        campaign_id: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED'], default: 'PAUSED' },
        billing_event: { type: 'string' },
        optimization_goal: { type: 'string' },
        targeting: { type: 'object' },
        daily_budget: { type: 'number' },
        lifetime_budget: { type: 'number' },
        bid_amount: { type: 'number' },
        start_time: { type: 'string' },
        end_time: { type: 'string' },
        promoted_object: { type: 'object' },
      },
      required: ['ad_account_id', 'campaign_id', 'name', 'billing_event', 'optimization_goal'],
    },
  },
  {
    name: 'meta_ads_update_adset',
    description: 'Update an existing ad set',
    inputSchema: {
      type: 'object',
      properties: {
        adset_id: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'] },
        targeting: { type: 'object' },
        daily_budget: { type: 'number' },
        lifetime_budget: { type: 'number' },
        bid_amount: { type: 'number' },
        end_time: { type: 'string' },
      },
      required: ['adset_id'],
    },
  },
  {
    name: 'meta_ads_delete_adset',
    description: 'Delete an ad set',
    inputSchema: {
      type: 'object',
      properties: {
        adset_id: { type: 'string' },
      },
      required: ['adset_id'],
    },
  },
  {
    name: 'meta_ads_create_ad',
    description: 'Create a new ad',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string' },
        adset_id: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED'], default: 'PAUSED' },
        creative: { type: 'object', description: 'Creative specification (creative_id or object_story_spec)' },
        tracking_specs: { type: 'array', items: { type: 'object' } },
      },
      required: ['ad_account_id', 'adset_id', 'name', 'creative'],
    },
  },
  {
    name: 'meta_ads_update_ad',
    description: 'Update an existing ad',
    inputSchema: {
      type: 'object',
      properties: {
        ad_id: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'] },
        creative: { type: 'object' },
      },
      required: ['ad_id'],
    },
  },
  {
    name: 'meta_ads_delete_ad',
    description: 'Delete an ad',
    inputSchema: {
      type: 'object',
      properties: {
        ad_id: { type: 'string' },
      },
      required: ['ad_id'],
    },
  },
  {
    name: 'meta_ads_create_ad_creative',
    description: 'Create a new ad creative',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string' },
        name: { type: 'string' },
        object_story_spec: { type: 'object', description: 'Story specification with page_id and link_data or video_data' },
        url_tags: { type: 'string' },
      },
      required: ['ad_account_id', 'name', 'object_story_spec'],
    },
  },
  {
    name: 'meta_ads_upload_ad_image',
    description: 'Upload an image to use in ad creatives',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string' },
        image_url: { type: 'string', description: 'URL of image to upload' },
        image_file: { type: 'string', description: 'Base64 encoded image data' },
        name: { type: 'string' },
      },
      required: ['ad_account_id'],
    },
  },
  {
    name: 'meta_ads_create_custom_audience',
    description: 'Create a custom audience for website visitor retargeting. Creates a WEBSITE subtype audience with optional URL rules and exclusion rules.',
    inputSchema: {
      type: 'object',
      properties: {
        ad_account_id: { type: 'string', description: 'Ad Account ID' },
        name: { type: 'string', description: 'Audience name' },
        retention_days: { type: 'number', description: 'How many days to retain visitors (e.g. 180)' },
        rule: { type: 'object', description: 'URL matching rule (e.g. {"url":{"operator":"i_contains","value":"product"}})' },
        exclusion_rule: { type: 'object', description: 'Exclusion rule (e.g. exclude converted users)' },
        description: { type: 'string', description: 'Audience description' },
      },
      required: ['ad_account_id', 'name'],
    },
  },
] as const;

// Type exports
export type ListAdAccountsInput = z.infer<typeof ListAdAccountsSchema>;
export type GetAdAccountInput = z.infer<typeof GetAdAccountSchema>;
export type GetAccountInsightsInput = z.infer<typeof GetAccountInsightsSchema>;
export type GetInstagramAccountsInput = z.infer<typeof GetInstagramAccountsSchema>;
export type ListCampaignsInput = z.infer<typeof ListCampaignsSchema>;
export type GetCampaignInput = z.infer<typeof GetCampaignSchema>;
export type GetCampaignInsightsInput = z.infer<typeof GetCampaignInsightsSchema>;
export type ListAdSetsInput = z.infer<typeof ListAdSetsSchema>;
export type GetAdSetInput = z.infer<typeof GetAdSetSchema>;
export type GetAdSetInsightsInput = z.infer<typeof GetAdSetInsightsSchema>;
export type ListAdsInput = z.infer<typeof ListAdsSchema>;
export type GetAdInput = z.infer<typeof GetAdSchema>;
export type GetAdInsightsInput = z.infer<typeof GetAdInsightsSchema>;
export type ListAdCreativesInput = z.infer<typeof ListAdCreativesSchema>;
export type GetAdCreativeInput = z.infer<typeof GetAdCreativeSchema>;
export type AnalyzeAdCreativeInput = z.infer<typeof AnalyzeAdCreativeSchema>;
export type GetActivitiesInput = z.infer<typeof GetActivitiesSchema>;
export type BatchGetInput = z.infer<typeof BatchGetSchema>;
export type GetAsyncReportStatusInput = z.infer<typeof GetAsyncReportStatusSchema>;
export type FetchNextPageInput = z.infer<typeof FetchNextPageSchema>;
export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof UpdateCampaignSchema>;
export type DeleteCampaignInput = z.infer<typeof DeleteCampaignSchema>;
export type CreateAdSetInput = z.infer<typeof CreateAdSetSchema>;
export type UpdateAdSetInput = z.infer<typeof UpdateAdSetSchema>;
export type DeleteAdSetInput = z.infer<typeof DeleteAdSetSchema>;
export type CreateAdInput = z.infer<typeof CreateAdSchema>;
export type UpdateAdInput = z.infer<typeof UpdateAdSchema>;
export type DeleteAdInput = z.infer<typeof DeleteAdSchema>;
export type CreateAdCreativeInput = z.infer<typeof CreateAdCreativeSchema>;
export type UploadAdImageInput = z.infer<typeof UploadAdImageSchema>;
