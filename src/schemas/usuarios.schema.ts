import {
    pgTable,
    serial,
    varchar,
    integer,
    timestamp,
    pgEnum
} from "drizzle-orm/pg-core";
import { timestamps } from "./util";

    
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
export const usuarios = pgTable("usuarios", {
    id: serial("id").primaryKey(),

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
