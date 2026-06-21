import { Link } from "react-router-dom";
import {
  BookOpen,
  ShieldCheck,
  ArrowLeft,
  Layers,
  Sparkles,
} from "lucide-react";

import PublicNavbar from "../../components/layout/PublicNavbar";
import PublicFooter from "../../components/layout/PublicFooter";
function isUserLoggedIn() {
  return Boolean(localStorage.getItem("user"));
}

function Home() {
  const isLoggedIn = isUserLoggedIn();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <PublicNavbar />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-white to-slate-50" />

          <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-sky-100 shadow-sm rounded-full px-4 py-2 text-sm font-bold text-sky-600 mb-6">
                <Sparkles size={17} />
                تعليم منظم ومناسب لطلاب التوجيهي
              </div>

              <h2 className="text-4xl md:text-6xl font-black leading-tight text-slate-950">
                ادرس بذكاء.
                <br />
                تابع دروسك بسهولة.
                <br />
                وابدأ رحلتك التعليمية.
              </h2>

              <p className="mt-6 text-lg text-slate-600 leading-9 max-w-2xl">
                منصة SANA تساعد طلاب التوجيهي على الوصول إلى الدروس
                والكورسات بطريقة مرتبة، واضحة، وآمنة.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to={isLoggedIn ? "/subjects" : "/register"}
                  className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-7 py-4 rounded-2xl font-bold shadow-lg transition"
                >
                  ابدأ الآن
                  <ArrowLeft size={19} />
                </Link>

                <Link
                  to="/subjects"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-7 py-4 rounded-2xl font-bold transition"
                >
                  تصفح المواد
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6">
              <div className="bg-slate-950 rounded-[1.5rem] p-6 text-white">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-slate-400 text-sm">لوحة تعليمية</p>
                    <h3 className="text-2xl font-black mt-1">
                      كورسات التوجيهي
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center">
                    <BookOpen />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <span className="font-bold">اللغة العربية</span>
                    <span className="text-sky-300 text-sm">متاح</span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <span className="font-bold">اللغة الإنجليزية</span>
                    <span className="text-sky-300 text-sm">متاح</span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <span className="font-bold">مواد أخرى</span>
                    <span className="text-slate-400 text-sm">قريبًا</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="subjects" className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black">
              المواد المتاحة حاليًا
            </h2>
            <p className="text-slate-500 mt-4 leading-8">
              نبدأ بالمواد الأساسية، ومع الوقت يمكن توسيع المنصة وإضافة مواد
              أكثر.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-lg transition">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5">
                <BookOpen />
              </div>
              <h3 className="text-xl font-black mb-3">اللغة العربية</h3>
              <p className="text-slate-500 leading-7">
                دروس وكورسات منظمة لمساعدة الطالب على الدراسة بشكل واضح.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-lg transition">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5">
                <Layers />
              </div>
              <h3 className="text-xl font-black mb-3">اللغة الإنجليزية</h3>
              <p className="text-slate-500 leading-7">
                محتوى تعليمي مرتب يساعد الطالب على المتابعة خطوة بخطوة.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 border border-dashed border-slate-300 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-5">
                <Sparkles />
              </div>
              <h3 className="text-xl font-black mb-3">مواد قادمة</h3>
              <p className="text-slate-500 leading-7">
                المنصة قابلة للتوسع لاحقًا لإضافة مواد ومعلمين أكثر.
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                  كل ما يحتاجه الطالب ليتعلم بثقة
                </h2>

                <p className="text-slate-500 mt-5 leading-8">
                  المنصة لا تعرض الدروس فقط، بل تساعد الطالب على الفهم،
                  المتابعة، ومعرفة تقدمه داخل كل كورس خطوة بخطوة.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h3 className="font-black mb-2">مساعد ذكي داخل الدروس</h3>
                  <p className="text-slate-500 text-sm leading-7">
                    اسأل عن محتوى الدرس واحصل على شرح مبسط يساعدك على الفهم.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h3 className="font-black mb-2">متابعة إنجازك</h3>
                  <p className="text-slate-500 text-sm leading-7">
                    اعرف كم أنهيت من الكورس وكم بقي لك لتكمل رحلتك التعليمية.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h3 className="font-black mb-2">دروس منظمة خطوة بخطوة</h3>
                  <p className="text-slate-500 text-sm leading-7">
                    انتقل بين الدروس بسهولة وادرس بالترتيب المناسب لك.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h3 className="font-black mb-2">ملفات وتمارين مرفقة</h3>
                  <p className="text-slate-500 text-sm leading-7">
                    احصل على ملاحظات، ملفات، وتمارين تساعدك أثناء الدراسة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="max-w-7xl mx-auto px-4 py-20">
          <div className="bg-slate-950 rounded-[2rem] p-8 md:p-12 text-white overflow-hidden relative">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center mb-6">
                  <ShieldCheck />
                </div>

                <h2 className="text-3xl md:text-4xl font-black">
                  تعلّم بتركيز وواصل تقدمك بسهولة
                </h2>

                <p className="text-slate-300 mt-5 leading-8">
                  كل طالب يحصل على تجربة تعليمية واضحة تساعده على متابعة
                  دروسه، حفظ تقدمه، والعودة من حيث توقف بدون تشتت.
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-slate-300">تقدمك محفوظ</span>
                    <span className="font-black">تابع من حيث توقفت</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-slate-300">إنجازك واضح</span>
                    <span className="font-black">اعرف نسبة الإكمال</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">مساعدك معك</span>
                    <span className="font-black">اسأل وافهم أثناء الدراسة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

export default Home;