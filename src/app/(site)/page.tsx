import { fontVariables } from '@/components/marketing/typography';
import Link from 'next/link';
import { landingContent } from '@/components/marketing/content';
import { FallingLeaves } from '@/components/marketing/effects/FallingLeaves';
import {
  Hero,
  TrustStrip,
  BeforeAfter,
  HowItWorks,
  EmotionBand,
  Pricing,
  Testimonials,
  Faq,
  FinalCta,
} from '@/components/marketing/LandingSections';
import { SiteFooter } from '@/components/marketing/sections/SiteFooter';

export default function Page() {
  const c = landingContent;

  return (
    <div className={`sp-landing ${fontVariables}`}>
      <FallingLeaves />
      <Hero content={c.hero} />
      <TrustStrip content={c.trust} />
      <BeforeAfter content={c.beforeAfter} />
      <HowItWorks content={c.howItWorks} />
      <EmotionBand content={c.emotionBand} />
      <Pricing content={c.pricing} />
      <Testimonials content={c.testimonials} />
      <section className="sp-discovery-teaser sp-sec">
        <div className="sp-wrap sp-discovery-teaser-grid">
          <div className="sp-discovery-teaser-art"><img src="/illustrations/crown1.webp" alt="A wrapped gift" /></div>
          <div>
            <span className="sp-eyebrow">gift discovery · coming soon</span>
            <h2>Still looking for the physical gift?</h2>
            <p>We&apos;re preparing a carefully reviewed collection from independent Indian businesses. Surprise Pages remains ready whenever you already have the gift—or only need the moment around it.</p>
            <Link href="/discover" className="sp-btn sp-btn-outline">see what we&apos;re preparing →</Link>
          </div>
        </div>
      </section>
      <Faq content={c.faq} />
      <FinalCta content={c.finalCta} />
      <SiteFooter brand={c.brand} footer={c.footer} />
    </div>
  );
}
