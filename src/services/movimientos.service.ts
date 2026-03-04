import { ServiceBuilder } from "bradb";
import { movimientosTable } from "../schemas/movimientos.schema"
import { movimientosFilterMap } from "../filters/movimientos.filter"
import { db } from "../db";

const builder = new ServiceBuilder(db, movimientosTable, movimientosFilterMap);

export const movimientosService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};