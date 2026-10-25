import { getSupabaseServerClient } from '@/lib/supabase';
import { getTrafficSummary } from '@/lib/analytics';

async function getCount(table: string): Promise<number> {
  const supabase = getSupabaseServerClient();
  const { count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

export default async function AdminDashboard() {
  const [ordersCount, manualRequestsCount, customersCount, traffic, revenueResult, pendingResult] = await Promise.all([
    getCount('orders'),
    getCount('manual_requests'),
    getCount('customers'),
    getTrafficSummary(),
    getSupabaseServerClient().from('orders').select('price_in_paise').eq('status', 'published'),
    getSupabaseServerClient().from('orders').select('*', { count: 'exact', head: true }).in('fulfillment_status', ['paid', 'in_production', 'needs_customer', 'ready']),
  ]);

  const revenue = (revenueResult.data ?? []).reduce((sum, order) => sum + Number(order.price_in_paise || 0), 0) / 100;

  const cards = [
    { label: 'Total orders', value: ordersCount, href: '/admin/orders' },
    { label: 'Manual requests', value: manualRequestsCount, href: '/admin/manual-requests' },
    { label: 'Customers', value: customersCount, href: '/admin/customers' },
    { label: 'Needs attention', value: pendingResult.count ?? 0, href: '/admin/orders' },
    { label: 'Actual visitors', value: traffic.uniqueVisitors, href: '/admin/settings' },
    { label: 'Published revenue', value: `₹${revenue.toLocaleString('en-IN')}`, href: '/admin/orders' },
  ];

  return (
    <div>
      <header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Overview</span><h1>Good to see you.</h1><p className="sp-admin-subtitle">A simple view of the pages and requests people have trusted you with.</p></div></header>
      <div className="sp-admin-stats">
        {cards.map((card) => (
          <a key={card.label} href={card.href} className="sp-admin-card sp-admin-stat">
            <div className="sp-admin-stat-value">{card.value}</div>
            <div className="sp-admin-stat-label">{card.label} →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
