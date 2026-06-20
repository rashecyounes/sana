import { Link } from "react-router-dom";
import { MonitorSmartphone, ShieldCheck, Video, Clock } from "lucide-react";

function SecurityOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Security Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor devices, user sessions, and video playback locks to reduce
          account sharing and protect paid content.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Link
          to="/admin/security/devices"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            <MonitorSmartphone size={28} />
          </div>

          <h2 className="text-lg font-black text-slate-900">
            Devices
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            View registered devices, device names, IP addresses, and deactivate
            suspicious devices.
          </p>
        </Link>

        <Link
          to="/admin/security/sessions"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Clock size={28} />
          </div>

          <h2 className="text-lg font-black text-slate-900">
            Sessions
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            Monitor active and inactive user sessions, last seen time, and end
            suspicious sessions manually.
          </p>
        </Link>

        <Link
          to="/admin/security/video-locks"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
            <Video size={28} />
          </div>

          <h2 className="text-lg font-black text-slate-900">
            Video Locks
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            View active video sessions and clear stuck video locks when a user
            cannot start playback.
          </p>
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h2 className="text-lg font-black">
              Security Philosophy
            </h2>
            <p className="text-sm text-slate-300">
              Security tools are designed to monitor account sharing, protect
              paid lessons, and keep audit visibility.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-slate-300">Device Limit</p>
            <p className="mt-1 font-black">Max 2 devices</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-slate-300">Video Playback</p>
            <p className="mt-1 font-black">One active video only</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-slate-300">Sessions</p>
            <p className="mt-1 font-black">Auditable, not hard deleted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityOverview;