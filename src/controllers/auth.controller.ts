import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { z } from "zod";

const redeemBody = z.object({
    code: z.string().min(6).max(16),
    dni: z.string().min(1, "El DNI es obligatorio")
});

export const authController = {
    async createTelegramLinkCode(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = Number(res.locals.user?.id);
            if (!userId) {
                return res.status(401).json({ message: "No autenticado" });
            }
            const result = await authService.createTelegramLinkCode(userId);
            return res.status(201).json({
                message: "Código generado. Vence en 15 minutos.",
                result
            });
        } catch (error) {
            next(error);
        }
    },

    async redeemTelegramLinkCode(req: Request, res: Response, next: NextFunction) {
        try {
            const { code, dni } = redeemBody.parse(req.body);
            const result = await authService.redeemTelegramLinkCode(code, dni);
            return res.status(200).json({
                message: "Sesión vinculada",
                result
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const result = await authService.login(email, password);

            return res.status(200).json({
                message: "Login exitoso",
                result
            });
        } catch (error) {
            next(error);
        }
    },

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);

            return res.status(201).json({
                message: "Usuario registrado correctamente",
                result
            });
        } catch (error) {
            next(error);
        }
    }
};
