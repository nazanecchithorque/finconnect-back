import { pgTable, serial, integer, numeric, pgEnum } from "drizzle-orm/pg-core";
import { cuentasTable } from "./cuentas.schema";
import { timestamps } from "./util";
import { tipoCriptomonedaEnum } from "./criptomonedas.schema";

export const sentidoCripto = {
    ingreso: "ingreso",
    egreso: "egreso"
} as const;

export type SentidoCriptoType =
    (typeof sentidoCripto)[keyof typeof sentidoCripto];

export const sentidoCriptoKeys = Object.values(sentidoCripto) as [
    SentidoCriptoType
];

export const sentidoCriptoEnum = pgEnum("sentidoCripto", sentidoCriptoKeys);

export const criptoTransactionTable = pgTable("cripto_transaction", {
    id: serial("id").primaryKey(),

    cuentaId: integer("cuenta_id")
        .notNull()
        .references(() => cuentasTable.id),

    tipoCriptomoneda: tipoCriptomonedaEnum("tipo_criptomoneda").notNull(),

    sentido: sentidoCriptoEnum("sentido").notNull(),

    cantidad: numeric("cantidad", { precision: 18, scale: 8 }).notNull(),

    precioUnitario: numeric("precio_unitario", {
        precision: 18,
        scale: 2
    }).notNull(),

    monto: numeric("monto", { precision: 18, scale: 2 }).notNull(),

    ...timestamps
});
