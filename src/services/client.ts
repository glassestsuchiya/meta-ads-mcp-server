/**
 * Meta Marketing API Client
 * Handles all HTTP requests to Meta Graph API
 */

import {
  META_API_BASE_URL,
  META_API_VERSION,
  AD_ACCOUNT_FIELDS,
  CAMPAIGN_FIELDS,
  ADSET_FIELDS,
  AD_FIELDS,
  AD_CREATIVE_FIELDS,
  INSIGHTS_FIELDS,
  ACTIVITY_FIELDS,
  INSTAGRAM_ACCOUNT_FIELDS,
  RETRY_ERROR_CODES,
  RATE_LIMIT_WAIT,
} from '../constants.js';
import type {
  AdAccount,
  Campaign,
  AdSet,
  Ad,
  AdCreative,
  Insights,
  Activity,
  InstagramAccount,
  PaginatedResponse,
  MetaApiErrorResponse,
  Targeting,
  ObjectStorySpec,
  AssetFeedSpec,
  DatePreset,
  Breakdown,
  ActionBreakdown,
  AdCreativeAnalysis,
  CampaignObjective,
  CampaignStatus,
  AdSetStatus,
  AdStatus,
  BidStrategy,
  BillingEvent,
  OptimizationGoal,
  SpecialAdCategory,
} from '../types.js';

// Environment configuration
interface MetaApiConfig {
  accessToken: string;
  appId?: string;
  appSecret?: string;
  defaultAccountId?: string;
}

function getConfig(): MetaApiConfig {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('META_ADS_ACCESS_TOKEN environment variable is required');
  }
  return {
    accessToken,
    appId: process.env.META_ADS_APP_ID,
    appSecret: process.env.META_ADS_APP_SECRET,
    defaultAccountId: process.env.META_ADS_DEFAULT_ACCOUNT_ID,
  };
}

// Helper to normalize account ID
function normalizeAccountId(accountId: string): string {
  return accountId.startsWith('act_') ? accountId : `act_${accountId}`;
}

// Helper to strip act_ prefix for API paths that don't need it
function stripActPrefix(accountId: string): string {
  return accountId.startsWith('act_') ? accountId.substring(4) : accountId;
}

// Error class for Meta API errors
export class MetaApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public type: string,
    public subcode?: number,
    public fbtrace_id?: string
  ) {
    super(message);
    this.name = 'MetaApiError';
  }
}

