import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth";
import { currencyConversionController } from "../controllers/currencyConversion.controller";

export const currencyConversionRouter = Router();

currencyConversionRouter.post(
    "/",
    authMiddleware,
    currencyConversionController.create
);
