import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth";
import { accionesController } from "../controllers/acciones.controller";

export const accionesRouter = Router();

accionesRouter.get(
    "/prices",
    authMiddleware,
    accionesController.getAccionPrices
);

accionesRouter.get("/", authMiddleware, accionesController.getAll);
