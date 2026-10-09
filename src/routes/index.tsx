import { createFileRoute } from "@tanstack/react-router";

import "@/ab-massivhaus.css";
import { JourneyChapters } from "@/components/ab/journey-chapters";
import { SiteHeader } from "@/components/ab/site-header";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/" as any)({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@200;300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

import { useState } from "react";

interface Project {
  id: string;
  title: string;
  location: string;
  tag: string;
  desc: string;
  specs: string[];
  image: string;
}

const projects: Project[] = [
  {
    id: "villa-am-see",
    title: "Villa Am See",
    location: "Starnberger See, Bayern",
    tag: "Bauhaus Moderne",
    desc: "Monolithischer Massivbau mit großflächigen Sichtbetonelementen, dreifach verglasten Panoramafenstern und direktem Blick auf das Wasser.",
    specs: ["285 m² Wohnfläche", "KfW 40 Plus", "Sichtbeton & Glas", "Erdwärmepumpe"],
    image: "/assets/projects/villa-am-see.jpg",
  },
  {
    id: "villa-bauhaus",
    title: "Residenz Taunus",
    location: "Königstein im Taunus",
    tag: "Klassische Moderne",
    desc: "Ausdrucksstarker Kubusbau aus hochdämmendem Ziegelmauerwerk mit integrierter Holz-Lamellen-Fassade und überkragendem Terrassenbereich.",
    specs: ["340 m² Wohnfläche", "KfW 40 Standard", "Ziegel massiv", "Photovoltaik 15 kWp"],
    image: "/assets/projects/villa-bauhaus.jpg",
  },
  {
    id: "residenz-kubus",
    title: "Kubus Grünwald",
    location: "München-Grünwald",
    tag: "Minimalistischer Kubus",
    desc: "Kompromisslose Geradlinigkeit mit dunkler Schieferfassade, privatem Zen-Innenhof, KNX Smart-Home-Steuerung und Wasserbecken.",
    specs: ["240 m² Wohnfläche", "KfW 40 EE", "Naturstein & Putz", "Wohnraumlüftung"],
    image: "/assets/projects/residenz-kubus.jpg",
  },
];

const servicePhases = [
  {
    num: "01",
    title: "Architektur & Planung",
    desc: "Vom ersten Strich bis zum fertigen Bauantrag: Wir entwerfen Ihr Traumhaus maßgeschneidert nach Ihren Lebensgewohnheiten.",
    points: [
      "Individuelle Entwurfsarchitektur",
      "3D-BIM & fotorealistische Visualisierung",
      "Komplette Genehmigungsplanung & Statik",
    ],
  },
  {
    num: "02",
    title: "Massivbau & Rohbau",
    desc: "Stein auf Stein gebaut: Hochwertige Ziegel- und Betonbauweise für maximale Wertbeständigkeit, Schallschutz und Erdbebensicherheit.",
    points: [
      "Hochdämmendes Ziegel- & Porenbetonmauerwerk",
      "Monolithische Stahlbetondecken & Fundament",
      "Witterungsresistente 3-fach-Isolierhülle",
    ],
  },
  {
    num: "03",
    title: "Schlüsselfertiger Ausbau",
    desc: "Präzises Handwerk bis ins kleinste Detail: Zukunftssichere Haustechnik und erstklassige Materialien für höchsten Wohnkomfort.",
    points: [
      "Wärmepumpentechnik & Fußbodenheizung",
      "Edles Echtholzparkett & Designer-Bäder",
      "DEKRA/TÜV-Bauabnahme & Schlüsselübergabe",
    ],
  },
];

const stats = [
  { num: "25+", label: "Jahre Bauerfahrung in Deutschland" },
  { num: "100%", label: "Garantierter Festpreis ohne Nachforderungen" },
  { num: "KfW 40", label: "Effizienzhaus-Standard für niedrige Energiekosten" },
  { num: "5-Stufen", label: "TÜV / DEKRA Bauüberwachung serienmäßig" },
];

