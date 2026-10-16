'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ── SCENE 03: Selected Work ──────────────────────────────────────────────────
// All section headings use Framer Motion whileInView — they trigger as the
// section scrolls into view, never on page load.
//
// Image reveals are intentionally unnoticeable: a simple opacity 0→1 fade
// (no curtain wipe, no scale, no clip-path). The image just quietly appears
// as the user arrives at it.
//
// Modal, filter, and IntersectionObserver logic is preserved unchanged.
// ────────────────────────────────────────────────────────────────────────────

type ProjectKey = 'featured' | 'documentary' | 'photography' | 'live' | 'design' | 'conference';

const projectData: Record<ProjectKey, {
  title: string; eyebrow: string; description: string; role: string; image: string; imageAlt: string;
}> = {
  featured:    { title: 'The experience, from every angle.',      eyebrow: '01 / FEATURED PROJECT',          description: 'A project-story template for an event or audiovisual production. The published version should explain the client brief, the audience and setting, the production approach, and what made the experience successful.', role: "Story structure: Brief → PENDA's role → Production details → Confirmed result.",                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80', imageAlt: 'Wide view of a professionally staged conference venue' },
  documentary: { title: 'Stories worth telling.',                 eyebrow: '02 / DOCUMENTARY',               description: 'A place for a verified documentary project, supported by approved stills and a concise account of the story, production approach, and people involved.',                                                              role: 'Story structure: Subject → Creative approach → Production → Confirmed impact.',                image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',  imageAlt: 'Cinema camera and film production setting' },
  photography: { title: 'Moments worth keeping.',                 eyebrow: '03 / PHOTOGRAPHY & VIDEOGRAPHY', description: 'A curated project entry for photography or video coverage, showing the range of moments and details captured during the assignment.',                                                                                 role: 'Story structure: Assignment → Coverage → Selected frames → Deliverables.',                    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80', imageAlt: 'Professional camera equipment ready for a shoot' },
  live:        { title: 'Every detail, brought together.',        eyebrow: '04 / LIVE PRODUCTION',          description: "A project entry for live production, streaming, or audiovisual delivery. Show the real production environment and explain PENDA's confirmed responsibilities.",                                                      role: 'Story structure: Event format → Technical requirements → Production approach → Outcome.',       image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80', imageAlt: 'Speaker on a stage at a live event' },
  design:      { title: 'Ideas with a visual point of view.',     eyebrow: '05 / GRAPHIC DESIGN',           description: 'A visual case study for an approved graphic design assignment, showing the brief, the visual system, and where the work was used.',                                                                                    role: 'Story structure: Communication goal → Design direction → Applications → Result.',               image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80', imageAlt: 'Creative studio workspace with visual design materials' },
  conference:  { title: 'Designed around the people in the room.',eyebrow: '06 / EVENT EXPERIENCE',         description: 'A project entry for event planning and execution, focusing on the guest experience and the details that helped the event run smoothly.',                                                                               role: 'Story structure: Event goal → Planning → On-site execution → Confirmed result.',                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80', imageAlt: 'Conference attendees participating in a professional event' },
};

type FilterValue = 'all' | 'events' | 'film' | 'visual';

const C = {
  accent:  'var(--s3-accent)',
  bg:      'var(--s3-bg)',
  surface: 'var(--s3-surface)',
  text:    'var(--s3-ink)',
  muted:   'var(--s3-muted)',
  line:    'var(--s3-line)',
};

// Shared ease used throughout scene 03 reveals
const EASE = [0.2, 0.75, 0.2, 1] as const;

// Title reveal — used for every section heading in this scene.
// Fires once when the element enters the viewport on scroll.
const TITLE_VARIANTS = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function Scene3Work() {
  const sectionRef     = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [modalProject, setModalProject] = useState<ProjectKey | null>(null);
  const lastFocusRef   = useRef<HTMLElement | null>(null);

  // Intersection-based reveal for text blocks (unchanged)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('scene3-visible'); observer.unobserve(e.target); } }); },
      { threshold: 0.12 }
    );
    sectionRef.current?.querySelectorAll('.scene3-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalProject]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && modalProject) closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalProject]);

  const openModal  = (key: ProjectKey, trigger: HTMLElement) => { lastFocusRef.current = trigger; setModalProject(key); };
  const closeModal = () => { setModalProject(null); lastFocusRef.current?.focus(); };
  const isHidden   = (cat: FilterValue) => activeFilter !== 'all' && activeFilter !== cat;

  return (
    <>
      <section
        id="work"
        ref={sectionRef}
        style={{ background: C.bg, color: C.text, fontFamily: '"DM Sans", var(--font-sans), sans-serif' }}
        aria-label="Selected work"
      >
        {/* ── Hero header ────────────────────────────────────────────────── */}
        <div
          style={{
            minHeight: '65vh', display: 'flex', alignItems: 'flex-end',
            padding: 'clamp(130px,15vw,190px) clamp(20px,8.3vw,132px) 78px',
            position: 'relative', background: 'var(--s3-hdr-bg)',
          }}
        >
          {/* Orbit decorations */}
          <div aria-hidden="true" style={{ position: 'absolute', right: '9%', top: '19%', width: 'min(29vw,390px)', aspectRatio: '1', border: `1px solid ${C.line}`, borderRadius: '50%', opacity: .65, pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', right: 'calc(9% + 34px)', top: 'calc(19% + 34px)', width: 'calc(min(29vw,390px) - 68px)', aspectRatio: '1', border: `1px dashed ${C.line}`, borderRadius: '50%', opacity: .6, animation: 'scene3-orbit 45s linear infinite', pointerEvents: 'none' }}>
            <span className="scene3-orbit-dot" style={{ position: 'absolute', top: '12%', right: '15%', width: '9px', height: '9px', borderRadius: '50%', background: C.accent, display: 'block' }} />
          </div>

          <div style={{ maxWidth: '930px', position: 'relative', zIndex: 1 }}>
            {/* Eyebrow — CSS reveal */}
            <div className="scene3-reveal" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px', fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.accent, display: 'block' }} />
              A SELECTION OF OUR WORK — 2022 / NOW
            </div>

            {/* Section heading — whileInView, scroll-triggered */}
            <motion.h1
              variants={TITLE_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ font: `500 clamp(48px,8.3vw,118px)/.98 "Manrope", var(--font-manrope), sans-serif`, letterSpacing: '-.075em', marginBottom: '26px' }}
            >
              Ideas made real.<br />
              <span style={{ color: C.muted }}>Experiences made memorable.</span>
            </motion.h1>

            <div className="scene3-reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '28px', flexWrap: 'wrap' }}>
              <p style={{ maxWidth: '455px', color: C.muted, fontSize: 'clamp(15px,1.35vw,18px)', lineHeight: 1.7, margin: 0 }}>
                From live experiences to stories told through the lens, every project begins with an idea worth bringing to life.
              </p>
              <a href="#work-gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 700, borderBottom: `1px solid ${C.text}`, paddingBottom: '9px', whiteSpace: 'nowrap', color: C.text, transition: 'gap .3s, color .3s' }}>
                Explore selected work <span style={{ fontSize: '18px', lineHeight: '10px' }}>↘</span>
              </a>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: C.line, margin: '0 clamp(20px,8.3vw,132px)' }} />

        {/* ── Work gallery ──────────────────────────────────────────────── */}
        <div id="work-gallery" style={{ padding: '50px clamp(20px,8.3vw,132px) 120px' }}>

          {/* Filter toolbar */}
          <div className="scene3-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: C.muted }}>
              A CLOSER LOOK <span style={{ color: C.accent }}>/</span> PROJECT INDEX
            </div>
            <div role="group" aria-label="Filter projects" style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {(['all', 'events', 'film', 'visual'] as FilterValue[]).map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`scene3-filter-btn${activeFilter === f ? ' scene3-filter-btn--active' : ''}`}>
                  {f === 'all' ? 'All work' : f === 'events' ? 'Events' : f === 'film' ? 'Film & video' : 'Visuals'}
                </button>
              ))}
            </div>
          </div>

          {/* Featured project */}
          {!isHidden('events') && (
            <article
              className="scene3-reveal"
              data-category="events"
              style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(260px,.7fr)', gap: 'clamp(22px,4vw,58px)', alignItems: 'end', marginBottom: 'clamp(80px,11vw,160px)' }}
            >
              <button
                onClick={(e) => openModal('featured', e.currentTarget)}
                className="scene3-img-btn"
                style={{ aspectRatio: '1.35', position: 'relative', background: C.surface }}
                aria-label="Open featured project details"
              >
                {/*
                  Image reveal: opacity 0 → 1 only. No scale, no clip-path.
                  Fires once when the button enters the viewport on scroll.
                  The CSS hover transform on the img is managed separately by
                  .scene3-img-btn:hover img — no conflict.
                */}
                <motion.img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80"
                  alt="Wide view of a professionally staged conference venue"
                  loading="eager"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s cubic-bezier(.2,.75,.2,1)' }}
                />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 52%,rgba(10,10,18,.38))', opacity: .75, pointerEvents: 'none' }} />
                <span style={{ position: 'absolute', zIndex: 1, bottom: '17px', left: '18px', color: '#fff', fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                  Illustrative visual · Replace with approved PENDA work
                </span>
              </button>

              <div style={{ padding: '0 0 5px' }}>
                <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', color: C.muted, marginBottom: '20px' }}>01 / FEATURED PROJECT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: C.muted, fontFamily: 'var(--font-mono), monospace', fontSize: '10px' }}>
                  <span style={{ width: '24px', height: '1px', background: C.accent, display: 'block' }} />
                  EVENTS · AUDIOVISUAL · PRODUCTION
                </div>
                {/* Featured heading — whileInView scroll trigger */}
                <motion.h2
                  variants={TITLE_VARIANTS}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                  transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
                  style={{ font: `500 clamp(34px,4vw,58px)/1.03 "Manrope", var(--font-manrope), sans-serif`, letterSpacing: '-.06em', marginBottom: '18px' }}
                >
                  The experience,<br />from every angle.
                </motion.h2>
                <p style={{ color: C.muted, lineHeight: 1.7, fontSize: '14px' }}>
                  A project story should show more than the final image. It should reveal the brief, the details that mattered, and how PENDA brought the experience together.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', margin: '23px 0 30px' }}>
                  {['Event production', 'AV', 'Photography'].map((t) => (
                    <span key={t} style={{ border: `1px solid ${C.line}`, padding: '7px 10px', borderRadius: '999px', fontSize: '10px', color: C.muted }}>{t}</span>
                  ))}
                </div>
                <button onClick={(e) => openModal('featured', e.currentTarget)} className="scene3-proj-link">
                  Explore project <span style={{ fontSize: '18px', lineHeight: '10px' }}>↗</span>
                </button>
              </div>
            </article>
          )}

          {/* Gallery heading — whileInView scroll trigger */}
          <div className="scene3-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', marginBottom: '35px', flexWrap: 'wrap' }}>
            <motion.h2
              variants={TITLE_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -6% 0px' }}
              transition={{ duration: 0.78, ease: EASE }}
              style={{ font: `500 clamp(34px,4vw,58px)/1.03 "Manrope", var(--font-manrope), sans-serif`, letterSpacing: '-.06em', maxWidth: '500px', marginBottom: 0 }}
            >
              Different briefs.<br /><span style={{ color: C.muted }}>One thoughtful approach.</span>
            </motion.h2>
            <p style={{ maxWidth: '270px', color: C.muted, lineHeight: 1.6, fontSize: '13px', margin: 0 }}>
              A curated collection of moments, stories, and visual ideas—each with its own purpose.
            </p>
          </div>

          {/* 2-column gallery */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(36px,7vw,100px) clamp(18px,4vw,58px)', alignItems: 'start' }} className="scene3-gallery">
            <GalleryProject hidden={isHidden('film')}   marginTop="0"                         aspectRatio=".84"  index="02 / DOCUMENTARY"             title="Stories worth telling."              desc="Real people, meaningful perspectives, and stories shaped with care."                                                                    metaLabel="Film & storytelling"   projectKey="documentary" img="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80"  imgAlt="Cinema camera and film production setting"                   revealDelay={0}    onOpen={openModal} />
            <GalleryProject hidden={isHidden('visual')} marginTop="clamp(70px,11vw,155px)"    aspectRatio="1.25" index="03 / PHOTOGRAPHY & VIDEOGRAPHY" title="Moments worth keeping."              desc="Thoughtful framing and considered coverage, from the main moment to the details around it."                                             metaLabel="Photo & motion"        projectKey="photography" img="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80" imgAlt="Professional camera equipment ready for a shoot"              revealDelay={0.12} onOpen={openModal} />
            <GalleryProject hidden={isHidden('events')} marginTop="-10px"                     aspectRatio="1.05" index="04 / LIVE PRODUCTION"           title="Every detail, brought together."     desc="People, equipment, timing, and technology working together behind a seamless experience."                                               metaLabel="Live events & streaming" projectKey="live"       img="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80" imgAlt="Speaker on a stage at a live event"                           revealDelay={0.06} onOpen={openModal} />
            <GalleryProject hidden={isHidden('visual')} marginTop="clamp(30px,6vw,85px)"      aspectRatio="1.25" index="05 / GRAPHIC DESIGN"            title="Ideas with a visual point of view."  desc="A visual language that gives a message clarity, character, and consistency."                                                            metaLabel="Design & art direction" projectKey="design"     img="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80" imgAlt="Creative studio workspace with visual design materials"        revealDelay={0.18} onOpen={openModal} />
          </div>

          {/* Wide project 06 */}
          {!isHidden('events') && (
            <article className="scene3-reveal" data-category="events" style={{ width: '82%', margin: 'clamp(20px,5vw,70px) auto 0' }}>
              <button
                className="scene3-img-btn"
                style={{ aspectRatio: '1.8', background: C.surface, position: 'relative' }}
                onClick={(e) => openModal('conference', e.currentTarget)}
                aria-label="Open conference project details"
              >
                <motion.img
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80"
                  alt="Conference attendees participating in a professional event"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 1s cubic-bezier(.2,.75,.2,1)' }}
                />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 52%,rgba(10,10,18,.38))', opacity: .75, pointerEvents: 'none' }} />
                <span style={{ position: 'absolute', zIndex: 1, bottom: '17px', left: '18px', color: '#fff', fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase' }}>Illustrative visual</span>
              </button>
              <div style={{ paddingTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: C.muted, fontFamily: 'var(--font-mono), monospace', fontSize: '10px' }}>
                  <span style={{ width: '24px', height: '1px', background: C.accent, display: 'block' }} />
                  06 / EVENT EXPERIENCE
                </div>
                <h3 style={{ font: `600 clamp(21px,2.4vw,31px)/1.1 "Manrope", var(--font-manrope), sans-serif`, letterSpacing: '-.045em', marginBottom: '10px' }}>
                  Designed around the people in the room.
                </h3>
                <p style={{ color: C.muted, fontSize: '13px', lineHeight: 1.7, marginBottom: '14px', maxWidth: '430px' }}>
                  Every successful event is a series of details that work together for the people attending it.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono), monospace', letterSpacing: '.08em', textTransform: 'uppercase', fontSize: '10px', color: C.muted }}>Planning & execution</span>
                  <button onClick={(e) => openModal('conference', e.currentTarget)} className="scene3-proj-link">
                    View story <span style={{ fontSize: '18px', lineHeight: '10px' }}>↗</span>
                  </button>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* ── Project modal ──────────────────────────────────────────────────── */}
      {modalProject && (
        <div
          role="dialog" aria-modal="true" aria-labelledby="scene3-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px', background: 'rgba(8,8,14,.68)', backdropFilter: 'blur(10px)', animation: 'scene3-fadeIn .25s ease both' }}
        >
          <div style={{ width: 'min(760px,100%)', maxHeight: 'min(88vh,900px)', overflow: 'auto', background: C.bg, color: C.text, border: `1px solid ${C.line}`, borderRadius: '12px', boxShadow: '0 24px 80px rgba(31,25,42,.12)' }}>
            <div style={{ aspectRatio: '16/8', overflow: 'hidden', background: C.surface }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={projectData[modalProject].image} alt={projectData[modalProject].imageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: 'clamp(22px,5vw,42px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono), monospace', letterSpacing: '.08em', textTransform: 'uppercase', fontSize: '10px', color: C.muted }}>{projectData[modalProject].eyebrow}</span>
                <button onClick={closeModal} autoFocus className="scene3-modal-close" aria-label="Close project details">×</button>
              </div>
              <h2 id="scene3-modal-title" style={{ font: `500 clamp(34px,4vw,58px)/1.03 "Manrope", var(--font-manrope), sans-serif`, letterSpacing: '-.06em', margin: '18px 0' }}>{projectData[modalProject].title}</h2>
              <p style={{ color: C.muted, lineHeight: 1.75 }}>{projectData[modalProject].description}</p>
              <p style={{ color: C.muted, lineHeight: 1.75 }}>{projectData[modalProject].role}</p>
              <p style={{ fontSize: '10px', borderTop: `1px solid ${C.line}`, paddingTop: '15px', marginTop: '22px', color: C.muted }}>
                Prototype note: illustrative placeholder copy. Replace with a verified PENDA project, approved imagery, the actual brief, PENDA&apos;s confirmed role, and real outcomes before publishing.
              </p>
              <a href="https://wa.me/256775408295?text=Hello%20PENDA%20Agency%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noreferrer" className="scene3-proj-link">
                Discuss a project <span style={{ fontSize: '18px', lineHeight: '10px' }}>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Gallery project card ─────────────────────────────────────────────────────
// revealDelay: stagger offset (seconds) so adjacent images don't all fade in
// at the exact same moment as you scroll the grid into view.
function GalleryProject({
  hidden, marginTop, aspectRatio, index, title, desc, metaLabel, projectKey, img, imgAlt, onOpen, revealDelay,
}: {
  hidden: boolean; marginTop: string; aspectRatio: string; index: string; title: string; desc: string;
  metaLabel: string; projectKey: ProjectKey; img: string; imgAlt: string;
  onOpen: (key: ProjectKey, el: HTMLElement) => void; revealDelay: number;
}) {
  if (hidden) return null;

  return (
    <article className="scene3-reveal" style={{ minWidth: 0, marginTop }}>
      <button
        className="scene3-img-btn"
        style={{ aspectRatio, background: C.surface, position: 'relative' }}
        onClick={(e) => onOpen(projectKey, e.currentTarget)}
        aria-label={`Open ${title} project details`}
      >
        {/*
          Subtle opacity fade — the only image reveal used in this scene.
          Starts at 0, reaches 1 as the card scrolls into view.
          revealDelay staggers adjacent cards so the gallery reads sequentially.
          The CSS hover transform (.scene3-img-btn:hover img) runs independently.
        */}
        <motion.img
          loading="lazy"
          src={img}
          alt={imgAlt}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -6% 0px' }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: revealDelay }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 1s cubic-bezier(.2,.75,.2,1)' }}
        />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 52%,rgba(10,10,18,.38))', opacity: .75, pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', zIndex: 1, bottom: '17px', left: '18px', color: '#fff', fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Illustrative visual
        </span>
      </button>
      <div style={{ paddingTop: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: C.muted, fontFamily: 'var(--font-mono), monospace', fontSize: '10px' }}>
          <span style={{ width: '24px', height: '1px', background: C.accent, display: 'block' }} />
          {index}
        </div>
        {/* Card heading — whileInView, fires as card enters viewport on scroll */}
        <motion.h3
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -6% 0px' }}
          transition={{ duration: 0.65, ease: EASE, delay: revealDelay + 0.08 }}
          style={{ font: `600 clamp(21px,2.4vw,31px)/1.1 "Manrope", var(--font-manrope), sans-serif`, letterSpacing: '-.045em', marginBottom: '10px' }}
        >
          {title}
        </motion.h3>
        <p style={{ color: C.muted, fontSize: '13px', lineHeight: 1.7, marginBottom: '14px', maxWidth: '430px' }}>{desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
          <span style={{ fontFamily: 'var(--font-mono), monospace', letterSpacing: '.08em', textTransform: 'uppercase', fontSize: '10px', color: C.muted }}>{metaLabel}</span>
          <button onClick={(e) => onOpen(projectKey, e.currentTarget)} className="scene3-proj-link">
            View story <span style={{ fontSize: '18px', lineHeight: '10px' }}>↗</span>
          </button>
        </div>
      </div>
    </article>
  );
}
