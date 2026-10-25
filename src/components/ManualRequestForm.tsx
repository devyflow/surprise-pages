'use client';

import { useState } from 'react';
import type { TemplateTier } from '@/types';

interface ManualRequestFormProps {
  tier: TemplateTier;
  tierLabel: string;
  /** Omit for tiers with no self-serve builder to fall back to (e.g. Tier 4). */
  onBackToBuilder?: () => void;
}

type Stage = 'editing' | 'submitting' | 'done';

/**
 * The "build it for me" counterpart to the self-serve builders. Only
 * recipientName and contactEmail are required — everything else is
 * optional context, since a human (not the template renderer) is going
 * to build the actual page from this. No PIN, no payment, no preview
 * pane: what gets submitted is a brief, not the final artifact.
 */
export default function ManualRequestForm({ tier, tierLabel, onBackToBuilder }: ManualRequestFormProps) {
  const [recipientName, setRecipientName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'whatsapp'>('email');
  const [contactConsent, setContactConsent] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [relationship, setRelationship] = useState('');
  const [tone, setTone] = useState('warm');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [requestedDeliveryAt, setRequestedDeliveryAt] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [stage, setStage] = useState<Stage>('editing');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!recipientName.trim()) {
      setError("Add who this is for — that's all we strictly need.");
      return;
    }
    if (!contactEmail.trim()) {
      setError("Add your email so we know where to send it back.");
      return;
    }
    if (preferredContact !== 'email' && (!contactPhone.trim() || !contactConsent)) {
      setError('Add your phone number and allow order contact before choosing calls or WhatsApp.');
      return;
    }

    setStage('submitting');

    try {
      const res = await fetch('/api/manual-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          recipientName,
          contactEmail,
          contactPhone: contactPhone || undefined,
          preferredContact,
          contactConsent,
          senderName: senderName || undefined,
          occasion: occasion || undefined,
          relationship: relationship || undefined,
          tone,
          preferredLanguage,
          requestedDeliveryAt: requestedDeliveryAt ? new Date(requestedDeliveryAt).toISOString() : undefined,
          message: message || undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Could not submit request');
      }

      setStage('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStage('editing');
    }
  }

  if (stage === 'done') {
    return (
      <section className="sp-builder">
        <div className="sp-wrap">
          <div className="sp-builder-done">
            <div className="mark" aria-hidden="true">✓</div>
            <h2>Got it — we&apos;re on it</h2>
            <p>
              We&apos;ll build your {tierLabel} page by hand and send it to{' '}
              <strong>{contactEmail}</strong> once it&apos;s ready.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sp-builder">
      <div className="sp-wrap">
        <div style={{ maxWidth: '34rem', margin: '0 auto' }}>
          <div className="sp-builder-intro" style={{ textAlign: 'center', marginInline: 'auto' }}>
            <span className="sp-eyebrow">{tierLabel.toLowerCase()}</span>
            <h1>Let us build your <span className="sp-script">{tierLabel}</span></h1>
            <p className="lede">
              Tell us who it&apos;s for and the feeling you&apos;re after — a real person takes it
              from there. Just the basics; we&apos;ll follow up if we need more.
            </p>
            {onBackToBuilder && (
              <p className="sp-builder-switch">
                <button type="button" onClick={onBackToBuilder} className="sp-textlink">
                  I&apos;d rather build it myself
                </button>.
              </p>
            )}
          </div>

          <form className="sp-form" onSubmit={(e) => e.preventDefault()}>
            <div className="sp-field">
              <label>Who&apos;s it for?</label>
              <input
                className="sp-input"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                maxLength={60}
              />
            </div>

            <div className="sp-field">
              <label>Your email</label>
              <input
                type="email"
                className="sp-input"
                placeholder="we'll send the finished page here"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div className="sp-intake-grid">
              <div className="sp-field">
                <label>Phone <span className="sp-form-note">(optional)</span></label>
                <input className="sp-input" inputMode="tel" placeholder="+91 98765 43210" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
              <div className="sp-field">
                <label>Preferred contact</label>
                <select className="sp-input" value={preferredContact} onChange={(e) => setPreferredContact(e.target.value as typeof preferredContact)}><option value="email">Email</option><option value="phone">Phone call</option><option value="whatsapp">WhatsApp</option></select>
              </div>
            </div>

            <div className="sp-field">
              <label>Your name <span className="sp-form-note" style={{ textTransform: 'none' }}>(optional)</span></label>
              <input
                className="sp-input"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                maxLength={60}
              />
            </div>

            <div className="sp-field">
              <label>Occasion <span className="sp-form-note" style={{ textTransform: 'none' }}>(optional)</span></label>
              <input
                className="sp-input"
                placeholder="Birthday, anniversary, just because…"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                maxLength={60}
              />
            </div>

            <div className="sp-intake-grid">
              <div className="sp-field"><label>Relationship <span className="sp-form-note">(optional)</span></label><input className="sp-input" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="Partner, friend, parent…" maxLength={60} /></div>
              <div className="sp-field"><label>Tone</label><select className="sp-input" value={tone} onChange={(e) => setTone(e.target.value)}><option value="warm">Warm</option><option value="romantic">Romantic</option><option value="playful">Playful</option><option value="elegant">Elegant</option><option value="funny">Funny</option></select></div>
              <div className="sp-field"><label>Language</label><select className="sp-input" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}><option>English</option><option>Hindi</option><option>Hinglish</option><option>Other</option></select></div>
              <div className="sp-field"><label>Needed by <span className="sp-form-note">(optional)</span></label><input type="datetime-local" className="sp-input" value={requestedDeliveryAt} onChange={(e) => setRequestedDeliveryAt(e.target.value)} /></div>
            </div>

            <div className="sp-field">
              <label>Message or vibe <span className="sp-form-note" style={{ textTransform: 'none' }}>(optional)</span></label>
              <textarea
                className="sp-textarea"
                style={{ minHeight: '90px' }}
                placeholder="What do you want it to say? Doesn't need to be final wording."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
              />
            </div>

            <div className="sp-field">
              <label>Anything else <span className="sp-form-note" style={{ textTransform: 'none' }}>(optional)</span></label>
              <textarea
                className="sp-textarea"
                style={{ minHeight: '70px' }}
                placeholder="Photos to include, colours, deadline — whatever's useful."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
              />
            </div>

            <label className="sp-consent"><input type="checkbox" checked={contactConsent} onChange={(e) => setContactConsent(e.target.checked)} /> Surprise Pages may contact me about this request. No promotional calls.</label>

            {error && <p className="sp-field-error">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={stage === 'submitting'}
              className="sp-btn sp-btn-red"
            >
              {stage === 'editing' ? 'Send my brief' : 'Sending…'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
