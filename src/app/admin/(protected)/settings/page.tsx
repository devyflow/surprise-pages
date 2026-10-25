import VisitorCountSettings from '@/components/admin/VisitorCountSettings';
import { getTrafficSummary } from '@/lib/analytics';

export default async function AdminSettingsPage() {
  const summary = await getTrafficSummary();
  return <div><header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Control centre</span><h1>Site settings</h1><p className="sp-admin-subtitle">Control public presentation without changing the underlying business data.</p></div></header><VisitorCountSettings actualCount={summary.uniqueVisitors} initial={summary.setting} /></div>;
}
