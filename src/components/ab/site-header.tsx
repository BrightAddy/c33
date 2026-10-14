import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
  id: string;
  num: string;
}

const navItems: NavItem[] = [
  { href: "#top", label: "STARTSEITE", id: "top", num: "01" },
  { href: "#projekte", label: "PROJEKTE", id: "projekte", num: "02" },
  { href: "#ueber-uns", label: "ÜBER UNS", id: "ueber-uns", num: "03" },
  { href: "#leistungen", label: "LEISTUNGEN", id: "leistungen", num: "04" },
  { href: "#kontakt", label: "KONTAKT", id: "kontakt", num: "05" },
];

export function SiteHeader() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Detect light section transition
      const projekteEl = document.getElementById("projekte");
      if (projekteEl) {
        const rect = projekteEl.getBoundingClientRect();
        setIsLightMode(rect.top <= 80);
      }

      // 2. Active section detection (Home while in hero journey)
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

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`ab-header ${isLightMode ? "ab-header--light" : ""} ${
          isMenuOpen ? "ab-header--menu-open" : ""
        }`}
      >
        <a className="ab-logo" href="#top" onClick={closeMenu}>
          <span className="ab-logo__title">AB MASSIVHAUS</span>
          <span className="ab-logo__sub">ARCHITEKTUR &amp; BAU</span>
        </a>

        {/* Desktop Navigation */}
        <nav aria-label="Hauptnavigation" className="ab-nav ab-nav--desktop">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                aria-current={isActive ? "page" : undefined}
                className={`ab-nav__link ${isActive ? "ab-nav__link--active" : ""}`}
                href={item.href}
                key={item.id}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Action button & mobile hamburger toggle */}
        <div className="ab-header__actions">
          <a
            className={`ab-cta ${isLightMode ? "ab-cta--dark" : "ab-cta--outline"}`}
            href="#kontakt"
            onClick={closeMenu}
          >
            <span className="ab-cta__text-desktop">BERATUNG ANFRAGEN</span>
            <span className="ab-cta__text-mobile">ANFRAGEN</span>
            <i aria-hidden="true">→</i>
          </a>

          <button
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
            className={`ab-menu-toggle ${isMenuOpen ? "ab-menu-toggle--active" : ""}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            type="button"
          >
            <span className="ab-menu-toggle__line" />
            <span className="ab-menu-toggle__line" />
          </button>
        </div>
      </header>

      {/* Luxury Full-Screen Mobile Drawer */}
      <div
        aria-hidden={!isMenuOpen}
        className={`ab-mobile-menu ${isMenuOpen ? "ab-mobile-menu--open" : ""}`}
      >
        <div className="ab-mobile-menu__inner">
          <nav aria-label="Mobile Navigation" className="ab-mobile-menu__nav">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  className={`ab-mobile-menu__link ${
                    isActive ? "ab-mobile-menu__link--active" : ""
                  }`}
                  href={item.href}
                  key={item.id}
                  onClick={closeMenu}
                >
                  <span className="ab-mobile-menu__num">{item.num}</span>
                  <span className="ab-mobile-menu__label">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="ab-mobile-menu__footer">
            <div className="ab-mobile-menu__contact">
              <span className="ab-mobile-menu__heading">Telefonische Beratung</span>
              <a className="ab-mobile-menu__val" href="tel:+493089004520">
                +49 (0) 30 8900 4520
              </a>
            </div>
            <div className="ab-mobile-menu__contact">
              <span className="ab-mobile-menu__heading">Showroom &amp; Zentrale</span>
              <p className="ab-mobile-menu__val">Kurfürstendamm 194, 10707 Berlin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SiteHeader;
