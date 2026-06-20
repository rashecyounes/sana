import { Navigate, Route, Routes } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/auth/Home";
import Devices from "./pages/auth/Devices";
import Sessions from "./pages/auth/Sessions";

import ProtectedRoute from "./components/ProtectedRoute";

import Subjects from "./pages/subjects/Subjects";
import SubjectCourses from "./pages/courses/SubjectCourses";
import CourseDetails from "./pages/courses/CourseDetails";
import CourseLessons from "./pages/courses/CourseLessons";

import StudentLayout from "./dashboard/student/layout/StudentLayout";
import StudentOverview from "./dashboard/student/overview/StudentOverview";
import MyCourses from "./dashboard/student/modules/my-courses/pages/MyCourses";
import StudentProfile from "./dashboard/student/modules/profile/pages/StudentProfile";

import AdminLayout from "./dashboard/admin/layout/AdminLayout";
import Overview from "./dashboard/admin/overview/Overview";

import SubjectsList from "./dashboard/admin/modules/subjects/pages/SubjectsList";
import CreateSubject from "./dashboard/admin/modules/subjects/pages/CreateSubject";
import EditSubject from "./dashboard/admin/modules/subjects/pages/EditSubject";

import CoursesList from "./dashboard/admin/modules/courses/pages/CoursesList";
import CreateCourse from "./dashboard/admin/modules/courses/pages/CreateCourse";
import EditCourse from "./dashboard/admin/modules/courses/pages/EditCourse";
import AdminCourseDetails from "./dashboard/admin/modules/courses/pages/AdminCourseDetails";
import EditCourseAIKnowledge from "./dashboard/admin/modules/courses/pages/EditCourseAIKnowledge";

import LessonsList from "./dashboard/admin/modules/lessons/pages/LessonsList";
import CreateLesson from "./dashboard/admin/modules/lessons/pages/CreateLesson";
import EditLesson from "./dashboard/admin/modules/lessons/pages/EditLesson";
import LessonDetails from "./dashboard/admin/modules/lessons/pages/LessonDetails";

import VideosList from "./dashboard/admin/modules/videos/pages/VideosList";
import UploadVideo from "./dashboard/admin/modules/videos/pages/UploadVideo";

import AccessCodesList from "./dashboard/admin/modules/access-codes/pages/AccessCodesList";
import GenerateAccessCodes from "./dashboard/admin/modules/access-codes/pages/GenerateAccessCodes";

import PurchasesList from "./dashboard/admin/modules/purchases/pages/PurchasesList";
import PurchaseDetails from "./dashboard/admin/modules/purchases/pages/PurchaseDetails";

import EnrollmentsList from "./dashboard/admin/modules/enrollments/pages/EnrollmentsList";
import CreateEnrollment from "./dashboard/admin/modules/enrollments/pages/CreateEnrollment";

import UsersList from "./dashboard/admin/modules/users/pages/UsersList";
import UserDetails from "./dashboard/admin/modules/users/pages/UserDetails";
import EditUser from "./dashboard/admin/modules/users/pages/EditUser";

import DevicesList from "./dashboard/admin/modules/security/pages/DevicesList";
import SessionsList from "./dashboard/admin/modules/security/pages/SessionsList";
import VideoLocksList from "./dashboard/admin/modules/security/pages/VideoLocksList";
import SecurityOverview from "./dashboard/admin/modules/security/pages/SecurityOverview";

import TeacherLayout from "./dashboard/teacher/layout/TeacherLayout";
import TeacherOverview from "./dashboard/teacher/overview/TeacherOverview";

import TeacherCoursesList from "./dashboard/teacher/modules/courses/pages/TeacherCoursesList";
import TeacherCourseDetails from "./dashboard/teacher/modules/courses/pages/TeacherCourseDetails";
import EditTeacherCourse from "./dashboard/teacher/modules/courses/pages/EditTeacherCourse";

import TeacherLessonsList from "./dashboard/teacher/modules/lessons/pages/TeacherLessonsList";
import CreateTeacherLesson from "./dashboard/teacher/modules/lessons/pages/CreateTeacherLesson";
import EditTeacherLesson from "./dashboard/teacher/modules/lessons/pages/EditTeacherLesson";
import TeacherLessonDetails from "./dashboard/teacher/modules/lessons/pages/TeacherLessonDetails";

import TeacherVideosList from "./dashboard/teacher/modules/videos/pages/TeacherVideosList";
import TeacherUploadVideo from "./dashboard/teacher/modules/videos/pages/TeacherUploadVideo";

import TeacherProfile from "./dashboard/teacher/modules/profile/TeacherProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/subjects" element={<Subjects />} />
      <Route path="/subjects/:slug/courses" element={<SubjectCourses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/courses/:id/lessons" element={<CourseLessons />} />

      <Route
        path="/devices"
        element={
          <ProtectedRoute>
            <Devices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentOverview />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherOverview />} />
        <Route path="courses" element={<TeacherCoursesList />} />
        <Route path="courses/:id" element={<TeacherCourseDetails />} />
        <Route path="courses/:id/edit" element={<EditTeacherCourse />} />
        <Route path="lessons" element={<TeacherLessonsList />} />
        <Route path="lessons/create" element={<CreateTeacherLesson />} />
        <Route path="lessons/:id" element={<TeacherLessonDetails />} />
        <Route path="lessons/:id/edit" element={<EditTeacherLesson />} />
        <Route path="videos" element={<TeacherVideosList />} />
        <Route path="videos/upload" element={<TeacherUploadVideo />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />

        <Route path="subjects" element={<SubjectsList />} />
        <Route path="subjects/create" element={<CreateSubject />} />
        <Route path="subjects/:slug/edit" element={<EditSubject />} />

        <Route path="courses" element={<CoursesList />} />
        <Route path="courses/create" element={<CreateCourse />} />
        <Route path="courses/:id" element={<AdminCourseDetails />} />
        <Route path="courses/:id/edit" element={<EditCourse />} />
        <Route
          path="courses/:courseId/ai-knowledge"
          element={<EditCourseAIKnowledge />}
        />

        <Route path="lessons" element={<LessonsList />} />
        <Route path="lessons/create" element={<CreateLesson />} />
        <Route path="lessons/:id" element={<LessonDetails />} />
        <Route path="lessons/:id/edit" element={<EditLesson />} />

        <Route path="videos" element={<VideosList />} />
        <Route path="videos/upload" element={<UploadVideo />} />

        <Route path="access-codes" element={<AccessCodesList />} />
        <Route path="access-codes/generate" element={<GenerateAccessCodes />} />

        <Route path="purchases" element={<PurchasesList />} />
        <Route path="purchases/:id" element={<PurchaseDetails />} />

        <Route path="enrollments" element={<EnrollmentsList />} />
        <Route path="enrollments/create" element={<CreateEnrollment />} />

        <Route path="users" element={<UsersList />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users/:id/edit" element={<EditUser />} />

        <Route path="security/devices" element={<DevicesList />} />
        <Route path="security/sessions" element={<SessionsList />} />
        <Route path="security/video-locks" element={<VideoLocksList />} />
        <Route path="security" element={<SecurityOverview />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;