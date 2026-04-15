import { pgTable, serial, integer, numeric, pgEnum } from "drizzle-orm/pg-core";
import { cuentasTable } from "./cuentas.schema";
import { timestamps } from "./util";
import { tipoAccionEnum } from "./acciones.schema";

export const sentidoAccion = {
    ingreso: "ingreso",
    egreso: "egreso"
} as const;

export type SentidoAccionType =
    (typeof sentidoAccion)[keyof typeof sentidoAccion];

export const sentidoAccionKeys = Object.values(sentidoAccion) as [
    SentidoAccionType
];

export const sentidoAccionEnum = pgEnum("sentidoAccion", sentidoAccionKeys);

export const accionTransactionTable = pgTable("accion_transaction", {
    id: serial("id").primaryKey(),

    cuentaId: integer("cuenta_id")
        .notNull()
        .references(() => cuentasTable.id),

    tipoAccion: tipoAccionEnum("tipo_accion").notNull(),

    sentido: sentidoAccionEnum("sentido").notNull(),

    cantidad: numeric("cantidad", { precision: 18, scale: 8 }).notNull(),

    precioUnitario: numeric("precio_unitario", {
        precision: 18,
        scale: 2
    }).notNull(),

    monto: numeric("monto", { precision: 18, scale: 2 }).notNull(),

    ...timestamps
});
