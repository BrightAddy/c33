import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#c8102e",
  background: "#0b0c0d",
  ink: "#f3efe8",
  muted: "#b8b2a7",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    body: "Architektur & Bau. Vom leeren Grundstück zum fertigen Zuhause.",
    clip: "/assets/world/scene-01.mp4",
    id: "journey-film",
    label: "Journey",
    linger: 0,
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobileObjectPosition: "50% 50%",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    objectPosition: "50% 50%",
    poster: "/assets/world/scene-01-poster.png",
    scroll: 8,
    title: "AB MASSIVHAUS. We make living dreams come true.",
  },
];
