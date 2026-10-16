'use client';

import { useState, useEffect } from 'react';

// ── Sticky Navigation ────────────────────────────────────────────────────────
// Rendered as a fixed header. Background fades in once the user scrolls past
// 60px. Mobile menu is a simple dropdown. No Tailwind utility classes are used
// in the HTML so the component renders identically on server and client without
// a 'mounted' flash.
// ────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Home',      href: '#home' },
  { label: 'Services',  href: '#services' },
  { label: 'Portfolio', href: '#work' },
  { label: 'Team',      href: '#team' },
  { label: 'Contact',   href: '#contact' },
] as const;

export default function Navigation() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    // Set initial state immediately
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    transition: 'background 0.5s ease, padding 0.5s ease, border-color 0.5s ease',
    paddingBlock: scrolled ? '1rem' : '1.5rem',
    paddingInline: 'clamp(20px,4vw,64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    background: scrolled ? 'rgba(8,9,11,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(14px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.09)' : '1px solid transparent',
  };

  const linkStyle: React.CSSProperties = {
    color: '#d4d4d4',
    fontSize: '0.8rem',
    transition: 'color 0.2s',
  };

  return (
    <>
      <header style={navStyle} aria-label="Main site navigation">
        {/* Brand */}
        <a href="#home" aria-label="Penda Agency home" style={{ flexShrink: 0, textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.55rem', lineHeight: 0.85, letterSpacing: '-0.08em', color: '#f5f5f3' }}>
            Penda
            <small style={{ display: 'block', fontFamily: 'var(--font-sans)', letterSpacing: '0.45em', color: 'rgba(245,245,243,0.7)', marginTop: '7px', marginLeft: '2px', fontSize: '0.48rem', fontWeight: 700 }}>
              AGENCY
            </small>
          </span>
        </a>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 'clamp(18px,3vw,40px)', alignItems: 'center' }} aria-label="Primary navigation" className="penda-nav-desktop">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href} style={linkStyle} className="penda-nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="#contact"
            className="penda-nav-cta"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              border: '1px solid rgba(255,255,255,0.32)',
              background: 'rgba(0,0,0,0.15)',
              color: '#f5f5f3',
              borderRadius: '999px',
              padding: '11px 20px',
              fontSize: '0.86rem',
              fontWeight: 700,
              transition: 'border-color 0.25s, background 0.25s, transform 0.25s',
              textDecoration: 'none',
            }}
          >
            Get a quote <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>↗</span>
          </a>

          <button
            className="penda-nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            style={{
              display: 'none', // shown via CSS at small breakpoint
              placeItems: 'center',
              width: '44px', height: '44px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              background: 'transparent',
              color: '#f5f5f3',
              cursor: 'pointer',
              fontSize: '18px',
              transition: 'border-color 0.2s',
            }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: '75px', left: '19px', right: '19px',
            zIndex: 40,
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(10,11,14,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMobile}
              style={{
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                color: '#d4d4d4',
                fontSize: '0.875rem',
                transition: 'color 0.2s',
              }}
              className="penda-nav-link"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMobile}
            style={{
              marginTop: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              border: '1px solid rgba(255,255,255,0.32)',
              background: 'rgba(0,0,0,0.15)',
              color: '#f5f5f3',
              borderRadius: '999px',
              padding: '12px 20px',
              fontSize: '0.875rem',
              fontWeight: 700,
              transition: 'border-color 0.2s',
            }}
          >
            Get a quote <span>↗</span>
          </a>
        </div>
      )}

      {/* Nav responsive helpers — show/hide hamburger */}
      <style>{`
        @media (max-width:1023px) {
          .penda-nav-desktop   { display: none !important; }
          .penda-nav-hamburger { display: grid !important; }
          .penda-nav-cta       { display: none !important; }
        }
      `}</style>
    </>
  );
}
