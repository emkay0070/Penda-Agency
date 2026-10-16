'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// ── PENDA Cinematic Navigation ────────────────────────────────────────────────
//
// Three-state system:
//   "hero"     → invisible during the cinematic opening (z-index behind hero topbar)
//   "floating" → compact floating glass bar during browsing
//   "top"      → gracefully faded at the very top of the page (post-hero)
//
// Scroll behavior:
//   – Scrolling DOWN past threshold → hide (slide up + fade)
//   – Scrolling UP any amount      → show floating bar
//   – Back at top (< HERO_HEIGHT)  → return to hero state
//
// Full-screen menu: Framer Motion staggered reveal, focus trap, Escape key.
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Services',  href: '#services',  index: '02' },
  { label: 'Work',      href: '#work',      index: '03' },
  { label: 'Team',      href: '#team',      index: '04' },
  { label: 'Contact',   href: '#contact',   index: '05' },
] as const;

// Hero intro runs for ~3.3 s then reveals the film scene. We stay invisible
// until the user scrolls (or the intro finishes — we detect via scroll only,
// keeping this component decoupled from Hero internals).
const HERO_HEIGHT_VH = 80; // treat first 80% of viewport as "still in hero"
const HIDE_THRESHOLD  = 80; // px scrolled down before hiding on scroll-down
const SHOW_THRESHOLD  = 6;  // px scrolled up before re-showing

