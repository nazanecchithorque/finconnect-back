import {
    pgTable,
    serial,
    varchar,
    pgEnum
} from "drizzle-orm/pg-core";
import { timestamps } from "./util";

export const categoriaEmpresaServicio = {
    luz: "luz",
    agua: "agua",
    internet: "internet",
    streaming: "streaming",
    otros: "otros"
} as const;

export type CategoriaEmpresaServicioType =
    (typeof categoriaEmpresaServicio)[keyof typeof categoriaEmpresaServicio];

export const categoriaEmpresaServicioKeys = Object.values(categoriaEmpresaServicio) as [
    CategoriaEmpresaServicioType
];

export const categoriaEmpresaServicioEnum = pgEnum(
    "categoriaEmpresaServicio",
    categoriaEmpresaServicioKeys
);

export const empresasServicioTable = pgTable("empresas_servicio", {
    id: serial("id").primaryKey(),

    nombre: varchar("nombre", { length: 120 }).notNull(),

    categoria: categoriaEmpresaServicioEnum("categoria").notNull(),

    ...timestamps
});

export type EmpresaServicio = typeof empresasServicioTable.$inferSelect;
export type EmpresaServicioInsert = typeof empresasServicioTable.$inferInsert;
