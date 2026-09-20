import type { Request, Response } from "express";
import { listActiveCatalogItems } from "../services/catalog.service.js";
import type { CatalogCategory } from "../types/catalog.types.js";

const categories = new Set<CatalogCategory>(["service", "tier", "extra"]);

export async function getPublicCatalog(req: Request, res: Response) {
	const category = typeof req.query.category === "string" && categories.has(req.query.category as CatalogCategory)
		? req.query.category as CatalogCategory
		: undefined;
	res.json({ items: await listActiveCatalogItems(category) });
}