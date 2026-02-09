import {
    createBuilder,
    deleteBuilder,
    findAllBuilder,
    findOneBuilder,
    updateBuilder
} from "bradb";

import { usuariosService } from "../services/usuarios.service";
import {
    usuariosCreateSchema,
    usuariosUpdateSchema,
    usuariosFilterSchema
} from "../validators/usuarios.validator";

export const usuariosController = {
    getById: findOneBuilder(usuariosService),
    getAll: findAllBuilder(usuariosService, usuariosFilterSchema),
    create: createBuilder(usuariosService, usuariosCreateSchema),
    update: updateBuilder(usuariosService, usuariosUpdateSchema),
    delete: deleteBuilder(usuariosService)
};
