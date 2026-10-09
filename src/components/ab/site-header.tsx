import { useEffect, useState } from "react";

const links = [
  { href: "#projekte", label: "PROJEKTE" },
  { href: "#ueber-uns", label: "ÜBER UNS" },
  { href: "#leistungen", label: "LEISTUNGEN" },
  { href: "#kontakt", label: "KONTAKT" },
];

export function SiteHeader() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const projekteEl = document.getElementById("projekte");
      if (projekteEl) {
        const rect = projekteEl.getBoundingClientRect();
        // Switch to light header when top of white section enters near the header area
        setIsLightMode(rect.top <= 80);
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
      <a aria-label="AB MASSIVHAUS, Startseite" className="ab-logo" href="#top">
        <strong>AB MASSIVHAUS</strong>
        <small>GMBH &amp; CO. KG</small>
      </a>
      <nav aria-label="Hauptnavigation" className="ab-nav">
        {links.map((link) => (
          <a href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a
        className={`ab-cta ${isLightMode ? "ab-cta--dark" : "ab-cta--outline"}`}
        href="#kontakt"
      >
        <span>PROJEKT STARTEN</span>
        <i aria-hidden="true">→</i>
      </a>
    </header>
  );
}
