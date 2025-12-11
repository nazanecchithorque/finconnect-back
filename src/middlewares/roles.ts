import { ClientType } from "@/schemas/client.schema";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const onlyForRol = (
    rol: ClientType | ClientType[],
    ...handlers: RequestHandler[]
): RequestHandler => {
    const roles = Array.isArray(rol) ? rol : [rol];

    return (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals.client.role) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        if (!roles.includes(res.locals.client.role)) {
            return next();
        }

        const executeHandlers = (index: number) => {
            if (index >= handlers.length) {
                return next();
            }

            const handler = handlers[index];
            handler(req, res, (err?: any) => {
                if (err) return next(err);
                executeHandlers(index + 1);
            });
        };

        executeHandlers(0);
    };
};
