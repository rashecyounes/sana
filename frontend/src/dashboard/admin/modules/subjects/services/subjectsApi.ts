import api from "../../../../../api/axios";
import type { Subject, SubjectFormData } from "../types/subject.types";

export async function getSubjects(search?: string): Promise<Subject[]> {
  const response = await api.get<Subject[]>("/subjects/", {
    params: search ? { search } : {},
  });

  return response.data;
}

export async function getSubject(slug: string): Promise<Subject> {
  const response = await api.get<Subject>(`/subjects/${slug}/`);
  return response.data;
}

export async function createSubject(data: SubjectFormData): Promise<Subject> {
  const formData = new FormData();

  formData.append("name", data.name);

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.post<Subject>("/subjects/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updateSubject(
  slug: string,
  data: SubjectFormData
): Promise<Subject> {
  const formData = new FormData();

  formData.append("name", data.name);

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.patch<Subject>(`/subjects/${slug}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteSubject(slug: string): Promise<void> {
  await api.delete(`/subjects/${slug}/`);
}