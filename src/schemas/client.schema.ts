import { serial, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./util";

export const clientRoles = {
    free: "free",
    premium: "premium",
    admin: "admin"
} as const; // Importante poner el as const, si no TS no infiere bien los tipos
export type ClientType = keyof typeof clientRoles;

export const clientRolesKeys = Object.keys(clientRoles) as [ClientType];

export const clientTypeEnum = pgEnum("role", clientRolesKeys);

export type TokenData = {
    id: string;
    role: ClientType;
};

export const clientTable = pgTable("clients", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(), // password hasheada
    role: clientTypeEnum().notNull(),

    ...timestamps
});
