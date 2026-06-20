import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import { Shield, Trash2 } from "lucide-react";

type Session = {
  id: number;
  device_name: string;
  ip_address: string;
  is_active: boolean;
  last_seen_at: string;
};

function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const response = await api.get<Session[]>("/security/sessions/");
      setSessions(response.data);
    } catch {
      console.error("Error fetching sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  async function deactivateSession(id: number) {
    try {
      await api.post(`/security/sessions/${id}/deactivate/`);
      await fetchSessions();
    } catch {
      alert("فشل في إلغاء الجلسة");
    }
  }

  useEffect(() => {
  const timer = window.setTimeout(() => {
    void fetchSessions();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [fetchSessions]);

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">الجلسات</h1>

      {loading ? (
        <p className="text-slate-500">جارٍ التحميل...</p>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white p-5 rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2 text-sky-600 font-semibold">
                  <Shield size={18} />
                  {session.device_name || "Unknown Device"}
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  IP: {session.ip_address || "غير معروف"}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  آخر نشاط: {new Date(session.last_seen_at).toLocaleString()}
                </p>

                <p className="text-xs mt-2">
                  الحالة:{" "}
                  <span
                    className={
                      session.is_active ? "text-green-600" : "text-red-600"
                    }
                  >
                    {session.is_active ? "فعالة" : "غير فعالة"}
                  </span>
                </p>
              </div>

              {session.is_active && (
                <button
                  onClick={() => void deactivateSession(session.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  إلغاء
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sessions;