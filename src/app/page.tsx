import { LoveLanguageQuiz } from "@/components/love-language-quiz";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <LoveLanguageQuiz />
      </div>
    </div>
  );
}
