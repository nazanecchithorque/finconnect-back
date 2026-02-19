import { Router } from "express";
import { usuariosController } from "../controllers/usuarios.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Obtener todos los usuarios
router.get("/", authMiddleware, usuariosController.getAll);

// Obtener mis datos
router.get("/me", authMiddleware, usuariosController.getMe);


// Obtener un usuario por id
router.get("/:id", authMiddleware, usuariosController.getById);

// Crear un usuario -> Esta en AUTH
//router.post("/", authMiddleware, usuariosController.create);

// Actualizar un usuario
router.put("/:id", authMiddleware, usuariosController.update);

// Eliminar un usuario
router.delete("/:id", authMiddleware, usuariosController.delete);

export default router;
