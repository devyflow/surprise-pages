'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { GiftUniverse } from './GiftUniverse';
import { giftProducts, occasions, styles, type GiftProduct, type GiftStyle, type Occasion } from './catalogue';

const budgetOptions = [500, 1000, 1500];

function TrustPassport({ product }: { product: GiftProduct }) {
  const [open, setOpen] = useState(false);
  const isTested = product.trust.status === 'Tested';

  return (
    <div className={`dp-passport ${open ? 'open' : ''}`}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className={`dp-passport-mark ${isTested ? 'tested' : 'pending'}`}>{isTested ? '✓' : '·'}</span>
        <span><strong>{product.trust.status}</strong><small>{product.trust.testedOn ?? 'Not yet recommended'}</small></span>
        <span className="dp-passport-toggle">{open ? '−' : '+'}</span>
      </button>
      {open ? (
        <div className="dp-passport-body">
          <ul>{product.trust.checks.map((check) => <li key={check}>{check}</li>)}</ul>
          <p>{product.trust.note}</p>
        </div>
      ) : null}
    </div>
  );
}

function ProductCard({ product }: { product: GiftProduct }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="dp-product-card">
      <div className="dp-product-visual">
        <span className="dp-demo-chip">pilot sample</span>
        <button
          type="button"
          className={`dp-save ${saved ? 'saved' : ''}`}
          onClick={() => setSaved((value) => !value)}
          aria-label={saved ? `Remove ${product.name} from saved gifts` : `Save ${product.name}`}
        >
          {saved ? '♥' : '♡'}
        </button>
        <img src={product.image} alt="" />
      </div>
      <div className="dp-product-body">
        <div className="dp-product-meta"><span>{product.seller}</span><span>{product.location}</span></div>
        <h3>{product.name}</h3>
        <p>{product.blurb}</p>
        <div className="dp-product-facts"><strong>{product.priceLabel}</strong><span>Dispatches in ~{product.dispatchDays} days</span></div>
        <TrustPassport product={product} />
        <div className="dp-card-actions">
          <button type="button" className="dp-seller-link" title="Demo listing — seller destination will be connected during onboarding">Visit seller <span>↗</span></button>
          <Link href="/builder">Add a Surprise Page</Link>
        </div>
      </div>
    </article>
  );
}

