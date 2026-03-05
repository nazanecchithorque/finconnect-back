import { ServiceBuilder } from "bradb";
import { criptomonedasTable } from "../schemas/criptomonedas.schema"
import { criptomonedasFilterMap } from "../filters/criptomonedas.filter"
import { db } from "../db";

const builder = new ServiceBuilder(db, criptomonedasTable, criptomonedasFilterMap);

export const criptomonedasService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};