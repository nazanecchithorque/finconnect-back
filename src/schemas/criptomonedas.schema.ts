import {
    pgTable,
    integer,
    numeric,
    pgEnum,
    primaryKey
} from "drizzle-orm/pg-core";
import { timestamps } from "./util";
import { usuariosTable } from "./usuarios.schema";

export const tipoCriptomoneda = {
    bitcoin: "bitcoin",
    ethereum: "ethereum",
    usdt: "usdt",
    solana: "solana",
    cardano: "cardano",
    polkadot: "polkadot",
    avalanche: "avalanche",
    binance: "binance",
    xrp: "xrp",
    dogecoin: "dogecoin"
} as const;

export type TipoCriptomonedaType =
    (typeof tipoCriptomoneda)[keyof typeof tipoCriptomoneda];

export const tipoCriptomonedaKeys = Object.values(tipoCriptomoneda) as [
    TipoCriptomonedaType
];

export const tipoCriptomonedaEnum = pgEnum("tipoCriptomoneda", tipoCriptomonedaKeys);

/*
Los movimientos son el impacto contable.
La transferencia es la operación de negocio.
*/

export const criptomonedasTable = pgTable("criptomonedas", {
    usuarioId: integer("usuarioId").notNull().references(() => usuariosTable.id),
    tipoCriptomoneda: tipoCriptomonedaEnum("tipoCriptomoneda").notNull(),
    monto: numeric("monto", { precision: 40, scale: 18 }).notNull(),
    ...timestamps
}, (table) => [
    primaryKey({ columns: [table.usuarioId, table.tipoCriptomoneda] })
])