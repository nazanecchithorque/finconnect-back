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
    }
};
