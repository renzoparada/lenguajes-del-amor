import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, handleApiError } from "@/lib/api-helpers";
import { LOVE_LANGUAGE_FROM_ENUM, computePercentages } from "@/lib/love-languages";
import { generateLoveLanguagePdf } from "@/lib/love-language-pdf";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await prisma.loveLanguageResult.findUnique({ where: { id } });
    if (!result) {
      throw new ApiError("Resultado no encontrado", 404);
    }

    const scores = {
      wordsOfAffirmation: result.wordsOfAffirmationScore,
      qualityTime: result.qualityTimeScore,
      receivingGifts: result.receivingGiftsScore,
      actsOfService: result.actsOfServiceScore,
      physicalTouch: result.physicalTouchScore,
    };
    const percentages = computePercentages(scores);

    const pdfBuffer = await generateLoveLanguagePdf({
      name: result.name,
      scores,
      percentages,
      createdAt: result.createdAt,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="lenguajes-del-amor-${LOVE_LANGUAGE_FROM_ENUM[result.primaryLanguage]}.pdf"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
