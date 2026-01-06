/**
 * Response Formatter for Meta Marketing API
 * Formats API responses for better readability in markdown or JSON
 */

import { ACCOUNT_STATUS_MAP, DISABLE_REASON_MAP } from '../constants.js';
import type {
  AdAccount,
  Campaign,
  AdSet,
  Ad,
  AdCreative,
  Insights,
  Activity,
  InstagramAccount,
  AdCreativeAnalysis,
  PaginatedResponse,
  ResponseFormat,
} from '../types.js';

// Helper to format currency
function formatCurrency(value: string | number | undefined, currency = 'USD'): string {
  if (value === undefined || value === null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
}

// Helper to format number
function formatNumber(value: string | number | undefined): string {
  if (value === undefined || value === null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
}

// Helper to format percentage
function formatPercent(value: string | number | undefined): string {
  if (value === undefined || value === null) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'N/A';
  return `${num.toFixed(2)}%`;
}

// Helper to format date
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

// Helper to get status emoji
function getStatusEmoji(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'ENABLED':
      return '🟢';
    case 'PAUSED':
      return '⏸️';
    case 'DELETED':
    case 'REMOVED':
      return '🗑️';
    case 'ARCHIVED':
      return '📦';
    case 'PENDING_REVIEW':
      return '⏳';
    case 'DISAPPROVED':
      return '❌';
    case 'WITH_ISSUES':
      return '⚠️';
    default:
      return '⚪';
  }
}

// ============================================
// Ad Account Formatters
// ============================================

export function formatAdAccount(account: AdAccount, format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(account, null, 2);
  }

  const accountStatus = ACCOUNT_STATUS_MAP[account.account_status] || 'UNKNOWN';
  const disableReason = account.disable_reason !== undefined
    ? DISABLE_REASON_MAP[account.disable_reason] || 'UNKNOWN'
    : 'N/A';

  return `
## Ad Account: ${account.name}

**ID:** \`${account.account_id}\`
**Status:** ${getStatusEmoji(accountStatus)} ${accountStatus}

### Financial Info
| Metric | Value |
|--------|-------|
| Currency | ${account.currency} |
| Amount Spent | ${formatCurrency(account.amount_spent, account.currency)} |
| Balance | ${formatCurrency(account.balance, account.currency)} |
| Spend Cap | ${account.spend_cap ? formatCurrency(account.spend_cap, account.currency) : 'No limit'} |
| Min Daily Budget | ${formatCurrency(account.min_daily_budget, account.currency)} |

### Business Info
| Field | Value |
|-------|-------|
| Business Name | ${account.business_name || 'N/A'} |
| Location | ${[account.business_city, account.business_state, account.business_country_code].filter(Boolean).join(', ') || 'N/A'} |
| Timezone | ${account.timezone_name} (UTC${account.timezone_offset_hours_utc >= 0 ? '+' : ''}${account.timezone_offset_hours_utc}) |
| Created | ${formatDate(account.created_time)} |

${account.disable_reason !== undefined && account.disable_reason !== 0 ? `
### ⚠️ Account Issue
**Disable Reason:** ${disableReason}
` : ''}
`.trim();
}

export function formatAdAccountList(accounts: AdAccount[], format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(accounts, null, 2);
  }

  if (accounts.length === 0) {
    return 'No ad accounts found.';
  }

  const rows = accounts.map(acc => {
    const status = ACCOUNT_STATUS_MAP[acc.account_status] || 'UNKNOWN';
    return `| ${getStatusEmoji(status)} | \`${acc.account_id}\` | ${acc.name} | ${status} | ${acc.currency} | ${formatCurrency(acc.amount_spent, acc.currency)} |`;
  }).join('\n');

  return `
## Ad Accounts (${accounts.length})

| Status | ID | Name | Status | Currency | Spent |
|--------|-----|------|--------|----------|-------|
${rows}
`.trim();
}

// ============================================
// Campaign Formatters
// ============================================

