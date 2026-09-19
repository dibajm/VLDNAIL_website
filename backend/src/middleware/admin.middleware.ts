import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { supabaseAdmin } from "../services/supabase.service.js";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || data.user?.email?.toLowerCase() !== env.adminEmail.toLowerCase()) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
}