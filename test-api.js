import 'dotenv/config';

const META_API_BASE_URL = 'https://graph.facebook.com/v24.0';
const token = process.env.META_ADS_ACCESS_TOKEN;

// Test URL construction like the FIXED server does
const fields = [
  'id', 'account_id', 'name', 'account_status', 'age', 'amount_spent',
  'balance', 'business_city', 'business_country_code', 'business_name',
  'business_state', 'business_street', 'business_street2', 'business_zip',
  'currency', 'disable_reason', 'end_advertiser', 'end_advertiser_name',
  'min_campaign_group_spend_cap', 'min_daily_budget', 'owner', 'spend_cap',
  'timezone_id', 'timezone_name', 'timezone_offset_hours_utc', 'created_time'
].join(',');

const endpoint = `/me/adaccounts?fields=${fields}`;
// Fixed URL construction
const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
const fullUrl = `${META_API_BASE_URL}/${cleanEndpoint}`;
const url = new URL(fullUrl);
url.searchParams.set('access_token', token);

console.log('Constructed URL:', url.toString());

fetch(url.toString())
  .then(res => res.json())
  .then(data => {
    console.log('Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