// Sleep helper for rate limiting
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main API request function with retry logic
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE' = 'GET',
  body?: Record<string, unknown>,
  retryCount = 0
): Promise<T> {
  const config = getConfig();

  // Build URL properly - ensure endpoint doesn't start with / to preserve base URL path
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const fullUrl = `${META_API_BASE_URL}/${cleanEndpoint}`;
  const url = new URL(fullUrl);

  // Add access token to all requests
  if (method === 'GET') {
    url.searchParams.set('access_token', config.accessToken);
  }

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === 'POST' && body) {
    options.body = JSON.stringify({
      ...body,
      access_token: config.accessToken,
    });
  } else if (method === 'DELETE') {
    url.searchParams.set('access_token', config.accessToken);
  }

  try {
    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (!response.ok) {
      const errorResponse = data as MetaApiErrorResponse;
      const error = errorResponse.error;

      // Check if we should retry
      if (RETRY_ERROR_CODES.includes(error.code) && retryCount < 3) {
        const waitTime = error.code === 17 || error.code === 4
          ? RATE_LIMIT_WAIT.HEAVY
          : RATE_LIMIT_WAIT.DEFAULT;
        console.error(`Rate limited, waiting ${waitTime}ms before retry...`);
        await sleep(waitTime);
        return apiRequest(endpoint, method, body, retryCount + 1);
      }

      throw new MetaApiError(
        error.message,
        error.code,
        error.type,
        error.error_subcode,
        error.fbtrace_id
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof MetaApiError) {
      throw error;
    }
    throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================
// Ad Account Functions
// ============================================

export async function listAdAccounts(): Promise<AdAccount[]> {
  const config = getConfig();
  const fields = AD_ACCOUNT_FIELDS.join(',');
  const response = await apiRequest<PaginatedResponse<AdAccount>>(
    `/me/adaccounts?fields=${fields}`
  );
  return response.data;
}

export async function getAdAccount(accountId: string): Promise<AdAccount> {
  const normalizedId = normalizeAccountId(accountId);
  const fields = AD_ACCOUNT_FIELDS.join(',');
  return apiRequest<AdAccount>(`/${normalizedId}?fields=${fields}`);
}

// ============================================
// Campaign Functions
// ============================================

export async function listCampaigns(
  accountId: string,
  options?: {
    limit?: number;
    status?: CampaignStatus[];
    effectiveStatus?: string[];
  }
): Promise<PaginatedResponse<Campaign>> {
  const normalizedId = normalizeAccountId(accountId);
  const fields = CAMPAIGN_FIELDS.join(',');

  let url = `/${normalizedId}/campaigns?fields=${fields}`;

  if (options?.limit) {
    url += `&limit=${options.limit}`;
  }
  if (options?.status && options.status.length > 0) {
    url += `&filtering=[{"field":"status","operator":"IN","value":${JSON.stringify(options.status)}}]`;
  }
  if (options?.effectiveStatus && options.effectiveStatus.length > 0) {
    url += `&effective_status=${JSON.stringify(options.effectiveStatus)}`;
  }

  return apiRequest<PaginatedResponse<Campaign>>(url);
}

export async function getCampaign(campaignId: string): Promise<Campaign> {
  const fields = CAMPAIGN_FIELDS.join(',');
  return apiRequest<Campaign>(`/${campaignId}?fields=${fields}`);
}

export async function createCampaign(
  accountId: string,
  params: {
    name: string;
    objective: CampaignObjective;
    status?: CampaignStatus;
    special_ad_categories?: SpecialAdCategory[];
    daily_budget?: number;
    lifetime_budget?: number;
    bid_strategy?: BidStrategy;
    buying_type?: string;
    start_time?: string;
    stop_time?: string;
  }
): Promise<{ id: string }> {
  const normalizedId = normalizeAccountId(accountId);
  return apiRequest<{ id: string }>(`/${normalizedId}/campaigns`, 'POST', params);
}

export async function updateCampaign(
  campaignId: string,
  params: {
    name?: string;
    status?: CampaignStatus;
    daily_budget?: number;
    lifetime_budget?: number;
    bid_strategy?: BidStrategy;
    start_time?: string;
    stop_time?: string;
  }
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/${campaignId}`, 'POST', params);
}

export async function deleteCampaign(campaignId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/${campaignId}`, 'DELETE');
}

// ============================================
// Ad Set Functions
// ============================================

export async function listAdSets(
  accountId: string,
  options?: {
    campaignId?: string;
    limit?: number;
    status?: AdSetStatus[];
    effectiveStatus?: string[];
  }
): Promise<PaginatedResponse<AdSet>> {
  const normalizedId = normalizeAccountId(accountId);
  const fields = ADSET_FIELDS.join(',');

  let url = `/${normalizedId}/adsets?fields=${fields}`;

  if (options?.campaignId) {
    url = `/${options.campaignId}/adsets?fields=${fields}`;
  }
  if (options?.limit) {
    url += `&limit=${options.limit}`;
  }
  if (options?.status && options.status.length > 0) {
    url += `&filtering=[{"field":"status","operator":"IN","value":${JSON.stringify(options.status)}}]`;
  }
  if (options?.effectiveStatus && options.effectiveStatus.length > 0) {
    url += `&effective_status=${JSON.stringify(options.effectiveStatus)}`;
  }

  return apiRequest<PaginatedResponse<AdSet>>(url);
}

export async function getAdSet(adSetId: string): Promise<AdSet> {
  const fields = ADSET_FIELDS.join(',');
  return apiRequest<AdSet>(`/${adSetId}?fields=${fields}`);
}

export async function createAdSet(
  accountId: string,
  params: {
    name: string;
    campaign_id: string;
    status?: AdSetStatus;
    billing_event: BillingEvent;
    optimization_goal: OptimizationGoal;
    targeting: Targeting;
    daily_budget?: number;
    lifetime_budget?: number;
    bid_amount?: number;
    bid_strategy?: BidStrategy;
    start_time?: string;
    end_time?: string;
  }
): Promise<{ id: string }> {
  const normalizedId = normalizeAccountId(accountId);
  return apiRequest<{ id: string }>(`/${normalizedId}/adsets`, 'POST', params);
}

export async function updateAdSet(
  adSetId: string,
  params: {
    name?: string;
    status?: AdSetStatus;
    daily_budget?: number;
    lifetime_budget?: number;
    bid_amount?: number;
    targeting?: Targeting;
    start_time?: string;
    end_time?: string;
  }
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/${adSetId}`, 'POST', params);
}

export async function deleteAdSet(adSetId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/${adSetId}`, 'DELETE');
}

