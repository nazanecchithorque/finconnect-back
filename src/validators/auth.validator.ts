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
    dni: z
        .string()
        .min(1, "El dni es requerido")
        .transform((v) => v.replace(/\D/g, ""))
        .refine((v) => v.length >= 7 && v.length <= 8, {
            message: "El DNI debe tener entre 7 y 8 dígitos",
        }),
    genero: z.enum(["masculino", "femenino", "otro"]),
    /** Número de trámite del DNI (recomendado para validación RENAPER) */
    numeroTramite: z
        .string()
        .optional()
        .refine(
            (v) => v === undefined || v === "" || /^\d{4,11}$/.test(v.replace(/\D/g, "")),
            { message: "El número de trámite debe tener entre 4 y 11 dígitos" }
        ),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
});

export type TokenData = {
    id: string;
    email: string;
    role: UserRolesType;
};