import { Router } from "express";
import { usuariosController } from "../controllers/usuarios.controller";
import { authMiddleware, checkUserRole, selfOrAdmin } from "@/middlewares/auth";
import { userRoles } from "@/schemas";
export const usuariosRouter = Router();

// Perfil (debe ir antes de /:id)
usuariosRouter.get("/me", authMiddleware, usuariosController.getMe);
usuariosRouter.patch("/me", authMiddleware, usuariosController.patchMe);
/** Misma semántica que PATCH (útil si el cliente o proxy no acepta PATCH). */
usuariosRouter.put("/me", authMiddleware, usuariosController.patchMe);

// Get All
usuariosRouter.get("/", authMiddleware, usuariosController.getAll);

// Create
usuariosRouter.post("/", authMiddleware, checkUserRole([userRoles.admin]), usuariosController.create);

// Get one
usuariosRouter.get("/:id", authMiddleware, selfOrAdmin(), usuariosController.getOne);

// Update
usuariosRouter.put("/:id", authMiddleware, selfOrAdmin(), usuariosController.update);

// Delete
usuariosRouter.delete("/:id", authMiddleware, selfOrAdmin(), usuariosController.remove);