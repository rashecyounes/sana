import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Mail,
} from "lucide-react";

function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
                <GraduationCap size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-black">SANA</h2>
                <p className="text-sm text-slate-400 mt-1">
                  منصة تعليمية لطلاب التوجيهي
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-slate-400 leading-8">
              منصة تساعد الطالب على الوصول إلى الدروس والكورسات بطريقة واضحة،
              منظمة، وسهلة المتابعة.
            </p>
          </div>

          <div>
            <h3 className="font-black text-lg mb-5">روابط سريعة</h3>

            <div className="space-y-3 text-slate-400">
              <Link to="/" className="block hover:text-sky-400 transition">
                الرئيسية
              </Link>

              <Link
                to="/subjects"
                className="block hover:text-sky-400 transition"
              >
                المواد
              </Link>

              <a
                href="/#features"
                className="block hover:text-sky-400 transition"
              >
                المميزات
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-black text-lg mb-5">ما الذي نقدمه؟</h3>

            <div className="space-y-4 text-slate-400">
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-sky-400" />
                <span>دروس منظمة</span>
              </div>

              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-sky-400" />
                <span>مساعد ذكي للتعلم</span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-sky-400" />
                <span>متابعة آمنة وواضحة</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-sky-400" />
                <span>دعم وتواصل لاحقًا</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 SANA. جميع الحقوق محفوظة.</p>

          <p>
            صُممت لتجربة تعليمية واضحة ومناسبة للطلاب.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;