import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../errors/http.error";

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new HttpError(401, "Token requerido");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new HttpError(401, "Token inválido");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number;
            email: string;
        };

        req.user = decoded;

        next();
    } catch (error) {
        throw new HttpError(401, "Token inválido o expirado");
    }
}
