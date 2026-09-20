import { API_BASE_URL } from "./constants";
import type { CatalogItem } from "./adminApi";

export async function getPublicCatalog(category: CatalogItem["category"]) {
  const response = await fetch(`${API_BASE_URL}/api/catalog?category=${category}`);
  if (!response.ok) throw new Error("Catalog unavailable");
  const result = (await response.json()) as { items: CatalogItem[] };
  return result.items;
}