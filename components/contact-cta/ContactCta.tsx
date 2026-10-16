'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.2, 0.75, 0.2, 1] as const;

// ── SCENE 05: The Closing Invitation ─────────────────────────────────────────
// Faithfully reproduces the closing CTA from penda-scene3.html.
// All animation CSS lives in globals.css (scene5-* classes).
// Contact: WhatsApp +256775408295 / info@pendaagency.com
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.querySelectorAll<HTMLElement>('.scene5-reveal').forEach((el) => el.classList.add('scene5-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scene5-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    section.querySelectorAll('.scene5-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        padding: 'clamp(70px,11vw,150px) clamp(20px,8.3vw,132px)',
        background: 'var(--s5-bg)',
        position: 'relative',
        overflow: 'hidden',
        color: 'var(--s5-ink)',
        fontFamily: '"DM Sans", var(--font-sans), sans-serif',
      }}
      aria-labelledby="contact-heading"
    >
      {/* Large background watermark P */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '4%',
          bottom: '-33%',
          fontFamily: '"Manrope", var(--font-manrope), sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(280px,48vw,680px)',
          lineHeight: 0.8,
          letterSpacing: '-.12em',
          color: '#7965b5',
          opacity: 0.07,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        P
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left — heading */}
        <div className="scene5-reveal">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '22px',
              color: 'var(--s5-accent)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'block' }} />
            YOUR IDEA COULD BE NEXT
          </div>
          {/*
            Section heading — whileInView, scroll-triggered.
            Fires once as the CTA section scrolls into the viewport.
            Parent div keeps scene5-reveal for the eyebrow dot + description.
          */}
          <motion.h2
            id="contact-heading"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.82, ease: EASE }}
            style={{
              fontFamily: '"Manrope", var(--font-manrope), sans-serif',
              fontSize: 'clamp(44px,7.2vw,100px)',
              fontWeight: 500,
              letterSpacing: '-.06em',
              lineHeight: 1.03,
              maxWidth: '800px',
              margin: '0 0 22px',
            }}
          >
            Let&apos;s make<br />something happen.
          </motion.h2>
          <p style={{ maxWidth: '430px', color: 'var(--s5-muted)', lineHeight: 1.7, margin: 0 }}>
            Planning an event, producing a film, or bringing an idea to life? Let&apos;s talk about what you&apos;re imagining.
          </p>
        </div>

        {/* Right — contact details + CTA */}
        <div className="scene5-reveal" style={{ flexShrink: 0 }}>
          <div style={{ display: 'grid', gap: '8px', marginBottom: '24px', color: 'var(--s5-muted)', fontSize: '0.85rem' }}>
            <a href="mailto:info@pendaagency.com" style={{ color: 'inherit', transition: 'color .2s' }} className="footer-link">
              info@pendaagency.com
            </a>
            <a href="tel:+256775408295" style={{ color: 'inherit', transition: 'color .2s' }} className="footer-link">
              +256 775 408 295
            </a>
            <span>Plot KL 21, Kaduyu Lane, Kiwatule, Kampala, Uganda</span>
          </div>

          <a
            href="https://wa.me/256775408295?text=Hello%20PENDA%20Agency%2C%20I%27d%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noreferrer"
            className="scene5-cta-btn"
          >
            Start a conversation <span style={{ fontSize: '17px', lineHeight: '10px' }}>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
