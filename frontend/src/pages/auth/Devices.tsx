import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import { Monitor, Trash2 } from "lucide-react";

type Device = {
  id: number;
  device_id: string;
  device_name: string;
  ip_address: string;
  is_active: boolean;
  last_login_at: string;
};

function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await api.get<Device[]>("/security/devices/");
      setDevices(response.data);
    } catch {
      console.error("Error fetching devices");
    } finally {
      setLoading(false);
    }
  }, []);

  async function deactivateDevice(id: number) {
    try {
      await api.post(`/security/devices/${id}/deactivate/`);
      await fetchDevices();
    } catch {
      alert("فشل في إلغاء الجهاز");
    }
  }

  useEffect(() => {
  const timer = window.setTimeout(() => {
    void fetchDevices();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [fetchDevices]);

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">أجهزتي</h1>

      {loading ? (
        <p className="text-slate-500">جارٍ التحميل...</p>
      ) : (
        <div className="grid gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white p-5 rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2 text-sky-600 font-semibold">
                  <Monitor size={18} />
                  {device.device_name || "Unknown Device"}
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  IP: {device.ip_address || "غير معروف"}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  آخر تسجيل دخول:{" "}
                  {new Date(device.last_login_at).toLocaleString()}
                </p>

                <p className="text-xs mt-2">
                  الحالة:{" "}
                  <span
                    className={
                      device.is_active ? "text-green-600" : "text-red-600"
                    }
                  >
                    {device.is_active ? "فعال" : "غير فعال"}
                  </span>
                </p>
              </div>

              {device.is_active && (
                <button
                  onClick={() => void deactivateDevice(device.id)}
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

export default Devices;