'use client';

import type { CustomerContact, CustomerNeeds } from '@/types';

export const EMPTY_CUSTOMER_CONTACT: CustomerContact = {
  fullName: '', email: '', phone: '', preferredContact: 'email', contactConsent: false,
};

export const EMPTY_CUSTOMER_NEEDS: CustomerNeeds = {
  occasion: '', relationship: '', tone: 'warm', preferredLanguage: 'English', specialRequests: '',
};

export function validateCustomerJourney(contact: CustomerContact, needs: CustomerNeeds): string | null {
  if (!contact.fullName.trim()) return 'Add your name so we know who placed the order.';
  if (!/^\S+@\S+\.\S+$/.test(contact.email)) return 'Add a valid email for your receipt and page link.';
  if (!needs.occasion.trim()) return 'Tell us the occasion so the page feels right.';
  if (!needs.relationship.trim()) return 'Tell us your relationship to the recipient.';
  if (contact.preferredContact !== 'email' && !contact.phone?.trim()) return 'Add a phone number for calls or WhatsApp.';
  if (contact.preferredContact !== 'email' && !contact.contactConsent) return 'Please allow contact before selecting calls or WhatsApp.';
  return null;
}

interface Props {
  contact: CustomerContact;
  needs: CustomerNeeds;
  onContactChange: (value: CustomerContact) => void;
  onNeedsChange: (value: CustomerNeeds) => void;
}

export default function CustomerNeedsFields({ contact, needs, onContactChange, onNeedsChange }: Props) {
  const contactPatch = (patch: Partial<CustomerContact>) => onContactChange({ ...contact, ...patch });
  const needsPatch = (patch: Partial<CustomerNeeds>) => onNeedsChange({ ...needs, ...patch });

  return (
    <fieldset className="sp-intake">
      <legend>Delivery and personalisation</legend>
      <p className="sp-form-note">Used only to fulfil this order and contact you in the way you choose.</p>
      <div className="sp-intake-grid">
        <div className="sp-field"><label>Your full name</label><input className="sp-input" value={contact.fullName} onChange={(e) => contactPatch({ fullName: e.target.value })} maxLength={80} /></div>
        <div className="sp-field"><label>Your email</label><input type="email" className="sp-input" value={contact.email} onChange={(e) => contactPatch({ email: e.target.value })} placeholder="receipt and final link" /></div>
        <div className="sp-field"><label>Phone <span className="sp-form-note">— optional</span></label><input className="sp-input" inputMode="tel" value={contact.phone ?? ''} onChange={(e) => contactPatch({ phone: e.target.value })} placeholder="+91 98765 43210" /></div>
        <div className="sp-field"><label>How should we contact you?</label><select className="sp-input" value={contact.preferredContact} onChange={(e) => contactPatch({ preferredContact: e.target.value as CustomerContact['preferredContact'] })}><option value="email">Email</option><option value="phone">Phone call</option><option value="whatsapp">WhatsApp</option></select></div>
        <div className="sp-field"><label>Occasion</label><input className="sp-input" value={needs.occasion} onChange={(e) => needsPatch({ occasion: e.target.value })} placeholder="Birthday, anniversary, apology…" maxLength={60} /></div>
        <div className="sp-field"><label>Your relationship</label><input className="sp-input" value={needs.relationship} onChange={(e) => needsPatch({ relationship: e.target.value })} placeholder="Partner, friend, parent…" maxLength={60} /></div>
        <div className="sp-field"><label>Tone</label><select className="sp-input" value={needs.tone} onChange={(e) => needsPatch({ tone: e.target.value })}><option value="warm">Warm</option><option value="romantic">Romantic</option><option value="playful">Playful</option><option value="elegant">Elegant</option><option value="funny">Funny</option><option value="apologetic">Apologetic</option></select></div>
        <div className="sp-field"><label>Language</label><select className="sp-input" value={needs.preferredLanguage} onChange={(e) => needsPatch({ preferredLanguage: e.target.value })}><option>English</option><option>Hindi</option><option>Hinglish</option><option>Other</option></select></div>
      </div>
      <div className="sp-field"><label>Needed by <span className="sp-form-note">— optional</span></label><input type="datetime-local" className="sp-input" onChange={(e) => needsPatch({ requestedDeliveryAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })} /></div>
      <div className="sp-field"><label>Special requests <span className="sp-form-note">— optional</span></label><textarea className="sp-textarea" value={needs.specialRequests ?? ''} onChange={(e) => needsPatch({ specialRequests: e.target.value })} placeholder="Accessibility needs, exact wording, a private detail, or anything we should know." maxLength={1000} /></div>
      <label className="sp-consent"><input type="checkbox" checked={contact.contactConsent} onChange={(e) => contactPatch({ contactConsent: e.target.checked })} /> Surprise Pages may contact me about this order. No promotional calls.</label>
    </fieldset>
  );
}
