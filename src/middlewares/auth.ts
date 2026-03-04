import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, Secret, TokenExpiredError } from "jsonwebtoken";
import { Forbidden, HttpError, Unauthorized } from "../errors/http.error";
import { TokenData } from "@/validators/auth.validator";
import z, { ZodObject } from "zod";
import { UserRolesType } from "@/schemas";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req
        .header("Authorization")
        ?.replace("Bearer ", "");

    if (!token)
        throw new Forbidden("you need Bearer Token to access this resource");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        res.locals.user = decoded as TokenData;
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

export const checkUserRole = (roles: Array<UserRolesType>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
      return next(new Error("needs to pass the auth middleware first"));
    }
    const user = res.locals.user;

    if (roles.indexOf(user.role) < 0) {
      return next(
        new Forbidden(
          `No tenes tiene permiso para acceder a este recurso, se necesita tipo: ${roles.join(", ")}`,
        ),
      );
    }

    next();
  };
};

export function checkIsMy<PKSchema extends ZodObject, Item extends object>(
  findOne: (pk: z.output<PKSchema>) => Promise<Item>,
  pkSchema: PKSchema,
  fieldName: keyof Item = "idUser" as keyof Item,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
      return next(new Error("needs to pass the auth middleware first"));
    }
    const me = res.locals.user;
    const pk = pkSchema.parse(req.params);
    const item = await findOne(pk);

    if (!(fieldName in item)) {
      throw new Error(`field ${fieldName as string} is not present on ${item}`);
    }

    if (item[fieldName as keyof typeof item] != me.id && me.role != "admin") {
      return next(
        new Forbidden(
          "No puedes acceder a un recurso que no es tuyo a menos que seas admin",
        ),
      );
    }

    res.locals.item = item;
    next();
  };
}

export function selfOrAdmin(paramName = "id") {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
      return next(new Error("needs to pass the auth middleware first"));
    }
    const me = res.locals.user;

    if (me.role == "admin") {
      return next();
    }

    if (me.id != Number(req.params[paramName])) {
      return next(
        new Forbidden(
          "No puedes acceder a un recurso que no es tuyo a menos que seas admin",
        ),
      );
    }

    next();
  };
}