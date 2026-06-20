type CourseCardProps = {
  title: string;
  description: string;
  image?: string | null;
  subjectName?: string;
  teacherName?: string;
  price?: string;
};

function CourseCard({
  title,
  description,
  image,
  subjectName,
  teacherName,
  price,
}: CourseCardProps) {
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `http://127.0.0.1:8000${image}`
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-slate-100 text-slate-400">
          No Image
        </div>
      )}

      <div className="space-y-3 p-5">
        <div>
          {subjectName && (
            <p className="text-sm font-medium text-sky-600">{subjectName}</p>
          )}

          <h3 className="mt-1 text-lg font-bold text-slate-900">{title}</h3>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {description}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span className="text-slate-500">
            {teacherName ? `Teacher: ${teacherName}` : "Teacher not assigned"}
          </span>

          {price && <span className="font-bold text-slate-900">${price}</span>}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;