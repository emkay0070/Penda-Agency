"use client";

import { useEffect, useState } from "react";

export default function ConceptBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  /* Show the modal on every page load (no session storage — intentional) */
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 320);
    return () => clearTimeout(timer);
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
      {/* ── Full-screen overlay ──────────────────────────────────────────── */}
      {visible && (
        <div
          className={`concept-overlay${closing ? " concept-overlay--exit" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Penda Agency — Concept Presentation"
        >
          {/* Decorative noise grain */}
          <div className="concept-grain" aria-hidden="true" />

          {/* Accent orbs */}
          <div className="concept-orb concept-orb--a" aria-hidden="true" />
          <div className="concept-orb concept-orb--b" aria-hidden="true" />

          <div className="concept-card">
            {/* Eyebrow */}
            <p className="concept-eyebrow">Confidential Concept — 2026</p>

            {/* Greeting */}
            <h1 className="concept-greeting">
              Hello,{" "}
              <span className="concept-greeting__name">Penda&nbsp;Team</span>
              <span className="concept-greeting__wave" aria-hidden="true">👋</span>
            </h1>

            {/* Body */}
            <p className="concept-body">
              This is the <strong>Penda Agency concept</strong> — a reimagined
              digital experience crafted exclusively for you.
            </p>

            {/* Byline */}
            <p className="concept-byline">
              Presented to you by{" "}
              <span className="concept-byline__author">Emkay</span>
            </p>

            {/* CTA */}
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

      {/* ── Persistent mini-ribbon (shown after dismiss) ─────────────────── */}
      {dismissed && (
        <div
          className="concept-ribbon"
          title="Penda Agency concept by Emkay"
          aria-label="Concept by Emkay"
        >
          <span className="concept-ribbon__dot" aria-hidden="true" />
          <span className="concept-ribbon__text">Concept by Emkay</span>
        </div>
      )}
    </>
  );
}
