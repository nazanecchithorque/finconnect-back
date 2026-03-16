import { Router } from "express";
import { cuentasController } from "../controllers/cuentas.controller";
import { authMiddleware } from "@/middlewares/auth";
export const cuentasRouter = Router();

// Get All
cuentasRouter.get("/", authMiddleware, cuentasController.getAll);

// Get one
cuentasRouter.get("/:id", authMiddleware, cuentasController.getOne);

// Update
cuentasRouter.put("/:id", authMiddleware, cuentasController.update);

// Delete
cuentasRouter.delete("/:id", authMiddleware, cuentasController.remove);
// Search by alias or cvu
cuentasRouter.post("/search", authMiddleware, cuentasController.searchByAliasOCvu);
