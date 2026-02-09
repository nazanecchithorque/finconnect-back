import {
    pgTable,
    serial,
    varchar,
    integer,
    timestamp
} from "drizzle-orm/pg-core";
import { timestamps } from "./util";

export const usuarios = pgTable("usuarios", {
    id: serial("id").primaryKey(),

    nombre: varchar("nombre", { length: 100 }).notNull(),
    apellido: varchar("apellido", { length: 100 }).notNull(),

    email: varchar("email", { length: 255 }).notNull().unique(),

    passwordHash: varchar("password_hash", { length: 255 }).notNull(),

    activo: integer("activo").notNull().default(1),

    fechaRegistro: timestamp("fecha_registro").notNull().defaultNow(),

    deletedAt: timestamps.deletedAt
});