// ============================================
// Ad Functions
// ============================================

export async function listAds(
  accountId: string,
  options?: {
    adSetId?: string;
    campaignId?: string;
    limit?: number;
    status?: AdStatus[];
    effectiveStatus?: string[];
  }
): Promise<PaginatedResponse<Ad>> {
  const normalizedId = normalizeAccountId(accountId);
  const fields = AD_FIELDS.join(',');

  let url = `/${normalizedId}/ads?fields=${fields}`;

  if (options?.adSetId) {
    url = `/${options.adSetId}/ads?fields=${fields}`;
  } else if (options?.campaignId) {
    url += `&filtering=[{"field":"campaign.id","operator":"EQUAL","value":"${options.campaignId}"}]`;
  }
  if (options?.limit) {
    url += `&limit=${options.limit}`;
  }
  if (options?.status && options.status.length > 0) {
    url += `&filtering=[{"field":"status","operator":"IN","value":${JSON.stringify(options.status)}}]`;
  }
  if (options?.effectiveStatus && options.effectiveStatus.length > 0) {
    url += `&effective_status=${JSON.stringify(options.effectiveStatus)}`;
  }

  return apiRequest<PaginatedResponse<Ad>>(url);
}

export async function getAd(adId: string): Promise<Ad> {
  const fields = AD_FIELDS.join(',');
  return apiRequest<Ad>(`/${adId}?fields=${fields}`);
}

export async function createAd(
  accountId: string,
  params: {
    name: string;
    adset_id: string;
    creative: { creative_id: string } | { object_story_spec: ObjectStorySpec };
    status?: AdStatus;
    tracking_specs?: Record<string, unknown>[];
    conversion_specs?: Record<string, unknown>[];
  }
): Promise<{ id: string }> {
  const normalizedId = normalizeAccountId(accountId);
  return apiRequest<{ id: string }>(`/${normalizedId}/ads`, 'POST', params);
}

export async function updateAd(
  adId: string,
  params: {
    name?: string;
    status?: AdStatus;
  }
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/${adId}`, 'POST', params);
}

export async function deleteAd(adId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/${adId}`, 'DELETE');
}

// ============================================
// Ad Creative Functions
// ============================================

export async function listAdCreatives(
  accountId: string,
  options?: {
    limit?: number;
  }
): Promise<PaginatedResponse<AdCreative>> {
  const normalizedId = normalizeAccountId(accountId);
  const fields = AD_CREATIVE_FIELDS.join(',');

  let url = `/${normalizedId}/adcreatives?fields=${fields}`;

  if (options?.limit) {
    url += `&limit=${options.limit}`;
  }

  return apiRequest<PaginatedResponse<AdCreative>>(url);
}

