import { getSupabaseServerClient } from '@/lib/supabase';

function whatsappHref(phone: string) { return `https://wa.me/${phone.replace(/\D/g, '')}`; }

export default async function AdminCustomersPage() {
  const { data, error } = await getSupabaseServerClient().from('customers').select('id, full_name, email, phone, preferred_contact, contact_consent, created_at').order('created_at', { ascending: false }).limit(250);
  if (error) throw new Error(`Could not load customers: ${error.message}`);
  return <div><header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Customer care</span><h1>Customers</h1><p className="sp-admin-subtitle">Contact details supplied for order fulfilment. Call or message only when consent is recorded.</p></div></header>{data?.length ? <div className="sp-admin-card sp-admin-table-card"><div className="sp-admin-table-wrap"><table className="sp-admin-table"><thead><tr>{['Customer', 'Email', 'Phone', 'Preference', 'Consent', 'Actions', 'Added'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><strong>{item.full_name}</strong></td><td><a href={`mailto:${item.email}`}>{item.email}</a></td><td>{item.phone || '—'}</td><td>{item.preferred_contact}</td><td>{item.contact_consent ? 'Yes' : 'No'}</td><td><div className="sp-admin-actions">{item.phone && item.contact_consent && <><a href={`tel:${item.phone}`}>Call</a><a href={whatsappHref(item.phone)} target="_blank" rel="noreferrer">WhatsApp</a></>}<a href={`mailto:${item.email}`}>Email</a></div></td><td>{new Date(item.created_at).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div></div> : <div className="sp-admin-card sp-admin-empty">No customers yet.</div>}</div>;
}
