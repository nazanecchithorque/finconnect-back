import { Router } from "express";
import {
    clientController,
    freeController,
    premiumController
} from "../controllers/client.controller";
import { auth, checkClientType, selfOrAdmin } from "../middlewares/auth";
import { clientRoles } from "../schemas/client.schema";
import { onlyForRol } from "../middlewares/roles";
import { logging } from "../middlewares/logging";
import { validate } from "bradb";
import { loginClientSchema } from "../validators/client.validator";

const router = Router();

router.get(
    "/",
    auth,
    // Solo los clientes premium van a tener acceso a esta ruta
    // Se le pueden pasar más tipos
    checkClientType([clientRoles.admin]),
    clientController.getAll
);

router.post(
    "/action",
    auth,
    // Podes pasarle nuevos middlewares solo a uno de los roles
    onlyForRol("free", logging, freeController.action),
    onlyForRol("premium", premiumController.action),
    clientController.action
);

router.get("/:id", auth, selfOrAdmin, clientController.getById);

// No necesitás token para crear una cuenta
router.post("/login", validate(loginClientSchema, clientController.login));

// No necesitás token para crear una cuenta
router.post("/", clientController.create);

router.put("/:id", auth, selfOrAdmin, clientController.update);

router.delete("/:id", auth, selfOrAdmin, clientController.delete);

export default router;