export async function getAdCreative(creativeId: string): Promise<AdCreative> {
  const fields = AD_CREATIVE_FIELDS.join(',');
  return apiRequest<AdCreative>(`/${creativeId}?fields=${fields}`);
}

export async function createAdCreative(
  accountId: string,
  params: {
    name?: string;
    object_story_spec?: ObjectStorySpec;
    asset_feed_spec?: AssetFeedSpec;
    url_tags?: string;
  }
): Promise<{ id: string }> {
  const normalizedId = normalizeAccountId(accountId);
  return apiRequest<{ id: string }>(`/${normalizedId}/adcreatives`, 'POST', params);
}

// ============================================
// Insights Functions
// ============================================

export async function getInsights(
  objectId: string,
  options: {
    level?: 'account' | 'campaign' | 'adset' | 'ad';
    date_preset?: DatePreset;
    time_range?: { since: string; until: string };
    time_increment?: number | 'monthly' | 'all_days';
    breakdowns?: Breakdown[];
    action_breakdowns?: ActionBreakdown[];
    fields?: string[];
    limit?: number;
  }
): Promise<PaginatedResponse<Insights>> {
  const fields = options.fields?.join(',') || INSIGHTS_FIELDS.PERFORMANCE.join(',');

  let url = `/${objectId}/insights?fields=${fields}`;

  if (options.level) {
    url += `&level=${options.level}`;
  }
  if (options.date_preset) {
    url += `&date_preset=${options.date_preset}`;
  }
  if (options.time_range) {
    url += `&time_range=${JSON.stringify(options.time_range)}`;
  }
  if (options.time_increment) {
    url += `&time_increment=${options.time_increment}`;
  }
  if (options.breakdowns && options.breakdowns.length > 0) {
    url += `&breakdowns=${options.breakdowns.join(',')}`;
  }
  if (options.action_breakdowns && options.action_breakdowns.length > 0) {
    url += `&action_breakdowns=${options.action_breakdowns.join(',')}`;
  }
  if (options.limit) {
    url += `&limit=${options.limit}`;
  }

  return apiRequest<PaginatedResponse<Insights>>(url);
}

export async function getAccountInsights(
  accountId: string,
  options: {
    date_preset?: DatePreset;
    time_range?: { since: string; until: string };
    time_increment?: number | 'monthly' | 'all_days';
    breakdowns?: Breakdown[];
    fields?: string[];
  }
): Promise<PaginatedResponse<Insights>> {
  const normalizedId = normalizeAccountId(accountId);
  return getInsights(normalizedId, options);
}

export async function getCampaignInsights(
  campaignId: string,
  options: {
    date_preset?: DatePreset;
    time_range?: { since: string; until: string };
    time_increment?: number | 'monthly' | 'all_days';
    breakdowns?: Breakdown[];
    fields?: string[];
  }
): Promise<PaginatedResponse<Insights>> {
  return getInsights(campaignId, options);
}

export async function getAdSetInsights(
  adSetId: string,
  options: {
    date_preset?: DatePreset;
    time_range?: { since: string; until: string };
    time_increment?: number | 'monthly' | 'all_days';
    breakdowns?: Breakdown[];
    fields?: string[];
  }
): Promise<PaginatedResponse<Insights>> {
  return getInsights(adSetId, options);
}

export async function getAdInsights(
  adId: string,
  options: {
    date_preset?: DatePreset;
    time_range?: { since: string; until: string };
    time_increment?: number | 'monthly' | 'all_days';
    breakdowns?: Breakdown[];
    fields?: string[];
  }
): Promise<PaginatedResponse<Insights>> {
  return getInsights(adId, options);
}

// ============================================
// Activity Functions
// ============================================

