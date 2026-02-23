import { Router } from "express";
import { cuentasController } from "../controllers/cuentas.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Obtener todas las cuentas
router.get("/", authMiddleware, cuentasController.getAll);

// Obtener una cuenta por id
router.get("/:id", authMiddleware, cuentasController.getById);

// Actualizar una cuenta
router.put("/:id", authMiddleware, cuentasController.update);

// Eliminar una cuenta (soft delete)
router.delete("/:id", authMiddleware, cuentasController.delete);

export default router;
