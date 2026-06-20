import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Loader2 } from "lucide-react";
import api from "../../api/axios";

type RegisterForm = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
};

function getErrorMessage(errorData: unknown): string {
  if (!errorData) {
    return "حدث خطأ غير متوقع. حاول مرة أخرى.";
  }

  if (typeof errorData === "string") {
    return errorData;
  }

  if (typeof errorData === "object" && errorData !== null) {
    const messages: string[] = [];

    Object.entries(errorData).forEach(([field, value]) => {
      const fieldNames: Record<string, string> = {
        username: "اسم المستخدم",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        password: "كلمة المرور",
        confirm_password: "تأكيد كلمة المرور",
        first_name: "الاسم الأول",
        last_name: "الاسم الأخير",
        non_field_errors: "خطأ",
      };

      const label = fieldNames[field] || field;

      if (Array.isArray(value)) {
        messages.push(`${label}: ${value.join(" - ")}`);
      } else if (typeof value === "string") {
        messages.push(`${label}: ${value}`);
      }
    });

    return messages.length > 0
      ? messages.join("\n")
      : "تأكد من البيانات المدخلة وحاول مرة أخرى.";
  }

  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/users/register/", form);
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(getErrorMessage(err.response?.data));
      } else {
        setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="hidden lg:flex flex-col justify-between bg-sky-500 p-10 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl">
                <GraduationCap size={34} />
              </div>
              <h1 className="text-2xl font-bold">X Platform</h1>
            </div>

            <h2 className="text-4xl font-bold mt-16 leading-tight">
              منصة تعليمية حديثة لطلاب التوجيهي
            </h2>

            <p className="text-sky-100 mt-5 text-lg leading-8">
              سجّل الآن وابدأ رحلتك التعليمية بطريقة منظمة وآمنة.
            </p>
          </div>

          <p className="text-sm text-sky-100">
            Arabic & English courses for Tawjihi students.
          </p>
        </div>

        <div className="p-7 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">إنشاء حساب</h2>
            <p className="text-slate-500 mt-2">
              سيتم تسجيلك تلقائياً كطالب داخل المنصة.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm whitespace-pre-line leading-7">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="first_name" placeholder="الاسم الأول" value={form.first_name} onChange={handleChange} className="input" required />
              <input name="last_name" placeholder="الاسم الأخير" value={form.last_name} onChange={handleChange} className="input" required />
            </div>

            <input name="username" placeholder="اسم المستخدم" value={form.username} onChange={handleChange} className="input" required />
            <input name="email" type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={handleChange} className="input" />
            <input name="phone" placeholder="رقم الهاتف" value={form.phone} onChange={handleChange} className="input" />

            <input name="password" type="password" placeholder="كلمة المرور" value={form.password} onChange={handleChange} className="input" required />
            <input name="confirm_password" type="password" placeholder="تأكيد كلمة المرور" value={form.confirm_password} onChange={handleChange} className="input" required />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              إنشاء الحساب
            </button>
          </form>

          <p className="text-center text-slate-500 mt-6">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-sky-600 font-semibold">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;