export function formatCampaign(campaign: Campaign, format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(campaign, null, 2);
  }

  return `
## Campaign: ${campaign.name}

**ID:** \`${campaign.id}\`
**Status:** ${getStatusEmoji(campaign.status)} ${campaign.status}
**Effective Status:** ${getStatusEmoji(campaign.effective_status)} ${campaign.effective_status}

### Configuration
| Setting | Value |
|---------|-------|
| Objective | ${campaign.objective} |
| Buying Type | ${campaign.buying_type || 'AUCTION'} |
| Bid Strategy | ${campaign.bid_strategy || 'N/A'} |

### Budget
| Type | Amount |
|------|--------|
| Daily Budget | ${campaign.daily_budget ? formatCurrency(campaign.daily_budget) : 'N/A'} |
| Lifetime Budget | ${campaign.lifetime_budget ? formatCurrency(campaign.lifetime_budget) : 'N/A'} |
| Budget Remaining | ${campaign.budget_remaining ? formatCurrency(campaign.budget_remaining) : 'N/A'} |

### Schedule
| Date | Value |
|------|-------|
| Start Time | ${formatDate(campaign.start_time)} |
| Stop Time | ${formatDate(campaign.stop_time)} |
| Created | ${formatDate(campaign.created_time)} |
| Updated | ${formatDate(campaign.updated_time)} |

${campaign.special_ad_categories && campaign.special_ad_categories.length > 0 ? `
### Special Ad Categories
${campaign.special_ad_categories.map(cat => `- ${cat}`).join('\n')}
` : ''}
`.trim();
}

export function formatCampaignList(campaigns: Campaign[], format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(campaigns, null, 2);
  }

  if (campaigns.length === 0) {
    return 'No campaigns found.';
  }

  const rows = campaigns.map(c => {
    const budget = c.daily_budget
      ? `${formatCurrency(c.daily_budget)}/day`
      : c.lifetime_budget
        ? `${formatCurrency(c.lifetime_budget)} lifetime`
        : 'N/A';
    return `| ${getStatusEmoji(c.status)} | \`${c.id}\` | ${c.name} | ${c.objective} | ${budget} |`;
  }).join('\n');

  return `
## Campaigns (${campaigns.length})

| Status | ID | Name | Objective | Budget |
|--------|-----|------|-----------|--------|
${rows}
`.trim();
}

// ============================================
// Ad Set Formatters
// ============================================

export function formatAdSet(adSet: AdSet, format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(adSet, null, 2);
  }

  return `
## Ad Set: ${adSet.name}

**ID:** \`${adSet.id}\`
**Campaign ID:** \`${adSet.campaign_id}\`
**Status:** ${getStatusEmoji(adSet.status)} ${adSet.status}
**Effective Status:** ${getStatusEmoji(adSet.effective_status)} ${adSet.effective_status}

### Optimization
| Setting | Value |
|---------|-------|
| Billing Event | ${adSet.billing_event} |
| Optimization Goal | ${adSet.optimization_goal} |
| Bid Strategy | ${adSet.bid_strategy || 'N/A'} |
| Bid Amount | ${adSet.bid_amount ? formatCurrency(adSet.bid_amount / 100) : 'N/A'} |

### Budget
| Type | Amount |
|------|--------|
| Daily Budget | ${adSet.daily_budget ? formatCurrency(adSet.daily_budget) : 'N/A'} |
| Lifetime Budget | ${adSet.lifetime_budget ? formatCurrency(adSet.lifetime_budget) : 'N/A'} |
| Budget Remaining | ${adSet.budget_remaining ? formatCurrency(adSet.budget_remaining) : 'N/A'} |

### Schedule
| Date | Value |
|------|-------|
| Start Time | ${formatDate(adSet.start_time)} |
| End Time | ${formatDate(adSet.end_time)} |
| Created | ${formatDate(adSet.created_time)} |
| Updated | ${formatDate(adSet.updated_time)} |

${adSet.targeting ? `
### Targeting Summary
${formatTargetingSummary(adSet.targeting)}
` : ''}
`.trim();
}

function formatTargetingSummary(targeting: AdSet['targeting']): string {
  if (!targeting) return 'No targeting info available';

  const parts: string[] = [];

  // Age & Gender
  const ageGender: string[] = [];
  if (targeting.age_min || targeting.age_max) {
    ageGender.push(`Age: ${targeting.age_min || 13}-${targeting.age_max || 65}+`);
  }
  if (targeting.genders && targeting.genders.length > 0) {
    const genderMap: Record<number, string> = { 1: 'Male', 2: 'Female' };
    ageGender.push(`Gender: ${targeting.genders.map(g => genderMap[g] || g).join(', ')}`);
  }
  if (ageGender.length > 0) parts.push(`- **Demographics:** ${ageGender.join(', ')}`);

  // Locations
  if (targeting.geo_locations) {
    const locations: string[] = [];
    if (targeting.geo_locations.countries) {
      locations.push(...targeting.geo_locations.countries);
    }
    if (targeting.geo_locations.regions) {
      locations.push(...targeting.geo_locations.regions.map(r => r.name || r.key));
    }
    if (targeting.geo_locations.cities) {
      locations.push(...targeting.geo_locations.cities.map(c => c.name || c.key));
    }
    if (locations.length > 0) {
      parts.push(`- **Locations:** ${locations.slice(0, 5).join(', ')}${locations.length > 5 ? ` (+${locations.length - 5} more)` : ''}`);
    }
  }

  // Interests
  if (targeting.interests && targeting.interests.length > 0) {
    const interests = targeting.interests.map(i => i.name || i.id);
    parts.push(`- **Interests:** ${interests.slice(0, 5).join(', ')}${interests.length > 5 ? ` (+${interests.length - 5} more)` : ''}`);
  }

  // Placements
  if (targeting.publisher_platforms && targeting.publisher_platforms.length > 0) {
    parts.push(`- **Platforms:** ${targeting.publisher_platforms.join(', ')}`);
  }

  // Custom Audiences
  if (targeting.custom_audiences && targeting.custom_audiences.length > 0) {
    const audiences = targeting.custom_audiences.map(a => a.name || a.id);
    parts.push(`- **Custom Audiences:** ${audiences.slice(0, 3).join(', ')}${audiences.length > 3 ? ` (+${audiences.length - 3} more)` : ''}`);
  }

  return parts.length > 0 ? parts.join('\n') : 'Default targeting';
}

