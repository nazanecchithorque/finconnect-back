import { FilterMap } from "bradb";
import { productFilterSchema, productTable } from "../schemas/product.schema";
import { gt, ilike } from "drizzle-orm";

export const productFilterMap: FilterMap<typeof productFilterSchema> = {
    name: (val) => ilike(productTable.name, `%${val}%`),
    price: (val) => gt(productTable.price, val),
    stock: (val) => gt(productTable.stock, val)
};
