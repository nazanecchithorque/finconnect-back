import { Router } from "express";
import { usuariosController } from "../controllers/usuarios.controller";
import { authMiddleware, checkUserRole } from "@/middlewares/auth";
import { userRoles } from "@/schemas";
export const usuariosRouter = Router();

// Get All
usuariosRouter.get("/", authMiddleware, usuariosController.getAll);

// Create
usuariosRouter.post("/", authMiddleware, checkUserRole([userRoles.admin]), usuariosController.create);

// Get one
usuariosRouter.get("/:id", authMiddleware, usuariosController.getOne);

// Update
usuariosRouter.put("/:id", authMiddleware, usuariosController.update);

// Delete
usuariosRouter.delete("/:id", authMiddleware, usuariosController.remove);