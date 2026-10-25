import { createHash, randomBytes } from 'crypto';
import { getSupabaseServerClient } from '@/lib/supabase';

export interface VisitorCountSetting {
  mode: 'actual' | 'custom' | 'hidden';
  customCount: number;
}

export interface TrafficSummary {
  pageViews: number;
  uniqueVisitors: number;
  displayedCount: number | null;
  setting: VisitorCountSetting;
}

const DEFAULT_SETTING: VisitorCountSetting = { mode: 'actual', customCount: 0 };

export function newVisitorId() {
  return randomBytes(24).toString('base64url');
}

export function dailyVisitorHash(visitorId: string, visitDate: string) {
  const salt = process.env.ANALYTICS_SALT || 'surprise-pages-local-analytics';
  return createHash('sha256').update(`${visitDate}:${visitorId}:${salt}`).digest('hex');
}

export async function recordVisit(visitorId: string) {
  const supabase = getSupabaseServerClient();
  const visitDate = new Date().toISOString().slice(0, 10);
  const visitorHash = dailyVisitorHash(visitorId, visitDate);

  const { error: uniqueError } = await supabase
    .from('traffic_daily_uniques')
    .insert({ visit_date: visitDate, visitor_hash: visitorHash });
  const isUnique = !uniqueError;

  const { error } = await supabase.rpc('increment_traffic', { p_visit_date: visitDate, p_is_unique: isUnique });
  if (error) throw new Error(`Failed to record visit: ${error.message}`);
}

export async function getVisitorCountSetting(): Promise<VisitorCountSetting> {
  const { data } = await getSupabaseServerClient()
    .from('site_settings')
    .select('value')
    .eq('key', 'visitor_count')
    .maybeSingle<{ value: VisitorCountSetting }>();
  return data?.value ?? DEFAULT_SETTING;
}

export async function getTrafficSummary(): Promise<TrafficSummary> {
  const supabase = getSupabaseServerClient();
  const [{ data }, setting] = await Promise.all([
    supabase.from('traffic_daily').select('page_views, unique_visitors'),
    getVisitorCountSetting(),
  ]);
  const pageViews = (data ?? []).reduce((sum, row) => sum + Number(row.page_views || 0), 0);
  const uniqueVisitors = (data ?? []).reduce((sum, row) => sum + Number(row.unique_visitors || 0), 0);
  const displayedCount = setting.mode === 'hidden' ? null : setting.mode === 'custom' ? setting.customCount : uniqueVisitors;
  return { pageViews, uniqueVisitors, displayedCount, setting };
}

export async function setVisitorCountSetting(setting: VisitorCountSetting, adminId: string) {
  const { error } = await getSupabaseServerClient().from('site_settings').upsert({
    key: 'visitor_count',
    value: setting,
    updated_by: adminId,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`Failed to update visitor-count setting: ${error.message}`);
}
