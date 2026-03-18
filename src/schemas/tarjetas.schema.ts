import {
    pgTable,
    serial,
    integer,
    varchar,
    timestamp,
    boolean,
    pgEnum
} from "drizzle-orm/pg-core";
import { cuentasTable } from "./cuentas.schema";
import { timestamps } from "./util";

export const marcaTarjeta = {
    mastercard: "mastercard"
} as const;

export type MarcaTarjetaType =
    (typeof marcaTarjeta)[keyof typeof marcaTarjeta];

export const marcaTarjetaKeys = Object.values(marcaTarjeta) as [
    MarcaTarjetaType
];

export const marcaTarjetaEnum = pgEnum(
    "marcaTarjeta",
    marcaTarjetaKeys
);

export const estadoTarjeta = {
    activa: "activa",
    bloqueada: "bloqueada",
    cancelada: "cancelada"
} as const;

export type EstadoTarjetaType =
    (typeof estadoTarjeta)[keyof typeof estadoTarjeta];

export const estadoTarjetaKeys = Object.values(estadoTarjeta) as [
    EstadoTarjetaType
];

export const estadoTarjetaEnum = pgEnum(
    "estadoTarjeta",
    estadoTarjetaKeys
);

export const tarjetasTable = pgTable("tarjetas", {
    id: serial("id").primaryKey(),

    cuentaId: integer("cuenta_id")
        .notNull()
        .references(() => cuentasTable.id),

    ultimos4: varchar("ultimos_4", { length: 4 }).notNull(),

    tipo: varchar("tipo", { length: 20 }).notNull().default("VIRTUAL"),

    marca: marcaTarjetaEnum("marca").notNull(),

    estado: estadoTarjetaEnum("estado").notNull(),

    fechaEmision: timestamp("fecha_emision", {
        withTimezone: true,
        mode: "date"
    }).notNull(),

    fechaVencimiento: timestamp("fecha_vencimiento", {
        withTimezone: true,
        mode: "date"
    }).notNull(),

    activo: boolean("activo").notNull().default(true),

    ...timestamps
});