export async function getActivities(
  accountId: string,
  options?: {
    since?: string;
    until?: string;
    add_children?: boolean;
    business_id?: string;
    category?: string;
    extra_oids?: string[];
    limit?: number;
    oid?: string;
    uid?: string;
  }
): Promise<PaginatedResponse<Activity>> {
  const normalizedId = normalizeAccountId(accountId);
  const fields = ACTIVITY_FIELDS.join(',');

  let url = `/${normalizedId}/activities?fields=${fields}`;

  if (options?.since) {
    url += `&since=${options.since}`;
  }
  if (options?.until) {
    url += `&until=${options.until}`;
  }
  if (options?.add_children !== undefined) {
    url += `&add_children=${options.add_children}`;
  }
  if (options?.business_id) {
    url += `&business_id=${options.business_id}`;
  }
  if (options?.category) {
    url += `&category=${options.category}`;
  }
  if (options?.extra_oids && options.extra_oids.length > 0) {
    url += `&extra_oids=${options.extra_oids.join(',')}`;
  }
  if (options?.limit) {
    url += `&limit=${options.limit}`;
  }
  if (options?.oid) {
    url += `&oid=${options.oid}`;
  }
  if (options?.uid) {
    url += `&uid=${options.uid}`;
  }

  return apiRequest<PaginatedResponse<Activity>>(url);
}

// ============================================
// Instagram Account Functions
// ============================================

export async function getInstagramAccounts(
  accountId: string
): Promise<PaginatedResponse<InstagramAccount>> {
  const normalizedId = normalizeAccountId(accountId);
  const fields = INSTAGRAM_ACCOUNT_FIELDS.join(',');
  return apiRequest<PaginatedResponse<InstagramAccount>>(
    `/${normalizedId}/instagram_accounts?fields=${fields}`
  );
}

// ============================================
// Creative Analysis Functions
// ============================================

export async function analyzeAdCreative(
  adId: string,
  options?: {
    include_performance?: boolean;
    date_preset?: DatePreset;
    time_range?: { since: string; until: string };
  }
): Promise<AdCreativeAnalysis> {
  // Get the ad with creative details
  const ad = await getAd(adId);

  if (!ad.creative?.id) {
    throw new Error('Ad does not have an associated creative');
  }

  // Get full creative details
  const creative = await getAdCreative(ad.creative.id);

  // Build the analysis object
  const analysis: AdCreativeAnalysis = {
    ad_id: ad.id,
    creative_id: creative.id,
    name: ad.name,
    status: ad.status,
    effective_status: ad.effective_status,
    creative_type: determineCreativeType(creative),
    visual_elements: extractVisualElements(creative),
    messaging: extractMessaging(creative),
    link_info: extractLinkInfo(creative),
    page_id: creative.object_story_spec?.page_id,
    instagram_actor_id: creative.object_story_spec?.instagram_actor_id,
    created_time: ad.created_time,
  };

  // Get performance data if requested
  if (options?.include_performance) {
    try {
      const insightsOptions: {
        date_preset?: DatePreset;
        time_range?: { since: string; until: string };
        fields: string[];
      } = {
        fields: [...INSIGHTS_FIELDS.MINIMAL],
      };

      if (options.time_range) {
        insightsOptions.time_range = options.time_range;
      } else if (options.date_preset) {
        insightsOptions.date_preset = options.date_preset;
      } else {
        insightsOptions.date_preset = 'last_30d';
      }

      const insights = await getAdInsights(adId, insightsOptions);

      if (insights.data && insights.data.length > 0) {
        const data = insights.data[0];
        analysis.performance = {
          impressions: parseInt(data.impressions || '0'),
          clicks: parseInt(data.clicks || '0'),
          spend: parseFloat(data.spend || '0'),
          ctr: parseFloat(data.ctr || '0'),
          cpc: parseFloat(data.cpc || '0'),
          conversions: data.actions?.find(a => a.action_type === 'purchase')?.value
            ? parseInt(data.actions.find(a => a.action_type === 'purchase')!.value)
            : undefined,
        };
      }
    } catch (error) {
      // Performance data is optional, don't fail if unavailable
      console.error('Failed to fetch performance data:', error);
    }
  }

  return analysis;
}

