import { db } from "../db";
import { productFilterMap } from "../filters/product.filter";

import { ServiceBuilder } from "bradb";
import { productTable } from "../schemas/product.schema";

const builder = new ServiceBuilder(db, productTable, productFilterMap);

export const productService = {
    create: builder.create(),
    update: builder.update(),
    count: builder.count(),
    delete: builder.softDelete(),
    findAll: builder.findAll(db.select().from(productTable).$dynamic()),
    findOne: builder.findOne(db.select().from(productTable).$dynamic())
};
