import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import SearchBar from "../../../shared/components/SearchBar";
import VideosTable from "../components/VideosTable";
import { getVideos } from "../services/videosApi";
import type { VideoLesson } from "../types/video.types";

function VideosList() {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lesson") || undefined;

  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadVideos() {
      try {
        setLoading(true);
        setError("");

        const data = await getVideos(lessonId);

        if (isMounted) {
          setVideos(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load videos.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  const filteredVideos = videos.filter((lesson) => {
    const keyword = search.toLowerCase();

    return (
      lesson.title.toLowerCase().includes(keyword) ||
      lesson.course_title?.toLowerCase().includes(keyword) ||
      lesson.video_playback_id?.toLowerCase().includes(keyword)
    );
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Video Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Connect lesson videos to Mux and monitor signed playback / DRM
            readiness.
          </p>
        </div>

        <Link
          to={lessonId ? `/admin/videos/upload?lesson=${lessonId}` : "/admin/videos/upload"}
          className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Upload Video
        </Link>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search lessons or playback IDs..."
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading videos...
        </div>
      ) : (
        <VideosTable videos={filteredVideos} />
      )}
    </section>
  );
}

export default VideosList;