'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ── SCENE 04: The People Behind PENDA ───────────────────────────────────────
// Section heading uses whileInView — animates in as the section scrolls into
// view, never on page load.
//
// Portrait images use a bare opacity 0→1 fade with a per-column stagger.
// Nothing dramatic — you barely notice it happening, but the portraits feel
// present rather than suddenly appearing.
//
// The rest of the card (name, role, line) is handled by the existing
// team4-reveal IntersectionObserver system (unchanged).
// ────────────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name:    'Isaac Sekiro',
    role:    'Creative Director',
    note:    'Creative vision & direction',
    index:   '01 / 03',
    loading: 'eager' as const,
    img:     'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    alt:     'Illustrative portrait placeholder for Isaac Sekiro, Creative Director',
  },
  {
    name:    'Berna Twinomugisha',
    role:    'Administrator',
    note:    'The details that bring it together',
    index:   '02 / 03',
    loading: 'lazy' as const,
    img:     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    alt:     'Illustrative portrait placeholder for Berna Twinomugisha, Administrator',
  },
  {
    name:    'Olivia Nakyejjwe',
    role:    'Public Relations',
    note:    'People, stories & connection',
    index:   '03 / 03',
    loading: 'lazy' as const,
    img:     'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    alt:     'Illustrative portrait placeholder for Olivia Nakyejjwe, Public Relations',
  },
] as const;

// Per-portrait reveal stagger so the three images don't all fade at once.
const PORTRAIT_DELAYS = [0, 0.14, 0.26] as const;

const EASE = [0.2, 0.75, 0.2, 1] as const;