export function formatAdSetList(adSets: AdSet[], format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(adSets, null, 2);
  }

  if (adSets.length === 0) {
    return 'No ad sets found.';
  }

  const rows = adSets.map(as => {
    const budget = as.daily_budget
      ? `${formatCurrency(as.daily_budget)}/day`
      : as.lifetime_budget
        ? `${formatCurrency(as.lifetime_budget)} lifetime`
        : 'N/A';
    return `| ${getStatusEmoji(as.status)} | \`${as.id}\` | ${as.name} | ${as.optimization_goal} | ${budget} |`;
  }).join('\n');

  return `
## Ad Sets (${adSets.length})

| Status | ID | Name | Goal | Budget |
|--------|-----|------|------|--------|
${rows}
`.trim();
}

// ============================================
// Ad Formatters
// ============================================

export function formatAd(ad: Ad, format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(ad, null, 2);
  }

  return `
## Ad: ${ad.name}

**ID:** \`${ad.id}\`
**Ad Set ID:** \`${ad.adset_id}\`
**Campaign ID:** \`${ad.campaign_id}\`
**Status:** ${getStatusEmoji(ad.status)} ${ad.status}
**Effective Status:** ${getStatusEmoji(ad.effective_status)} ${ad.effective_status}

### Creative
| Field | Value |
|-------|-------|
| Creative ID | ${ad.creative?.id ? `\`${ad.creative.id}\`` : 'N/A'} |
| Creative Name | ${ad.creative?.name || 'N/A'} |

### Dates
| Date | Value |
|------|-------|
| Created | ${formatDate(ad.created_time)} |
| Updated | ${formatDate(ad.updated_time)} |
`.trim();
}

export function formatAdList(ads: Ad[], format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(ads, null, 2);
  }

  if (ads.length === 0) {
    return 'No ads found.';
  }

  const rows = ads.map(a => {
    return `| ${getStatusEmoji(a.status)} | \`${a.id}\` | ${a.name} | ${a.effective_status} | ${a.creative?.id ? `\`${a.creative.id}\`` : 'N/A'} |`;
  }).join('\n');

  return `
## Ads (${ads.length})

| Status | ID | Name | Effective Status | Creative ID |
|--------|-----|------|------------------|-------------|
${rows}
`.trim();
}

// ============================================
// Insights Formatters
// ============================================

export function formatInsights(insights: Insights[], format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(insights, null, 2);
  }

  if (insights.length === 0) {
    return 'No insights data available.';
  }

  const rows = insights.map(i => {
    const actions = i.actions?.find(a => a.action_type === 'purchase');
    const conversions = actions ? formatNumber(actions.value) : 'N/A';

    return `
### ${i.date_start} to ${i.date_stop}
${i.campaign_name ? `**Campaign:** ${i.campaign_name}` : ''}
${i.adset_name ? `**Ad Set:** ${i.adset_name}` : ''}
${i.ad_name ? `**Ad:** ${i.ad_name}` : ''}

| Metric | Value |
|--------|-------|
| Impressions | ${formatNumber(i.impressions)} |
| Reach | ${formatNumber(i.reach)} |
| Clicks | ${formatNumber(i.clicks)} |
| CTR | ${formatPercent(i.ctr)} |
| Spend | ${formatCurrency(i.spend)} |
| CPC | ${formatCurrency(i.cpc)} |
| CPM | ${formatCurrency(i.cpm)} |
| Conversions | ${conversions} |
`;
  }).join('\n---\n');

  return `## Performance Insights\n\n${rows}`.trim();
}

