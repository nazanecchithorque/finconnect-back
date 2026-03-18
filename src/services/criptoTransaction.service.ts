import { ServiceBuilder } from "bradb";
import { criptoTransactionTable } from "../schemas/criptoTransaction.schema"
import { criptoTransactionFilterMap } from "../filters/criptoTransaction.filter"
import { db } from "../db";

const builder = new ServiceBuilder(db, criptoTransactionTable, criptoTransactionFilterMap);

export const criptoTransactionService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};