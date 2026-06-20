export type PurchaseStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export type Purchase = {
  id: number;
  student: number;
  student_name?: string;
  student_email?: string;
  course: number;
  course_title?: string;
  amount: string;
  status: PurchaseStatus;
  provider: string;
  provider_reference: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PurchaseFilters = {
  search?: string;
  status?: string;
};