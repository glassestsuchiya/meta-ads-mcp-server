#!/usr/bin/env node
/**
 * Meta Ads MCP Server
 * Model Context Protocol server for Meta Marketing API
 */

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { TOOL_DEFINITIONS } from './schemas.js';
import * as client from './services/client.js';
import * as formatter from './services/formatter.js';
import type { ResponseFormat, DatePreset, Breakdown, Targeting } from './types.js';

// Create server instance
const server = new Server(
  {
    name: 'meta-ads-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOL_DEFINITIONS.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Helper to handle errors
function handleError(error: unknown): never {
  if (error instanceof client.MetaApiError) {
    throw new McpError(
      ErrorCode.InternalError,
      `Meta API Error [${error.code}]: ${error.message}`
    );
  }
  if (error instanceof Error) {
    throw new McpError(ErrorCode.InternalError, error.message);
  }
  throw new McpError(ErrorCode.InternalError, 'Unknown error occurred');
}

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // ============================================
      // Read Operations
      // ============================================

      case 'meta_ads_list_ad_accounts': {
        const accounts = await client.listAdAccounts();
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatAdAccountList(accounts, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_ad_account': {
        const { ad_account_id } = args as { ad_account_id: string };
        const account = await client.getAdAccount(ad_account_id);
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatAdAccount(account, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_account_insights': {
        const { ad_account_id, date_preset, time_range, time_increment, level, fields, breakdowns, limit } = args as {
          ad_account_id: string;
          date_preset?: DatePreset;
          time_range?: { since: string; until: string };
          time_increment?: number | 'monthly' | 'all_days';
          level?: 'account' | 'campaign' | 'adset' | 'ad';
          fields?: string[];
          breakdowns?: Breakdown[];
          limit?: number;
        };
        const insights = await client.getAccountInsights(ad_account_id, {
          date_preset,
          time_range,
          time_increment,
          fields,
          breakdowns,
        });
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatInsights(insights.data, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_instagram_accounts': {
        const { ad_account_id } = args as { ad_account_id: string };
        const accounts = await client.getInstagramAccounts(ad_account_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(accounts.data, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_list_campaigns': {
        const { ad_account_id, status, effective_status, limit } = args as {
          ad_account_id: string;
          status?: Array<'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'>;
          effective_status?: string[];
          limit?: number;
        };
        const campaigns = await client.listCampaigns(ad_account_id, {
          status,
          effectiveStatus: effective_status,
          limit,
        });
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatCampaignList(campaigns.data, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_campaign': {
        const { campaign_id } = args as { campaign_id: string };
        const campaign = await client.getCampaign(campaign_id);
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatCampaign(campaign, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_campaign_insights': {
        const { campaign_id, date_preset, time_range, time_increment, fields, breakdowns } = args as {
          campaign_id: string;
          date_preset?: DatePreset;
          time_range?: { since: string; until: string };
          time_increment?: number | 'monthly' | 'all_days';
          fields?: string[];
          breakdowns?: Breakdown[];
        };
        const insights = await client.getCampaignInsights(campaign_id, {
          date_preset,
          time_range,
          time_increment,
          fields,
          breakdowns,
        });
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatInsights(insights.data, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_list_adsets': {
        const { ad_account_id, campaign_id, status, effective_status, limit } = args as {
          ad_account_id: string;
          campaign_id?: string;
          status?: Array<'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'>;
          effective_status?: string[];
          limit?: number;
        };
        const adSets = await client.listAdSets(ad_account_id, {
          campaignId: campaign_id,
          status,
          effectiveStatus: effective_status,
          limit,
        });
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatAdSetList(adSets.data, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_adset': {
        const { adset_id } = args as { adset_id: string };
        const adSet = await client.getAdSet(adset_id);
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatAdSet(adSet, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_adset_insights': {
        const { adset_id, date_preset, time_range, time_increment, fields, breakdowns } = args as {
          adset_id: string;
          date_preset?: DatePreset;
          time_range?: { since: string; until: string };
          time_increment?: number | 'monthly' | 'all_days';
          fields?: string[];
          breakdowns?: Breakdown[];
        };
        const insights = await client.getAdSetInsights(adset_id, {
          date_preset,
          time_range,
          time_increment,
          fields,
          breakdowns,
        });
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatInsights(insights.data, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_list_ads': {
        const { ad_account_id, adset_id, campaign_id, status, effective_status, limit } = args as {
          ad_account_id: string;
          adset_id?: string;
          campaign_id?: string;
          status?: Array<'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'>;
          effective_status?: string[];
          limit?: number;
        };
        const ads = await client.listAds(ad_account_id, {
          adSetId: adset_id,
          campaignId: campaign_id,
          status,
          effectiveStatus: effective_status,
          limit,
        });
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatAdList(ads.data, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_ad': {
        const { ad_id } = args as { ad_id: string };
        const ad = await client.getAd(ad_id);
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatAd(ad, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_ad_insights': {
        const { ad_id, date_preset, time_range, time_increment, fields, breakdowns } = args as {
          ad_id: string;
          date_preset?: DatePreset;
          time_range?: { since: string; until: string };
          time_increment?: number | 'monthly' | 'all_days';
          fields?: string[];
          breakdowns?: Breakdown[];
        };
        const insights = await client.getAdInsights(ad_id, {
          date_preset,
          time_range,
          time_increment,
          fields,
          breakdowns,
        });
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatInsights(insights.data, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_list_ad_creatives': {
        const { ad_account_id, limit } = args as { ad_account_id: string; limit?: number };
        const creatives = await client.listAdCreatives(ad_account_id, { limit });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(creatives.data, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_get_ad_creative': {
        const { creative_id } = args as { creative_id: string };
        const creative = await client.getAdCreative(creative_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(creative, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_analyze_ad_creative': {
        const { ad_id, creative_id, include_performance, date_preset, time_range } = args as {
          ad_id?: string;
          creative_id?: string;
          include_performance?: boolean;
          date_preset?: DatePreset;
          time_range?: { since: string; until: string };
        };

        if (!ad_id && !creative_id) {
          throw new McpError(ErrorCode.InvalidParams, 'Either ad_id or creative_id must be provided');
        }

        // If creative_id is provided directly, we need to find an ad using it
        let targetAdId = ad_id;
        if (!targetAdId && creative_id) {
          // We need to analyze the creative directly
          const creative = await client.getAdCreative(creative_id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  creative_id: creative.id,
                  name: creative.name,
                  status: creative.status,
                  object_type: creative.object_type,
                  object_story_spec: creative.object_story_spec,
                  asset_feed_spec: creative.asset_feed_spec,
                  image_url: creative.image_url,
                  thumbnail_url: creative.thumbnail_url,
                  video_id: creative.video_id,
                  call_to_action_type: creative.call_to_action_type,
                  link_url: creative.link_url,
                }, null, 2),
              },
            ],
          };
        }

        const analysis = await client.analyzeAdCreative(targetAdId!, {
          include_performance,
          date_preset,
          time_range,
        });

        return {
          content: [
            {
              type: 'text',
              text: formatter.formatCreativeAnalysis(analysis, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_get_activities': {
        const { ad_account_id, since, until, category, uid, oid, limit } = args as {
          ad_account_id: string;
          since?: string;
          until?: string;
          category?: string[];
          uid?: string;
          oid?: string;
          limit?: number;
        };
        const activities = await client.getActivities(ad_account_id, {
          since,
          until,
          category: category?.join(','),
          uid,
          oid,
          limit,
        });
        return {
          content: [
            {
              type: 'text',
              text: formatter.formatActivities(activities.data, 'json'),
            },
          ],
        };
      }

      case 'meta_ads_batch_get': {
        const { ids, fields } = args as { ids: string[]; fields?: string[] };
        // Batch get is handled by making multiple parallel requests
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              // Try to determine object type and fetch accordingly
              const fieldsStr = fields?.join(',') || 'id,name';
              const response = await fetch(
                `https://graph.facebook.com/v24.0/${id}?fields=${fieldsStr}&access_token=${process.env.META_ADS_ACCESS_TOKEN}`
              );
              return response.json();
            } catch (error) {
              return { id, error: error instanceof Error ? error.message : 'Unknown error' };
            }
          })
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_get_async_report_status': {
        const { report_run_id } = args as { report_run_id: string };
        const response = await fetch(
          `https://graph.facebook.com/v24.0/${report_run_id}?fields=id,async_status,async_percent_completion&access_token=${process.env.META_ADS_ACCESS_TOKEN}`
        );
        const result = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_fetch_next_page': {
        const { next_page_url } = args as { next_page_url: string };
        const result = await client.fetchNextPage(next_page_url);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // ============================================
      // Write Operations
      // ============================================

      case 'meta_ads_create_campaign': {
        const { ad_account_id, name, objective, status, special_ad_categories, daily_budget, lifetime_budget, bid_strategy, start_time, stop_time } = args as {
          ad_account_id: string;
          name: string;
          objective: 'OUTCOME_AWARENESS' | 'OUTCOME_ENGAGEMENT' | 'OUTCOME_LEADS' | 'OUTCOME_SALES' | 'OUTCOME_TRAFFIC' | 'OUTCOME_APP_PROMOTION';
          status?: 'ACTIVE' | 'PAUSED';
          special_ad_categories?: string[];
          daily_budget?: number;
          lifetime_budget?: number;
          bid_strategy?: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'COST_CAP' | 'LOWEST_COST_WITH_MIN_ROAS';
          start_time?: string;
          stop_time?: string;
        };
        const result = await client.createCampaign(ad_account_id, {
          name,
          objective,
          status,
          special_ad_categories: special_ad_categories as any,
          daily_budget,
          lifetime_budget,
          bid_strategy,
          start_time,
          stop_time,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, campaign_id: result.id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_update_campaign': {
        const { campaign_id, name, status, daily_budget, lifetime_budget, bid_strategy, stop_time } = args as {
          campaign_id: string;
          name?: string;
          status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
          daily_budget?: number;
          lifetime_budget?: number;
          bid_strategy?: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'COST_CAP' | 'LOWEST_COST_WITH_MIN_ROAS';
          stop_time?: string;
        };
        const result = await client.updateCampaign(campaign_id, {
          name,
          status,
          daily_budget,
          lifetime_budget,
          bid_strategy,
          stop_time,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: result.success, campaign_id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_delete_campaign': {
        const { campaign_id } = args as { campaign_id: string };
        const result = await client.deleteCampaign(campaign_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: result.success, campaign_id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_create_adset': {
        const { ad_account_id, campaign_id, name, status, billing_event, optimization_goal, targeting, daily_budget, lifetime_budget, bid_amount, start_time, end_time } = args as {
          ad_account_id: string;
          campaign_id: string;
          name: string;
          status?: 'ACTIVE' | 'PAUSED';
          billing_event: 'APP_INSTALLS' | 'CLICKS' | 'IMPRESSIONS' | 'LINK_CLICKS' | 'NONE' | 'OFFER_CLAIMS' | 'PAGE_LIKES' | 'POST_ENGAGEMENT' | 'THRUPLAY' | 'PURCHASE' | 'LISTING_INTERACTION';
          optimization_goal: string;
          targeting?: Targeting;
          daily_budget?: number;
          lifetime_budget?: number;
          bid_amount?: number;
          start_time?: string;
          end_time?: string;
        };
        const result = await client.createAdSet(ad_account_id, {
          name,
          campaign_id,
          status,
          billing_event,
          optimization_goal: optimization_goal as any,
          targeting: targeting || {},
          daily_budget,
          lifetime_budget,
          bid_amount,
          start_time,
          end_time,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, adset_id: result.id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_update_adset': {
        const { adset_id, name, status, targeting, daily_budget, lifetime_budget, bid_amount, end_time } = args as {
          adset_id: string;
          name?: string;
          status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
          targeting?: Targeting;
          daily_budget?: number;
          lifetime_budget?: number;
          bid_amount?: number;
          end_time?: string;
        };
        const result = await client.updateAdSet(adset_id, {
          name,
          status,
          targeting,
          daily_budget,
          lifetime_budget,
          bid_amount,
          end_time,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: result.success, adset_id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_delete_adset': {
        const { adset_id } = args as { adset_id: string };
        const result = await client.deleteAdSet(adset_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: result.success, adset_id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_create_ad': {
        const { ad_account_id, adset_id, name, status, creative, tracking_specs } = args as {
          ad_account_id: string;
          adset_id: string;
          name: string;
          status?: 'ACTIVE' | 'PAUSED';
          creative: { creative_id?: string; object_story_spec?: any };
          tracking_specs?: any[];
        };

        let creativeSpec: any;
        if (creative.creative_id) {
          creativeSpec = { creative_id: creative.creative_id };
        } else if (creative.object_story_spec) {
          creativeSpec = { object_story_spec: creative.object_story_spec };
        } else {
          throw new McpError(ErrorCode.InvalidParams, 'Creative must have either creative_id or object_story_spec');
        }

        const result = await client.createAd(ad_account_id, {
          name,
          adset_id,
          creative: creativeSpec,
          status,
          tracking_specs,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, ad_id: result.id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_update_ad': {
        const { ad_id, name, status } = args as {
          ad_id: string;
          name?: string;
          status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
        };
        const result = await client.updateAd(ad_id, { name, status });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: result.success, ad_id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_delete_ad': {
        const { ad_id } = args as { ad_id: string };
        const result = await client.deleteAd(ad_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: result.success, ad_id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_create_ad_creative': {
        const { ad_account_id, name, object_story_spec, url_tags } = args as {
          ad_account_id: string;
          name: string;
          object_story_spec: any;
          url_tags?: string;
        };
        const result = await client.createAdCreative(ad_account_id, {
          name,
          object_story_spec,
          url_tags,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, creative_id: result.id }, null, 2),
            },
          ],
        };
      }

      case 'meta_ads_upload_ad_image': {
        const { ad_account_id, image_url, image_file, name } = args as {
          ad_account_id: string;
          image_url?: string;
          image_file?: string;
          name?: string;
        };

        if (!image_url && !image_file) {
          throw new McpError(ErrorCode.InvalidParams, 'Either image_url or image_file must be provided');
        }

        const imageData: { url?: string; bytes?: string; filename?: string } = {};
        if (image_url) {
          imageData.url = image_url;
        } else if (image_file) {
          imageData.bytes = image_file;
        }
        if (name) {
          imageData.filename = name;
        }

        const result = await client.uploadImage(ad_account_id, imageData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, hash: result.hash, url: result.url }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    handleError(error);
  }
});

// Start server
async function main() {
  // Validate required environment variables
  if (!process.env.META_ADS_ACCESS_TOKEN) {
    console.error('Error: META_ADS_ACCESS_TOKEN environment variable is required');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Meta Ads MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
