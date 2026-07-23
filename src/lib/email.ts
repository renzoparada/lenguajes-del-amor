import { Resend } from "resend";

type EmailAttachment = { filename: string; content: Buffer };
type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  from?: string;
  attachments?: EmailAttachment[];
};

const FROM_ADDRESS = process.env.LOVE_LANGUAGES_FROM_EMAIL ?? "Emprendedores Makeover <onboarding@resend.dev>";

/**
 * Envía un email si hay RESEND_API_KEY configurada; si no, lo imprime por
 * consola. Así el envío del resultado funciona igual en desarrollo o en
 * instalaciones que todavía no configuraron un proveedor de email.
 */
export async function sendEmail({ to, subject, html, from, attachments }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `[email:fallback] Para: ${to} | Asunto: ${subject}${
        attachments?.length ? ` | Adjuntos: ${attachments.map((a) => a.filename).join(", ")}` : ""
      }\n${html}`,
    );
    return { delivered: false, reason: "RESEND_API_KEY no configurada" };
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: from ?? FROM_ADDRESS,
    to,
    subject,
    html,
    attachments: attachments?.map((a) => ({ filename: a.filename, content: a.content })),
  });

  if (result.error) {
    console.error("[email:error]", result.error);
    return { delivered: false, reason: result.error.message };
  }

  return { delivered: true };
}
