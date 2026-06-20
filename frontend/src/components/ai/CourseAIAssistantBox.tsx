import { useState } from "react";
import {
  askCourseAI,
  generateCourseQuiz,
  generateCourseExercises,
  generateCourseExamples,
} from "../../api/ai";

type Props = {
  courseId: number;
};

type HistoryItem = {
  action: string;
  input: string;
  output: string;
};

type ApiErrorResponse = {
  response?: {
    data?: {
      error?: string;
    };
  };
};

function getErrorMessage(error: unknown): string {
  const apiError = error as ApiErrorResponse;

  return (
    apiError.response?.data?.error ||
    "حدث خطأ أثناء الاتصال بالمساعد الذكي."
  );
}

export default function CourseAIAssistantBox({ courseId }: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAction(
    action: "ask" | "quiz" | "exercises" | "examples"
  ) {
    const text = input.trim();

    if (!text) {
      setError("اكتب سؤالًا أو طلبًا أولًا.");
      return;
    }

    setError("");
    setResult("");
    setLoadingAction(action);

    try {
      let response;

      if (action === "ask") {
        response = await askCourseAI(courseId, text);
      } else if (action === "quiz") {
        response = await generateCourseQuiz(courseId, text);
      } else if (action === "exercises") {
        response = await generateCourseExercises(courseId, text);
      } else {
        response = await generateCourseExamples(courseId, text);
      }

      setResult(response.result);

      setHistory((prev) => [
        {
          action,
          input: text,
          output: response.result,
        },
        ...prev.slice(0, 4),
      ]);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoadingAction(null);
    }
  }

  const isLoading = loadingAction !== null;

  return (
    <section className="mt-8 rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-black text-sky-600">AI Assistant</p>
        <h2 className="text-2xl font-black text-slate-900">
          المساعد الذكي الخاص بالكورس
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          اسأل عن محتوى هذا الكورس فقط، أو اطلب تمارين واختبارات وأمثلة من المادة العلمية.
        </p>
      </div>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        disabled={isLoading}
        placeholder="مثال: اشرح المضارع البسيط، أو اعمل اختبار من 5 أسئلة..."
        className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
      />

      {error && (
        <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleAction("ask")}
          disabled={isLoading}
          className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "ask" ? "جاري الإجابة..." : "اسأل"}
        </button>

        <button
          type="button"
          onClick={() => void handleAction("quiz")}
          disabled={isLoading}
          className="rounded-2xl border border-sky-200 px-5 py-3 text-sm font-black text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "quiz" ? "جاري إنشاء الاختبار..." : "اختبار"}
        </button>

        <button
          type="button"
          onClick={() => void handleAction("exercises")}
          disabled={isLoading}
          className="rounded-2xl border border-sky-200 px-5 py-3 text-sm font-black text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "exercises" ? "جاري إنشاء التمارين..." : "تمارين"}
        </button>

        <button
          type="button"
          onClick={() => void handleAction("examples")}
          disabled={isLoading}
          className="rounded-2xl border border-sky-200 px-5 py-3 text-sm font-black text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "examples" ? "جاري إنشاء الأمثلة..." : "أمثلة"}
        </button>
      </div>

      {result && (
        <div className="mt-5 rounded-3xl bg-slate-50 p-5">
          <h3 className="mb-3 text-sm font-black text-slate-800">النتيجة</h3>
          <p className="whitespace-pre-line text-sm leading-8 text-slate-700">
            {result}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <h3 className="mb-3 text-sm font-black text-slate-800">
            آخر النتائج
          </h3>

          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={`${item.action}-${index}`}
                className="rounded-2xl border border-slate-100 p-3"
              >
                <p className="text-xs font-black text-sky-600">
                  {item.action}
                </p>
                <p className="mt-1 text-sm text-slate-700">{item.input}</p>
                <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-slate-500">
                  {item.output}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}