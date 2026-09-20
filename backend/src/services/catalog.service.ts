import { supabaseAdmin } from "./supabase.service.js";
import type { CatalogCategory, CatalogItem } from "../types/catalog.types.js";

export async function listCatalogItems(category?: CatalogCategory) {
	let query = supabaseAdmin.from("catalog_items").select("*").order("sort_order");
	if (category) query = query.eq("category", category);
	const { data, error } = await query;
	if (error) throw error;
	return (data ?? []) as CatalogItem[];
}

export async function listActiveCatalogItems(category?: CatalogCategory) {
	let query = supabaseAdmin.from("catalog_items").select("*").eq("active", true).order("sort_order");
	if (category) query = query.eq("category", category);
	const { data, error } = await query;
	if (error) throw error;
	return (data ?? []) as CatalogItem[];
}

export async function updateCatalogItem(id: string, values: Partial<Pick<CatalogItem, "label" | "description" | "new_set_price" | "fill_price" | "price_min" | "price_max" | "duration_minutes" | "active" | "sort_order">>) {
	const { data, error } = await supabaseAdmin
		.from("catalog_items")
		.update({ ...values, updated_at: new Date().toISOString() })
		.eq("id", id)
		.select()
		.single();
	if (error) throw error;
	return data as CatalogItem;
}