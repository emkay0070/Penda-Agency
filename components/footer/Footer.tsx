'use client';

import { useEffect, useState } from 'react';

// ── Footer ────────────────────────────────────────────────────────────────────
// Uses a client useEffect to set the year (avoids SSR/client mismatch for the
// date). Footer links use the .footer-link class defined in globals.css.
// <style> is NOT supported in Next.js App Router — rules moved to globals.css.
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Home',      href: '#home' },
  { label: 'Services',  href: '#services' },
  { label: 'Portfolio', href: '#work' },
  { label: 'Team',      href: '#team' },
  { label: 'Contact',   href: '#contact' },
] as const;

export default function Footer() {
  // Initialise with a dash so SSR and first client render agree (avoids mismatch)
  const [year, setYear] = useState('—');
  useEffect(() => setYear(String(new Date().getFullYear())), []);

  return (
    <footer style={{ padding: '34px 0 22px', background: '#07080a' }}>
      <div className="wrap">
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '40px',
            alignItems: 'flex-start',
            paddingBottom: '36px',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand */}
          <div>
            <a href="#home" style={{ display: 'inline-block', textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.55rem', lineHeight: 0.85, letterSpacing: '-0.08em', color: '#f5f5f3' }}>
                Penda
                <small style={{ display: 'block', fontFamily: 'var(--font-sans)', letterSpacing: '0.45em', color: 'rgba(245,245,243,0.7)', marginTop: '7px', marginLeft: '2px', fontSize: '0.48rem', fontWeight: 700 }}>
                  AGENCY
                </small>
              </span>
            </a>
            <p style={{ color: 'var(--muted)', maxWidth: '260px', fontSize: '0.83rem', marginTop: '20px', lineHeight: 1.6 }}>
              Creating experiences that bring people together and make moments matter.
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: 'clamp(20px,3vw,40px)', flexWrap: 'wrap', fontSize: '0.8rem', color: '#d4d4d6' }}>
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className="footer-link">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: '1px solid var(--line)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            color: '#8c8d93',
            fontSize: '0.72rem',
            flexWrap: 'wrap',
          }}
        >
          <span>© {year} Penda Agency. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link">Instagram</a>
            <a href="https://linkedin.com"  target="_blank" rel="noreferrer" className="footer-link">LinkedIn</a>
            <a href="https://youtube.com"   target="_blank" rel="noreferrer" className="footer-link">YouTube</a>
          </div>
          <span>Made for moments that matter.</span>
        </div>
      </div>
    </footer>
  );
}
