import { Router } from "express";
import { movimientosController } from "../controllers/movimientos.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Obtener todos los movimientos
router.get("/", authMiddleware, movimientosController.getAll);

// Obtener un movimiento por id
router.get("/:id", authMiddleware, movimientosController.getById);

export default router;