export default function Scene4Team() {
  const sectionRef = useRef<HTMLElement>(null);

  // CSS-based reveal for card text (name, role, footer line) — unchanged
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.querySelectorAll<HTMLElement>('.team4-reveal').forEach((el) => el.classList.add('team4-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('team4-visible'); obs.unobserve(entry.target); }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -35px 0px' }
    );
    section.querySelectorAll('.team4-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      style={{
        position: 'relative', isolation: 'isolate', overflow: 'hidden',
        padding: 'clamp(80px,11vw,150px) clamp(22px,7vw,108px)',
        background: `radial-gradient(ellipse at 90% 15%,rgba(237,116,72,0.075),transparent 34%), #171715`,
        color: '#f5f0e8', fontFamily: '"DM Sans", var(--font-sans), sans-serif',
      }}
      aria-labelledby="team-section-heading"
    >
      <div style={{ width: '100%', maxWidth: '1440px', marginInline: 'auto' }}>

        {/* Intro */}
        <header
          className="team4-reveal"
          style={{ display: 'grid', gridTemplateColumns: '1fr minmax(220px,340px)', alignItems: 'end', gap: '40px', marginBottom: 'clamp(48px,7vw,90px)' }}
        >
          <div>
            <p style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 26px', color: '#ed7448', fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase' }}>
              <span style={{ width: '26px', height: '1px', background: 'currentColor', display: 'block' }} />
              The people behind the work
            </p>

            {/*
              Section heading — whileInView, scroll-triggered.
              Fires once as the team section scrolls into the viewport.
              Uses a modest y-translate so it enters from just below its resting spot.
            */}
            <motion.h2
              id="team-section-heading"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.82, ease: EASE }}
              style={{
                maxWidth: '850px', margin: 0,
                fontFamily: '"Manrope", var(--font-manrope), sans-serif',
                fontSize: 'clamp(48px,7.5vw,104px)', fontWeight: 500,
                letterSpacing: '-0.075em', lineHeight: 0.98,
              }}
            >
              Good work<br />
              takes <span style={{ color: '#ed7448' }}>people.</span>
            </motion.h2>
          </div>
          <div style={{ maxWidth: '310px', paddingBottom: '8px' }}>
            <p style={{ margin: 0, color: '#a5a198', fontSize: '15px', lineHeight: 1.9 }}>
              Different perspectives. Shared ambition. One team bringing ideas to life.
            </p>
            <span style={{ display: 'block', marginTop: '25px', color: '#f5f0e8', fontSize: '10px', letterSpacing: '.16em' }}>
              PENDA STUDIO &nbsp;/&nbsp; 03 PEOPLE
            </span>
          </div>
        </header>

        {/* Portrait grid */}
        <div
          className="team4-grid"
          style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.85fr 0.85fr', alignItems: 'start', gap: 'clamp(14px,2vw,28px)' }}
        >
          {TEAM.map((member, i) => (
            <article
              key={member.name}
              className="team4-reveal team4-card"
              style={{
                minWidth: 0,
                marginTop: i === 1 ? '85px' : i === 2 ? '170px' : '0',
                transitionDelay: i === 1 ? '100ms' : i === 2 ? '200ms' : '0ms',
              }}
            >
              {/* Portrait */}
              <div
                className="team4-portrait"
                style={{ position: 'relative', overflow: 'hidden', aspectRatio: i === 1 ? '0.82' : '0.76', background: '#22221f', isolation: 'isolate' }}
              >
                {/*
                  Portrait image reveal: opacity 0 → 1 only.
                  Unobtrusive — the portrait quietly materialises as you scroll to it.
                  Per-column delay (0, 0.14, 0.26s) makes the trio read left→right.
                  CSS hover (.team4-card:hover .team4-portrait-img) manages the
                  transform and filter independently — no conflict.
                */}
                <motion.img
                  src={member.img}
                  alt={member.alt}
                  loading={member.loading}
                  className="team4-portrait-img"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                  transition={{ duration: 0.85, ease: 'easeOut', delay: PORTRAIT_DELAYS[i] }}
                  style={{
                    display: 'block', width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center',
                    filter: 'saturate(0.78)',
                    transition: 'transform 900ms cubic-bezier(.2,.7,.2,1), filter 600ms ease',
                  }}
                />

                {/* Gradient */}
                <div
                  aria-hidden="true"
                  className="team4-portrait-grad"
                  style={{ position: 'absolute', inset: '30% 0 0', zIndex: 1, background: 'linear-gradient(to bottom,transparent,rgba(15,15,14,0.75))', opacity: 0.65, transition: 'opacity 500ms ease', pointerEvents: 'none' }}
                />

                {/* Index badge */}
                <span style={{ position: 'absolute', top: '18px', left: '18px', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '10px', letterSpacing: '.13em' }}>
                  <span style={{ width: '6px', height: '6px', background: '#ed7448', borderRadius: '50%', display: 'block' }} />
                  {member.index}
                </span>

                {/* Hover note */}
                <span
                  className="team4-portrait-note"
                  style={{ position: 'absolute', right: '16px', bottom: '18px', left: '16px', zIndex: 2, color: 'white', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', opacity: 0, transform: 'translateY(8px)', transition: 'opacity 350ms ease, transform 350ms ease' }}
                >
                  {member.note}
                </span>
              </div>

              {/* Name / role */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', padding: '22px 0 0', borderTop: '1px solid rgba(245,240,232,0.16)', marginTop: '17px' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: '"Manrope", var(--font-manrope), sans-serif', fontSize: 'clamp(17px,1.8vw,24px)', fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1.3 }}>{member.name}</h3>
                  <p style={{ margin: '8px 0 0', color: '#a5a198', fontSize: '12px', lineHeight: 1.6 }}>{member.role}</p>
                </div>
                <span
                  className="team4-arrow"
                  aria-hidden="true"
                  style={{ display: 'grid', placeItems: 'center', flex: '0 0 34px', width: '34px', height: '34px', border: '1px solid rgba(245,240,232,0.16)', borderRadius: '50%', color: '#f5f0e8', fontSize: '17px', transition: 'background 250ms ease, color 250ms ease, transform 250ms ease, border-color 250ms ease' }}
                >
                  ↗
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Footer line */}
        <footer
          className="team4-reveal"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '25px', paddingTop: '32px', marginTop: 'clamp(55px,8vw,100px)', borderTop: '1px solid rgba(245,240,232,0.16)', flexWrap: 'wrap' }}
        >
          <p style={{ margin: 0, color: '#a5a198', fontSize: '13px', lineHeight: 1.7 }}>
            Behind every experience is a team that cares about how it comes to life.
          </p>
          <span style={{ color: '#ed7448', fontSize: '10px', letterSpacing: '.17em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            PENDA &nbsp;/&nbsp; PEOPLE FIRST
          </span>
        </footer>
      </div>
    </section>
  );
}
