import { LoveLanguage } from "@/generated/prisma/enums";

export type LoveLanguageKey =
  | "wordsOfAffirmation"
  | "qualityTime"
  | "receivingGifts"
  | "actsOfService"
  | "physicalTouch";

export const LOVE_LANGUAGE_ORDER: LoveLanguageKey[] = [
  "wordsOfAffirmation",
  "qualityTime",
  "receivingGifts",
  "actsOfService",
  "physicalTouch",
];

export const LOVE_LANGUAGE_ENUM: Record<LoveLanguageKey, LoveLanguage> = {
  wordsOfAffirmation: LoveLanguage.WORDS_OF_AFFIRMATION,
  qualityTime: LoveLanguage.QUALITY_TIME,
  receivingGifts: LoveLanguage.RECEIVING_GIFTS,
  actsOfService: LoveLanguage.ACTS_OF_SERVICE,
  physicalTouch: LoveLanguage.PHYSICAL_TOUCH,
};

export const LOVE_LANGUAGE_FROM_ENUM: Record<LoveLanguage, LoveLanguageKey> = {
  WORDS_OF_AFFIRMATION: "wordsOfAffirmation",
  QUALITY_TIME: "qualityTime",
  RECEIVING_GIFTS: "receivingGifts",
  ACTS_OF_SERVICE: "actsOfService",
  PHYSICAL_TOUCH: "physicalTouch",
};

export const LOVE_LANGUAGE_LABEL: Record<LoveLanguageKey, string> = {
  wordsOfAffirmation: "Palabras de Afirmación",
  qualityTime: "Tiempo de Calidad",
  receivingGifts: "Regalos",
  actsOfService: "Actos de Servicio",
  physicalTouch: "Toque Físico",
};

export const LOVE_LANGUAGE_COLOR: Record<LoveLanguageKey, string> = {
  wordsOfAffirmation: "#e11d48",
  qualityTime: "#2563eb",
  receivingGifts: "#d97706",
  actsOfService: "#059669",
  physicalTouch: "#7c3aed",
};

export const LOVE_LANGUAGE_SHORT_DESCRIPTION: Record<LoveLanguageKey, string> = {
  wordsOfAffirmation: "Te llenan el tanque emocional los elogios sinceros, el reconocimiento y las palabras de aliento.",
  qualityTime: "Sentís el amor cuando alguien te dedica atención plena, sin distracciones, y comparte momentos con vos.",
  receivingGifts: "Un detalle pensado especialmente para vos vale más que su precio: es la prueba visible de que te tuvieron presente.",
  actsOfService: "Las acciones concretas que te facilitan la vida dicen 'te quiero' más fuerte que cualquier palabra.",
  physicalTouch: "Un abrazo, una mano en el hombro o un gesto físico cercano te hacen sentir seguro/a y conectado/a.",
};

export const LOVE_LANGUAGE_INTERPRETATION: Record<LoveLanguageKey, { meaning: string; tip: string }> = {
  wordsOfAffirmation: {
    meaning:
      "Tu lenguaje principal es Palabras de Afirmación. Necesitás escuchar, de forma explícita y sincera, que sos valorado/a: un 'gracias', un 'estoy orgulloso/a de vos' o un reconocimiento público tienen un efecto profundo en cómo percibís el cariño que te tienen. El silencio o la crítica, en cambio, te pesan más de lo habitual.",
    tip: "Pedí explícitamente lo que necesitás escuchar y, a la vez, practicá decir en voz alta lo que valorás de las personas importantes para vos: la reciprocidad fortalece este lenguaje.",
  },
  qualityTime: {
    meaning:
      "Tu lenguaje principal es Tiempo de Calidad. Lo que más te conecta con otra persona es su atención completa: una conversación sin celular de por medio, una actividad compartida o simplemente estar presente. Sentís la distancia emocional cuando el tiempo compartido es escaso o está lleno de distracciones.",
    tip: "Reservá momentos fijos, aunque sean cortos, dedicados exclusivamente a estar con la otra persona sin pantallas ni interrupciones. La calidad de la atención importa más que la duración.",
  },
  receivingGifts: {
    meaning:
      "Tu lenguaje principal es Regalos. No se trata de materialismo, sino del significado simbólico: un detalle elegido con intención te demuestra que alguien pensó en vos incluso cuando no estabas presente. Las fechas olvidadas o la ausencia de gestos concretos pueden dolerte más de lo que dejás ver.",
    tip: "No hace falta gastar mucho: un regalo pequeño pero pensado, entregado en el momento justo, comunica el mismo cariño que uno costoso. Animate también a expresar qué tipo de detalles te llegan más.",
  },
  actsOfService: {
    meaning:
      "Tu lenguaje principal es Actos de Servicio. Para vos, el amor se demuestra haciendo: una tarea resuelta sin que la pidas, una ayuda oportuna o un compromiso cumplido valen más que mil palabras bonitas. Las promesas incumplidas te generan una frustración particular.",
    tip: "Comunicá con claridad qué tareas o ayudas te aliviarían de verdad, y reconocé cuando alguien hace ese esfuerzo por vos: así el gesto se vuelve un hábito compartido.",
  },
  physicalTouch: {
    meaning:
      "Tu lenguaje principal es Toque Físico. La cercanía corporal (un abrazo, tomarse de la mano, un gesto de apoyo físico) es, para vos, una de las formas más directas de sentirte querido/a y seguro/a en un vínculo. Su ausencia puede sentirse como distancia emocional, incluso si no lo es.",
    tip: "Buscá momentos naturales de contacto físico apropiado en tu día a día y comunicá con confianza cuánto valorás esos gestos: para muchas personas no es algo obvio y agradecen que se lo digan.",
  },
};

