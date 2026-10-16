'use client';

import { useRef, useEffect, useState } from 'react';

// ── SCENE 01: The Cinematic Opening ─────────────────────────────────────────
// Faithfully reproduces penda-scene1.html as a React component.
// Hydration fix: theme vars are initialised with the light palette on both
// server and first client render; a single useEffect corrects them after mount
// so that SSR output and hydration always match.
// ─────────────────────────────────────────────────────────────────────────────

// Plain interface — no `as const` so light and dark are both assignable to ThemeVars
interface ThemeVars {
  bg:     string;
  ink:    string;
  muted:  string;
  glow:   string;
  line:   string;
  pill:   string;
  accent: string;
}

const LIGHT_VARS: ThemeVars = {
  bg:     '#f4f0e9',
  ink:    '#1c1b24',
  muted:  '#716b79',
  glow:   'rgba(163,130,235,.19)',
  line:   'rgba(28,27,36,.15)',
  pill:   'rgba(255,255,255,.62)',
  accent: '#344dff',
};

const DARK_VARS: ThemeVars = {
  bg:     '#101018',
  ink:    '#f6f2ff',
  muted:  '#b4aec4',
  glow:   'rgba(103,82,255,.2)',
  line:   'rgba(246,242,255,.18)',
  pill:   'rgba(25,24,38,.7)',
  accent: '#9ba6ff',
};

function getVars(theme: 'light' | 'dark' | 'system'): ThemeVars {
  if (theme === 'dark') return DARK_VARS;
  if (theme === 'light') return LIGHT_VARS;
  // system — safe to call only on client
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK_VARS;
  }
  return LIGHT_VARS;
}

