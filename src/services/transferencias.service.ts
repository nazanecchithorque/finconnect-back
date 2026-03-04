import { ServiceBuilder } from "bradb";
import { transferenciasTable } from "../schemas/transferencias.schema"
import { transferenciasFilterMap } from "../filters/transferencias.filter"
import { db } from "../db";

const builder = new ServiceBuilder(db, transferenciasTable, transferenciasFilterMap);

export const transferenciasService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};