"use client";

import { useEffect, useState } from "react";

export default function ConceptBanner() {
  const [visible,   setVisible]   = useState(false);
  const [closing,   setClosing]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 320);
    return () => clearTimeout(t);
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      setDismissed(true);
    }, 540);
  }

  return (
    <>
      {/* ── Full-screen intro overlay ─────────────────────────────────────── */}
      {visible && (
        <div
          className={`concept-overlay${closing ? " concept-overlay--exit" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Penda Agency — Concept Presentation"
        >
          <div className="concept-grain" aria-hidden="true" />
          <div className="concept-orb concept-orb--a" aria-hidden="true" />
          <div className="concept-orb concept-orb--b" aria-hidden="true" />

          <div className="concept-card">
            <p className="concept-eyebrow">Confidential Concept — 2026</p>

            <h1 className="concept-greeting">
              Hello,{" "}
              <span className="concept-greeting__name">Penda&nbsp;Team</span>
              <span className="concept-greeting__wave" aria-hidden="true">👋</span>
            </h1>

            <p className="concept-body">
              This is the <strong>Penda Agency concept</strong> — a reimagined
              digital experience crafted exclusively for you.
            </p>

            <p className="concept-byline">
              Presented to you by{" "}
              <span className="concept-byline__author">Emkay</span>
            </p>

            <button
              id="concept-enter-btn"
              className="concept-cta"
              onClick={handleClose}
              autoFocus
            >
              <span>Enter the Experience</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Persistent watermark badge (shown after dismiss) ───────────────── */}
      {dismissed && (
        <div className="concept-watermark" aria-label="This is a concept website by Emkay">
          <div className="concept-watermark__inner">
            {/* Pulse dot */}
            <span className="concept-watermark__dot" aria-hidden="true" />

            {/* Label stack */}
            <div className="concept-watermark__copy">
              <span className="concept-watermark__label">✦ Concept Website</span>
              <span className="concept-watermark__sub">
                Want this for your brand? <strong>Let's talk.</strong>
              </span>
            </div>

            {/* CTA link — opens a WhatsApp chat with Emkay */}
            <a
              href="https://wa.me/256780698341?text=Hello%20Emkay%2C%20I%27d%20like%20to%20start%20a%20project."
              target="_blank"
              rel="noreferrer"
              className="concept-watermark__cta"
              aria-label="Start your project with Emkay on WhatsApp"
            >
              Start your project
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
