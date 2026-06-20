import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  Lock,
  PlayCircle,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import api from "../../api/axios";
import PublicNavbar from "../../components/layout/PublicNavbar";
import PublicFooter from "../../components/layout/PublicFooter";

type Course = {
  id: number;
  subject: number;
  subject_name: string;
  teacher: number;
  teacher_name: string;
  title: string;
  description: string;
  image: string | null;
  price: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  has_access?: boolean;
  is_enrolled?: boolean;
};

type LessonResource = {
  id: number;
  lesson: number;
  title: string;
  file: string;
  description: string | null;
  uploaded_by: number | null;
  uploaded_by_name: string | null;
  created_at: string;
};

type Lesson = {
  id: number;
  course: number;
  title: string;
  description: string | null;
  video_provider: string;
  video_asset_id: string | null;
  video_playback_id: string | null;
  thumbnail: string | null;
  order: number;
  duration: string | null;
  is_preview: boolean;
  is_published: boolean;
  resources: LessonResource[];
  created_at: string;
  updated_at: string;
};

type PurchaseCreateResponse = {
  message: string;
  purchase: {
    id: number;
  };
};

function isUserLoggedIn() {
  return Boolean(localStorage.getItem("user"));
}

function getImageUrl(image: string | null): string {
  if (!image) return "";

  if (image.startsWith("http")) return image;

  return `http://127.0.0.1:8000${image}`;
}

