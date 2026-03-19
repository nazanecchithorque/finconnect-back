import {
    pgTable,
    serial,
    integer,
    numeric,
    timestamp
} from "drizzle-orm/pg-core";
import { cuentasTable } from "./cuentas.schema";

export const currencyConversionTable = pgTable("currency_conversion", {
    id: serial("id").primaryKey(),

    cuentaOrigenId: integer("cuenta_origen_id")
        .notNull()
        .references(() => cuentasTable.id),

    cuentaDestinoId: integer("cuenta_destino_id")
        .notNull()
        .references(() => cuentasTable.id),

    montoOrigen: numeric("monto_origen", { precision: 18, scale: 2 }).notNull(),

    montoDestino: numeric("monto_destino", { precision: 18, scale: 2 }).notNull(),

    tasaCambio: numeric("tasa_cambio", { precision: 18, scale: 6 }).notNull(),

    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date"
    })
        .notNull()
        .defaultNow()
});

export type CurrencyConversion = typeof currencyConversionTable.$inferSelect;
export type CurrencyConversionInsert = typeof currencyConversionTable.$inferInsert;
