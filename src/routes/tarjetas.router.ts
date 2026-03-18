import { Router } from "express";
import { tarjetasController } from "../controllers/tarjetas.controller";
import { authMiddleware } from "@/middlewares/auth";

export const tarjetasRouter = Router();

// Listar tarjetas del usuario autenticado
tarjetasRouter.get("/", authMiddleware, tarjetasController.getAllByUser);

// Crear tarjeta para una cuenta del usuario
tarjetasRouter.post("/", authMiddleware, tarjetasController.create);

// Bloquear tarjeta (definitivo)
tarjetasRouter.post(
    "/:id/bloquear",
    authMiddleware,
    tarjetasController.bloquear
);

// Parar tarjeta (pausa temporal / reanudar)
tarjetasRouter.post(
    "/:id/parar",
    authMiddleware,
    tarjetasController.parar
);

// Cancelar tarjeta (alias de bloqueo definitivo)
tarjetasRouter.post(
    "/:id/cancelar",
    authMiddleware,
    tarjetasController.bloquear
);

// Eliminar (soft delete)
tarjetasRouter.delete(
    "/:id",
    authMiddleware,
    tarjetasController.remove
);

