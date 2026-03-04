import { Router } from "express";
import { transferenciasController } from "../controllers/transferencias.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Obtener todas las transferencias
router.get("/", authMiddleware, transferenciasController.getAll);

// Obtener una transferencia por id
router.get("/:id", authMiddleware, transferenciasController.getById);

// Crear una transferencia
router.post("/", authMiddleware, transferenciasController.create);

export default router;

