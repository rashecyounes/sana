import api from "../../../../../api/axios";
import type { Purchase, PurchaseFilters } from "../types/purchase.types";

export async function getPurchases(filters: PurchaseFilters = {}) {
  const response = await api.get<Purchase[]>("/admin-dashboard/purchases/", {
    params: filters,
  });

  return response.data;
}

export async function getPurchaseDetails(id: number) {
  const response = await api.get<Purchase>(
    `/admin-dashboard/purchases/${id}/`
  );

  return response.data;
}