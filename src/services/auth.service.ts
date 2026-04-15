import { randomBytes } from "node:crypto";
import { db } from "../db";
import { userRoles, usuariosTable } from "../schemas/usuarios.schema";
import { cuentasTable } from "../schemas/cuentas.schema";
import { telegramLinkCodesTable } from "../schemas/telegram_link_codes.schema";
import { and, eq, gt, isNull } from "drizzle-orm";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/http.error";
import jwt from "jsonwebtoken";
import { TokenData } from "../validators/auth.validator";

function issueLongLivedToken(user: {
    id: number;
    email: string;
    role: string;
}): string {
    return jwt.sign(
        {
            id: user.id.toString(),
            email: user.email,
            role: user.role
        } as TokenData,
        process.env.JWT_SECRET as string,
        { expiresIn: "100000h" }
    );
}

const TELEGRAM_CODE_TTL_MS = 15 * 60 * 1000;
const TELEGRAM_CODE_LENGTH = 8;

function generateLinkCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = randomBytes(TELEGRAM_CODE_LENGTH);
    let out = "";
    for (let i = 0; i < TELEGRAM_CODE_LENGTH; i++) {
        out += chars[bytes[i]! % chars.length];
    }
    return out;
}

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

        const token = issueLongLivedToken(user);

        return {
            token
        };
    },

    /** Código de un solo uso (15 min) para enlazar Telegram / IA con la cuenta desde la wallet. */
    async createTelegramLinkCode(usuarioId: number) {
        await db
            .delete(telegramLinkCodesTable)
            .where(
                and(
                    eq(telegramLinkCodesTable.usuarioId, usuarioId),
                    isNull(telegramLinkCodesTable.usedAt)
                )
            );

        const expiresAt = new Date(Date.now() + TELEGRAM_CODE_TTL_MS);
        for (let attempt = 0; attempt < 5; attempt++) {
            const code = generateLinkCode();
            try {
                await db.insert(telegramLinkCodesTable).values({
                    usuarioId,
                    code,
                    expiresAt
                });
                return {
                    code,
                    expiresAt: expiresAt.toISOString(),
                    ttlMinutes: 15
                };
            } catch {
                /* colisión de code único, reintentar */
            }
        }
        throw new HttpError(500, "No se pudo generar el código");
    },

    /** Canjea el código y devuelve JWT (mismo formato que login). Exige DNI que coincida con la cuenta. */
    async redeemTelegramLinkCode(rawCode: string, rawDni: string) {
        const code = rawCode.trim().toUpperCase().replace(/\s+/g, "");
        if (code.length < 6) {
            throw new HttpError(400, "Código inválido");
        }

        const dniIngresado = rawDni.replace(/\D/g, "");
        if (dniIngresado.length < 7 || dniIngresado.length > 8) {
            throw new HttpError(400, "El DNI debe tener entre 7 y 8 dígitos");
        }

        const row = await db.query.telegramLinkCodesTable.findFirst({
            where: and(
                eq(telegramLinkCodesTable.code, code),
                isNull(telegramLinkCodesTable.usedAt),
                gt(telegramLinkCodesTable.expiresAt, new Date())
            )
        });

        if (!row) {
            throw new HttpError(400, "Código incorrecto o vencido");
        }

        const user = await db.query.usuariosTable.findFirst({
            where: eq(usuariosTable.id, row.usuarioId)
        });
        if (!user) {
            throw new HttpError(400, "Usuario no encontrado");
        }

        const dniCuenta = String(user.dni).replace(/\D/g, "");
        if (dniIngresado !== dniCuenta) {
            throw new HttpError(400, "El DNI no coincide con la cuenta de este código");
        }

        await db
            .update(telegramLinkCodesTable)
            .set({ usedAt: new Date() })
            .where(eq(telegramLinkCodesTable.id, row.id));

        const token = issueLongLivedToken(user);
        return { token };
    },

    async register(body: any) {
        const { registerSchema } = await import("../validators/auth.validator");

        // Validar datos
        const data = registerSchema.parse(body);

        const { validarIdentidadRenaper } = await import("../lib/renaper");
        const renaper = await validarIdentidadRenaper({
            dni: data.dni,
            nombre: data.nombre,
            apellido: data.apellido,
            genero: data.genero,
            ...(data.numeroTramite && data.numeroTramite.length > 0
                ? { numeroTramite: data.numeroTramite.replace(/\D/g, "") }
                : {}),
        });
        if (!renaper.ok) {
            throw new HttpError(400, renaper.mensaje);
        }

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

        const monedas = ["ARS", "USD", "EUR", "JPY", "BRL", "GBP"] as const;

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
