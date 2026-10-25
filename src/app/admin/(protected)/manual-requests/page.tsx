import { getSupabaseServerClient } from '@/lib/supabase';
import ManualRequestControl from '@/components/admin/ManualRequestControl';

export default async function AdminManualRequestsPage() {
  const { data, error } = await getSupabaseServerClient()
    .from('manual_requests')
    .select('id, tier, recipient_name, contact_email, contact_phone, preferred_contact, contact_consent, sender_name, occasion, relationship, tone, preferred_language, requested_delivery_at, message, notes, internal_notes, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new Error(`Could not load manual requests: ${error.message}`);

  return (
    <div>
      <header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Concierge</span><h1>Manual requests</h1><p className="sp-admin-subtitle">The latest requests from people who want your help creating something special.</p></div></header>
      {data?.length ? (
        <div className="sp-admin-card sp-admin-table-card"><div className="sp-admin-table-wrap"><table className="sp-admin-table">
          <thead><tr>{['Request', 'Customer', 'What they need', 'Brief', 'Manage'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
          <tbody>{data.map((item: any) => <tr key={item.id}>
            <td><strong>{item.tier}</strong><small className="sp-admin-cell-note">For {item.recipient_name}<br />{new Date(item.created_at).toLocaleString('en-IN')}</small></td>
            <td>{item.sender_name ?? '—'}<small className="sp-admin-cell-note">{item.contact_email}<br />{item.contact_phone ?? ''}</small><div className="sp-admin-actions">{item.contact_phone && item.contact_consent && <a href={`tel:${item.contact_phone}`}>Call</a>}<a href={`mailto:${item.contact_email}`}>Email</a></div></td>
            <td>{item.occasion ?? '—'}<small className="sp-admin-cell-note">{[item.relationship, item.tone, item.preferred_language].filter(Boolean).join(' · ')}{item.requested_delivery_at ? <><br />Due {new Date(item.requested_delivery_at).toLocaleString('en-IN')}</> : null}</small></td>
            <td><span className="sp-admin-clamp">{item.message || item.notes || '—'}</span></td><td><ManualRequestControl id={item.id} initialStatus={item.status} initialNotes={item.internal_notes} /></td>
          </tr>)}</tbody>
        </table></div></div>
      ) : <div className="sp-admin-card sp-admin-empty">No manual requests yet.</div>}
    </div>
  );
}
