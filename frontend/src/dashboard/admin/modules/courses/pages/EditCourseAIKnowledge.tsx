import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Loader2, Save, Sparkles, Upload } from "lucide-react";

import {
  getCourseAIKnowledge,
  saveCourseAIKnowledge,
  uploadCourseAIKnowledgeFile,
} from "../../../../../api/aiKnowledge";

type UploadResponse = {
  knowledge: {
    content: string;
    instructions: string | null;
    is_active: boolean;
  };
};

export default function EditCourseAIKnowledge() {
  const { courseId } = useParams<{ courseId: string }>();

  const [content, setContent] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;

    async function loadKnowledge() {
      try {
        setLoading(true);
        setError("");

        const data = await getCourseAIKnowledge(Number(courseId));

        if (!isMounted) return;

        setContent(data.content || "");
        setInstructions(data.instructions || "");
        setIsActive(data.is_active);
      } catch {
        if (!isMounted) return;
        setError("تعذر تحميل مادة المساعد الذكي لهذا الكورس.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadKnowledge();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  async function handleUploadFile() {
    if (!courseId) return;

    if (!selectedFile) {
      setError("اختر ملفًا أولًا.");
      setSuccess("");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const data = (await uploadCourseAIKnowledgeFile(
        Number(courseId),
        selectedFile
      )) as UploadResponse;

      setContent(data.knowledge.content || "");
      setInstructions(data.knowledge.instructions || "");
      setIsActive(data.knowledge.is_active);

      setSelectedFile(null);
      setSuccess("تم رفع الملف واستخراج النص وإضافته للمادة العلمية.");
    } catch {
      setError("تعذر رفع الملف أو استخراج النص منه.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!courseId) return;

    if (!content.trim()) {
      setError("يجب إدخال المادة العلمية قبل الحفظ.");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await saveCourseAIKnowledge(Number(courseId), {
        content: content.trim(),
        instructions: instructions.trim(),
        is_active: isActive,
      });

      setSuccess("تم حفظ مادة المساعد الذكي بنجاح.");
    } catch {
      setError("تعذر حفظ مادة المساعد الذكي.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" />
        جاري تحميل مادة المساعد الذكي...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6" dir="rtl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black text-sky-600">AI Knowledge</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            إدارة مادة المساعد الذكي
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            هذه المادة هي المصدر الوحيد الذي سيعتمد عليه المساعد عند الإجابة داخل هذا الكورس.
          </p>
        </div>

        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowRight size={18} />
          العودة للكورسات
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
          {success}
        </div>
      )}

      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-3 rounded-3xl border border-sky-100 bg-sky-50 p-5">
          <Sparkles className="mt-1 shrink-0 text-sky-600" />

          <div>
            <h2 className="text-lg font-black text-slate-900">
              كيف تستخدم هذه المادة؟
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              اكتب هنا شرح الكورس، القواعد، الأمثلة، النقاط المهمة، الأسئلة المتوقعة،
              وأي معلومات تريد أن يعتمد عليها المساعد. إذا سأل الطالب عن شيء غير موجود هنا،
              يجب أن يرفض المساعد الإجابة.
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-100 bg-slate-50 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-black text-slate-900">
              رفع ملف مادة علمية
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              يمكنك رفع ملف PDF أو Word أو TXT، وسيتم استخراج النص وإضافته تلقائيًا إلى نهاية المادة الحالية.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setSelectedFile(file);
              }}
              disabled={uploading}
              className="flex-1 rounded-2xl border border-slate-200 bg-white p-3 text-sm"
            />

            <button
              type="button"
              onClick={() => void handleUploadFile()}
              disabled={uploading || !selectedFile}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              {uploading ? "جاري الرفع..." : "رفع واستخراج النص"}
            </button>
          </div>

          {selectedFile && (
            <p className="mt-3 text-sm font-bold text-slate-600">
              الملف المحدد: {selectedFile.name}
            </p>
          )}
        </div>

        <label className="mb-2 block text-sm font-black text-slate-800">
          المادة العلمية للكورس
        </label>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="ضع هنا المادة العلمية التي سيعتمد عليها المساعد..."
          className="min-h-[360px] w-full resize-y rounded-2xl border border-slate-200 p-4 text-sm leading-7 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />

        <label className="mb-2 mt-6 block text-sm font-black text-slate-800">
          تعليمات إضافية للمساعد
        </label>

        <textarea
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          placeholder="مثال: أجب بالعربية، اجعل الشرح بسيطًا، استخدم أسلوب مناسب لطلاب التوجيهي..."
          className="min-h-[130px] w-full resize-y rounded-2xl border border-slate-200 p-4 text-sm leading-7 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />

        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-5 w-5 accent-sky-600"
          />

          <span className="text-sm font-bold text-slate-700">
            تفعيل المساعد الذكي لهذا الكورس
          </span>
        </label>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "جاري الحفظ..." : "حفظ مادة المساعد"}
          </button>
        </div>
      </div>
    </div>
  );
}