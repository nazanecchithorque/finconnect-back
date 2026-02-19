import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const authController = {
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
