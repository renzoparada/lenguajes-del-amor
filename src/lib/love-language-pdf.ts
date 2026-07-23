import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, RGB } from "pdf-lib";
import {
  LOVE_LANGUAGE_COLOR,
  LOVE_LANGUAGE_INTERPRETATION,
  LOVE_LANGUAGE_LABEL,
  LoveLanguageKey,
  Percentages,
  Scores,
  rankLanguages,
} from "@/lib/love-languages";

type PdfInput = {
  name: string;
  scores: Scores;
  percentages: Percentages;
  createdAt: Date;
};

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;

function hexToRgb(hex: string): RGB {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16) / 255;
  const g = parseInt(value.substring(2, 4), 16) / 255;
  const b = parseInt(value.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function embedImageIfExists(doc: PDFDocument, filenames: string[]) {
  for (const filename of filenames) {
    const filePath = path.join(process.cwd(), "public", "brand", filename);
    try {
      const bytes = await readFile(filePath);
      if (filename.toLowerCase().endsWith(".png")) {
        return await doc.embedPng(bytes);
      }
      return await doc.embedJpg(bytes);
    } catch {
      // El archivo todavía no fue subido a public/brand/; se omite sin romper el PDF.
    }
  }
  return null;
}

export async function generateLoveLanguagePdf({ name, scores, percentages, createdAt }: PdfInput): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const logo = await embedImageIfExists(doc, ["logo.png", "logo.jpg", "logo.jpeg"]);
  const signature = await embedImageIfExists(doc, ["firma.png", "firma.jpg", "firma.jpeg", "signature.png"]);

  const ranked = rankLanguages(scores);
  const primary = ranked[0];
  const secondary = ranked[1];

  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  let y = PAGE_HEIGHT - MARGIN;

  // --- Header ---
  if (logo) {
    const logoHeight = 56;
    const logoWidth = (logo.width / logo.height) * logoHeight;
    page.drawImage(logo, {
      x: PAGE_WIDTH / 2 - logoWidth / 2,
      y: y - logoHeight,
      width: logoWidth,
      height: logoHeight,
    });
    y -= logoHeight + 32;
  }

  page.drawText("Los 5 Lenguajes del Amor", {
    x: MARGIN,
    y,
    size: 22,
    font: fontBold,
    color: rgb(0.15, 0.15, 0.2),
  });
  y -= 26;

  page.drawText("Resultado personalizado del test", {
    x: MARGIN,
    y,
    size: 12,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.45),
  });
  y -= 34;

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: rgb(0.88, 0.88, 0.9),
  });
  y -= 24;

  // --- Participant info ---
  const dateLabel = createdAt.toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" });
  page.drawText(`Nombre: ${name}`, { x: MARGIN, y, size: 12, font: fontBold, color: rgb(0.1, 0.1, 0.15) });
  page.drawText(`Fecha: ${dateLabel}`, {
    x: PAGE_WIDTH - MARGIN - fontRegular.widthOfTextAtSize(`Fecha: ${dateLabel}`, 11),
    y,
    size: 11,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.45),
  });
  y -= 30;

  // --- Primary language highlight box ---
  const primaryColor = hexToRgb(LOVE_LANGUAGE_COLOR[primary]);
  const boxHeight = 78;
  page.drawRectangle({
    x: MARGIN,
    y: y - boxHeight,
    width: contentWidth,
    height: boxHeight,
    color: primaryColor,
    opacity: 0.12,
    borderColor: primaryColor,
    borderWidth: 1,
  });
  page.drawText("Tu lenguaje principal", {
    x: MARGIN + 16,
    y: y - 22,
    size: 11,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.35),
  });
  page.drawText(`${LOVE_LANGUAGE_LABEL[primary]} — ${percentages[primary]}%`, {
    x: MARGIN + 16,
    y: y - 44,
    size: 18,
    font: fontBold,
    color: primaryColor,
  });
  page.drawText(`Lenguaje secundario: ${LOVE_LANGUAGE_LABEL[secondary]} (${percentages[secondary]}%)`, {
    x: MARGIN + 16,
    y: y - 64,
    size: 10.5,
    font: fontRegular,
    color: rgb(0.35, 0.35, 0.4),
  });
  y -= boxHeight + 26;

  // --- Bar chart ---
  page.drawText("Distribución de tus 5 lenguajes del amor", {
    x: MARGIN,
    y,
    size: 13,
    font: fontBold,
    color: rgb(0.15, 0.15, 0.2),
  });
  y -= 20;

  const barMaxWidth = contentWidth - 140;
  const barHeight = 14;
  const rowGap = 30;
  const maxPercentage = Math.max(...Object.values(percentages), 1);

  for (const key of ranked) {
    const label = LOVE_LANGUAGE_LABEL[key];
    const pct = percentages[key];
    const color = hexToRgb(LOVE_LANGUAGE_COLOR[key]);

    page.drawText(label, { x: MARGIN, y: y - 10, size: 10.5, font: fontRegular, color: rgb(0.2, 0.2, 0.25) });

    const trackX = MARGIN + 118;
    page.drawRectangle({
      x: trackX,
      y: y - barHeight - 2,
      width: barMaxWidth,
      height: barHeight,
      color: rgb(0.94, 0.94, 0.95),
    });
    const filledWidth = Math.max((pct / maxPercentage) * barMaxWidth, 3);
    page.drawRectangle({
      x: trackX,
      y: y - barHeight - 2,
      width: filledWidth,
      height: barHeight,
      color,
    });
    page.drawText(`${pct}%`, {
      x: trackX + barMaxWidth + 8,
      y: y - barHeight + 1,
      size: 10,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.25),
    });

    y -= rowGap;
  }

  y -= 10;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: rgb(0.88, 0.88, 0.9),
  });
  y -= 24;

  // --- Interpretation ---
  const interpretation = LOVE_LANGUAGE_INTERPRETATION[primary];
  page.drawText("¿Qué significa este resultado?", {
    x: MARGIN,
    y,
    size: 13,
    font: fontBold,
    color: rgb(0.15, 0.15, 0.2),
  });
  y -= 20;

  y = drawParagraph(page, interpretation.meaning, fontRegular, 10.5, MARGIN, y, contentWidth, 14, rgb(0.25, 0.25, 0.3));
  y -= 10;

  page.drawText("Recomendación", { x: MARGIN, y, size: 11, font: fontBold, color: primaryColor });
  y -= 16;
  y = drawParagraph(page, interpretation.tip, fontItalic, 10.5, MARGIN, y, contentWidth, 14, rgb(0.3, 0.3, 0.35));

  // --- Footer with signature/logo brand ---
  const footerY = 96;
  page.drawLine({
    start: { x: MARGIN, y: footerY + 34 },
    end: { x: PAGE_WIDTH - MARGIN, y: footerY + 34 },
    thickness: 1,
    color: rgb(0.88, 0.88, 0.9),
  });

  if (signature) {
    const sigHeight = 40;
    const sigWidth = (signature.width / signature.height) * sigHeight;
    page.drawImage(signature, { x: MARGIN, y: footerY - 12, width: sigWidth, height: sigHeight });
  }

  page.drawText("Emprendedores Makeover", {
    x: MARGIN,
    y: footerY - 26,
    size: 9,
    font: fontRegular,
    color: rgb(0.45, 0.45, 0.5),
  });

  const footerNote = "Este resultado es orientativo y está inspirado en el marco de Los 5 Lenguajes del Amor de Gary Chapman.";
  page.drawText(footerNote, {
    x: PAGE_WIDTH - MARGIN - fontRegular.widthOfTextAtSize(footerNote, 8),
    y: footerY - 26,
    size: 8,
    font: fontRegular,
    color: rgb(0.55, 0.55, 0.6),
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

function drawParagraph(
  page: PDFPage,
  text: string,
  font: PDFFont,
  size: number,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  color: RGB,
): number {
  const lines = wrapText(text, font, size, maxWidth);
  let cursorY = y;
  for (const line of lines) {
    page.drawText(line, { x, y: cursorY, size, font, color });
    cursorY -= lineHeight;
  }
  return cursorY;
}

export type { LoveLanguageKey };
