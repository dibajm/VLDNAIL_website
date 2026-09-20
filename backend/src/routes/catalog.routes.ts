import { Router } from "express";
import { getCatalog, patchCatalogItem } from "../controllers/catalog.controller.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

export const catalogRouter = Router();

catalogRouter.use(requireAdmin);
catalogRouter.get("/", getCatalog);
catalogRouter.patch("/:id", patchCatalogItem);