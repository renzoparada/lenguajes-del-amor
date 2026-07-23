import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";
import { loveLanguageQuizSchema } from "@/lib/validation";
import {
  LOVE_LANGUAGE_ENUM,
  LOVE_LANGUAGE_LABEL,
  computePercentages,
  computeScores,
  rankLanguages,
} from "@/lib/love-languages";
import { generateLoveLanguagePdf } from "@/lib/love-language-pdf";
import { sendEmail } from "@/lib/email";
import { buildResultEmailHtml } from "@/lib/love-language-email";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loveLanguageQuizSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
    }

    const { name, email, answers } = parsed.data;
    const scores = computeScores(answers);
    const percentages = computePercentages(scores);
    const [primary, secondary] = rankLanguages(scores);

    const result = await prisma.loveLanguageResult.create({
      data: {
        name,
        email,
        wordsOfAffirmationScore: scores.wordsOfAffirmation,
        qualityTimeScore: scores.qualityTime,
        receivingGiftsScore: scores.receivingGifts,
        actsOfServiceScore: scores.actsOfService,
        physicalTouchScore: scores.physicalTouch,
        primaryLanguage: LOVE_LANGUAGE_ENUM[primary],
        secondaryLanguage: LOVE_LANGUAGE_ENUM[secondary],
      },
    });

    const pdfBuffer = await generateLoveLanguagePdf({
      name,
      scores,
      percentages,
      createdAt: result.createdAt,
    });

    const emailResult = await sendEmail({
      to: email,
      subject: `${name}, tu lenguaje principal es ${LOVE_LANGUAGE_LABEL[primary]}`,
      html: buildResultEmailHtml({ name, primary, percentages }),
      attachments: [{ filename: "lenguajes-del-amor-resultado.pdf", content: pdfBuffer }],
      from: process.env.LOVE_LANGUAGES_FROM_EMAIL,
    });

    if (emailResult.delivered) {
      await prisma.loveLanguageResult.update({ where: { id: result.id }, data: { emailSent: true } });
    }

    return NextResponse.json(
      {
        id: result.id,
        scores,
        percentages,
        primaryLanguage: primary,
        secondaryLanguage: secondary,
        emailDelivered: emailResult.delivered,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
