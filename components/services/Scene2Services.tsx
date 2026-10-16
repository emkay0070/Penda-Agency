'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

// ── SCENE 02: Our Services ───────────────────────────────────────────────────
//
// This component is a faithful replica of penda-scene2.html.
//
// Part A — Capsule cloud
//   Pure CSS animation (scene2-capsuleFall keyframe in globals.css).
//   The capsule wrapper gains class "scene2-playing" when the section enters
//   the viewport (useInView), triggering the animation exactly as the HTML
//   does on page-load — same keyframe, same timing, same per-capsule delays.
//
//   --cx / --cy / --cr are set as inline CSS custom properties on each span.
//   The 64% keyframe uses calc(var(--cr)*-.18) for the pendulum counter-swing,
//   so each capsule's intermediate rotation is unique to its starting angle.
//
// Part B — Pinned horizontal journey (unchanged scroll logic)
// ────────────────────────────────────────────────────────────────────────────

// Exact positions, rotations and labels from penda-scene2.html
// --cx / --cy: starting translate offset  --cr: starting rotation
const CAPSULES = [
  { label: 'Events Management',   invert: true,  cx: '-70vw', cy: '-65vh', cr: '-25deg' },
  { label: 'Live Streaming',      invert: false, cx:  '70vw', cy: '-45vh', cr:  '30deg' },
  { label: 'AV Equipment',        invert: false, cx: '-45vw', cy:  '60vh', cr:  '22deg' },
  { label: 'Documentary',         invert: true,  cx:  '55vw', cy: '-70vh', cr: '-35deg' },
  { label: 'Photography & Video', invert: false, cx:  '80vw', cy:  '40vh', cr:  '18deg' },
  { label: 'Graphic Design',      invert: false, cx: '-65vw', cy: '-30vh', cr:  '38deg' },
] as const;

