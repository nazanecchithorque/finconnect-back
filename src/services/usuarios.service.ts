import { generoEnum, usuarios } from "../schemas/usuarios.schema";
import { usuariosFilterMap } from "../filters/usuarios.filter";
import { usuariosCreateSchema } from "../validators/usuarios.validator";
import { db } from "../db";
import { z } from "zod";
import { ServiceBuilder } from "bradb";
import { eq, InferInsertModel } from "drizzle-orm";
import bcrypt from "bcrypt";

type CrearUsuarioDTO = z.infer<typeof usuariosCreateSchema>;
const builder = new ServiceBuilder(db, usuarios, usuariosFilterMap);
const baseCreate = builder.create();

export const usuariosService = {
    findAll: builder.findAll(
        db
            .select({
                id: usuarios.id,
                nombre: usuarios.nombre,
                apellido: usuarios.apellido,
                email: usuarios.email,
                dni: usuarios.dni,
                genero: usuarios.genero,
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
                dni: usuarios.dni,
                genero: usuarios.genero,
                activo: usuarios.activo,
                fechaRegistro: usuarios.fechaRegistro
            })
            .from(usuarios)
            .$dynamic()
    ),

    create: async (data: CrearUsuarioDTO) => {
        const passwordHash = await bcrypt.hash(data.password, 10);

        return baseCreate({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            dni: data.dni,
            genero: data.genero,
            passwordHash
        });
    },

    update: builder.update(),
    count: builder.count(),
    delete: builder.softDelete()
};
