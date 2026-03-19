import { ServiceBuilder } from "bradb";
import { db } from "../db";
import { facturasTable } from "../schemas/facturas.schema";
import { facturasFilterMap } from "../filters/facturas.filter";

const builder = new ServiceBuilder(db, facturasTable, facturasFilterMap);

export const facturasService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};