// Exact slide content from penda-scene2.html
const SLIDES = [
  { meta: '01 / Events',          title: 'Make the\nmoment.',              desc: 'Thoughtfully planned, beautifully executed events that bring people together and make every detail count.',                                           link: 'Explore event management', img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=2200&q=85', alt: 'Concert stage with colourful lighting' },
  { meta: '02 / Live connection', title: 'Bring everyone\ninto the room.',  desc: 'Professional live streaming and video conferencing that connect audiences wherever they are.',                                                        link: 'Explore live streaming',   img: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=2200&q=85', alt: 'Live streaming camera at a professional event' },
  { meta: '03 / Audiovisual',     title: 'The power\nbehind the scene.',   desc: 'Reliable audiovisual equipment and production support that help every message land with clarity.',                                                      link: 'Explore AV solutions',     img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=2200&q=85', alt: 'Radio studio mixing desk with headphones' },
  { meta: '04 / Documentary',     title: 'Stories worth\nremembering.',    desc: 'Documentary films that find the human story, capture real perspectives, and leave something meaningful behind.',                                        link: 'Explore documentaries',    img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2200&q=85', alt: 'Cinema camera on a film set' },
  { meta: '05 / Image & motion',  title: 'Keep the\nfeeling.',             desc: 'Photography, videography, and editing that turn fleeting moments into lasting impressions.',                                                            link: 'Explore photo & video',    img: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=2200&q=85', alt: 'Photographer at work at a professional shoot' },
  { meta: '06 / Graphic design',  title: 'Make ideas\nvisible.',           desc: 'Distinctive visual design that gives ideas a voice, a form, and a place in the world.',                                                                link: 'Explore graphic design',   img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=2200&q=85', alt: 'Graphic designer working with colour swatches' },
];

// Ease shared by text reveal transitions — matches HTML --ease variable
const EASE = [0.2, 0.75, 0.2, 1] as const;

export default function Scene2Services() {
  // Part A
  const cloudWrapRef  = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Add "scene2-playing" to the capsule wrapper when section enters viewport.
  // This triggers the CSS fall-in animation exactly as the HTML does on load.
  const inView = useInView(cloudWrapRef, { once: true, margin: '0px 0px -8% 0px' });

  // For text reveals — derived from inView so they share the same trigger
  const shouldReveal = inView || !!prefersReduced;

  // Part B refs
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const fillRef    = useRef<HTMLSpanElement>(null);
  const countRef   = useRef<HTMLSpanElement>(null);

  // ── Part B: scroll-linked horizontal journey (exact from reference HTML) ──
  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    const fill    = fillRef.current;
    const count   = countRef.current;
    if (!section || !track) return;

    const slides = [...section.querySelectorAll<HTMLElement>('.penda-service-slide')];
    let ticking = false;

    const update = () => {
      const rect      = section.getBoundingClientRect();
      const maxTravel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress  = Math.max(0, Math.min(1, -rect.top / maxTravel));
      const distance  = Math.max(0, track.scrollWidth - window.innerWidth);

      track.style.transform = `translate3d(${-distance * progress}px,0,0)`;

      const index = Math.min(slides.length - 1, Math.floor(progress * slides.length));
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));

      if (fill)  fill.style.height  = `${Math.max(16.666, progress * 100)}%`;
      if (count) count.textContent  = `${String(index + 1).padStart(2, '0')} — ${String(slides.length).padStart(2, '0')}`;
      ticking = false;
    };

    const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      {/* ── PART A: Capsule intro + heading ──────────────────────────────────── */}
      <section
        id="services"
        aria-labelledby="services-heading"
        style={{
          position: 'relative',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '130px 24px 70px',
          isolation: 'isolate',
          overflow: 'hidden',
          // Exact radial gradient from reference HTML (light mode)
          background: 'radial-gradient(ellipse at 52% 36%,rgba(180,158,225,.18),transparent 38%),radial-gradient(ellipse at 80% 78%,rgba(215,190,166,.2),transparent 32%),var(--bg)',
        }}
      >
        {/* Grain overlay — exact from reference HTML */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: -1, opacity: .17,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.14'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ width: 'min(1050px,100%)', textAlign: 'center', position: 'relative' }}>

          {/* Eyebrow — delay: 0.35s (from HTML: animation:rise .8s .35s) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={shouldReveal ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              textTransform: 'uppercase',
              letterSpacing: '.22em',
              fontSize: '10px',
              color: 'var(--s2a-muted)',
              margin: '0 0 20px',
            }}
          >
            Ideas into experiences / 01—06
          </motion.p>

          {/*
            Capsule stage — exact dimensions from HTML.
            The wrapper ref is the IntersectionObserver anchor.
            "scene2-playing" class triggers the CSS fall-in animation.
            CSS handles all animation, delays, and keyframe logic.
          */}
          <div
            aria-label="PENDA's six service areas"
            style={{
              height: 'clamp(210px,28vh,310px)',
              maxWidth: '920px',
              margin: '16px auto 0',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              ref={cloudWrapRef}
              className={inView ? 'scene2-playing' : ''}
              style={{
                width: 'min(840px,100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                position: 'relative',
                padding: '12px 8px',
              }}
            >
              {CAPSULES.map((cap) => (
                <span
                  key={cap.label}
                  className="scene2-capsule"
                  style={{
                    // CSS custom properties consumed by scene2-capsuleFall keyframe
                    '--cx': cap.cx,
                    '--cy': cap.cy,
                    '--cr': cap.cr,
                    // Visual styles — matching reference HTML .capsule rule
                    border: cap.invert ? '1px solid transparent' : '1px solid var(--cap-border)',
                    borderRadius: '999px',
                    padding: '15px 20px',
                    minHeight: '48px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap',
                    background: cap.invert ? 'var(--cap-i-bg)' : 'var(--cap-n-bg)',
                    backdropFilter: cap.invert ? 'none' : 'blur(14px)',
                    fontSize: 'clamp(10px,1vw,12px)',
                    fontWeight: 600,
                    letterSpacing: '-.02em',
                    color: cap.invert ? 'var(--cap-i-text)' : 'var(--cap-n-text)',
                    willChange: 'transform',
                    cursor: 'default',
                  } as React.CSSProperties}
                >
                  {/* Dot: #b7a6f0 for inverted, var(--purple) for normal */}
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: cap.invert ? '#b7a6f0' : 'var(--s2a-accent)',
                    flexShrink: 0, display: 'block', flex: '0 0 auto',
                  }} />
                  {cap.label}
                </span>
              ))}
            </div>
          </div>

          {/*
            "Our Services." heading
            font: Manrope (matching reference HTML body/heading font)
            Delay 2.0s — appears after the last capsule has landed.
            (Last capsule: 0.68s delay + 1.25s duration = 1.93s)
          */}
          <motion.h1
            id="services-heading"
            initial={{ opacity: 0, y: 22 }}
            animate={shouldReveal ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 2.0, ease: EASE }}
            style={{
              fontSize: 'clamp(42px,7vw,94px)',
              letterSpacing: '-.085em',
              lineHeight: .98,
              fontWeight: 600,
              margin: 0,
              fontFamily: 'var(--font-manrope), Manrope, sans-serif',
              color: 'var(--s2a-ink)',
            }}
          >
            Our Services<span style={{ color: 'var(--s2a-accent)' }}>.</span>
          </motion.h1>

          {/* Supporting copy — delay 2.25s */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={shouldReveal ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 2.25, ease: EASE }}
            style={{
              maxWidth: '560px',
              margin: '20px auto 0',
              fontSize: 'clamp(13px,1.3vw,16px)',
              lineHeight: 1.8,
              color: 'var(--s2a-muted)',
            }}
          >
            From the first idea to the final frame, we bring creativity, people, and technology together to make things happen.
          </motion.p>

          {/* Scroll cue — delay 3.1s, pulse-line animation loops indefinitely */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={shouldReveal ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 3.1, ease: EASE }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '12px',
              color: 'var(--s2a-muted)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '10px',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{
              width: '42px', height: '1px',
              background: 'var(--s2a-accent)',
              display: 'block',
              transformOrigin: 'left',
              animation: 'scene2-pulseLine 2s 3.5s ease-in-out infinite',
            }} />
            <span>Scroll to explore</span>
            <span>↓</span>
          </motion.div>

        </div>
      </section>

      {/* ── PART B: Pinned horizontal journey ────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{ height: '600vh', position: 'relative', background: '#080811', color: '#fff' }}
        aria-label="Explore PENDA services horizontally"
      >
        <div style={{ height: '100svh', position: 'sticky', top: 0, overflow: 'hidden', isolation: 'isolate' }}>

          {/* Keep scrolling hint */}
          <div style={{
            position: 'absolute',
            left: 'clamp(28px,6vw,86px)', top: 'clamp(84px,12vh,130px)',
            zIndex: 4,
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,.68)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ width: '22px', height: '1px', background: '#b8a7f3', display: 'block' }} />
            Keep scrolling to explore <span>↘</span>
          </div>

          {/* Scrolling track */}
          <div
            ref={trackRef}
            style={{
              height: '100%',
              width: `${SLIDES.length * 100}%`,
              display: 'flex',
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
            }}
          >
            {SLIDES.map((slide, i) => (
              <article
                key={slide.meta}
                className={`penda-service-slide${i === 0 ? ' active' : ''}`}
                style={{
                  height: '100%',
                  width: `${100 / SLIDES.length}%`,
                  flex: `0 0 ${100 / SLIDES.length}%`,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 'clamp(28px,6vw,86px)',
                  isolation: 'isolate',
                }}
              >
                {/* Background image — uses .penda-slide-bg for the scale transition */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="penda-slide-bg"
                  src={slide.img}
                  alt=""
                  aria-hidden="true"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Gradient overlay — matches reference HTML ::after */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute', inset: 0, zIndex: -1,
                    background: 'linear-gradient(90deg,rgba(5,5,12,.82) 0%,rgba(5,5,12,.4) 48%,rgba(5,5,12,.06) 100%),linear-gradient(0deg,rgba(5,5,12,.64),transparent 60%)',
                  }}
                />

                {/* Slide content — opacity + translateY transition via CSS */}
                <div className="penda-slide-content" style={{ maxWidth: '760px', position: 'relative', paddingBottom: 'clamp(22px,5vh,64px)' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px',
                    fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase',
                    fontSize: '10px', letterSpacing: '.18em', color: 'rgba(255,255,255,.7)',
                  }}>
                    <span style={{ height: '1px', width: '36px', background: '#b7a6f0', display: 'block' }} />
                    <span>{slide.meta}</span>
                  </div>
                  <h2 style={{
                    fontSize: 'clamp(42px,7.6vw,112px)',
                    fontWeight: 600, lineHeight: .94, letterSpacing: '-.085em',
                    maxWidth: '900px', margin: 0,
                    fontFamily: 'var(--font-manrope), Manrope, sans-serif',
                    whiteSpace: 'pre-line',
                  }}>
                    {slide.title}
                  </h2>
                  <p style={{
                    fontSize: 'clamp(14px,1.35vw,17px)',
                    lineHeight: 1.8, color: 'rgba(255,255,255,.78)',
                    maxWidth: '500px', margin: '22px 0 28px',
                  }}>
                    {slide.desc}
                  </p>
                  <a href="#contact" className="penda-slide-link">
                    {slide.link} <span style={{ fontSize: '17px', lineHeight: '10px' }}>↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Progress indicator */}
          <aside
            style={{
              position: 'absolute', zIndex: 5,
              right: 'clamp(24px,4vw,60px)', top: '50%', transform: 'translateY(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              color: 'rgba(255,255,255,.72)',
              fontFamily: 'var(--font-mono), monospace', fontSize: '10px',
            }}
            aria-label="Service journey progress"
          >
            <span ref={countRef} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '.12em' }}>01 — 06</span>
            <span style={{ width: '2px', height: '100px', background: 'rgba(255,255,255,.22)', position: 'relative', overflow: 'hidden', display: 'block' }}>
              <span ref={fillRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '16.666%', background: '#b8a7f3', transformOrigin: 'top', transition: 'height .15s linear' }} />
            </span>
            <span style={{ writingMode: 'vertical-rl', letterSpacing: '.12em', textTransform: 'uppercase', fontSize: '9px' }}>Services</span>
          </aside>

          <span style={{
            position: 'absolute', right: 'clamp(28px,6vw,86px)', bottom: '28px', zIndex: 4,
            fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '.14em',
            color: 'rgba(255,255,255,.55)',
          }}>
            SCROLL ↔
          </span>
        </div>
      </section>
    </>
  );
}
