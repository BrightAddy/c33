import React, { useEffect, useRef, useState, useMemo } from "react";
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

  const [isMobile, setIsMobile] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const activeScene = scenes[activeSceneIndex] || scenes[0];

  // Calculate total viewport height span based on scene scroll multipliers
  const totalScrollVh = useMemo(() => {
    return scenes.reduce((sum, s) => sum + (s.scroll || 4), 0) * 100;
  }, [scenes]);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine active clip URL
  const targetClipUrl = useMemo(() => {
    if (!activeScene) return "";
    return isMobile && activeScene.mobileClip ? activeScene.mobileClip : activeScene.clip;
  }, [activeScene, isMobile]);

  // Determine active poster URL
  const posterUrl = useMemo(() => {
    if (!activeScene) return "";
    return isMobile && activeScene.mobilePoster ? activeScene.mobilePoster : activeScene.poster;
  }, [activeScene, isMobile]);

  // Fetch clip as Blob URL for instantaneous, stutter-free scrubbing
  useEffect(() => {
    if (!targetClipUrl) return;

    let isCancelled = false;
    let createdUrl: string | null = null;

    fetch(targetClipUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (isCancelled) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
      })
      .catch((err) => {
        console.warn("Direct blob loading fallback to source url:", err);
        if (!isCancelled) {
          setBlobUrl(targetClipUrl);
        }
      });

    return () => {
      isCancelled = true;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [targetClipUrl]);

  // Scrubbing animation loop
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const progressEl = progressRef.current;
    if (!container || !video) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = 0;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = Math.max(rect.height - vh, 1);
      targetProgress = Math.min(1, Math.max(0, -rect.top / span));
    };

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
        const targetTime = Math.min(
          video.duration - 0.02,
          Math.max(0, currentProgress * video.duration)
        );

        if (Math.abs(video.currentTime - targetTime) > 0.015) {
          if ("fastSeek" in video && typeof (video as any).fastSeek === "function") {
            (video as any).fastSeek(targetTime);
          } else {
            video.currentTime = targetTime;
          }
        }
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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

  return (
    <div
      className={`scroll-scrub ${className}`}
      ref={containerRef}
      style={{
        ...themeStyles,
        height: `${totalScrollVh}vh`,
      }}
    >
      <div className="scroll-scrub__stage">
        <video
          aria-hidden="true"
          className="scroll-scrub__video"
          disablePictureInPicture
          muted
          playsInline
          poster={posterUrl}
          preload="auto"
          ref={videoRef}
          src={blobUrl || targetClipUrl}
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
