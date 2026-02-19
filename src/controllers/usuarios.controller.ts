import {
    createBuilder,
    deleteBuilder,
    findAllBuilder,
    findOneBuilder,
    updateBuilder
} from "bradb";
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";

import { usuariosService } from "../services/usuarios.service";
import {
    //usuariosCreateSchema,
    usuariosUpdateSchema,
    usuariosFilterSchema
} from "../validators/usuarios.validator";

async function getMe(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    const usuario = await usuariosService.findOne(req.user.userId);

    return res.json(usuario);
}


export const usuariosController = {
    getMe,
    getById: findOneBuilder(usuariosService),
    getAll: findAllBuilder(usuariosService, usuariosFilterSchema),
    /*create: createBuilder(usuariosService, usuariosCreateSchema),*/
    update: updateBuilder(usuariosService, usuariosUpdateSchema),
    delete: deleteBuilder(usuariosService)
};