export function DiscoveryLanding() {
  const [occasion, setOccasion] = useState<Occasion | 'All'>('All');
  const [style, setStyle] = useState<GiftStyle | 'All'>('All');
  const [budget, setBudget] = useState(1500);

  const filtered = useMemo(() => giftProducts.filter((product) => (
    product.price <= budget
    && (occasion === 'All' || product.occasions.includes(occasion))
    && (style === 'All' || product.styles.includes(style))
  )), [occasion, style, budget]);

  function chooseFromUniverse(next: Occasion) {
    setOccasion(next);
    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="dp-page">
      <section className="dp-hero" id="top">
        <div className="sp-wrap dp-hero-grid">
          <div className="dp-hero-copy">
            <p className="sp-eyebrow">small makers · unusual gifts · checked with care</p>
            <h1>Find the gift<br /><em>you didn’t know existed.</em></h1>
            <p className="dp-lede">We discover delightful gifts from small Instagram businesses, show you exactly what we checked, and help you turn the final gift into a moment.</p>
            <div className="dp-hero-actions">
              <a href="#discover" className="sp-btn sp-btn-red">find their gift ↓</a>
              <a href="#trust" className="sp-btn sp-btn-ghost">how we check sellers</a>
            </div>
            <div className="dp-proof-row">
              <span><b>100</b> pilot gifts</span>
              <span><b>Evidence</b> over vague scores</span>
              <span><b>India-first</b> discovery</span>
            </div>
          </div>
          <div className="dp-hero-world">
            <GiftUniverse occasion={occasion} onOccasionChange={chooseFromUniverse} />
            <div className="dp-float-card one"><span>✓</span><div><b>Test order checked</b><small>Evidence, not promises</small></div></div>
            <div className="dp-float-card two"><span>✦</span><div><b>Made by small brands</b><small>Found beyond big marketplaces</small></div></div>
          </div>
        </div>
      </section>

      <section className="dp-finder" id="discover">
        <div className="sp-wrap">
          <div className="dp-section-head">
            <div><p className="sp-eyebrow">start with the person</p><h2>What would feel like <em>them?</em></h2></div>
            <p>Use a few human clues. We’ll keep the list small enough to actually choose from.</p>
          </div>

          <div className="dp-filter-panel">
            <fieldset><legend>What’s the moment?</legend><div className="dp-chips">{occasions.map((item) => <button type="button" key={item} className={occasion === item ? 'active' : ''} onClick={() => setOccasion(item)}>{item}</button>)}</div></fieldset>
            <fieldset><legend>What feels right?</legend><div className="dp-chips">{styles.map((item) => <button type="button" key={item} className={style === item ? 'active' : ''} onClick={() => setStyle(item)}>{item}</button>)}</div></fieldset>
            <fieldset className="dp-budget"><legend>Keep it under</legend><div className="dp-chips">{budgetOptions.map((item) => <button type="button" key={item} className={budget === item ? 'active' : ''} onClick={() => setBudget(item)}>₹{item.toLocaleString('en-IN')}</button>)}</div></fieldset>
          </div>

          <div className="dp-results-bar"><span><b>{filtered.length}</b> thoughtful finds</span><span>Curated for discovery, not infinite scrolling.</span></div>
          {filtered.length ? <div className="dp-product-grid">{filtered.map((product) => <ProductCard product={product} key={product.id} />)}</div> : (
            <div className="dp-empty"><img src="/illustrations/nervous.webp" alt="" /><div><h3>That combination is wonderfully specific.</h3><p>We don’t have a matching pilot gift yet. Try a wider budget or another style.</p><button type="button" onClick={() => { setOccasion('All'); setStyle('All'); setBudget(1500); }}>Show every gift</button></div></div>
          )}
        </div>
      </section>

      <section className="dp-trust-section" id="trust">
        <div className="sp-wrap dp-trust-grid">
          <div className="dp-trust-copy"><p className="sp-eyebrow">the trust passport</p><h2>No mysterious<br /><em>“genuineness score.”</em></h2><p>One number can hide too much. We show the actual checks, the latest test date, what went well, and what did not.</p><a href="#discover">Open a sample passport ↑</a></div>
          <div className="dp-passport-large">
            <div className="dp-passport-top"><div className="dp-seal">✓</div><div><span>TESTED BY SURPRISE PAGES</span><h3>Paper Moon Studio</h3><p>Jaipur · Last checked October 2026</p></div></div>
            <div className="dp-check-grid"><div><b>Identity</b><span>Verified</span></div><div><b>Test order</b><span>Delivered</span></div><div><b>Photo match</b><span>Strong</span></div><div><b>Packaging</b><span>Gift-ready</span></div></div>
            <blockquote>“The product matched the listing, arrived safely and the seller communicated clearly. This is demonstration copy until the first real test cohort.”</blockquote>
            <small>Commercial promotion can never change this result.</small>
          </div>
        </div>
      </section>

      <section className="dp-moment">
        <div className="sp-wrap dp-moment-grid">
          <div className="dp-moment-art"><div className="dp-orbit" /><img src="/illustrations/hugheart.webp" alt="A person holding a large heart" /></div>
          <div><p className="sp-eyebrow">after you find it</p><h2>The gift arrives.<br /><em>The feeling arrives first.</em></h2><p>Add photos, a note, music or a countdown to a private Surprise Page. Send the page before the parcel, on the special day, or as the final reveal.</p><Link className="sp-btn sp-btn-red" href="/builder">create a Surprise Page →</Link></div>
        </div>
      </section>

      <section className="dp-seller" id="sellers">
        <div className="sp-wrap dp-seller-inner"><div><p className="sp-eyebrow">for small gift businesses</p><h2>Make remarkable work<br />easier to discover.</h2></div><div><p>Our founding cohort will be small and manually reviewed. No open flood of listings, no paid trust badges, and no commission before we prove useful.</p><a href="mailto:hello@surprisepages.in?subject=Founding%20seller%20application" className="sp-btn sp-btn-cream">apply for the pilot →</a></div></div>
      </section>

      <footer className="sp-footer"><div className="sp-wrap"><div className="sp-foot-grid"><div><div className="sp-foot-brand"><span /> surprise pages</div><p>Unexpected gifts from small brands, checked with care.</p></div><div><h4>Discover</h4><a href="#discover">Gift finder</a><a href="#trust">How trust works</a></div><div><h4>For sellers</h4><a href="#sellers">Join the pilot</a><Link href="/contact">Contact</Link></div><div><h4>Surprise pages</h4><Link href="/builder">Create a page</Link><Link href="/examples">See examples</Link></div></div><div className="sp-foot-bot"><span>© surprise pages</span><span>Pilot catalogue · made in India</span></div></div></footer>
    </main>
  );
}
