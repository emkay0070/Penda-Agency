import Navigation  from '@/components/navigation/Navigation';
import Hero        from '@/components/hero/Hero';
import Scene2Services from '@/components/services/Scene2Services';
import Scene3Work  from '@/components/work/Scene3Work';
import Team        from '@/components/team/Team';
import ContactCta  from '@/components/contact-cta/ContactCta';

export default function Home() {
  return (
    <main>
      {/* Sticky navigation — present across all five scenes */}
      <Navigation />

      {/* ─── SCENE 01 — The Cinematic Opening ─────────────────────────────── */}
      <Hero />

      {/* ─── SCENE 02 — The Cinematic Services Journey ───────────────────── */}
      {/* Part A: capsule fall + "Our Services" reveal                         */}
      {/* Part B: pinned horizontal journey through 6 service slides           */}
      <Scene2Services />

      {/* ─── SCENE 03 — The Curated Exhibition ──────────────────────────── */}
      {/* Headline: "Ideas made real. Experiences made memorable."             */}
      {/* Featured project + asymmetric gallery + filter + modals             */}
      <Scene3Work />

      {/* ─── SCENE 04 — The People Behind PENDA ─────────────────────────── */}
      {/* Headline: "Good work takes people."                                  */}
      {/* Editorial portrait gallery — Isaac, Berna, Olivia                   */}
      <Team />

      {/* ─── SCENE 05 — The Closing Invitation ──────────────────────────── */}
      {/* Headline: "Let's make something happen."                             */}
      <ContactCta />
    </main>
  );
}
