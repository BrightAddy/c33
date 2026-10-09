import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { href: "#top", label: "STARTSEITE", id: "top" },
  { href: "#projekte", label: "PROJEKTE", id: "projekte" },
  { href: "#ueber-uns", label: "ÜBER UNS", id: "ueber-uns" },
  { href: "#leistungen", label: "LEISTUNGEN", id: "leistungen" },
  { href: "#kontakt", label: "KONTAKT", id: "kontakt" },
];

export function SiteHeader() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const handleScroll = () => {
      // 1. Detect light section transition
      const projekteEl = document.getElementById("projekte");
      if (projekteEl) {
        const rect = projekteEl.getBoundingClientRect();
        setIsLightMode(rect.top <= 80);
      }

      // 2. Active section detection (Home / Startseite while in hero journey)
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const journeyEl = document.querySelector(".ab-journey");
      const journeyBottom = journeyEl ? journeyEl.getBoundingClientRect().bottom : vh;

      if (journeyBottom > 100) {
        setActiveSection("top");
      } else {
        const sections = ["kontakt", "leistungen", "ueber-uns", "projekte"];
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= vh * 0.45) {
              setActiveSection(id);
              return;
            }
          }
        }
        setActiveSection("projekte");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header className={`ab-header ${isLightMode ? "ab-header--light" : ""}`}>
      <a aria-label="AB MASSIVHAUS, Zur Startseite" className="ab-logo" href="#top">
        <span className="ab-logo__title">AB MASSIVHAUS</span>
        <span className="ab-logo__sub">ARCHITEKTUR &amp; BAU</span>
      </a>

      <nav aria-label="Hauptnavigation" className="ab-nav">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              aria-current={isActive ? "page" : undefined}
              className={`ab-nav__link ${isActive ? "ab-nav__link--active" : ""}`}
              href={item.href}
              key={item.id}
            >
              {item.id === "top" && (
                <span aria-hidden="true" className="ab-nav__indicator" />
              )}
              <span>{item.label}</span>
              {item.id === "top" && (
                <span className="ab-nav__tag">START</span>
              )}
            </a>
          );
        })}
      </nav>

      <a
        className={`ab-cta ${isLightMode ? "ab-cta--dark" : "ab-cta--outline"}`}
        href="#kontakt"
      >
        <span>BERATUNG ANFRAGEN</span>
        <i aria-hidden="true">→</i>
      </a>
    </header>
  );
}

export default SiteHeader;
