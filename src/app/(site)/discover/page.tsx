import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { landingContent } from '@/components/marketing/content';
import { SiteFooter } from '@/components/marketing/sections/SiteFooter';

export const metadata: Metadata = {
  title: 'Gift discovery is coming — Surprise Pages',
  description: 'A carefully prepared way to discover uncommon gifts from small Indian businesses.',
  robots: { index: false, follow: true },
};

export default function DiscoverPage() {
  return (
    <div className="dp-soon-page">
      <main>
        <section className="dp-soon-hero">
          <div className="sp-wrap dp-soon-grid">
            <div className="dp-soon-copy">
              <span className="dp-soon-pill"><i /> gift discovery · coming soon</span>
              <h1>The gifts you don&apos;t already know to search for.</h1>
              <p>
                We&apos;re preparing a smaller, more thoughtful way to find delightful products
                from independent Indian businesses. Every listing will be reviewed before it appears.
              </p>
              <div className="dp-soon-actions">
                <Link href="/builder" className="sp-btn sp-btn-red">create a Surprise Page →</Link>
                <Link href="/contact" className="sp-btn sp-btn-outline">tell us what you&apos;d love to find</Link>
              </div>
              <small>Surprise Pages is available now. Gift discovery will open separately.</small>
            </div>
            <div className="dp-soon-art" aria-label="Gift discovery preview illustration">
              <div className="dp-soon-orbit" />
              <div className="dp-soon-gift main"><Image src="/illustrations/crown1.webp" alt="A wrapped gift" width={624} height={780} priority /></div>
              <div className="dp-soon-float one"><b>small brands</b><span>worth finding</span></div>
              <div className="dp-soon-float two"><b>clear checks</b><span>before listing</span></div>
            </div>
          </div>
        </section>

        <section className="dp-soon-principles">
          <div className="sp-wrap">
            <header><span>WHAT WE&apos;RE PREPARING</span><h2>Discovery without the noisy marketplace feeling.</h2></header>
            <div className="dp-soon-cards">
              <article><b>01</b><h3>Unexpected finds</h3><p>Products with personality, not another endless catalogue of the same things.</p></article>
              <article><b>02</b><h3>Useful evidence</h3><p>What was checked, when it was checked and what still needs caution—without a mysterious score.</p></article>
              <article><b>03</b><h3>Human occasions</h3><p>Filters based on the person, the relationship and the feeling—not only product categories.</p></article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter brand={landingContent.brand} footer={landingContent.footer} />
    </div>
  );
}
