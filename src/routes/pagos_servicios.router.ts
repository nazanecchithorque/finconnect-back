import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth";
import { pagosServiciosController } from "../controllers/pagos_servicios.controller";

export const pagosServiciosRouter = Router();

// Get all
pagosServiciosRouter.get("/", authMiddleware, pagosServiciosController.getAll);

// Create (pagar factura)
pagosServiciosRouter.post("/", authMiddleware, pagosServiciosController.create);

// Get one
pagosServiciosRouter.get("/:id", authMiddleware, pagosServiciosController.getOne);

// Update
pagosServiciosRouter.patch("/:id", authMiddleware, pagosServiciosController.update);

// Delete (soft delete)
pagosServiciosRouter.delete(
    "/:id",
    authMiddleware,
    pagosServiciosController.remove
);
