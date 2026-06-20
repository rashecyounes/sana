from rest_framework.permissions import BasePermission


class IsAdminOrAssignedTeacher(BasePermission):
    """
    Allows only admin users or the teacher assigned to the course.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_staff or getattr(user, "role", None) == "admin":
            return True

        course = getattr(obj, "course", None)

        if course and course.teacher_id == user.id:
            return True

        return False