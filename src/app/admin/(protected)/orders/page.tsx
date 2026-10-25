import { getSupabaseServerClient } from '@/lib/supabase';
import OrderTakedownButton from '@/components/admin/OrderTakedownButton';
import OrderOperationsControl from '@/components/admin/OrderOperationsControl';

export default async function AdminOrdersPage() {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .select('id, slug, status, fulfillment_status, price_in_paise, created_at, paid_at, occasion, relationship, requested_delivery_at, special_requests, internal_notes, customers(full_name, email, phone, preferred_contact, contact_consent)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new Error(`Could not load orders: ${error.message}`);

  return (
    <div>
      <header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Payments</span><h1>Orders</h1><p className="sp-admin-subtitle">Your 100 most recent orders, newest first.</p></div></header>
      {data?.length ? (
        <div className="sp-admin-card sp-admin-table-card"><div className="sp-admin-table-wrap"><table className="sp-admin-table">
          <thead><tr>{['Order', 'Customer', 'Need', 'Payment', 'Fulfilment', 'Manage'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
          <tbody>{data.map((order: any) => { const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers; return <tr key={order.id}>
            <td><code>{order.slug}</code><small className="sp-admin-cell-note">₹{(order.price_in_paise / 100).toFixed(0)} · {new Date(order.created_at).toLocaleDateString('en-IN')}</small></td>
            <td><strong>{customer?.full_name ?? 'Anonymous'}</strong><small className="sp-admin-cell-note">{customer?.email ?? '—'}<br />{customer?.phone ?? ''}</small><div className="sp-admin-actions">{customer?.phone && customer?.contact_consent && <a href={`tel:${customer.phone}`}>Call</a>}{customer?.email && <a href={`mailto:${customer.email}`}>Email</a>}</div></td>
            <td>{order.occasion ?? '—'}<small className="sp-admin-cell-note">{order.relationship ?? ''}{order.requested_delivery_at ? ` · due ${new Date(order.requested_delivery_at).toLocaleString('en-IN')}` : ''}</small></td>
            <td><span className="sp-admin-status">{order.status}</span><small className="sp-admin-cell-note">{order.paid_at ? new Date(order.paid_at).toLocaleString('en-IN') : 'Not paid'}</small></td>
            <td><span className="sp-admin-status">{order.fulfillment_status}</span></td>
            <td><OrderOperationsControl slug={order.slug} initialStatus={order.fulfillment_status} initialNotes={order.internal_notes} />{order.status === 'published' && <OrderTakedownButton slug={order.slug} />}</td>
          </tr>; })}</tbody>
        </table></div></div>
      ) : <div className="sp-admin-card sp-admin-empty">No orders yet.</div>}
    </div>
  );
}
