from locust import HttpUser, task, between


class StudentUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        self.device_id = "test-device-1"

        response = self.client.post(
            "/api/security/login/",
            json={
                "identifier": "student1",
                "password": "1234Rashed4321",
            },
            headers={
                "x-device-id": self.device_id,
                "x-device-name": "Locust Test Device",
            },
        )

        if response.status_code == 200:
            self.access = response.json().get("access")
        else:
            self.access = None

    def auth_headers(self):
        return {
            "Authorization": f"Bearer {self.access}",
            "x-device-id": self.device_id,
            "x-device-name": "Locust Test Device",
        }

    @task(3)
    def get_subjects(self):
        self.client.get("/api/subjects/")

    @task(3)
    def get_courses(self):
        self.client.get("/api/courses/")

    @task(2)
    def get_my_courses(self):
        if self.access:
            self.client.get(
                "/api/enrollments/my-courses/",
                headers=self.auth_headers(),
            )

    @task(1)
    def get_course_lessons(self):
        if self.access:
            self.client.get(
                "/api/courses/1/lessons/",
                headers=self.auth_headers(),
            )