// ============================================
// Activity Formatters
// ============================================

export function formatActivities(activities: Activity[], format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(activities, null, 2);
  }

  if (activities.length === 0) {
    return 'No activities found.';
  }

  const rows = activities.map(a => {
    return `| ${formatDate(a.event_time)} | ${a.actor_name || a.actor_id || 'Unknown'} | ${a.translated_event_type || a.event_type} | ${a.object_name || a.object_id || 'N/A'} |`;
  }).join('\n');

  return `
## Account Activities (${activities.length})

| Time | Actor | Event | Object |
|------|-------|-------|--------|
${rows}
`.trim();
}

// ============================================
// Creative Analysis Formatter
// ============================================

export function formatCreativeAnalysis(analysis: AdCreativeAnalysis, format: ResponseFormat = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(analysis, null, 2);
  }

  let result = `
## Creative Analysis: ${analysis.name}

**Ad ID:** \`${analysis.ad_id}\`
**Creative ID:** \`${analysis.creative_id}\`
**Type:** ${analysis.creative_type}
**Status:** ${getStatusEmoji(analysis.status)} ${analysis.status}
**Effective Status:** ${getStatusEmoji(analysis.effective_status)} ${analysis.effective_status}

### Visual Elements
`;

  if (analysis.visual_elements.image_url) {
    result += `- **Image URL:** ${analysis.visual_elements.image_url}\n`;
  }
  if (analysis.visual_elements.video_id) {
    result += `- **Video ID:** \`${analysis.visual_elements.video_id}\`\n`;
  }
  if (analysis.visual_elements.carousel_cards && analysis.visual_elements.carousel_cards.length > 0) {
    result += `- **Carousel Cards:** ${analysis.visual_elements.carousel_cards.length}\n`;
    analysis.visual_elements.carousel_cards.forEach((card, i) => {
      result += `  - Card ${i + 1}: ${card.headline || 'No headline'} → ${card.link}\n`;
    });
  }

  result += `
### Messaging
| Element | Content |
|---------|---------|
| Primary Text | ${analysis.messaging.primary_text || 'N/A'} |
| Headline | ${analysis.messaging.headline || 'N/A'} |
| Description | ${analysis.messaging.description || 'N/A'} |
| CTA | ${analysis.messaging.call_to_action?.type || 'N/A'} |
`;

  if (analysis.link_info.website_url) {
    result += `
### Link Info
- **Website URL:** ${analysis.link_info.website_url}
${analysis.link_info.display_url ? `- **Display URL:** ${analysis.link_info.display_url}` : ''}
`;
  }

  if (analysis.performance) {
    result += `
### Performance (Last 30 Days)
| Metric | Value |
|--------|-------|
| Impressions | ${formatNumber(analysis.performance.impressions)} |
| Clicks | ${formatNumber(analysis.performance.clicks)} |
| CTR | ${formatPercent(analysis.performance.ctr)} |
| CPC | ${formatCurrency(analysis.performance.cpc)} |
| Spend | ${formatCurrency(analysis.performance.spend)} |
${analysis.performance.conversions !== undefined ? `| Conversions | ${formatNumber(analysis.performance.conversions)} |` : ''}
`;
  }

  if (analysis.page_id) {
    result += `\n**Page ID:** \`${analysis.page_id}\``;
  }
  if (analysis.instagram_actor_id) {
    result += `\n**Instagram Actor ID:** \`${analysis.instagram_actor_id}\``;
  }

  return result.trim();
}

// ============================================
// Generic Response Formatter
// ============================================

export function formatResponse(
  data: unknown,
  format: ResponseFormat = 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  return JSON.stringify(data, null, 2);
}

// ============================================
// Pagination Info Formatter
// ============================================

export function formatPaginatedResponse<T>(
  response: PaginatedResponse<T>,
  formatItem: (item: T, format: ResponseFormat) => string,
  format: ResponseFormat = 'json'
): { content: string; hasNextPage: boolean; nextPageUrl?: string } {
  const items = response.data;
  const hasNextPage = !!response.paging?.next;

  if (format === 'json') {
    return {
      content: JSON.stringify(response, null, 2),
      hasNextPage,
      nextPageUrl: response.paging?.next,
    };
  }

  const formattedItems = items.map(item => formatItem(item, format)).join('\n\n---\n\n');

  let content = formattedItems;
  if (hasNextPage) {
    content += `\n\n---\n\n**More results available.** Use \`meta_ads_fetch_next_page\` with the next page URL to retrieve additional results.`;
  }

  return {
    content,
    hasNextPage,
    nextPageUrl: response.paging?.next,
  };
}