function Index() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    propertyStatus: "Grundstück vorhanden",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="ab-site" id="top">
      <SiteHeader />
      <main>
        {/* Hero Scroll Journey */}
        <div className="ab-journey">
          <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
          <JourneyChapters />
        </div>

        {/* Post-Hero Light Zone: Crisp Architectural White Aesthetic */}
        <div className="ab-light-zone">
          {/* Section: Selected Architecture Projects */}
          <section className="ab-section ab-section--first" id="projekte">
          <div className="ab-section__header">
            <p className="ab-eyebrow">
              <span>01</span>
              Architektur &amp; Portfolio
            </p>
            <h2 className="ab-headline">
              <span className="ab-light">AUSGEWÄHLTE PROJEKTE.</span>
              <span className="ab-bold">FÜR IHR LEBEN GEPLANT.</span>
            </h2>
            <p className="ab-copy">
              Jedes AB MASSIVHAUS ist ein architektonisches Unikat. Zeitlose Formensprache,
              höchste Materialqualität und kompromisslose Ausführung.
            </p>
          </div>

          <div className="ab-projects__grid">
            {projects.map((project) => (
              <article className="ab-project__card" key={project.id}>
                <div className="ab-project__thumb">
                  <img
                    alt={project.title}
                    decoding="async"
                    loading="lazy"
                    src={project.image}
                  />
                  <div className="ab-project__badge">{project.tag}</div>
                </div>
                <div className="ab-project__body">
                  <p className="ab-project__location">{project.location}</p>
                  <h3 className="ab-project__title">{project.title}</h3>
                  <p className="ab-project__desc">{project.desc}</p>
                  <div className="ab-project__specs">
                    {project.specs.map((spec) => (
                      <span key={spec}>{spec}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section: Über uns & Philosophie */}
        <section className="ab-section" id="ueber-uns">
          <div className="ab-section__header">
            <p className="ab-eyebrow">
              <span>02</span>
              Philosophie &amp; Bauweise
            </p>
            <h2 className="ab-headline">
              <span className="ab-light">BAUEN FÜR GENERATIONEN.</span>
              <span className="ab-bold">STEIN AUF STEIN.</span>
            </h2>
          </div>

          <div className="ab-about__content">
            <div className="ab-about__text">
              <p className="ab-statement">
                Ein Zuhause ist das Fundament Ihres Lebens. Deshalb bauen wir kompromisslos massiv.
              </p>
              <p className="ab-about__p">
                Während der Markt zunehmend auf leichte Holzrahmenbauweise setzt, bleiben wir unserer
                Überzeugung treu: Massives Mauerwerk bietet unübertroffenen Schallschutz, natürliche
                Klimaregulierung und höchste Wertbeständigkeit über Jahrzehnte.
              </p>
              <p className="ab-about__p">
                Vom ersten Vorentwurf über die behördliche Genehmigungsplanung bis hin zur schlüsselfertigen
                Übergabe begleiten unsere erfahrenen Ingenieure und Architekten Sie partnerschaftlich.
              </p>
            </div>

            <div className="ab-stats__grid">
              {stats.map((stat) => (
                <div className="ab-stat__card" key={stat.label}>
                  <div className="ab-stat__num">{stat.num}</div>
                  <div className="ab-stat__label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Leistungen */}
        <section className="ab-section" id="leistungen">
          <div className="ab-section__header">
            <p className="ab-eyebrow">
              <span>03</span>
              Leistungsspektrum
            </p>
            <h2 className="ab-headline">
              <span className="ab-light">VON DER ERSTEN SKIZZE</span>
              <span className="ab-bold">ZUR SCHLÜSSELÜBERGABE.</span>
            </h2>
            <p className="ab-copy">
              Ein Ansprechpartner für das gesamte Bauvorhaben. Präzise Koordination, zertifizierte
              Handwerksbetriebe und transparente Meilensteine.
            </p>
          </div>

          <div className="ab-services__grid">
            {servicePhases.map((service) => (
              <article className="ab-service__card" key={service.title}>
                <span className="ab-service__num">{service.num}</span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <ul className="ab-service__points">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Section: Kontakt & Beratung */}
        <section className="ab-section" id="kontakt">
          <div className="ab-section__header">
            <p className="ab-eyebrow">
              <span>04</span>
              Beratung &amp; Kontakt
            </p>
            <h2 className="ab-headline">
              <span className="ab-light">IHR ZUHAUSE BEGINNT</span>
              <span className="ab-bold">MIT EINEM GESPRÄCH.</span>
            </h2>
          </div>

          <div className="ab-contact__layout">
            <div className="ab-contact__info">
              <p className="ab-contact__lead">
                Planen Sie einen Neubau oder suchen Sie das passende Grundstück? Unsere
                Bauherrenberater stehen Ihnen von Anfang an mit Fachwissen zur Seite.
              </p>

              <div className="ab-contact__details">
                <div className="ab-contact__item">
                  <span className="ab-contact__label">Hauptsitz &amp; Showroom</span>
                  <span className="ab-contact__val">Kurfürstendamm 194, 10707 Berlin</span>
                </div>
                <div className="ab-contact__item">
                  <span className="ab-contact__label">Telefonische Beratung</span>
                  <a className="ab-contact__val" href="tel:+493089004520">
                    +49 (0) 30 8900 4520
                  </a>
                </div>
                <div className="ab-contact__item">
                  <span className="ab-contact__label">E-Mail Kontakt</span>
                  <a className="ab-contact__val" href="mailto:beratung@ab-massivhaus.de">
                    beratung@ab-massivhaus.de
                  </a>
                </div>
                <div className="ab-contact__item">
                  <span className="ab-contact__label">Öffnungszeiten</span>
                  <span className="ab-contact__val">Mo – Fr: 08:30 – 18:00 Uhr</span>
                </div>
              </div>
            </div>

            <div className="ab-contact__form-wrap">
              {isSubmitted ? (
                <div className="ab-form__success">
                  <p className="ab-eyebrow">
                    <span>✓</span>
                    Erfolgreich Gesendet
                  </p>
                  <h3>Vielen Dank für Ihre Anfrage!</h3>
                  <p>
                    Wir haben Ihre Nachricht erhalten. Einer unserer Architekten wird sich
                    innerhalb von 24 Stunden persönlich bei Ihnen melden.
                  </p>
                  <button
                    className="ab-cta"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormState({
                        name: "",
                        email: "",
                        phone: "",
                        propertyStatus: "Grundstück vorhanden",
                        message: "",
                      });
                    }}
                    type="button"
                  >
                    <span>WEITERE ANFRAGE SENDEN</span>
                  </button>
                </div>
              ) : (
                <form className="ab-form" onSubmit={handleSubmit}>
                  <div className="ab-form__row">
                    <div className="ab-field">
                      <label htmlFor="name">Vor- und Nachname *</label>
                      <input
                        className="ab-input"
                        id="name"
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        placeholder="z.B. Maximilian Weber"
                        required
                        type="text"
                        value={formState.name}
                      />
                    </div>
                    <div className="ab-field">
                      <label htmlFor="phone">Telefonnummer</label>
                      <input
                        className="ab-input"
                        id="phone"
                        onChange={(e) =>
                          setFormState({ ...formState, phone: e.target.value })
                        }
                        placeholder="+49 ..."
                        type="tel"
                        value={formState.phone}
                      />
                    </div>
                  </div>

                  <div className="ab-form__row">
                    <div className="ab-field">
                      <label htmlFor="email">E-Mail-Adresse *</label>
                      <input
                        className="ab-input"
                        id="email"
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        placeholder="weber@beispiel.de"
                        required
                        type="email"
                        value={formState.email}
                      />
                    </div>
                    <div className="ab-field">
                      <label htmlFor="property">Grundstücksstatus</label>
                      <select
                        className="ab-select"
                        id="property"
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            propertyStatus: e.target.value,
                          })
                        }
                        value={formState.propertyStatus}
                      >
                        <option value="Grundstück vorhanden">Grundstück vorhanden</option>
                        <option value="Grundstück in Aussicht">Grundstück in Aussicht</option>
                        <option value="Auf Grundstückssuche">Auf Grundstückssuche</option>
                        <option value="Bestandsumbau / Abriss">Bestandsumbau / Abriss</option>
                      </select>
                    </div>
                  </div>

                  <div className="ab-field">
                    <label htmlFor="message">Ihr Bauvorhaben / Anmerkungen</label>
                    <textarea
                      className="ab-textarea"
                      id="message"
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      placeholder="Beschreiben Sie kurz Ihre Vorstellungen (Wohnfläche, Bauort, Zeitrahmen)..."
                      rows={3}
                      value={formState.message}
                    />
                  </div>

                  <button className="ab-cta ab-form__button" type="submit">
                    <span>UNVERBINDLICHES ERSTGESPRÄCH ANFRAGEN</span>
                    <i aria-hidden="true">→</i>
                  </button>

                  <p className="ab-form__notice">
                    * Pflichtfelder. Ihre Daten werden streng vertraulich gemäß DSGVO verarbeitet.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="ab-footer">
          <div className="ab-footer__top">
            <div className="ab-footer__brand">
              <a className="ab-logo" href="#top">
                <strong>AB MASSIVHAUS</strong>
                <small>GMBH &amp; CO. KG</small>
              </a>
              <p>
                Präzise Architektur und massive Bauweise nach deutschen Standards.
                Wir machen Wohnträume dauerhaft wahr.
              </p>
            </div>

            <div className="ab-footer__nav">
              <div className="ab-footer__links">
                <span className="ab-footer__heading">Navigation</span>
                <a href="#projekte">Projekte</a>
                <a href="#ueber-uns">Über uns</a>
                <a href="#leistungen">Leistungen</a>
                <a href="#kontakt">Beratung</a>
              </div>

              <div className="ab-footer__links">
                <span className="ab-footer__heading">Qualitätsstandards</span>
                <a href="#ueber-uns">100% Massivbau</a>
                <a href="#ueber-uns">KfW-Effizienzhaus 40</a>
                <a href="#ueber-uns">TÜV / DEKRA geprüft</a>
                <a href="#ueber-uns">Festpreisgarantie</a>
              </div>

              <div className="ab-footer__links">
                <span className="ab-footer__heading">Zentrale</span>
                <a href="#kontakt">Kurfürstendamm 194</a>
                <a href="#kontakt">10707 Berlin</a>
                <a href="tel:+493089004520">+49 30 8900 4520</a>
                <a href="mailto:beratung@ab-massivhaus.de">beratung@ab-massivhaus.de</a>
              </div>
            </div>
          </div>

          <div className="ab-footer__bottom">
            <p>© 2026 AB MASSIVHAUS GmbH &amp; Co. KG. Alle Rechte vorbehalten.</p>
            <div className="ab-footer__legal">
              <a href="#top">Impressum</a>
              <a href="#top">Datenschutz</a>
              <a href="#top">AGB</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  </div>
);
}

export { Index };
export default Index;

