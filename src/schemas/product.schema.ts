import {
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    real,
    integer,
    serial
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { timestamps } from "./util";

export const productTable = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: real("price").notNull(),
    stock: integer("stock").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at")
});

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    stock: z.number(),

    ...timestamps
});

export const productFilterSchema = productSchema
    .pick({
        name: true,
        price: true,
        stock: true
    })
    .partial();
export type ProductFilterSchema = z.infer<typeof productFilterSchema>;

export const productCreateSchema = productSchema.pick({
    name: true,
    description: true,
    price: true,
    stock: true
});

export const productUpdateSchema = productCreateSchema.partial();
