export interface AbChapter {
  id: string;
  num: string;
  eyebrow: string;
  light: string;
  bold: string;
  body: string;
  /** Film progress window (0..1) in which this chapter is visible. */
  start: number;
  end: number;
  final?: boolean;
}

export const abChapters: AbChapter[] = [
  { id: "intro", num: "01", eyebrow: "Architektur & Bau", light: "WE MAKE", bold: "LIVING DREAMS COME TRUE.", body: "Vom Grundstück zum Zuhause. Präzise geplant, massiv gebaut.", start: -0.1, end: 0.22 },
  { id: "design", num: "02", eyebrow: "Architectural Design", light: "VON DER IDEE", bold: "ZUR REALITÄT", body: "Präzise Planung. Durchdachte Architektur. Ein Zuhause, das zu Ihrem Leben passt.", start: 0.18, end: 0.44 },
  { id: "structure", num: "03", eyebrow: "Structural Engineering", light: "STARKE BASIS.", bold: "FÜR GENERATIONEN.", body: "Massive Bauweise. Höchste Präzision. Engineered in Germany.", start: 0.40, end: 0.66 },
  { id: "envelope", num: "04", eyebrow: "Building Envelope", light: "FORM TRIFFT", bold: "FUNKTION.", body: "Hochwertige Materialien. Für ein Zuhause mit Zukunft.", start: 0.62, end: 0.84 },
  { id: "final", num: "05", eyebrow: "The Final Home", light: "WE MAKE", bold: "LIVING DREAMS COME TRUE.", body: "Moderne Architektur für Ihr Leben. Zeitlose Ästhetik. Höchste Qualität. Ein Zuhause, das bleibt.", start: 0.81, end: 1.2, final: true },
];
