import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "./scroll-scrub.css";

export interface ScrollScrubScene {
  id: string;
  label?: string;
  title?: string;
  body?: string;
  clip: string;
  mobileClip?: string;
  poster?: string;
  mobilePoster?: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
  scroll: number;
  linger?: number;
}

export interface ScrollScrubTheme {
  accent: string;
  background: string;
  ink: string;
  muted: string;
}

export interface ScrollScrubProps {
  scenes: ScrollScrubScene[];
  theme?: ScrollScrubTheme;
  className?: string;
}

export function ScrollScrub({ scenes, theme, className = "" }: ScrollScrubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 900;
    }
    return false;
  });

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const activeScene = scenes[activeSceneIndex] || scenes[0];

  // Calculate total viewport height span based on scene scroll multipliers
  const totalScrollVh = useMemo(() => {
    return scenes.reduce((sum, s) => sum + (s.scroll || 4), 0) * 100;
  }, [scenes]);

  // Mobile viewport listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine active clip URL - direct native streaming for mobile compatibility
  const targetClipUrl = useMemo(() => {
    if (!activeScene) return "";
    return isMobile && activeScene.mobileClip ? activeScene.mobileClip : activeScene.clip;
  }, [activeScene, isMobile]);

  // Determine active poster URL
  const posterUrl = useMemo(() => {
    if (!activeScene) return "";
    return isMobile && activeScene.mobilePoster ? activeScene.mobilePoster : activeScene.poster;
  }, [activeScene, isMobile]);

  // Imperatively prime the video element for mobile iOS Safari / Android Chrome
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Critical mobile WebKit properties
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    let isCancelled = false;

    // Boot mobile video decoder so it doesn't freeze on black screen
    const bootDecoder = () => {
      if (isCancelled || !video) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isCancelled && video) {
              video.pause();
              setIsVideoLoaded(true);
            }
          })
          .catch(() => {
            // Mobile autoplay policy may require interaction; still mark ready if data available
            if (video.readyState >= 2) {
              setIsVideoLoaded(true);
            }
          });
      }
    };

    video.addEventListener("loadeddata", bootDecoder, { once: true });
    video.addEventListener("canplay", bootDecoder, { once: true });

    if (video.readyState >= 2) {
      bootDecoder();
    }

    return () => {
      isCancelled = true;
      video.removeEventListener("loadeddata", bootDecoder);
      video.removeEventListener("canplay", bootDecoder);
    };
  }, [targetClipUrl]);

  // Scrubbing animation loop with non-blocking, queued seeking
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const progressEl = progressRef.current;
    if (!container || !video) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = 0;
    let pendingSeekTime: number | null = null;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = Math.max(rect.height - vh, 1);
      targetProgress = Math.min(1, Math.max(0, -rect.top / span));
    };

    const applySeek = (time: number) => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      const clampedTime = Math.min(video.duration - 0.02, Math.max(0, time));

      if (video.seeking) {
        // Queue the seek instead of aborting the hardware decoder
        pendingSeekTime = clampedTime;
        return;
      }

      if (Math.abs(video.currentTime - clampedTime) > 0.025) {
        try {
          video.currentTime = clampedTime;
        } catch {
          // Ignore transient seek errors
        }
      }
    };

    const onSeeked = () => {
      if (pendingSeekTime !== null) {
        const nextTime = pendingSeekTime;
        pendingSeekTime = null;
        applySeek(nextTime);
      }
    };

    video.addEventListener("seeked", onSeeked);

    const updateLoop = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0002) {
        currentProgress += diff * 0.18;
      } else {
        currentProgress = targetProgress;
      }

      if (progressEl) {
        progressEl.style.transform = `scaleX(${currentProgress})`;
      }

      if (video.duration && !Number.isNaN(video.duration) && video.duration > 0) {
        const targetTime = currentProgress * video.duration;
        applySeek(targetTime);
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("seeked", onSeeked);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const themeStyles = theme
    ? ({
        "--scroll-scrub-accent": theme.accent,
        "--scroll-scrub-bg": theme.background,
        "--scroll-scrub-ink": theme.ink,
        "--scroll-scrub-muted": theme.muted,
      } as React.CSSProperties)
    : undefined;

  // On mobile screens, 380vh provides natural thumb swipe pacing
  const containerHeight = isMobile ? "380vh" : `${totalScrollVh}vh`;

  return (
    <div
      className={`scroll-scrub ${className}`}
      ref={containerRef}
      style={{
        ...themeStyles,
        height: containerHeight,
      }}
    >
      <div className="scroll-scrub__stage">
        {/* Instant fallback poster image so mobile phones never render a black void */}
        {posterUrl && (
          <img
            alt=""
            aria-hidden="true"
            className="scroll-scrub__poster"
            loading="eager"
            src={posterUrl}
            style={{
              objectPosition: isMobile
                ? activeScene?.mobileObjectPosition || "50% 50%"
                : activeScene?.objectPosition || "50% 50%",
            }}
          />
        )}

        <video
          aria-hidden="true"
          autoPlay
          className={`scroll-scrub__video ${isVideoLoaded ? "scroll-scrub__video--ready" : ""}`}
          disablePictureInPicture
          loop
          muted
          playsInline
          poster={posterUrl}
          preload="auto"
          ref={videoRef}
          src={targetClipUrl}
          style={{
            objectPosition: isMobile
              ? activeScene?.mobileObjectPosition || "50% 50%"
              : activeScene?.objectPosition || "50% 50%",
          }}
        />

        <div className="scroll-scrub__progress" ref={progressRef} />

        <div className="scroll-scrub__route">
          {scenes.map((scene, idx) => (
            <span
              className={idx === activeSceneIndex ? "active" : ""}
              key={scene.id}
            >
              {scene.label || scene.title || `Scene ${idx + 1}`}
            </span>
          ))}
        </div>

        <div className="scroll-scrub__copy" aria-live="polite">
          <h2>{activeScene?.title}</h2>
          <p>{activeScene?.body}</p>
        </div>
      </div>
    </div>
  );
}

export default ScrollScrub;
