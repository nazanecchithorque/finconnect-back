import { ServiceBuilder } from "bradb";
import { cuentasTable } from "../schemas/cuentas.schema"
import { cuentasFilterMap } from "../filters/cuentas.filter"
import { db } from "../db";

const builder = new ServiceBuilder(db, cuentasTable, cuentasFilterMap);

export const cuentasService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};