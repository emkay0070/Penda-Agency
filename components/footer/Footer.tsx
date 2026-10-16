'use client';

import { useEffect, useState } from 'react';

// ── PENDA Footer — Editorial Layout ──────────────────────────────────────────
// Six-column grid on desktop → stacked on mobile.
// Avoids invented contact info — social links are left as placeholders.
// ─────────────────────────────────────────────────────────────────────────────

const SERVICES = [
  'Live Event Production',
  'Audiovisual Experiences',
  'Broadcast & Streaming',
  'Visual Storytelling',
  'Stage & Set Design',
  'Creative Direction',
];

const NAV = [
  { label: 'Home',      href: '#home' },
  { label: 'Services',  href: '#services' },
  { label: 'Work',      href: '#work' },
  { label: 'Team',      href: '#team' },
  { label: 'Contact',   href: '#contact' },
];

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn',  href: '#' },
  { label: 'YouTube',   href: '#' },
  { label: 'Behance',   href: '#' },
];

export default function Footer() {
  const [year, setYear] = useState('—');
  useEffect(() => setYear(String(new Date().getFullYear())), []);

  return (
    <footer className="penda-footer">

      {/* ── CTA bar ─────────────────────────────────────────────────────── */}
      <div className="penda-footer__cta-bar">
        <div className="wrap penda-footer__cta-inner">
          <div className="penda-footer__cta-copy">
            <p className="penda-footer__cta-eyebrow">Ready to create?</p>
            <h2 className="penda-footer__cta-headline">
              Let's make something<br />
              <span>unforgettable.</span>
            </h2>
          </div>
          <a href="#contact" className="penda-footer__cta-btn">
            Start a project
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 15L15 3M15 3H6M15 3v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="wrap penda-footer__grid">

        {/* Brand column */}
        <div className="penda-footer__brand">
          <a href="#home" className="penda-footer__logo" aria-label="Penda Agency home">
            <span className="penda-footer__logo-mark" aria-hidden="true">P.</span>
            <span className="penda-footer__logo-word">
              <strong>PENDA</strong>
              <small>AGENCY</small>
            </span>
          </a>
          <p className="penda-footer__tagline">
            Independent production partner for live events, audiovisual, and
            visual storytelling. Based in Kampala, Uganda.
          </p>
          <p className="penda-footer__location">
            <span aria-hidden="true">📍</span> Kampala, Uganda · Est. 2022
          </p>
        </div>

        {/* Services column */}
        <div className="penda-footer__col">
          <h3 className="penda-footer__col-title">Services</h3>
          <ul className="penda-footer__list">
            {SERVICES.map(s => (
              <li key={s}>
                <a href="#services" className="penda-footer__link">{s}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation column */}
        <div className="penda-footer__col">
          <h3 className="penda-footer__col-title">Navigate</h3>
          <ul className="penda-footer__list">
            {NAV.map(item => (
              <li key={item.label}>
                <a href={item.href} className="penda-footer__link">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social + awards column */}
        <div className="penda-footer__col">
          <h3 className="penda-footer__col-title">Follow</h3>
          <ul className="penda-footer__list">
            {SOCIALS.map(s => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="penda-footer__link penda-footer__link--social"
                >
                  {s.label}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Divider + bottom bar ─────────────────────────────────────────── */}
      <div className="wrap penda-footer__bottom">
        <div className="penda-footer__bottom-line" />
        <div className="penda-footer__bottom-row">
          <span>© {year} Penda Agency. All rights reserved.</span>
          <span className="penda-footer__bottom-mid">
            Events · Audiovisual · Creative
          </span>
          <span>Made for moments that matter.</span>
        </div>
      </div>

    </footer>
  );
}
