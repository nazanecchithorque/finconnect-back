import { Response } from "express";

export function okResponse(res: Response, code: number, message: string) {
    res.status(201).json({
        success: true,
        code,
        message
    });
}

export function errorResponse(res: Response, code: number, message: string) {
    res.status(code).json({
        success: false,
        code,
        message
    });
}

export function badRequest(res: Response, message: string) {
    errorResponse(res, 400, message);
}
