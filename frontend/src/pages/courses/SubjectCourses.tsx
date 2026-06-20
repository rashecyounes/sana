import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, Loader2, X } from "lucide-react";

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

function SubjectCourses() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [purchaseMethod, setPurchaseMethod] = useState<
    "code" | "online" | null
  >(null);
  const [code, setCode] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = isUserLoggedIn();

  useEffect(() => {
    let isMounted = true;

    void api
      .get<Course[]>("/courses/", {
        params: {
          subject: slug,
        },
      })
      .then((response) => {
        if (!isMounted) return;

        setCourses(response.data);
        setError("");
      })
      .catch(() => {
        if (!isMounted) return;

        setError("حدث خطأ أثناء تحميل الكورسات. حاول مرة أخرى.");
      })
      .finally(() => {
        if (!isMounted) return;

        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  async function refreshCourses() {
    try {
      const response = await api.get<Course[]>("/courses/", {
        params: {
          subject: slug,
        },
      });

      setCourses(response.data);
      setError("");
    } catch {
      setError("حدث خطأ أثناء تحديث الكورسات.");
    }
  }

  function openPurchaseModal(course: Course) {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setSelectedCourse(course);
    setPurchaseMethod(null);
    setCode("");
    setModalError("");
    setModalSuccess("");
  }

  function closePurchaseModal() {
    if (submitting) return;

    setSelectedCourse(null);
    setPurchaseMethod(null);
    setCode("");
    setModalError("");
    setModalSuccess("");
  }

  async function handleRedeemCode() {
    if (!selectedCourse) return;

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
      await refreshCourses();
    } catch {
      setModalError("الرمز غير صحيح أو مستخدم أو منتهي الصلاحية.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOnlinePurchase() {
    if (!selectedCourse) return;

    setSubmitting(true);
    setModalError("");
    setModalSuccess("");

    try {
      const createResponse = await api.post<PurchaseCreateResponse>(
        "/purchases/create/",
        {
          course_id: selectedCourse.id,
        }
      );

      const purchaseId = createResponse.data.purchase.id;

      await api.post(`/purchases/${purchaseId}/complete/`);

      setModalSuccess("تم شراء الكورس بنجاح بشكل تجريبي.");
      await refreshCourses();
    } catch {
      setModalError("حدث خطأ أثناء تنفيذ الشراء التجريبي.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <Link
          to="/subjects"
          className="inline-flex items-center gap-2 text-sky-600 font-bold mb-8"
        >
          <ArrowRight size={18} />
          العودة إلى المواد
        </Link>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5">
            <BookOpen size={30} />
          </div>

          <h2 className="text-3xl md:text-5xl font-black leading-tight">
            كورسات المادة
          </h2>

          <p className="text-slate-500 mt-5 leading-8 text-lg">
            اختر الكورس المناسب لك، ثم يمكنك شراء الكورس أونلاين بشكل تجريبي أو
            تفعيله باستخدام رمز.
          </p>
        </section>

        <section className="mt-8">
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-500 gap-3">
              <Loader2 className="animate-spin" />
              جاري تحميل الكورسات...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-5">
              {error}
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center">
              <h3 className="text-xl font-black mb-2">لا توجد كورسات بعد</h3>
              <p className="text-slate-500">
                لم يتم نشر أي كورسات لهذه المادة حتى الآن.
              </p>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <Link to={`/courses/${course.id}`}>
                    <div className="h-52 bg-slate-100 overflow-hidden">
                      {course.image ? (
                        <img
                          src={getImageUrl(course.image)}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <BookOpen size={52} />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-xs font-bold bg-sky-50 text-sky-600 px-3 py-1 rounded-full">
                        {course.subject_name}
                      </span>

                      <span className="text-sm font-black text-slate-900">
                        {course.price} JD
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900">
                      {course.title}
                    </h3>

                    <p className="text-slate-500 mt-3 leading-7 line-clamp-3">
                      {course.description}
                    </p>

                    <p className="text-slate-400 text-sm mt-4">
                      المدرّس: {course.teacher_name || "غير محدد"}
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <Link
                        to={`/courses/${course.id}`}
                        className="flex-1 text-center px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        عرض التفاصيل
                      </Link>

                      {course.has_access ? (
                        <span className="flex-1 text-center px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-bold">
                          أنت تملك الكورس
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openPurchaseModal(course)}
                          className="flex-1 px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md transition"
                        >
                          شراء
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <PublicFooter />

      {selectedCourse && (
        <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-black">شراء الكورس</h3>
                <p className="text-slate-500 mt-2">
                  {selectedCourse.title} — {selectedCourse.price} JD
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
                  <h4 className="font-black text-lg">التفعيل بالرمز</h4>
                  <p className="text-sm text-slate-500 mt-2 leading-6">
                    أدخل رمز التفعيل الذي حصلت عليه.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPurchaseMethod("online")}
                  className="p-5 rounded-3xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-right transition"
                >
                  <h4 className="font-black text-lg">شراء أونلاين</h4>
                  <p className="text-sm text-slate-500 mt-2 leading-6">
                    حاليًا سيتم الشراء مباشرة بشكل تجريبي.
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
                  في النسخة الحالية لا توجد بوابة دفع حقيقية. عند الضغط على
                  الزر سيتم اعتبار الدفع ناجحًا وتجريبيًا.
                </p>

                <div className="flex items-center gap-3 mt-5">
                  <button
                    type="button"
                    onClick={handleOnlinePurchase}
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold disabled:opacity-60 transition"
                  >
                    {submitting ? "جاري الشراء..." : "إكمال الشراء التجريبي"}
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

export default SubjectCourses;