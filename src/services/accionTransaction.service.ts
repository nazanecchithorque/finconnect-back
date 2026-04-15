import { ServiceBuilder } from "bradb";
import { accionTransactionTable } from "../schemas/accionTransaction.schema";
import { accionTransactionFilterMap } from "../filters/accionTransaction.filter";
import { db } from "../db";

const builder = new ServiceBuilder(
    db,
    accionTransactionTable,
    accionTransactionFilterMap
);

export const accionTransactionService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};