function determineCreativeType(creative: AdCreative): AdCreativeAnalysis['creative_type'] {
  if (creative.object_story_spec?.video_data || creative.video_id) {
    return 'VIDEO';
  }
  if (creative.object_story_spec?.link_data?.child_attachments) {
    return 'CAROUSEL';
  }
  if (creative.asset_feed_spec) {
    return 'DYNAMIC';
  }
  if (creative.object_type === 'SHARE' && creative.object_story_spec?.link_data) {
    return 'COLLECTION';
  }
  return 'IMAGE';
}

function extractVisualElements(creative: AdCreative): AdCreativeAnalysis['visual_elements'] {
  const elements: AdCreativeAnalysis['visual_elements'] = {};

  if (creative.image_url) {
    elements.image_url = creative.image_url;
  }
  if (creative.image_hash) {
    elements.image_hash = creative.image_hash;
  }
  if (creative.thumbnail_url) {
    elements.thumbnail_url = creative.thumbnail_url;
  }
  if (creative.video_id) {
    elements.video_id = creative.video_id;
  }

  // Handle link data images
  if (creative.object_story_spec?.link_data) {
    const linkData = creative.object_story_spec.link_data;
    if (linkData.picture) {
      elements.image_url = linkData.picture;
    }
    if (linkData.image_hash) {
      elements.image_hash = linkData.image_hash;
    }

    // Carousel cards
    if (linkData.child_attachments) {
      elements.carousel_cards = linkData.child_attachments.map(card => ({
        image_url: card.picture || '',
        link: card.link,
        headline: card.name,
        description: card.description,
      }));
    }
  }

  // Handle video data
  if (creative.object_story_spec?.video_data) {
    const videoData = creative.object_story_spec.video_data;
    elements.video_id = videoData.video_id;
    if (videoData.image_url) {
      elements.video_thumbnail = videoData.image_url;
    }
  }

  return elements;
}

function extractMessaging(creative: AdCreative): AdCreativeAnalysis['messaging'] {
  const messaging: AdCreativeAnalysis['messaging'] = {};

  if (creative.body) {
    messaging.primary_text = creative.body;
  }
  if (creative.title) {
    messaging.headline = creative.title;
  }

  // Extract from link data
  if (creative.object_story_spec?.link_data) {
    const linkData = creative.object_story_spec.link_data;
    if (linkData.message) {
      messaging.primary_text = linkData.message;
    }
    if (linkData.name) {
      messaging.headline = linkData.name;
    }
    if (linkData.description) {
      messaging.description = linkData.description;
    }
    if (linkData.caption) {
      messaging.link_caption = linkData.caption;
    }
    if (linkData.call_to_action) {
      messaging.call_to_action = {
        type: linkData.call_to_action.type,
        value: linkData.call_to_action.value?.link,
      };
    }
  }

  // Extract from video data
  if (creative.object_story_spec?.video_data) {
    const videoData = creative.object_story_spec.video_data;
    if (videoData.message) {
      messaging.primary_text = videoData.message;
    }
    if (videoData.title) {
      messaging.headline = videoData.title;
    }
    if (videoData.call_to_action) {
      messaging.call_to_action = {
        type: videoData.call_to_action.type,
        value: videoData.call_to_action.value?.link,
      };
    }
  }

  // Fallback to creative-level call to action
  if (!messaging.call_to_action && creative.call_to_action_type) {
    messaging.call_to_action = {
      type: creative.call_to_action_type,
    };
  }

  return messaging;
}

