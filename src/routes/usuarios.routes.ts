import { Router } from "express";
import { usuariosController } from "../controllers/usuarios.controller";

const router = Router();

// Obtener todos los usuarios
router.get("/", usuariosController.getAll);

// Obtener un usuario por id
router.get("/:id", usuariosController.getById);

// Crear un usuario
router.post("/", usuariosController.create);

// Actualizar un usuario
router.put("/:id", usuariosController.update);

// Eliminar un usuario
router.delete("/:id", usuariosController.delete);

export default router;