export type Question = {
  id: string;
  language: LoveLanguageKey;
  text: string;
};

/**
 * 25 afirmaciones originales (5 por lenguaje), inspiradas en el marco de
 * "Los 5 lenguajes del amor" de Gary Chapman, evaluadas con escala de
 * acuerdo 1-5 (no son una reproducción del test oficial del libro).
 */
export const QUESTIONS: Question[] = [
  // Palabras de afirmación
  { id: "wa1", language: "wordsOfAffirmation", text: "Me siento profundamente valorado/a cuando alguien me dice en voz alta que está orgulloso/a de mí." },
  { id: "wa2", language: "wordsOfAffirmation", text: "Un simple 'te quiero' dicho con sinceridad puede cambiarme el ánimo del día." },
  { id: "wa3", language: "wordsOfAffirmation", text: "Aprecio mucho cuando reconocen abiertamente mi esfuerzo o mis logros." },
  { id: "wa4", language: "wordsOfAffirmation", text: "Las palabras de aliento me motivan más que casi cualquier otra muestra de cariño." },
  { id: "wa5", language: "wordsOfAffirmation", text: "Un comentario negativo o una crítica dura me afecta más de lo que suelo admitir." },
  // Tiempo de calidad
  { id: "qt1", language: "qualityTime", text: "Nada me hace sentir más querido/a que tener la atención completa de alguien, sin distracciones." },
  { id: "qt2", language: "qualityTime", text: "Prefiero una conversación profunda y sin apuro antes que un regalo costoso." },
  { id: "qt3", language: "qualityTime", text: "Me siento conectado/a cuando compartimos una actividad juntos, solo nosotros dos." },
  { id: "qt4", language: "qualityTime", text: "Cuando la otra persona está distraída con el celular mientras hablamos, siento que no me escucha de verdad." },
  { id: "qt5", language: "qualityTime", text: "Planear tiempo exclusivo con alguien importante es, para mí, una prioridad real." },
  // Regalos
  { id: "rg1", language: "receivingGifts", text: "Recibir un detalle, aunque sea pequeño, me hace sentir que pensaron en mí." },
  { id: "rg2", language: "receivingGifts", text: "Guardo con cariño los regalos que me dieron personas importantes en mi vida." },
  { id: "rg3", language: "receivingGifts", text: "Me emociona más el gesto de haber elegido algo especialmente para mí que el valor económico del regalo." },
  { id: "rg4", language: "receivingGifts", text: "Olvidar una fecha especial sin ningún detalle me afecta más de lo que suelo demostrar." },
  { id: "rg5", language: "receivingGifts", text: "Disfruto sorprender a otras personas con obsequios que sé que les van a gustar." },
  // Actos de servicio
  { id: "as1", language: "actsOfService", text: "Que alguien se ofrezca a ayudarme con una tarea pendiente me hace sentir muy querido/a." },
  { id: "as2", language: "actsOfService", text: "Valoro más las acciones concretas de ayuda que las palabras bonitas sin acción detrás." },
  { id: "as3", language: "actsOfService", text: "Cuando alguien hace algo por mí sin que se lo pida, siento que realmente me conoce." },
  { id: "as4", language: "actsOfService", text: "Me frustra especialmente cuando alguien promete ayudar y después no cumple." },
  { id: "as5", language: "actsOfService", text: "Demuestro mi cariño principalmente haciendo cosas útiles por las personas que quiero." },
  // Contacto físico
  { id: "pt1", language: "physicalTouch", text: "Un abrazo o una caricia en el momento justo dicen más que mil palabras para mí." },
  { id: "pt2", language: "physicalTouch", text: "Tomarnos de la mano o caminar cerca de alguien me hace sentir conectado/a." },
  { id: "pt3", language: "physicalTouch", text: "Necesito cercanía física para sentirme realmente seguro/a en una relación cercana." },
  { id: "pt4", language: "physicalTouch", text: "Un abrazo prolongado después de un mal día me reconforta enormemente." },
  { id: "pt5", language: "physicalTouch", text: "El contacto físico apropiado (abrazos, mimos) es, para mí, esencial en cualquier vínculo cercano." },
];

export const ANSWER_SCALE = [
  { value: 1, label: "Nunca" },
  { value: 2, label: "Casi nunca" },
  { value: 3, label: "A veces" },
  { value: 4, label: "Casi siempre" },
  { value: 5, label: "Siempre" },
];

export type Scores = Record<LoveLanguageKey, number>;
export type Percentages = Record<LoveLanguageKey, number>;

export function computeScores(answers: Record<string, number>): Scores {
  const scores: Scores = {
    wordsOfAffirmation: 0,
    qualityTime: 0,
    receivingGifts: 0,
    actsOfService: 0,
    physicalTouch: 0,
  };

  for (const question of QUESTIONS) {
    const raw = answers[question.id];
    const value = Number.isFinite(raw) ? Math.min(5, Math.max(1, Math.round(raw))) : 1;
    scores[question.language] += value;
  }

  return scores;
}

export function computePercentages(scores: Scores): Percentages {
  const total = LOVE_LANGUAGE_ORDER.reduce((sum, key) => sum + scores[key], 0) || 1;
  const percentages = {} as Percentages;
  for (const key of LOVE_LANGUAGE_ORDER) {
    percentages[key] = Math.round((scores[key] / total) * 1000) / 10;
  }
  return percentages;
}

export function rankLanguages(scores: Scores): LoveLanguageKey[] {
  return [...LOVE_LANGUAGE_ORDER].sort((a, b) => scores[b] - scores[a]);
}
