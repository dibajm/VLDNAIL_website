import { API_BASE_URL } from "./constants";

export type PendingBooking = {
  id: string;
  appointment_start: string;
  duration_minutes: number;
  service: string;
  service_type: string;
  nail_length: string | null;
  nail_shape: string | null;
  design_tier: number | null;
  extras: string[];
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    instagram: string;
  };
};

export type CatalogItem = {
  id: string;
  category: "service" | "tier" | "extra";
  slug: string;
  label: string;
  description: string;
  new_set_price: number | null;
  fill_price: number | null;
  price_min: number | null;
  price_max: number | null;
  duration_minutes: number | null;
  active: boolean;
  sort_order: number;
  updated_at: string;
};

async function request<T>(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "The request could not be completed.");
  }

  return (await response.json()) as T;
}

export async function getPendingBookings(token: string) {
  const result = await request<{ bookings: PendingBooking[] }>("/api/booking/pending", token);
  return result.bookings;
}

export async function acceptBooking(id: string, durationMinutes: number, token: string) {
  return request(`/api/booking/${id}/accept`, token, {
    method: "POST",
    body: JSON.stringify({ durationMinutes }),
  });
}

export async function declineBooking(id: string, token: string) {
  return request(`/api/booking/${id}/decline`, token, { method: "POST" });
}

export async function getCatalog(token: string) {
  const result = await request<{ items: CatalogItem[] }>("/api/admin/catalog?category=service", token);
  return result.items;
}

export async function updateCatalogItem(id: string, values: Partial<CatalogItem>, token: string) {
  const result = await request<{ item: CatalogItem }>(`/api/admin/catalog/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
  return result.item;
}