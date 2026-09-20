import { Router } from "express";
import { getPublicCatalog } from "../controllers/public-catalog.controller.js";

export const publicCatalogRouter = Router();

publicCatalogRouter.get("/", getPublicCatalog);