const THEMES = ['system', 'light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

/** Writes data-theme="dark"|"light" to <html> so CSS vars update site-wide. */
function applyDocTheme(theme: Theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
}


export default function Hero() {
  // Always start with light so SSR and initial client render agree → no mismatch
  const [vars, setVars] = useState<ThemeVars>(LIGHT_VARS);
  const [themeIdx, setThemeIdx] = useState(0);
  const [filmVisible, setFilmVisible] = useState(false);
  const [introOut, setIntroOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // After mount: restore saved theme (or fall back to system preference)
  useEffect(() => {
    const saved = localStorage.getItem('penda-theme') as Theme | null;
    const initial: Theme = (saved && (THEMES as readonly string[]).includes(saved)) ? saved as Theme : 'system';
    const idx = THEMES.indexOf(initial);
    setThemeIdx(idx);
    const resolved = getVars(initial);
    setVars(resolved);
    applyDocTheme(initial);
  }, []);

  const revealFilm = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIntroOut(true);
    setFilmVisible(true);
  };

  const replayScene = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIntroOut(false);
    setFilmVisible(false);
    timerRef.current = setTimeout(revealFilm, 3300);
  };

  useEffect(() => {
    // Skip intro immediately for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroOut(true);
      setFilmVisible(true);
      return;
    }
    timerRef.current = setTimeout(revealFilm, 3300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cycleTheme = () => {
    const next = (themeIdx + 1) % THEMES.length;
    const theme: Theme = THEMES[next];
    setThemeIdx(next);
    setVars(getVars(theme));
    // Trigger CSS transition on warm scenes briefly
    document.documentElement.classList.add('theme-switching');
    applyDocTheme(theme);
    localStorage.setItem('penda-theme', theme);
    setTimeout(() => document.documentElement.classList.remove('theme-switching'), 500);
  };

  const ease = 'cubic-bezier(.22,.75,.18,1)';

  return (
    <section
      id="home"
      aria-label="PENDA Agency cinematic homepage opening"
      style={{
        position: 'relative',
        minHeight: '100svh',
        overflow: 'hidden',
        isolation: 'isolate',
        background: `radial-gradient(ellipse at 78% 28%,${vars.glow},transparent 42%),
                     radial-gradient(ellipse at 18% 82%,rgba(217,177,231,.09),transparent 40%),
                     ${vars.bg}`,
        color: vars.ink,
        transition: `background 1.4s ${ease}, color 0.7s`,
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="penda-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', font: '600 12px var(--font-display), sans-serif', letterSpacing: '.09em', color: vars.ink }}>
          <span
            style={{
              width: '24px', height: '24px',
              border: `1px solid ${vars.line}`,
              display: 'grid', placeItems: 'center',
              borderRadius: '7px',
              color: vars.accent,
              font: '700 15px var(--font-display), sans-serif',
              transform: 'rotate(-7deg)',
            }}
          >P.</span>
          <span>PENDA AGENCY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <button
            onClick={cycleTheme}
            style={{
              border: `1px solid ${vars.line}`,
              background: vars.pill,
              color: vars.ink,
              borderRadius: '999px',
              padding: '9px 12px',
              font: '10px var(--font-mono), monospace',
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
            }}
            aria-label="Change color theme"
            type="button"
          >
            Theme: {THEMES[themeIdx].charAt(0).toUpperCase() + THEMES[themeIdx].slice(1)}
          </button>
        </div>
      </header>

      {/* ── Intro (animated logo) ────────────────────────────── */}
      <div
        aria-label="Animated PENDA introduction"
        aria-hidden={introOut}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          zIndex: 5,
          transition: `opacity 1.25s ${ease}, transform 1.25s ${ease}`,
          opacity: introOut ? 0 : 1,
          transform: introOut ? 'scale(1.025)' : 'scale(1)',
          pointerEvents: introOut ? 'none' : 'auto',
          background: `radial-gradient(ellipse at 50% 50%,${vars.glow},transparent 48%)`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '0 22px', maxWidth: '100vw' }}>
          {/* Animated mark */}
          <div className="penda-mark-wrap">
            <div
              aria-label="PENDA mark"
              style={{
                width: '100%', height: '100%',
                display: 'grid', placeItems: 'center',
                borderRadius: '29% 34% 28% 36%',
                background: 'linear-gradient(140deg,#5c6dff,#3348ec 57%,#7c62d8)',
                color: 'white',
                boxShadow: '0 22px 65px rgba(65,66,220,.25),inset 0 1px 1px rgba(255,255,255,.6)',
                font: 'bold clamp(54px,7vw,82px)/1 var(--font-display), sans-serif',
                letterSpacing: '-.12em',
                paddingRight: '.11em',
                transform: 'rotate(-9deg)',
                position: 'relative',
              }}
            >
              P.
              <span style={{ position: 'absolute', inset: '7px', border: '1px solid rgba(255,255,255,.34)', borderRadius: 'inherit', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Wordmark */}
          <div className="penda-wordmark" style={{ color: vars.ink }}>
            <strong>PENDA</strong>&nbsp;AGENCY
          </div>
        </div>

        {/* Caption */}
        <div className="penda-intro-caption" style={{ color: vars.muted }}>
          Ideas in motion · Kampala, Uganda
        </div>
      </div>

      {/* ── Film scene ───────────────────────────────────────── */}
      <div
        aria-label="Cinematic hero scene"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: filmVisible ? 1 : 0,
          transform: filmVisible ? 'scale(1)' : 'scale(1.035)',
          transition: `opacity 1.8s ${ease}, transform 2.4s ${ease}`,
          background: '#111',
        }}
      >
        {/*
          Illustrative stock footage from Pexels by Nino Souza.
          Replace with PENDA-approved footage before production.
          Source: https://www.pexels.com/video/cameraman-filming-a-live-show-2890196/
        */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1920&q=80"
          aria-label="Illustrative stock footage of a live event being filmed"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: .77,
            filter: 'saturate(.8) contrast(1.06)',
          }}
        >
          <source src="https://videos.pexels.com/video-files/2890196/2890196-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg,rgba(9,10,18,.7),rgba(9,10,18,.12) 75%),linear-gradient(0deg,rgba(7,8,14,.75),transparent 42%)',
            pointerEvents: 'none',
          }}
        />

        {/* Film content */}
        <div style={{ position: 'absolute', zIndex: 2, inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(26px,8vw,124px)', color: '#fff' }}>
          <div
            style={{
              font: '10px var(--font-mono), monospace',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.78)',
              opacity: filmVisible ? 1 : 0,
              transform: filmVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity .9s .25s, transform .9s .25s ${ease}`,
            }}
          >
            Independent production partner · Est. 2022 · Uganda
          </div>

          <h1
            style={{
              maxWidth: '780px',
              margin: '21px 0 0',
              font: `500 clamp(43px,6.5vw,88px)/.94 var(--font-display), sans-serif`,
              letterSpacing: '-.065em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ display: 'block', overflow: 'hidden', padding: '0 .08em .13em 0' }}>
              <span style={{ display: 'inline-block', transform: filmVisible ? 'translateY(0)' : 'translateY(115%)', transition: `transform 1.05s ${ease}` }}>WE MAKE</span>
            </span>
            <span style={{ display: 'block', overflow: 'hidden', padding: '0 .08em .13em 0' }}>
              <span style={{ display: 'inline-block', transform: filmVisible ? 'translateY(0)' : 'translateY(115%)', transition: `transform 1.05s .28s ${ease}`, color: '#c8c5ff' }}>THINGS HAPPEN.</span>
            </span>
          </h1>

          <p style={{ maxWidth: '390px', margin: '17px 0 0', fontSize: 'clamp(12px,1.05vw,14px)', lineHeight: 1.65, color: 'rgba(255,255,255,.78)', opacity: filmVisible ? 1 : 0, transform: filmVisible ? 'translateY(0)' : 'translateY(15px)', transition: `opacity .9s .8s, transform .9s .8s ${ease}` }}>
            From the first idea to the final cue, we bring the moving parts together.
          </p>
        </div>

        {/* Corner index */}
        <div style={{ position: 'absolute', right: 'clamp(26px,4vw,64px)', top: 'clamp(92px,12vh,130px)', zIndex: 3, color: 'rgba(255,255,255,.7)', font: '10px var(--font-mono), monospace', letterSpacing: '.13em', opacity: filmVisible ? 1 : 0, transition: 'opacity .8s 1.2s' }}>
          01 — The opening
        </div>

        {/* Film bottom */}
        <div
          style={{
            position: 'absolute', zIndex: 3,
            left: 'clamp(26px,4vw,64px)', right: 'clamp(26px,4vw,64px)',
            bottom: 'clamp(24px,4vh,44px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            gap: '20px',
            color: 'rgba(255,255,255,.75)',
            opacity: filmVisible ? 1 : 0,
            transition: 'opacity 1s 1.15s',
          }}
        >
          <div style={{ font: '9px/1.7 var(--font-mono), monospace', letterSpacing: '.14em', textTransform: 'uppercase' }}>
            Events / Audiovisual / Creative<br />Built around the moment.
          </div>
          <a
            href="#services"
            className="penda-scroll-link"
          >
            Scroll to discover
            <span style={{ width: '46px', height: '1px', background: 'rgba(255,255,255,.65)', display: 'block' }} />
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {/* ── Skip intro button ────────────────────────────────── */}
      <button
        onClick={revealFilm}
        type="button"
        style={{
          position: 'absolute',
          zIndex: 12,
          bottom: '26px',
          left: 'clamp(20px,4vw,64px)',
          border: `1px solid ${vars.line}`,
          background: vars.pill,
          color: vars.ink,
          borderRadius: '999px',
          padding: '9px 12px',
          font: '10px var(--font-mono), monospace',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          opacity: introOut ? 0 : 1,
          pointerEvents: introOut ? 'none' : 'auto',
          transition: 'opacity .3s',
        }}
      >
        Skip intro ↗
      </button>

      {/* ── Replay button ────────────────────────────────────── */}
      <button
        onClick={replayScene}
        type="button"
        style={{
          position: 'fixed',
          zIndex: 15,
          left: 'clamp(20px,4vw,64px)',
          bottom: '24px',
          border: `1px solid ${vars.line}`,
          background: vars.pill,
          color: vars.ink,
          borderRadius: '999px',
          padding: '9px 12px',
          font: '10px var(--font-mono), monospace',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          opacity: filmVisible ? 1 : 0,
          pointerEvents: filmVisible ? 'auto' : 'none',
          transition: 'opacity .5s',
        }}
      >
        ↺ Replay scene
      </button>
    </section>
  );
}
