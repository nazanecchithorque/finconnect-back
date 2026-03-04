import {
    pgTable,
    serial,
    integer,
    numeric,
    varchar,
    pgEnum
} from "drizzle-orm/pg-core";
import { cuentas } from "./cuentas.schema";
import { timestamps } from "./util";

export const sentidoMovimiento = {
    ingreso: "ingreso",
    egreso: "egreso"
} as const;

export type SentidoMovimientoType =
    (typeof sentidoMovimiento)[keyof typeof sentidoMovimiento];

export const sentidoMovimientoKeys = Object.values(sentidoMovimiento) as [
    SentidoMovimientoType
];

export const sentidoMovimientoEnum = pgEnum("sentidoMovimiento", sentidoMovimientoKeys);

export const tipoOperacion = {
    transferencia: "transferencia",
    cripto: "cripto",
    pagoservicio: "pagoservicio",
    otros: "otros"
} as const;

export type TipoOperacionType =
    (typeof tipoOperacion)[keyof typeof tipoOperacion];

export const tipoOperacionKeys = Object.values(tipoOperacion) as [
    TipoOperacionType
];

export const tipoOperacionEnum = pgEnum("tipoOperacion", tipoOperacionKeys);

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

    referenciaId: integer("referencia_id"),

    sentido: sentidoMovimientoEnum("sentido_movimiento").notNull(),

    monto: numeric("monto", { precision: 18, scale: 2 }).notNull(),

    saldoPosterior: numeric("saldo_posterior", {
        precision: 18,
        scale: 2
    }).notNull(),

    descripcion: varchar("descripcion", { length: 255 }),
    ...timestamps
});
