import {
    pgTable,
    serial,
    integer,
    numeric,
    timestamp,
    pgEnum
} from "drizzle-orm/pg-core";
import { usuariosTable } from "./usuarios.schema";
import { empresasServicioTable } from "./empresas_servicio.schema";
import { timestamps } from "./util";

export const estadoFactura = {
    pendiente: "pendiente",
    pagada: "pagada",
    vencida: "vencida"
} as const;

export type EstadoFacturaType =
    (typeof estadoFactura)[keyof typeof estadoFactura];

export const estadoFacturaKeys = Object.values(estadoFactura) as [
    EstadoFacturaType
];

export const estadoFacturaEnum = pgEnum(
    "estadoFactura",
    estadoFacturaKeys
);

export const facturasTable = pgTable("facturas", {
    id: serial("id").primaryKey(),

    usuarioId: integer("usuario_id")
        .notNull()
        .references(() => usuariosTable.id),

    empresaId: integer("empresa_id")
        .notNull()
        .references(() => empresasServicioTable.id),

    monto: numeric("monto", { precision: 18, scale: 2 }).notNull(),

    vencimiento: timestamp("vencimiento", {
        withTimezone: true,
        mode: "date"
    }).notNull(),

    estado: estadoFacturaEnum("estado").notNull().default("pendiente"),

    ...timestamps
});

export type Factura = typeof facturasTable.$inferSelect;
export type FacturaInsert = typeof facturasTable.$inferInsert;
