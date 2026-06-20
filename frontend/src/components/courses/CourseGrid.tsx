import CourseCard from "./CourseCard";

export type DashboardCourse = {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  subjectName?: string;
  teacherName?: string;
  price?: string;
};

type CourseGridProps = {
  courses: DashboardCourse[];
  emptyMessage: string;
};

function CourseGrid({ courses, emptyMessage }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          title={course.title}
          description={course.description}
          image={course.image}
          subjectName={course.subjectName}
          teacherName={course.teacherName}
          price={course.price}
        />
      ))}
    </div>
  );
}

export default CourseGrid;