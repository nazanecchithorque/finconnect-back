import { db } from "../db";
import { usuarios } from "../schemas/usuarios.schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/http.error";
import jwt from "jsonwebtoken";

export const authService = {
    async login(email: string, password: string) {
        const user = await db.query.usuarios.findFirst({
            where: eq(usuarios.email, email)
        });

        if (!user) {
            throw new HttpError(401, "Credenciales inválidas");
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            throw new HttpError(401, "Credenciales inválidas");
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return {
            token
        };
    },

    async register(body: any) {
        const { registerSchema } = await import("../validators/auth.validator");

        // Validar datos
        const data = registerSchema.parse(body);

        // Verificar si ya existe usuario
        const existingUser = await db.query.usuarios.findFirst({
            where: eq(usuarios.email, data.email)
        });

        if (existingUser) {
            throw new HttpError(400, "El email ya está registrado");
        }

        // Verificar si el DNI ya existe
        const existingDni = await db.query.usuarios.findFirst({
            where: eq(usuarios.dni, data.dni)
        });

        if (existingDni) {
            throw new HttpError(400, "El DNI ya está registrado");
        }

        // Hashear password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Crear usuario
        const [newUser] = await db
            .insert(usuarios)
            .values({
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                dni: data.dni,
                genero: data.genero,
                passwordHash: hashedPassword
            })
            .returning();

        // Generar token
        const token = jwt.sign(
            {
                userId: newUser.id,
                email: newUser.email
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return { token };
    }
};
