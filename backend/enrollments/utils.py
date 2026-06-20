from enrollments.models import CourseEnrollment


def user_has_course_access(user, course):
    if not user or not user.is_authenticated:
        return False

    if user.role in ["admin", "teacher"]:
        return True

    return CourseEnrollment.objects.filter(
        student=user,
        course=course,
        is_active=True,
    ).exists()