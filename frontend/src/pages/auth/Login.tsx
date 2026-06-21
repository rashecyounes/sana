import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Loader2, ShieldCheck } from "lucide-react";

import api from "../../api/axios";

import {
  getDeviceName,
  getOrCreateDeviceId,
} from "../../utils/device";

type LoginForm = {
  identifier: string;
  password: string;
};

type LoginUser = {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  role: string;
  profile_image?: string | null;
  profile_image_url?: string | null;
};

type LoginResponse = {
  user: LoginUser;
};

function getLoginErrorMessage(errorData: unknown): string {
  if (
    typeof errorData === "object" &&
    errorData !== null &&
    "error" in errorData
  ) {
    const error = String((errorData as { error: string }).error);

    if (error.includes("Invalid credentials")) {
      return "بيانات الدخول غير صحيحة. تأكد من اسم المستخدم أو البريد وكلمة المرور.";
    }

    if (error.includes("Device limit")) {
      return "تم الوصول للحد الأقصى للأجهزة. لا يمكن استخدام الحساب على أكثر من جهازين.";
    }

    if (error.includes("active session") || error.includes("Active session")) {
      return "يوجد تسجيل دخول نشط على جهاز آخر. حاول مرة أخرى بعد انتهاء الجلسة.";
    }

    if (error.includes("Device ID is required")) {
      return "تعذر التعرف على هذا الجهاز. أعد تحميل الصفحة وحاول مرة أخرى.";
    }

    if (error.includes("disabled")) {
      return "هذا الحساب أو الجهاز معطل. تواصل مع الإدارة.";
    }

    return error;
  }

  return "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.";
}

function normalizeUser(user: LoginUser): LoginUser {
  let profileImage =
    user.profile_image_url || user.profile_image || null;

  if (profileImage && !profileImage.startsWith("http")) {
    profileImage = `http://127.0.0.1:8000${profileImage}`;
  }

  return {
    ...user,
    profile_image: profileImage,
    profile_image_url: profileImage,
  };
}

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function saveUser(user: LoginUser) {
    const normalizedUser = normalizeUser(user);

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("role", normalizedUser.role);
    localStorage.setItem("username", normalizedUser.username);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      getOrCreateDeviceId();
      getDeviceName();

      const response = await api.post<LoginResponse>("/security/login/", form);

      saveUser(response.data.user);

      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(getLoginErrorMessage(err.response?.data));
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
        <div className="p-7 sm:p-10">
          <div className="mb-8">
            <div className="bg-sky-100 text-sky-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
              <GraduationCap size={32} />
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              تسجيل الدخول
            </h2>

            <p className="text-slate-500 mt-2">
              ادخل باستخدام البريد الإلكتروني أو اسم المستخدم أو رقم الهاتف.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm leading-7">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="identifier"
              placeholder="البريد الإلكتروني أو اسم المستخدم أو رقم الهاتف"
              value={form.identifier}
              onChange={handleChange}
              className="input"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="كلمة المرور"
              value={form.password}
              onChange={handleChange}
              className="input"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              دخول
            </button>
          </form>

          <p className="text-center text-slate-500 mt-6">
            لا تملك حساباً؟{" "}
            <Link to="/register" className="text-sky-600 font-semibold">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        <div className="hidden lg:flex flex-col justify-between bg-sky-500 p-10 text-white">
          <div>
            <div className="bg-white/20 p-4 rounded-3xl w-fit">
              <ShieldCheck size={42} />
            </div>

            <h2 className="text-4xl font-bold mt-12 leading-tight">
              دخول آمن ومحمي ضد مشاركة الحسابات
            </h2>

            <p className="text-sky-100 mt-5 text-lg leading-8">
              النظام يراقب الأجهزة والجلسات النشطة لحماية محتوى المنصة.
            </p>
          </div>

          <p className="text-sm text-sky-100">
            Secure login system for SANA.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;