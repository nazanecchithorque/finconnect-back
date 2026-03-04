import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { ZodError } from "zod";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const logMessage = `${req.method} ${req.url}`;

  const token: string | undefined = req
    .header("Authorization")
    ?.replace("Bearer ", "");

  // TODO: if the GET doesnt provide token will failed
  let user;
  if (token) {
    user = jwt.decode(token);
  }

  next();
}

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logMessage = `${req.method} ${req.url}`;
  let error = {};

  if (err instanceof ZodError) {
    error = {
      message: "Validation failed",
      errors: err.issues,
    };
  } else {
    error = {
      message: err.message,
    };
  }

  next(err);
};

export const responseLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method == "POST" || req.method == "PUT") {
    const originalJson = res.json;

    // Override the json function
    res.json = function (body) {
      const logMessage = `${req.method} ${req.originalUrl}`;

      return originalJson.call(this, body);
    };
  }

  next();
};