export default function Navigation() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [navVisible, setNavVisible] = useState(false); // floating bar visible
  const [inHero,     setInHero]     = useState(true);  // still inside hero zone

  const lastScrollY   = useRef(0);
  const ticking       = useRef(false);
  const menuCloseRef  = useRef<HTMLButtonElement>(null);
  const menuOpenRef   = useRef<HTMLButtonElement>(null);
  // How many px scrolled down in a row before we hide
  const scrollDownAcc = useRef(0);

  // ── Scroll handler ─────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const y     = window.scrollY;
      const heroH = window.innerHeight * (HERO_HEIGHT_VH / 100);
      const diff  = y - lastScrollY.current;

      if (y < heroH) {
        // Still in hero zone — stay invisible, reset accumulator
        setInHero(true);
        setNavVisible(false);
        scrollDownAcc.current = 0;
      } else {
        setInHero(false);

        if (diff > 0) {
          // Scrolling down — accumulate
          scrollDownAcc.current += diff;
          if (scrollDownAcc.current > HIDE_THRESHOLD) {
            setNavVisible(false);
          }
        } else {
          // Any scroll up — reset accumulator and show immediately
          scrollDownAcc.current = 0;
          if (diff < -SHOW_THRESHOLD) setNavVisible(true);
        }

        // Entered post-hero zone for the first time → show
        if (lastScrollY.current < heroH && y >= heroH) {
          setNavVisible(true);
          scrollDownAcc.current = 0;
        }
      }

      lastScrollY.current = y;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ── Menu open/close ────────────────────────────────────────────────────────
  const openMenu = () => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
    // Return focus to the trigger
    requestAnimationFrame(() => menuOpenRef.current?.focus());
  }, []);

  // Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  // Auto-focus close button when menu opens
  useEffect(() => {
    if (menuOpen) {
      requestAnimationFrame(() => menuCloseRef.current?.focus());
    }
  }, [menuOpen]);

  // ── Smooth scroll + close menu ─────────────────────────────────────────────
  const navigate = (href: string) => {
    closeMenu();
    // Small delay so exit animation has time to start before scroll
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  // ── Reduced motion preference ──────────────────────────────────────────────
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Framer Motion variants ─────────────────────────────────────────────────
  const barVariants = {
    hidden:  { y: -16, opacity: 0 },
    visible: { y: 0,   opacity: 1 },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open:   { opacity: 1 },
  };

  const menuItemVariants = {
    closed: { y: 32,  opacity: 0 },
    open:   { y: 0,   opacity: 1 },
  };

  const menuLinkVariants = {
    closed: { x: -24, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
    open:   { x: 0,   opacity: 1, clipPath: 'inset(0 0% 0 0)'   },
  };

  // ── Logo mark (shared) ─────────────────────────────────────────────────────
  const LogoMark = ({ size = 28 }: { size?: number }) => (
    <a
      href="#home"
      onClick={e => { e.preventDefault(); navigate('#home'); }}
      aria-label="Penda Agency — back to top"
      className="pnav-logo"
    >
      <span
        className="pnav-logo__mark"
        style={{ width: size, height: size, fontSize: size * 0.54 }}
        aria-hidden="true"
      >P.</span>
      <span className="pnav-logo__word">
        <strong>PENDA</strong>
        <small>AGENCY</small>
      </span>
    </a>
  );

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          FLOATING NAV BAR
          Appears when user scrolls up past hero zone.
          Hidden during hero cinematic; never shown while menu is open.
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!inHero && navVisible && !menuOpen && (
          <motion.header
            key="floating-nav"
            role="banner"
            aria-label="Site navigation"
            className="pnav-bar"
            variants={prefersReduced ? {} : barVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.38, ease: [0.22, 0.75, 0.18, 1] }}
          >
            <LogoMark size={26} />

            {/* Desktop links */}
            <nav className="pnav-bar__links" aria-label="Primary navigation">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={e => { e.preventDefault(); navigate(item.href); }}
                  className="pnav-bar__link"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="pnav-bar__right">
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); navigate('#contact'); }}
                className="pnav-bar__cta"
                aria-label="Get a quote"
              >
                Get a quote <span aria-hidden="true">↗</span>
              </a>

              <button
                ref={menuOpenRef}
                onClick={openMenu}
                aria-label="Open full navigation menu"
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                className="pnav-bar__menu-btn"
              >
                <span className="pnav-burger" aria-hidden="true">
                  <span /><span /><span />
                </span>
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          FULL-SCREEN MENU OVERLAY
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Full navigation menu"
            className="pnav-menu"
            variants={prefersReduced ? {} : overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.48, ease: [0.22, 0.75, 0.18, 1] }}
          >
            {/* Noise grain */}
            <div className="pnav-menu__grain" aria-hidden="true" />

            {/* Accent orb */}
            <div className="pnav-menu__orb" aria-hidden="true" />

            {/* Header row */}
            <div className="pnav-menu__header">
              <LogoMark size={30} />
              <button
                ref={menuCloseRef}
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="pnav-menu__close"
              >
                <span className="pnav-menu__close-x" aria-hidden="true">
                  <span /><span />
                </span>
              </button>
            </div>

            {/* Nav links */}
            <nav
              className="pnav-menu__nav"
              aria-label="Full site navigation"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="pnav-menu__item"
                  variants={prefersReduced ? {} : menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{
                    duration: 0.55,
                    delay: 0.08 + i * 0.09,
                    ease: [0.22, 0.75, 0.18, 1],
                  }}
                >
                  <span className="pnav-menu__item-index">
                    {item.index}
                  </span>
                  <motion.a
                    href={item.href}
                    onClick={e => { e.preventDefault(); navigate(item.href); }}
                    className="pnav-menu__link"
                    variants={prefersReduced ? {} : menuLinkVariants}
                    whileHover={prefersReduced ? {} : { x: 12 }}
                    transition={{ duration: 0.3, ease: [0.22, 0.75, 0.18, 1] }}
                  >
                    {item.label}
                  </motion.a>
                </motion.div>
              ))}
            </nav>

            {/* Footer row */}
            <motion.div
              className="pnav-menu__footer"
              variants={prefersReduced ? {} : menuItemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.5, delay: 0.46, ease: [0.22, 0.75, 0.18, 1] }}
            >
              <p className="pnav-menu__tagline">
                Independent production partner<br />
                <span>Est. 2022 · Kampala, Uganda</span>
              </p>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); navigate('#contact'); }}
                className="pnav-menu__contact-cta"
              >
                Start a project <span aria-hidden="true">→</span>
              </a>
            </motion.div>

            {/* Scene label */}
            <motion.div
              className="pnav-menu__scene-label"
              aria-hidden="true"
              variants={prefersReduced ? {} : { closed: { opacity: 0 }, open: { opacity: 1 } }}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              Navigation
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