function extractLinkInfo(creative: AdCreative): AdCreativeAnalysis['link_info'] {
  const linkInfo: AdCreativeAnalysis['link_info'] = {};

  if (creative.link_url) {
    linkInfo.website_url = creative.link_url;
  }
  if (creative.object_url) {
    linkInfo.display_url = creative.object_url;
  }

  // Extract from link data
  if (creative.object_story_spec?.link_data) {
    linkInfo.website_url = creative.object_story_spec.link_data.link;
  }

  return linkInfo;
}

// ============================================
// Pagination Helper
// ============================================

export async function fetchNextPage<T>(nextPageUrl: string): Promise<PaginatedResponse<T>> {
  // The next page URL already includes the access token from Meta's response
  // We need to add our access token
  const config = getConfig();
  const url = new URL(nextPageUrl);
  url.searchParams.set('access_token', config.accessToken);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok) {
    const errorResponse = data as MetaApiErrorResponse;
    throw new MetaApiError(
      errorResponse.error.message,
      errorResponse.error.code,
      errorResponse.error.type,
      errorResponse.error.error_subcode,
      errorResponse.error.fbtrace_id
    );
  }

  return data as PaginatedResponse<T>;
}

// ============================================
// Custom Audiences (for targeting)
// ============================================

export async function listCustomAudiences(
  accountId: string,
  options?: {
    limit?: number;
  }
): Promise<PaginatedResponse<{ id: string; name: string; subtype: string; approximate_count: number }>> {
  const normalizedId = normalizeAccountId(accountId);
  let url = `/${normalizedId}/customaudiences?fields=id,name,subtype,approximate_count`;

  if (options?.limit) {
    url += `&limit=${options.limit}`;
  }

  return apiRequest(url);
}

export async function createCustomAudience(
  accountId: string,
  params: {
    name: string;
    subtype: string;
    retention_days?: number;
    rule?: Record<string, unknown>;
    exclusion_rule?: Record<string, unknown>;
    description?: string;
  }
): Promise<{ id: string }> {
  const normalizedId = normalizeAccountId(accountId);
  return apiRequest<{ id: string }>(`/${normalizedId}/customaudiences`, 'POST', params as Record<string, unknown>);
}

// ============================================
// Saved Audiences (for targeting)
// ============================================

export async function listSavedAudiences(
  accountId: string,
  options?: {
    limit?: number;
  }
): Promise<PaginatedResponse<{ id: string; name: string; targeting: Targeting }>> {
  const normalizedId = normalizeAccountId(accountId);
  let url = `/${normalizedId}/saved_audiences?fields=id,name,targeting`;

  if (options?.limit) {
    url += `&limit=${options.limit}`;
  }

  return apiRequest(url);
}

// ============================================
// Budget/Spend Info
// ============================================

export async function getAccountSpendCap(
  accountId: string
): Promise<{ spend_cap: string; amount_spent: string; balance: string }> {
  const normalizedId = normalizeAccountId(accountId);
  return apiRequest(`/${normalizedId}?fields=spend_cap,amount_spent,balance`);
}

// ============================================
// Images (for creative creation)
// ============================================

export async function uploadImage(
  accountId: string,
  imageData: { bytes?: string; url?: string; filename?: string }
): Promise<{ hash: string; url: string }> {
  const normalizedId = normalizeAccountId(accountId);
  return apiRequest(`/${normalizedId}/adimages`, 'POST', imageData);
}

// ============================================
// Videos (for creative creation)
// ============================================

export async function uploadVideo(
  accountId: string,
  params: {
    source?: string;
    file_url?: string;
    title?: string;
    description?: string;
  }
): Promise<{ id: string }> {
  const normalizedId = normalizeAccountId(accountId);
  return apiRequest(`/${normalizedId}/advideos`, 'POST', params);
}

export async function getVideoStatus(
  videoId: string
): Promise<{ id: string; status: { video_status: string }; source?: string }> {
  return apiRequest(`/${videoId}?fields=id,status,source`);
}
