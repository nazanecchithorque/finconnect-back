import { UserRolesType } from "@/schemas";
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),

    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
});

export const registerSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    apellido: z.string().min(1, "El apellido es requerido"),
    email: z.string().email("Email inválido"),
    dni: z.string().min(1, "El dni es requerido"),
    genero: z.enum(["masculino", "femenino", "otro"]),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
});

export type TokenData = {
    id: string;
    email: string;
    role: UserRolesType;
};