"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Button, Card, Input, Label } from "@/components/ui";
import {
  ANSWER_SCALE,
  LOVE_LANGUAGE_COLOR,
  LOVE_LANGUAGE_INTERPRETATION,
  LOVE_LANGUAGE_LABEL,
  LOVE_LANGUAGE_SHORT_DESCRIPTION,
  LoveLanguageKey,
  Percentages,
  QUESTIONS,
  Scores,
} from "@/lib/love-languages";

type Step = "intro" | "quiz" | "form" | "result";

type ResultResponse = {
  id: string;
  scores: Scores;
  percentages: Percentages;
  primaryLanguage: LoveLanguageKey;
  secondaryLanguage: LoveLanguageKey;
  emailDelivered: boolean;
};

export function LoveLanguageQuiz() {
  const [step, setStep] = useState<Step>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultResponse | null>(null);

  const currentQuestion = QUESTIONS[questionIndex];
  const progress = Math.round((questionIndex / QUESTIONS.length) * 100);

  function selectAnswer(value: number) {
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    if (questionIndex + 1 < QUESTIONS.length) {
      setQuestionIndex((i) => i + 1);
    } else {
      setStep("form");
    }
  }

  function goBack() {
    if (questionIndex === 0) {
      setStep("intro");
      return;
    }
    setQuestionIndex((i) => i - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/love-languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, answers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No se pudo procesar tu resultado");
        setLoading(false);
        return;
      }
      setResult(data);
      setStep("result");
    } catch {
      setError("Ocurrió un error inesperado. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "intro") {
    return <IntroScreen onStart={() => setStep("quiz")} />;
  }

  if (step === "quiz") {
    return (
      <QuizScreen
        question={currentQuestion}
        index={questionIndex}
        total={QUESTIONS.length}
        progress={progress}
        selected={answers[currentQuestion.id]}
        onSelect={selectAnswer}
        onBack={goBack}
      />
    );
  }

  if (step === "form") {
    return (
      <FormScreen
        name={name}
        email={email}
        loading={loading}
        error={error}
        onChangeName={setName}
        onChangeEmail={setEmail}
        onSubmit={handleSubmit}
        onBack={() => setStep("quiz")}
      />
    );
  }

  if (result) {
    return <ResultScreen name={name} result={result} />;
  }

  return null;
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <Card className="text-center">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-rose-600 dark:text-rose-400">
        Emprendedores Makeover
      </p>
      <h1 className="mb-3 text-2xl font-semibold">¿Cuál es tu lenguaje del amor?</h1>
      <p className="mx-auto mb-6 max-w-md text-sm text-slate-600 dark:text-slate-400">
        Un test de 25 preguntas, inspirado en el libro <em>Los 5 Lenguajes del Amor</em> de Gary Chapman, para
        descubrir cómo das y recibís cariño. Al finalizar vas a ver el porcentaje de cada lenguaje, la
        interpretación de tu resultado, y vas a poder descargarlo en PDF o recibirlo por email.
      </p>
      <div className="mx-auto mb-8 grid max-w-md grid-cols-1 gap-2 text-left sm:grid-cols-2">
        {(Object.keys(LOVE_LANGUAGE_LABEL) as LoveLanguageKey[]).map((key) => (
          <div key={key} className="flex items-start gap-2 rounded-lg border border-slate-200 p-2 text-xs dark:border-slate-800">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: LOVE_LANGUAGE_COLOR[key] }} />
            <span className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">{LOVE_LANGUAGE_LABEL[key]}</strong>
            </span>
          </div>
        ))}
      </div>
      <Button onClick={onStart} className="px-8">
        Comenzar el test
      </Button>
      <p className="mt-4 text-xs text-slate-400">Toma unos 5 minutos. Tus datos se usan solo para enviarte el resultado.</p>
    </Card>
  );
}

function QuizScreen({
  question,
  index,
  total,
  progress,
  selected,
  onSelect,
  onBack,
}: {
  question: (typeof QUESTIONS)[number];
  index: number;
  total: number;
  progress: number;
  selected: number | undefined;
  onSelect: (value: number) => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Pregunta {index + 1} de {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-rose-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="mb-8 min-h-16 text-lg font-medium text-slate-800 dark:text-slate-100">{question.text}</p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {ANSWER_SCALE.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={clsx(
              "rounded-lg border px-3 py-3 text-sm font-medium transition-colors",
              selected === option.value
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        ← Volver
      </button>
    </Card>
  );
}

function FormScreen({
  name,
  email,
  loading,
  error,
  onChangeName,
  onChangeEmail,
  onSubmit,
  onBack,
}: {
  name: string;
  email: string;
  loading: boolean;
  error: string | null;
  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <h2 className="mb-1 text-xl font-semibold">Ya casi terminamos</h2>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Ingresá tus datos para ver tu resultado, descargarlo en PDF y recibir una copia por email.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="ll-name">Nombre</Label>
          <Input id="ll-name" required value={name} onChange={(e) => onChangeName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="ll-email">Email</Label>
          <Input
            id="ll-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Calculando resultado..." : "Ver mi resultado"}
          </Button>
        </div>
      </form>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        ← Volver a las preguntas
      </button>
    </Card>
  );
}

function ResultScreen({ name, result }: { name: string; result: ResultResponse }) {
  const chartData = useMemo(
    () =>
      (Object.keys(LOVE_LANGUAGE_LABEL) as LoveLanguageKey[])
        .map((key) => ({
          key,
          name: LOVE_LANGUAGE_LABEL[key],
          value: result.percentages[key],
          color: LOVE_LANGUAGE_COLOR[key],
        }))
        .sort((a, b) => b.value - a.value),
    [result.percentages],
  );

  const interpretation = LOVE_LANGUAGE_INTERPRETATION[result.primaryLanguage];

  return (
    <div className="space-y-4">
      <Card className="text-center">
        <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">El lenguaje del amor de {name} es</p>
        <h1 className="mb-1 text-3xl font-bold" style={{ color: LOVE_LANGUAGE_COLOR[result.primaryLanguage] }}>
          {LOVE_LANGUAGE_LABEL[result.primaryLanguage]}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{result.percentages[result.primaryLanguage]}% de tu perfil</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 dark:text-slate-400">
          {LOVE_LANGUAGE_SHORT_DESCRIPTION[result.primaryLanguage]}
        </p>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Distribución completa</h2>
        <div style={{ height: chartData.length * 44 }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={130} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                label={{ position: "right", formatter: (v: unknown) => `${v ?? 0}%`, fontSize: 12 }}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">¿Qué significa?</h2>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{interpretation.meaning}</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Recomendación</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{interpretation.tip}</p>
      </Card>

      <Card className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tu resultado en PDF</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {result.emailDelivered
              ? "Ya te lo enviamos por email. También podés descargarlo ahora."
              : "Descargalo ahora en formato profesional, listo para guardar o imprimir."}
          </p>
        </div>
        <a href={`/api/love-languages/${result.id}/pdf`} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary">Descargar PDF</Button>
        </a>
      </Card>
    </div>
  );
}
