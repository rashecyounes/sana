import MyCourseCard from "./MyCourseCard";
import type { StudentCourse } from "../types/myCourse.types";

type MyCoursesGridProps = {
  courses: StudentCourse[];
};

export default function MyCoursesGrid({ courses }: MyCoursesGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <MyCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}