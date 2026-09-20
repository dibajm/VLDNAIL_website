export type CatalogCategory = "service" | "tier" | "extra";

export type CatalogItem = {
	id: string;
	category: CatalogCategory;
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