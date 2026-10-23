import { fontVariables } from '@/components/marketing/typography';
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
      <Faq content={c.faq} />
      <FinalCta content={c.finalCta} />
      <SiteFooter brand={c.brand} footer={c.footer} />
    </div>
  );
}
