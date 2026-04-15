import {
    pgTable,
    integer,
    numeric,
    pgEnum,
    primaryKey
} from "drizzle-orm/pg-core";
import { timestamps } from "./util";
import { usuariosTable } from "./usuarios.schema";

export const tipoAccion = {
    apple: "apple",
    microsoft: "microsoft",
    alphabet: "alphabet",
    amazon: "amazon",
    nvidia: "nvidia"
} as const;

export type TipoAccionType =
    (typeof tipoAccion)[keyof typeof tipoAccion];

export const tipoAccionKeys = Object.values(tipoAccion) as [TipoAccionType];

export const tipoAccionEnum = pgEnum("tipoAccion", tipoAccionKeys);

export const accionesTable = pgTable(
    "acciones",
    {
        usuarioId: integer("usuarioId")
            .notNull()
            .references(() => usuariosTable.id),
        tipoAccion: tipoAccionEnum("tipoAccion").notNull(),
        monto: numeric("monto", { precision: 40, scale: 18 }).notNull(),
        ...timestamps
    },
    (table) => [
        primaryKey({ columns: [table.usuarioId, table.tipoAccion] })
    ]
);
