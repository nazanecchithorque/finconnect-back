import { ServiceBuilder } from "bradb";
import { db } from "../db";
import { empresasServicioTable } from "../schemas/empresas_servicio.schema";
import { empresasServicioFilterMap } from "../filters/empresas_servicio.filter";

const builder = new ServiceBuilder(
    db,
    empresasServicioTable,
    empresasServicioFilterMap
);

export const empresasServicioService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};
