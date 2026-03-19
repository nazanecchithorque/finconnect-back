import { ServiceBuilder } from "bradb";
import { currencyConversionTable } from "../schemas/currencyConversion.schema";
import { currencyConversionFilterMap } from "../filters/currencyConversion.filter";
import { db } from "../db";

const builder = new ServiceBuilder(
    db,
    currencyConversionTable,
    currencyConversionFilterMap
);

export const currencyConversionService = {
    create: builder.create(),
    findAll: builder.findAll(),
    findOne: builder.findOne(),
};
