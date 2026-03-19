import { ServiceBuilder } from "bradb";
import { db } from "../db";
import { pagosServiciosTable } from "../schemas/pagos_servicios.schema";
import { pagosServiciosFilterMap } from "../filters/pagos_servicios.filter";

const builder = new ServiceBuilder(db, pagosServiciosTable, pagosServiciosFilterMap);

export const pagosServiciosService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};
