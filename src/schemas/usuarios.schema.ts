import {
    pgTable,
    serial,
    varchar,
    integer,
    timestamp,
    pgEnum
} from "drizzle-orm/pg-core";
import { timestamps } from "./util";


export const userRoles = {
    admin: "admin",
    finalUser: "final_user",
} as const;

export type UserRolesType =
    (typeof userRoles)[keyof typeof userRoles];

export const userRolesKeys = Object.values(userRoles) as [
    UserRolesType
];

export const userRolesEnum = pgEnum(
    "user_roles",
    userRolesKeys
);
    
export const genero = {
    masculino: "masculino",
    femenino: "femenino",
    otro: "otro"
} as const;

export type GeneroType =
    (typeof genero)[keyof typeof genero];

export const generoKeys = Object.values(genero) as [
    GeneroType
];

export const generoEnum = pgEnum(
    "genero",
    generoKeys
);

export const usuariosTable = pgTable("usuarios", {
    id: serial("id").primaryKey(),

    role: userRolesEnum("role").notNull(),

    nombre: varchar("nombre", { length: 100 }).notNull(),

    apellido: varchar("apellido", { length: 100 }).notNull(),

    email: varchar("email", { length: 255 }).notNull().unique(),

    dni: varchar("dni", { length: 20 }).notNull().unique(),

    genero: generoEnum("genero").notNull(),

    passwordHash: varchar("password_hash", { length: 255 }).notNull(),

    activo: integer("activo").notNull().default(1),

    createdAt: timestamps.createdAt,

    deletedAt: timestamps.deletedAt
});
