import {
    pgTable,
    serial,
    integer,
    numeric,
    timestamp
} from "drizzle-orm/pg-core";
import { facturasTable } from "./facturas.schema";
import { cuentasTable } from "./cuentas.schema";

export const pagosServiciosTable = pgTable("pagos_servicios", {
    id: serial("id").primaryKey(),

    facturaId: integer("factura_id")
        .notNull()
        .references(() => facturasTable.id),

    cuentaId: integer("cuenta_id")
        .notNull()
        .references(() => cuentasTable.id),

    monto: numeric("monto", { precision: 18, scale: 2 }).notNull(),

    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date"
    }).notNull().defaultNow()
});

export type PagoServicio = typeof pagosServiciosTable.$inferSelect;
export type PagoServicioInsert = typeof pagosServiciosTable.$inferInsert;
