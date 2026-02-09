import { usuarios } from "../schemas/usuarios.schema";
import { usuariosFilterMap } from "../filters/usuarios.filter";
import { db } from "../db";
import { ServiceBuilder } from "bradb";

const builder = new ServiceBuilder(db, usuarios, usuariosFilterMap);

export const usuariosService = {
    findAll: builder.findAll(
        db
            .select({
                id: usuarios.id,
                nombre: usuarios.nombre,
                apellido: usuarios.apellido,
                email: usuarios.email,
                activo: usuarios.activo
            })
            .from(usuarios)
            .$dynamic()
    ),

    findOne: builder.findOne(
        db
            .select({
                id: usuarios.id,
                nombre: usuarios.nombre,
                apellido: usuarios.apellido,
                email: usuarios.email,
                activo: usuarios.activo,
                fechaRegistro: usuarios.fechaRegistro
            })
            .from(usuarios)
            .$dynamic()
    ),

    create: builder.create(),
    update: builder.update(),
    count: builder.count(),
    delete: builder.softDelete()
};
