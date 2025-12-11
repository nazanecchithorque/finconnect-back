import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "../errors/http.error";

export const customErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            success: false,
            code: err.statusCode,
            message: err.message
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            code: 400,
            message: "Validation failed",
            errors: err.issues
        });
    }

    // console.error(err.stack);
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
};
