import {
    findAllBuilder,
    findOneBuilder,
    updateBuilder,
    deleteBuilder
} from "bradb";

import { cuentasService } from "../services/cuentas.service";
import {
    cuentasFilterSchema,
    cuentasUpdateSchema
} from "../validators/cuentas.validator";

export const cuentasController = {
    getAll: findAllBuilder(cuentasService, cuentasFilterSchema),
    getById: findOneBuilder(cuentasService),
    update: updateBuilder(cuentasService, cuentasUpdateSchema),
    delete: deleteBuilder(cuentasService)
};
