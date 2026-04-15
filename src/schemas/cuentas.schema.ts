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
import { usuariosTable } from "./usuarios.schema";

export const monedaTypes = {
    ARS: "ARS",
    USD: "USD",
    EUR: "EUR",
    JPY: "JPY",
    BRL: "BRL",
    GBP: "GBP"
} as const;

export type MonedaType =
    (typeof monedaTypes)[keyof typeof monedaTypes];

export const monedaTypesKeys = Object.values(monedaTypes) as [
    MonedaType
];
export const monedaEnum = pgEnum("monedaTypes", monedaTypesKeys);

export const cuentasTable = pgTable(
    "cuentas",
    {
        id: serial("id").primaryKey(),

        usuarioId: integer("usuario_id")
            .notNull()
            .references(() => usuariosTable.id),

        cvu: varchar("cvu", { length: 22 }).notNull().unique(),

        alias: varchar("alias", { length: 50 }).notNull().unique(),

        moneda: monedaEnum("moneda").notNull(),

        saldo: numeric("saldo", { precision: 18, scale: 2 })
            .notNull()
            .default("0"),

        activo: boolean("activo").notNull().default(true),
        deletedAt: timestamp("deleted_at"),
        createdAt: timestamp("created_at").notNull().defaultNow()
    },
    (table) => [
        uniqueIndex("unique_usuario_moneda").on(table.usuarioId, table.moneda)
    ]
);
