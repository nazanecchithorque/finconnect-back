import {
    pgTable,
    serial,
    integer,
    varchar,
    numeric,
    boolean,
    timestamp,
    pgEnum,
    uniqueIndex
} from "drizzle-orm/pg-core";
import { timestamps } from "./util";
import { usuarios } from "./usuarios.schema";

export const monedaEnum = pgEnum("moneda_enum", ["ARS", "USD", "EUR", "BRL"]);

export const cuentas = pgTable(
    "cuentas",
    {
        id: serial("id").primaryKey(),

        usuarioId: integer("usuario_id")
            .notNull()
            .references(() => usuarios.id),

        cvu: varchar("cvu", { length: 22 }).notNull().unique(),

        alias: varchar("alias", { length: 50 }).notNull().unique(),

        moneda: monedaEnum("moneda").notNull(),

        saldo: numeric("saldo", { precision: 18, scale: 2 })
            .notNull()
            .default("0"),

        activa: boolean("activa").notNull().default(true),
        deletedAt: timestamp("deleted_at"),
        createdAt: timestamp("created_at").notNull().defaultNow()
    },
    (table) => [
        uniqueIndex("unique_usuario_moneda").on(table.usuarioId, table.moneda)
    ]
);
