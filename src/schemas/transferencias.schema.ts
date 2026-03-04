import {
    pgTable,
    serial,
    integer,
    numeric,
    timestamp,
    pgEnum
} from "drizzle-orm/pg-core";
import { cuentasTable } from "./cuentas.schema";
import { timestamps } from "./util";

export const estadoTransferencia = {
    completada: "completada",
    pendiente: "pendiente",
    cancelada: "cancelada"
} as const;

export type EstadoTransferenciaType =
    (typeof estadoTransferencia)[keyof typeof estadoTransferencia];

export const estadoTransferenciaKeys = Object.values(estadoTransferencia) as [
    EstadoTransferenciaType
];

export const estadoTransferenciaEnum = pgEnum(
    "estadoTransferencia",
    estadoTransferenciaKeys
);

export const transferenciasTable = pgTable("transferencias", {
    id: serial("id").primaryKey(),

    cuentaOrigenId: integer("cuenta_origen_id")
        .notNull()
        .references(() => cuentasTable.id),

    cuentaDestinoId: integer("cuenta_destino_id")
        .notNull()
        .references(() => cuentasTable.id),

    monto: numeric("monto", { precision: 18, scale: 2 }).notNull(),

    estado: estadoTransferenciaEnum("estado").notNull(),
    ...timestamps
});

