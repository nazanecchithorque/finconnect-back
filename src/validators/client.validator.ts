import { clientRolesKeys } from "../schemas/client.schema";
import { z } from "zod";

export const clientSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.email(),
    password: z.string(),
    role: z.enum(clientRolesKeys),
    deletedAt: z.date().nullable()
});

export const loginClientSchema = clientSchema.pick({
    email: true,
    password: true
});
export type LoginClient = z.infer<typeof loginClientSchema>;

export const clientFilterSchema = clientSchema
    .pick({
        name: true,
        email: true,
        role: true
    })
    .partial(); // Importante que sea partial(), no optional() para los filtros

export const clientCreateSchema = clientSchema.omit({
    id: true,
    deletedAt: true
});
export const clientUpdateSchema = clientCreateSchema.partial();