function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [previewLessons, setPreviewLessons] = useState<Lesson[]>([]);

  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);

  const [error, setError] = useState("");
  const [lessonsError, setLessonsError] = useState("");

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseMethod, setPurchaseMethod] = useState<"code" | "online" | null>(
    null
  );
  const [code, setCode] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = isUserLoggedIn();
  const hasCourseAccess = Boolean(course?.has_access || course?.is_enrolled);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function loadCourseDetails() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Course>(`/courses/${id}/`);

        if (!isMounted) return;

        setCourse(response.data);
      } catch {
        if (!isMounted) return;

        setError("حدث خطأ أثناء تحميل تفاصيل الكورس.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadCourseDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function loadPreviewLessons() {
      try {
        setLessonsLoading(true);
        setLessonsError("");

        const response = await api.get<Lesson[]>(
          `/courses/${id}/preview-lessons/`
        );

        if (!isMounted) return;

        setPreviewLessons(response.data);
      } catch {
        if (!isMounted) return;

        setLessonsError("حدث خطأ أثناء تحميل الدروس المجانية.");
      } finally {
        if (isMounted) {
          setLessonsLoading(false);
        }
      }
    }

    void loadPreviewLessons();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function refreshCourse() {
    if (!id) return;

    try {
      const response = await api.get<Course>(`/courses/${id}/`);
      setCourse(response.data);
      setError("");
    } catch {
      setError("حدث خطأ أثناء تحديث بيانات الكورس.");
    }
  }

  function openPurchaseModal() {
    setIsPurchaseModalOpen(true);
    setPurchaseMethod(null);
    setCode("");
    setModalError("");
    setModalSuccess("");
  }

  function closePurchaseModal() {
    if (submitting) return;

    setIsPurchaseModalOpen(false);
    setPurchaseMethod(null);
    setCode("");
    setModalError("");
    setModalSuccess("");
  }

  function handleEnterCourseContent() {
    if (!course) return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (hasCourseAccess) {
      navigate(`/courses/${course.id}/lessons`);
      return;
    }

    openPurchaseModal();
  }

  async function handleRedeemCode() {
    if (!course) return;

    if (!code.trim()) {
      setModalError("يرجى إدخال رمز التفعيل.");
      return;
    }

    setSubmitting(true);
    setModalError("");
    setModalSuccess("");

    try {
      await api.post("/access-codes/redeem/", {
        code: code.trim(),
      });

      setModalSuccess("تم تفعيل الكورس بنجاح.");
      await refreshCourse();
    } catch {
      setModalError("الرمز غير صحيح أو مستخدم أو منتهي الصلاحية.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOnlinePurchase() {
    if (!course) return;

    setSubmitting(true);
    setModalError("");
    setModalSuccess("");

    try {
      const createResponse = await api.post<PurchaseCreateResponse>(
        "/purchases/create/",
        {
          course_id: course.id,
        }
      );

      const purchaseId = createResponse.data.purchase.id;

      await api.post(`/purchases/${purchaseId}/complete/`);

      setModalSuccess("تم شراء الكورس بنجاح بشكل تجريبي.");
      await refreshCourse();
    } catch {
      setModalError("حدث خطأ أثناء تنفيذ الشراء التجريبي.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 gap-3">
        <Loader2 className="animate-spin" />
        جاري تحميل تفاصيل الكورس...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
        dir="rtl"
      >
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center max-w-md">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            لم يتم العثور على الكورس
          </h2>

          <p className="text-slate-500 mb-6">
            {error || "هذا الكورس غير متاح حاليًا."}
          </p>

          <Link
            to="/subjects"
            className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition"
          >
            العودة إلى المواد
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(course.image);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <PublicNavbar />

      <main>
        <section className="bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-4 py-10 lg:py-14">
            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 text-sky-300 font-bold mb-8"
            >
              <ArrowRight size={18} />
              العودة إلى المواد
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <span className="inline-flex items-center rounded-full bg-sky-500/15 border border-sky-400/30 px-4 py-1.5 text-sm font-bold text-sky-200">
                  {course.subject_name}
                </span>

                <h1 className="mt-5 text-4xl md:text-5xl font-black leading-tight">
                  {course.title}
                </h1>

                <p className="mt-5 text-lg leading-9 text-slate-300 max-w-3xl">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                  <span>المدرّس: {course.teacher_name || "غير محدد"}</span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    مناسب لطلاب التوجيهي
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>ادرس حسب وقتك ومن أي مكان</span>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white text-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                  <div className="h-56 bg-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BookOpen size={56} />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-3xl font-black text-slate-950">
                      {course.price} JD
                    </p>

                    {hasCourseAccess && (
                      <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 font-bold flex items-center gap-2">
                        <CheckCircle2 size={20} />
                        أنت تملك هذا الكورس
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleEnterCourseContent}
                      className="mt-5 w-full px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md transition flex items-center justify-center gap-2"
                    >
                      {hasCourseAccess ? (
                        <>
                          <PlayCircle size={20} />
                          ابدأ التعلم الآن
                        </>
                      ) : (
                        <>
                          <Lock size={20} />
                          افتح محتوى الكورس
                        </>
                      )}
                    </button>

                    {!hasCourseAccess && (
                      <p className="mt-3 text-xs leading-6 text-slate-500 text-center">
                        بعد التفعيل ستتمكن من مشاهدة الدروس، استخدام الملفات،
                        ومتابعة محتوى الكورس كاملًا.
                      </p>
                    )}

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <h3 className="font-black mb-4">ماذا ستحصل عليه؟</h3>

                      <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <PlayCircle size={18} className="text-sky-500" />
                          دروس فيديو مرتبة تساعدك تدرس خطوة بخطوة
                        </li>
                        <li className="flex items-center gap-2">
                          <BookOpen size={18} className="text-sky-500" />
                          ملفات وملاحظات تساعدك أثناء المراجعة
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles size={18} className="text-sky-500" />
                          تجربة تعليمية تساعدك على الفهم والمتابعة
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-black mb-6">
                كيف يساعدك هذا الكورس؟
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 flex gap-3">
                  <CheckCircle2 className="text-sky-500 shrink-0" />
                  <p className="text-slate-700 leading-7">
                    تفهم الدروس بطريقة مرتبة بدل الدراسة العشوائية.
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 flex gap-3">
                  <CheckCircle2 className="text-sky-500 shrink-0" />
                  <p className="text-slate-700 leading-7">
                    تراجع من الملفات والملاحظات المرفقة مع الدروس.
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 flex gap-3">
                  <CheckCircle2 className="text-sky-500 shrink-0" />
                  <p className="text-slate-700 leading-7">
                    تشاهد بعض الدروس المجانية قبل أن تقرر إكمال الكورس.
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 flex gap-3">
                  <CheckCircle2 className="text-sky-500 shrink-0" />
                  <p className="text-slate-700 leading-7">
                    تتابع المحتوى براحة وتعود للدروس وقت ما تحتاج.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black">جرّب قبل أن تبدأ</h2>
                  <p className="mt-2 text-slate-500 leading-7">
                    شاهد الدروس المجانية المتاحة لتأخذ فكرة عن أسلوب الشرح
                    ومحتوى الكورس.
                  </p>
                </div>

                <span className="hidden sm:inline-flex rounded-full bg-sky-50 border border-sky-100 px-4 py-2 text-xs font-black text-sky-600">
                  دروس مجانية
                </span>
              </div>

              {lessonsLoading && (
                <div className="flex items-center gap-3 text-slate-500">
                  <Loader2 className="animate-spin" size={20} />
                  جاري تحميل الدروس المجانية...
                </div>
              )}

              {lessonsError && (
                <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 p-4 text-sm font-bold">
                  {lessonsError}
                </div>
              )}

              {!lessonsLoading &&
                !lessonsError &&
                previewLessons.length === 0 && (
                  <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6 text-slate-500">
                    لا توجد دروس مجانية متاحة حاليًا.
                  </div>
                )}

              {!lessonsLoading && !lessonsError && previewLessons.length > 0 && (
                <div className="space-y-4">
                  {previewLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="rounded-3xl bg-slate-50 border border-slate-100 p-5 hover:bg-slate-100 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                            <PlayCircle size={24} />
                          </div>

                          <div>
                            <h3 className="font-black text-slate-900">
                              {lesson.order}. {lesson.title}
                            </h3>

                            {lesson.description && (
                              <p className="mt-2 text-sm text-slate-600 leading-7">
                                {lesson.description}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              {lesson.duration && (
                                <span>المدة: {lesson.duration}</span>
                              )}

                              <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 font-bold text-emerald-600">
                                متاح مجانًا
                              </span>
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/lessons/${lesson.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-sky-300 hover:text-sky-600 transition"
                        >
                          <PlayCircle size={18} />
                          مشاهدة الدرس
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-black mb-4">عن هذا الكورس</h2>

              <p className="text-slate-600 leading-9">{course.description}</p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <h3 className="text-xl font-black mb-5">ملخص الكورس</h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">المادة</span>
                  <span className="font-bold text-slate-900">
                    {course.subject_name}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">المدرّس</span>
                  <span className="font-bold text-slate-900">
                    {course.teacher_name || "غير محدد"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">السعر</span>
                  <span className="font-bold text-slate-900">
                    {course.price} JD
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">دروس مجانية للتجربة</span>
                  <span className="font-bold text-slate-900">
                    {previewLessons.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">الوصول للكورس</span>
                  <span className="font-bold text-slate-900">
                    {hasCourseAccess ? "مفعّل لديك" : "يحتاج تفعيل"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
          <PublicFooter />


      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-black">افتح محتوى الكورس</h3>
                <p className="text-slate-500 mt-2">
                  {course.title} — {course.price} JD
                </p>
                <p className="text-sm text-slate-500 mt-3 leading-7">
                  بعد التفعيل ستتمكن من مشاهدة الدروس الكاملة والرجوع إليها
                  وقت ما تحتاج.
                </p>
              </div>

              <button
                type="button"
                onClick={closePurchaseModal}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <X size={20} />
              </button>
            </div>

            {!purchaseMethod && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPurchaseMethod("code")}
                  className="p-5 rounded-3xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-right transition"
                >
                  <h4 className="font-black text-lg">لديك رمز تفعيل؟</h4>
                  <p className="text-sm text-slate-500 mt-2 leading-6">
                    أدخل الرمز لتفعيل الكورس مباشرة.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPurchaseMethod("online")}
                  className="p-5 rounded-3xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-right transition"
                >
                  <h4 className="font-black text-lg">شراء الكورس</h4>
                  <p className="text-sm text-slate-500 mt-2 leading-6">
                    سيتم تفعيل الكورس لك مباشرة بعد الشراء التجريبي.
                  </p>
                </button>
              </div>
            )}

            {purchaseMethod === "code" && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  رمز التفعيل
                </label>

                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="مثال: A7K9P2QX"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />

                <div className="flex items-center gap-3 mt-5">
                  <button
                    type="button"
                    onClick={handleRedeemCode}
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold disabled:opacity-60 transition"
                  >
                    {submitting ? "جاري التفعيل..." : "تفعيل الكورس"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPurchaseMethod(null)}
                    disabled={submitting}
                    className="px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700 disabled:opacity-60"
                  >
                    رجوع
                  </button>
                </div>
              </div>
            )}

            {purchaseMethod === "online" && (
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                <p className="text-slate-600 leading-7">
                  هذه نسخة تجريبية، لذلك سيتم تفعيل الكورس مباشرة بدون بوابة دفع
                  حقيقية.
                </p>

                <div className="flex items-center gap-3 mt-5">
                  <button
                    type="button"
                    onClick={handleOnlinePurchase}
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold disabled:opacity-60 transition"
                  >
                    {submitting ? "جاري التفعيل..." : "تفعيل الكورس الآن"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPurchaseMethod(null)}
                    disabled={submitting}
                    className="px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700 disabled:opacity-60"
                  >
                    رجوع
                  </button>
                </div>
              </div>
            )}

            {modalError && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-bold">
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="mt-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 text-sm font-bold">
                {modalSuccess}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;