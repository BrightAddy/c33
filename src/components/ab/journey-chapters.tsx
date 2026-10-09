import { useEffect, useRef } from "react";

import { abChapters } from "@/ab-chapters";

const FADE = 0.035;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Chapter copy laid over the scroll film. Opacity/transform are written
 * straight to the DOM from a rAF-throttled scroll handler, never React state.
 */
export function JourneyChapters() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const wrap = root?.parentElement;
    if (!root || !wrap) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = Math.max(rect.height - vh, 1);
      const progress = clamp(-rect.top / span);

      // Hero overlay is in view while top is above bottom and bottom hasn't left screen
      const inView = rect.top < vh && rect.bottom > 0;
      root.style.visibility = inView ? "visible" : "hidden";

      // Smooth exit factor as hero section begins leaving the viewport
      const wrapExit = clamp(rect.bottom / (vh * 0.85));

      items.forEach((el, index) => {
        const chapter = abChapters[index];
        const enter = chapter.start < 0 ? 1 : clamp((progress - chapter.start) / FADE);
        const exit = chapter.final ? 1 : clamp((chapter.end - progress) / FADE);
        const o = Math.min(enter, exit) * (chapter.final ? wrapExit : 1);

        el.style.opacity = String(o);
        const yOffset = (1 - Math.min(enter, exit)) * 22 + (chapter.final ? (1 - wrapExit) * -35 : 0);
        el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        el.setAttribute("aria-hidden", o < 0.05 ? "true" : "false");
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ab-chapters" ref={rootRef}>
      {abChapters.map((chapter, index) => (
        <article
          className="ab-chapter"
          data-chapter={chapter.id}
          data-first={index === 0 ? "true" : undefined}
          key={chapter.id}
        >
          <p className="ab-eyebrow">
            <span>{chapter.num}</span>
            {chapter.eyebrow}
          </p>
          <h2 className="ab-headline">
            <span className="ab-light">{chapter.light}</span>
            <span className="ab-bold">{chapter.bold}</span>
          </h2>
          <p className="ab-copy">{chapter.body}</p>
          {chapter.final ? (
            <div className="ab-final">
              <p className="ab-company">
                AB MASSIVHAUS <span>GmbH &amp; Co. KG</span>
              </p>
              <a className="ab-cta" href="#kontakt">
                <span>PROJEKT STARTEN</span>
                <i aria-hidden="true">→</i>
              </a>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
