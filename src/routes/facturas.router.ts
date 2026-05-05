import { Router } from "express";
import { facturasController } from "../controllers/facturas.controller";
import { authMiddleware } from "@/middlewares/auth";

export const facturasRouter = Router();

facturasRouter.get("/", authMiddleware, facturasController.getAll);
facturasRouter.get("/:id", authMiddleware, facturasController.getOne);
