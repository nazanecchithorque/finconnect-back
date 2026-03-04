import {
    findAllBuilder,
    findOneBuilder
} from "bradb";

import { movimientosService } from "../services/movimientos.service";
import { movimientosFilterSchema } from "../validators/movimientos.validator";

export const movimientosController = {
    getAll: findAllBuilder(movimientosService, movimientosFilterSchema),
    getById: findOneBuilder(movimientosService)
};

