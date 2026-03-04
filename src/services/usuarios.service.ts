import { ServiceBuilder } from "bradb";
import { usuariosTable } from "../schemas/usuarios.schema"
import { usuariosFilterMap } from "../filters/usuarios.filter"
import { db } from "../db";

const builder = new ServiceBuilder(db, usuariosTable, usuariosFilterMap);

export const usuariosService = {
    create: builder.create(),
    update: builder.update(),
    delete: builder.delete(),
    findAll: builder.findAll(),
    findOne: builder.findOne()
};