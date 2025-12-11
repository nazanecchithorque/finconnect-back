import {
    createBuilder,
    deleteBuilder,
    findAllBuilder,
    findOneBuilder,
    updateBuilder
} from "bradb";
import { productService } from "../services/product.service";
import {
    productCreateSchema,
    productFilterSchema,
    productUpdateSchema
} from "../schemas/product.schema";

export const productController = {
    getById: findOneBuilder(productService),
    getAll: findAllBuilder(productService, productFilterSchema),
    update: updateBuilder(productService, productUpdateSchema),
    create: createBuilder(productService, productCreateSchema),
    delete: deleteBuilder(productService)
};
