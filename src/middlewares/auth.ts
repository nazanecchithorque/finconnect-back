import { env } from "../env";
import { Forbidden, Unauthorized } from "../errors/http.error";
import { ClientType, clientRoles, TokenData } from "../schemas/client.schema";
import { Request, Response, NextFunction } from "express";
import jwt, {
    JsonWebTokenError,
    Secret,
    TokenExpiredError
} from "jsonwebtoken";

/*
 * Sirve para autenticar que una request tenga un token JWT de acceso válido
 * La request espera un Header 'Authorization: Bearer <token>'
 * Que es lo estándar para jwt.
 * Notar la diferencia entre error Forbidden(403) y Unathorized(401)
 * Mirar la `guia-backend.md` donde está mejor explicado
 *
 * El objecto res.locals guarda la información del token
 * !! NO GUARDAR la contraseña ni nigún dato sensible en el token !!
 * Dentro del controler que está dsp de este middleware se puede acceder
 * a res.locals.client (o lo que sea que se defina en `types/express.d.ts`
 * */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req
        .header("Authorization")
        ?.replace("Bearer ", "");

    if (!token)
        throw new Forbidden("you need Bearer Token to access this resource");

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET as Secret);
        res.locals.client = decoded as TokenData;
        next();
    } catch (err: any) {
        if (err instanceof TokenExpiredError) {
            next(new Unauthorized("expired token"));
        }
        if (err instanceof JsonWebTokenError) {
            next(new Unauthorized(""));
        }

        next(err);
    }
};

export const checkClientType = (types: Array<ClientType>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!res.locals.client)
            next(new Error("needs to pass the auth middleware first"));
        const client = res.locals.client;

        if (types.indexOf(client.role) < 0) {
            next(
                new Forbidden(
                    `No tenes tiene permiso para acceder a este recurso, se necesita tipo: ${types.join(", ")}`
                )
            );
        }

        next();
    };
};

/*
 * Esto es un ejemplo
 * Solo un admin, o uno mismo puede borrarse, pero si no soy admin
 * no puedo borrar a otro cliente.
 */
export const selfOrAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const clientId = req.params.id;
    const token = res.locals.client;
    if (clientId != token.id && token.role != clientRoles.admin)
        throw new Forbidden(
            "No estas autorizado a acceder a un recurso de otra persona a menos que tengas rol 'admin'"
        );
    next();
};
