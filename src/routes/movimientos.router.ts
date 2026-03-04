import { Router } from "express";
import { movimientosController } from "../controllers/movimientos.controller";
import { authMiddleware } from "@/middlewares/auth";
export const movimientosRouter = Router();

// Get All
movimientosRouter.get("/", authMiddleware, movimientosController.getAll);

// Create
movimientosRouter.post("/", authMiddleware, movimientosController.create);

// Get one
movimientosRouter.get("/:id", authMiddleware, movimientosController.getOne);

// Update
movimientosRouter.put("/:id", authMiddleware, movimientosController.update);

// Delete
movimientosRouter.delete("/:id", authMiddleware, movimientosController.remove);