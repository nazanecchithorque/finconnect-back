import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { usuariosTable } from "./usuarios.schema";
import { timestamps } from "./util";

/** Código de un solo uso para enlazar Telegram / IA con la cuenta (wallet). */
export const telegramLinkCodesTable = pgTable("telegram_link_codes", {
    id: serial("id").primaryKey(),
    usuarioId: integer("usuario_id")
        .notNull()
        .references(() => usuariosTable.id),
    /** Código en mayúsculas, ej. A3F9K2L1 */
    code: varchar("code", { length: 16 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamps.createdAt,
});
