import { db } from "../db";
import { userRoles, usuariosTable } from "../schemas/usuarios.schema";
import { cuentasTable } from "../schemas/cuentas.schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/http.error";
import jwt from "jsonwebtoken";
import { TokenData } from "../validators/auth.validator";

export const authService = {
    async login(email: string, password: string) {
        const user = await db.query.usuariosTable.findFirst({
            where: eq(usuariosTable.email, email)
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
                id: user.id.toString(),
                email: user.email,
                role: user.role
            } as TokenData,
            process.env.JWT_SECRET as string,
            { expiresIn: "100000h" }
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
        const existingUser = await db.query.usuariosTable.findFirst({
            where: eq(usuariosTable.email, data.email)
        });

        if (existingUser) {
            throw new HttpError(400, "El email ya está registrado");
        }

        // Verificar si el DNI ya existe
        const existingDni = await db.query.usuariosTable.findFirst({
            where: eq(usuariosTable.dni, data.dni)
        });

        if (existingDni) {
            throw new HttpError(400, "El DNI ya está registrado");
        }

        // Hashear password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Crear usuario
        const [newUser] = await db
            .insert(usuariosTable)
            .values({
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                dni: data.dni,
                genero: data.genero,
                passwordHash: hashedPassword,
                role: userRoles.finalUser
            })
            .returning();

        const monedas = ["ARS", "USD", "EUR", "BRL"] as const;

        for (const moneda of monedas) {
            await db.insert(cuentasTable).values({
                usuarioId: newUser.id,
                cvu: Math.random().toString().slice(2, 24),
                alias: `usuario.${newUser.id}.${moneda.toLowerCase()}`,
                moneda,
                saldo: "0",
                activo: true
            });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: newUser.id.toString(),
                email: newUser.email
            } as TokenData,
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return { token };
    }
};
