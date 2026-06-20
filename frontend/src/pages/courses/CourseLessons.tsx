import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MuxPlayer from "@mux/mux-player-react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock3,
  Loader2,
  Lock,
  PlayCircle,
} from "lucide-react";

import api from "../../api/axios";
import { getMuxLessonToken } from "../../api/mux";
import { startVideoLock, stopVideoLock } from "../../api/videoLock";
import CourseAIAssistantBox from "../../components/ai/CourseAIAssistantBox";
import PublicNavbar from "../../components/layout/PublicNavbar";
import PublicFooter from "../../components/layout/PublicFooter";


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
  is_drm_protected?: boolean;
  drm_license_type?: string | null;
  thumbnail: string | null;
  order: number;
  duration: string | null;
  is_preview: boolean;
  is_published: boolean;
  resources: LessonResource[];
  created_at: string;
  updated_at: string;
};

type WatermarkData = {
  username: string;
  email: string;
  device_id: string;
};

type SignedMuxData = {
  playbackId: string;
  token: string;
  watermark: WatermarkData | null;
  isDrmProtected: boolean;
  drmLicenseType: string | null;
};

type WatermarkPosition = {
  top: string;
  right: string;
};

function VideoWatermark({ data }: { data: WatermarkData }) {
  const [position, setPosition] = useState<WatermarkPosition>({
    top: "12%",
    right: "8%",
  });

  useEffect(() => {
    const positions: WatermarkPosition[] = [
      { top: "10%", right: "8%" },
      { top: "22%", right: "58%" },
      { top: "42%", right: "18%" },
      { top: "63%", right: "48%" },
      { top: "78%", right: "10%" },
    ];

    let index = 0;

    const intervalId = window.setInterval(() => {
      index = (index + 1) % positions.length;
      setPosition(positions[index]);
    }, 9000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const currentTime = new Date().toLocaleTimeString("ar-JO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="pointer-events-none absolute z-30 select-none rounded-md bg-black/10 px-3 py-1 text-[10px] font-semibold text-white/35 shadow-sm backdrop-blur-[1px] transition-all duration-700"
      style={{
        top: position.top,
        right: position.right,
        textShadow: "0 1px 4px rgba(0,0,0,0.45)",
      }}
    >
      {data.username} | {data.email} | {data.device_id.slice(0, 12)} |{" "}
      {currentTime}
    </div>
  );
}

function CourseLessons() {
  const { id } = useParams<{ id: string }>();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  const [loading, setLoading] = useState(true);
  const [videoLockLoading, setVideoLockLoading] = useState(false);
  const [muxTokenLoading, setMuxTokenLoading] = useState(false);

  const [error, setError] = useState("");
  const [videoLockError, setVideoLockError] = useState("");
  const [muxTokenError, setMuxTokenError] = useState("");

  const [signedMuxData, setSignedMuxData] = useState<SignedMuxData | null>(null);

  const activeLessonRef = useRef<Lesson | null>(null);

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => a.order - b.order);
  }, [lessons]);

  const stopCurrentVideoLock = useCallback(async () => {
    const activeLesson = activeLessonRef.current;

    if (!activeLesson) return;

    try {
      await stopVideoLock({
        course_id: activeLesson.course,
        lesson_id: activeLesson.id,
      });
    } catch {
      // لا نمنع المستخدم من التنقل بسبب فشل إيقاف القفل.
    } finally {
      activeLessonRef.current = null;
    }
  }, []);

  const loadMuxSignedToken = useCallback(async (lesson: Lesson) => {
    if (lesson.video_provider !== "mux" || !lesson.video_playback_id) {
      setSignedMuxData(null);
      return;
    }

    try {
      setMuxTokenLoading(true);
      setMuxTokenError("");

      const data = await getMuxLessonToken(lesson.id);

      setSignedMuxData({
        playbackId: data.playback_id,
        token: data.token,
        watermark: data.watermark ?? null,
        isDrmProtected: data.is_drm_protected ?? false,
        drmLicenseType: data.drm_license_type ?? null,
      });
    } catch {
      setSignedMuxData(null);
      setMuxTokenError("تعذر إنشاء رمز تشغيل آمن لهذا الفيديو.");
    } finally {
      setMuxTokenLoading(false);
    }
  }, []);

  const startCurrentVideoLock = useCallback(
    async (lesson: Lesson) => {
      try {
        setVideoLockLoading(true);
        setVideoLockError("");
        setMuxTokenError("");
        setSignedMuxData(null);

        await startVideoLock({
          course_id: lesson.course,
          lesson_id: lesson.id,
        });

        activeLessonRef.current = lesson;

        await loadMuxSignedToken(lesson);
      } catch {
        setVideoLockError(
          "لا يمكنك تشغيل هذا الفيديو الآن، قد يكون الحساب يشاهد فيديو على جهاز آخر."
        );
        activeLessonRef.current = null;
        setSignedMuxData(null);
      } finally {
        setVideoLockLoading(false);
      }
    },
    [loadMuxSignedToken]
  );

  async function handleSelectLesson(lesson: Lesson) {
    if (currentLesson?.id === lesson.id) return;

    await stopCurrentVideoLock();

    setCurrentLesson(lesson);

    await startCurrentVideoLock(lesson);
  }

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function loadLessons() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Lesson[]>(`/courses/${id}/lessons/`);

        if (!isMounted) return;

        const sortedData = [...response.data].sort(
          (a, b) => a.order - b.order
        );

        setLessons(sortedData);

        if (sortedData.length > 0) {
          const firstLesson = sortedData[0];

          setCurrentLesson(firstLesson);

          await startCurrentVideoLock(firstLesson);
        }
      } catch {
        if (!isMounted) return;

        setError("ليس لديك صلاحية للوصول إلى محتوى هذا الكورس.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadLessons();

    return () => {
      isMounted = false;
      void stopCurrentVideoLock();
    };
  }, [id, startCurrentVideoLock, stopCurrentVideoLock]);

  useEffect(() => {
    function handleBeforeUnload() {
      const activeLesson = activeLessonRef.current;

      if (!activeLesson) return;

      const payload = JSON.stringify({
        course_id: activeLesson.course,
        lesson_id: activeLesson.id,
      });

      navigator.sendBeacon(
        "http://127.0.0.1:8000/api/security/video/stop/",
        new Blob([payload], {
          type: "application/json",
        })
      );
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" />
        جاري تحميل محتوى الكورس...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
        dir="rtl"
      >
        <div className="max-w-md w-full bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
            <Lock size={36} />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-4">
            وصول غير مسموح
          </h2>

          <p className="text-slate-600 leading-8">{error}</p>

          <Link
            to={`/courses/${id}`}
            className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition"
          >
            <ArrowRight size={18} />
            العودة إلى صفحة الكورس
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100" dir="rtl">
      <PublicNavbar />
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] min-h-screen">
        <aside className="bg-white border-l border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <Link
              to={`/courses/${id}`}
              className="inline-flex items-center gap-2 text-sky-600 font-bold"
            >
              <ArrowRight size={18} />
              العودة للكورس
            </Link>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              محتوى الكورس
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              جميع دروس الكورس مرتبة حسب التسلسل.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedLessons.map((lesson) => {
              const isActive = currentLesson?.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => void handleSelectLesson(lesson)}
                  disabled={videoLockLoading || muxTokenLoading}
                  className={`w-full text-right rounded-3xl border p-4 transition disabled:opacity-60 ${
                    isActive
                      ? "bg-sky-500 border-sky-500 text-white shadow-lg"
                      : "bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isActive ? "bg-white/20" : "bg-sky-100 text-sky-600"
                      }`}
                    >
                      <PlayCircle size={22} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-black leading-7">
                        {lesson.order}. {lesson.title}
                      </h3>

                      {lesson.duration && (
                        <div
                          className={`mt-2 inline-flex items-center gap-1 text-xs ${
                            isActive ? "text-sky-100" : "text-slate-500"
                          }`}
                        >
                          <Clock3 size={14} />
                          {lesson.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="p-6 lg:p-10">
          {currentLesson ? (
            <div className="max-w-5xl mx-auto">
              {(videoLockError || muxTokenError) && (
                <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700 flex items-start gap-3">
                  <AlertTriangle className="shrink-0 mt-1" />
                  <p className="font-bold leading-7">
                    {videoLockError || muxTokenError}
                  </p>
                </div>
              )}

              <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-video text-white">
                {videoLockLoading || muxTokenLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-center">
                    <div>
                      <Loader2
                        size={70}
                        className="mx-auto mb-5 animate-spin opacity-80"
                      />
                      <h2 className="text-2xl font-black">
                        جاري تجهيز الفيديو الآمن...
                      </h2>
                    </div>
                  </div>
                ) : videoLockError || muxTokenError ? (
                  <div className="w-full h-full flex items-center justify-center text-center">
                    <div>
                      <Lock size={80} className="mx-auto mb-5 opacity-80" />
                      <h2 className="text-2xl font-black">الفيديو مقفل</h2>
                      <p className="mt-3 text-slate-300">
                        لا يمكن تشغيل الفيديو حاليًا.
                      </p>
                    </div>
                  </div>
                ) : currentLesson.video_provider === "mux" &&
                  currentLesson.video_playback_id &&
                  signedMuxData ? (
                  <>
                    <MuxPlayer
                      playbackId={signedMuxData.playbackId}
                      tokens={{
                        playback: signedMuxData.token,
                      }}
                      metadata={{
                        video_id: String(currentLesson.id),
                        video_title: currentLesson.title,
                      }}
                      streamType="on-demand"
                      accentColor="#0ea5e9"
                      className="w-full h-full"
                    />

                    {signedMuxData.watermark && (
                      <VideoWatermark data={signedMuxData.watermark} />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center">
                    <div>
                      <PlayCircle
                        size={80}
                        className="mx-auto mb-5 opacity-80"
                      />
                      <h2 className="text-2xl font-black">
                        لا يوجد فيديو لهذا الدرس
                      </h2>
                      <p className="mt-3 text-slate-300">
                        لم يتم ربط هذا الدرس بفيديو آمن بعد.
                      </p>
                    </div>
                  </div>
                )}
              </div>
                <CourseAIAssistantBox courseId={currentLesson.course} />
              <div className="mt-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="rounded-full bg-sky-50 border border-sky-100 px-4 py-2 text-xs font-black text-sky-700">
                    Lesson {currentLesson.order}
                  </span>

                  {currentLesson.duration && (
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                      {currentLesson.duration}
                    </span>
                  )}

                  {!videoLockError && (
                    <span className="rounded-full bg-emerald-50 border border-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
                      Video Lock Active
                    </span>
                  )}

                  {signedMuxData && (
                    <span className="rounded-full bg-purple-50 border border-purple-100 px-4 py-2 text-xs font-black text-purple-700">
                      Signed Mux Video
                    </span>
                  )}

                  {signedMuxData?.isDrmProtected && (
                    <span className="rounded-full bg-amber-50 border border-amber-100 px-4 py-2 text-xs font-black text-amber-700">
                      DRM Protected
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-black text-slate-900 leading-tight">
                  {currentLesson.title}
                </h1>

                {currentLesson.description && (
                  <p className="mt-6 text-slate-600 leading-9 text-lg">
                    {currentLesson.description}
                  </p>
                )}
              </div>

              <div className="mt-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-sky-600" />

                  <h2 className="text-2xl font-black text-slate-900">
                    ملفات الدرس
                  </h2>
                </div>

                {currentLesson.resources.length === 0 ? (
                  <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6 text-slate-500">
                    لا توجد ملفات مرتبطة بهذا الدرس حاليًا.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentLesson.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.file}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 hover:bg-slate-100 p-5 transition"
                      >
                        <div>
                          <h3 className="font-black text-slate-900">
                            {resource.title}
                          </h3>

                          {resource.description && (
                            <p className="mt-2 text-sm text-slate-500">
                              {resource.description}
                            </p>
                          )}
                        </div>

                        <span className="text-sm font-bold text-sky-600">
                          فتح الملف
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              لا توجد دروس متاحة حاليًا.
            </div>
          )}
        </main>
        
      </div>
      <PublicFooter />
    </div>
  );
}

export default CourseLessons;