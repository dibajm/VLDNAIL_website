import type { Request, Response } from "express";
import { listCatalogItems, updateCatalogItem } from "../services/catalog.service.js";
import type { CatalogCategory } from "../types/catalog.types.js";

const categories = new Set<CatalogCategory>(["service", "tier", "extra"]);

export async function getCatalog(req: Request, res: Response) {
	const category = typeof req.query.category === "string" && categories.has(req.query.category as CatalogCategory)
		? req.query.category as CatalogCategory
		: undefined;
	res.json({ items: await listCatalogItems(category) });
}

export async function patchCatalogItem(req: Request, res: Response) {
	const id = req.params.id;
	if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
		throw new Error("VALIDATION_ERROR: Invalid catalog item id");
	}
	const values = req.body as Record<string, unknown>;
	const allowed = ["label", "description", "new_set_price", "fill_price", "price_min", "price_max", "duration_minutes", "active", "sort_order"];
	const updates = Object.fromEntries(Object.entries(values).filter(([key]) => allowed.includes(key)));
	if (Object.keys(updates).length === 0) throw new Error("VALIDATION_ERROR: No editable values provided");
	res.json({ item: await updateCatalogItem(id, updates) });
}