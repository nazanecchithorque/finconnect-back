import { ServiceBuilder } from "bradb";
import { accionesTable } from "../schemas/acciones.schema";
import { accionesFilterMap } from "../filters/acciones.filter";
import { db } from "../db";

const builder = new ServiceBuilder(db, accionesTable, accionesFilterMap);

export const accionesService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};
