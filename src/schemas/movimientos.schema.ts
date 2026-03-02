import {
    pgTable,
    serial,
    integer,
    numeric,
    varchar,
    timestamp,
    pgEnum
} from "drizzle-orm/pg-core";

export const tipoOperacionEnum = pgEnum("tipo_operacion", ["TRANSFERENCIA"]);

export const sentidoMovimientoEnum = pgEnum("sentido_movimiento", [
    "INGRESO",
    "EGRESO"
]);

import { cuentas } from "./cuentas.schema";

/*
Los movimientos son el impacto contable.
La transferencia es la operación de negocio.
*/

export const movimientos = pgTable("movimientos", {
    id: serial("id").primaryKey(),

    cuentaId: integer("cuenta_id")
        .notNull()
        .references(() => cuentas.id),

    tipoOperacion: tipoOperacionEnum("tipo_operacion").notNull(),

    sentido: sentidoMovimientoEnum("sentido_movimiento").notNull(),

    monto: numeric("monto", { precision: 18, scale: 2 }).notNull(),

    saldoPosterior: numeric("saldo_posterior", {
        precision: 18,
        scale: 2
    }).notNull(),

    referenciaId: integer("referencia_id"), // aca va el id de la transferencia/cripto/pagoservicio

    descripcion: varchar("descripcion", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull()
});
