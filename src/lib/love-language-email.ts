import {
  LOVE_LANGUAGE_INTERPRETATION,
  LOVE_LANGUAGE_LABEL,
  LoveLanguageKey,
  Percentages,
  rankLanguages,
} from "@/lib/love-languages";

export function buildResultEmailHtml({
  name,
  primary,
  percentages,
}: {
  name: string;
  primary: LoveLanguageKey;
  percentages: Percentages;
}) {
  const ranked = rankLanguages(percentages);
  const interpretation = LOVE_LANGUAGE_INTERPRETATION[primary];

  const rows = ranked
    .map(
      (key) =>
        `<tr><td style="padding:4px 0;color:#334155;font-size:14px;">${LOVE_LANGUAGE_LABEL[key]}</td><td style="padding:4px 0;text-align:right;font-weight:600;color:#0f172a;font-size:14px;">${percentages[key]}%</td></tr>`,
    )
    .join("");

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#0f172a;">
    <h1 style="font-size:20px;margin-bottom:4px;">Hola ${name},</h1>
    <p style="font-size:14px;color:#475569;">Ya tenemos el resultado de tu test de <strong>Los 5 Lenguajes del Amor</strong>.</p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin:20px 0;">
      <p style="font-size:12px;color:#64748b;margin:0 0 4px;">Tu lenguaje principal</p>
      <p style="font-size:20px;font-weight:700;margin:0;color:#4f46e5;">${LOVE_LANGUAGE_LABEL[primary]} — ${percentages[primary]}%</p>
    </div>
    <p style="font-size:14px;color:#334155;line-height:1.5;">${interpretation.meaning}</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">${rows}</table>
    <p style="font-size:14px;color:#334155;">Te adjuntamos el resultado completo en PDF, con la interpretación y la recomendación personalizada.</p>
    <p style="font-size:13px;color:#64748b;margin-top:32px;">Con cariño,<br/>Renzo Parada — Emprendedores Makeover</p>
  </div>`;
}
