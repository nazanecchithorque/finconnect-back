import { ServiceBuilder } from "bradb";
import { tarjetasTable } from "../schemas/tarjetas.schema";
import { tarjetasFilterMap } from "@/filters/tarjetas.filter"; 
import { db } from "@/db";

const builder = new ServiceBuilder(db, tarjetasTable, tarjetasFilterMap);

export const tarjetasService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};
