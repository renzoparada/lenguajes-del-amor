import { z } from "zod";
import { QUESTIONS } from "@/lib/love-languages";

const questionIds = QUESTIONS.map((q) => q.id) as [string, ...string[]];

export const loveLanguageQuizSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(80),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  answers: z
    .record(z.enum(questionIds), z.number().int().min(1).max(5))
    .refine((answers) => questionIds.every((id) => id in answers), {
      message: "Faltan respuestas por completar",
    }),
});
