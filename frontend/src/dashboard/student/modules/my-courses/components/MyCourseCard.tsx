import { Link } from "react-router-dom";
import type { StudentCourse } from "../types/myCourse.types";

type MyCourseCardProps = {
  course: StudentCourse;
};

export default function MyCourseCard({ course }: MyCourseCardProps) {
  const imageSrc = course.image_url || course.image;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
      <div className="h-44 bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
            {course.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {course.description}
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {course.teacher_name && <p>Teacher: {course.teacher_name}</p>}
          {course.subject_name && <p>Subject: {course.subject_name}</p>}
        </div>

        <Link
          to={`/courses/${course.id}/lessons`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Enter Course
        </Link>
      </div>
    </div>
  );
}