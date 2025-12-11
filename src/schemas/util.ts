import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date"
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "date"
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", {
        withTimezone: true,
        mode: "date"
    })
};
