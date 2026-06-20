import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Loader2, Search } from "lucide-react";

import api from "../../api/axios";
import PublicNavbar from "../../components/layout/PublicNavbar";
import PublicFooter from "../../components/layout/PublicFooter";
type Subject = {
  id: number;
  name: string;
  slug: string;
  image: string;
  created_at: string;
  updated_at: string;
};

function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      async function fetchSubjects() {
        setLoading(true);
        setError("");

        try {
          const response = await api.get<Subject[]>("/subjects/", {
            params: {
              search: search || undefined,
            },
          });

          setSubjects(response.data);
        } catch {
          setError("حدث خطأ أثناء تحميل المواد. حاول مرة أخرى.");
        } finally {
          setLoading(false);
        }
      }

      void fetchSubjects();
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12">
          <div className="max-w-3xl">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5">
              <BookOpen size={30} />
            </div>

            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              اختر المادة التي تريد الدراسة منها
            </h2>

            <p className="text-slate-500 mt-5 leading-8 text-lg">
              تصفح المواد المتاحة في المنصة، ثم اختر المادة للوصول لاحقًا إلى
              الكورسات الخاصة بها.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="relative">
            <Search
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={22}
            />

            <input
              type="text"
              placeholder="ابحث عن مادة..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-white border border-slate-200 rounded-3xl py-4 pr-14 pl-5 outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 transition text-slate-700"
            />
          </div>
        </section>

        <section className="mt-8">
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-500 gap-3">
              <Loader2 className="animate-spin" />
              جاري تحميل المواد...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-5">
              {error}
            </div>
          )}

          {!loading && !error && subjects.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center">
              <h3 className="text-xl font-black mb-2">لا توجد مواد</h3>
              <p className="text-slate-500">
                لم يتم العثور على مواد مطابقة للبحث الحالي.
              </p>
            </div>
          )}

          {!loading && !error && subjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  to={`/subjects/${subject.slug}/courses`}
                  className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div className="h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={subject.image}
                      alt={subject.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-black text-slate-900">
                      {subject.name}
                    </h3>

                    <p className="text-slate-500 mt-3 leading-7">
                      اضغط لعرض الكورسات الخاصة بهذه المادة.
                    </p>

                    <div className="mt-5 inline-flex items-center text-sky-600 font-bold">
                      عرض الكورسات
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

export default Subjects;