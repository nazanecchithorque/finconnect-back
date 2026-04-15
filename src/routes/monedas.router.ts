import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth";
import { currenciesController } from "../controllers/currencies.controller";

/** Alias retrocompatible: la implementación vive en `currencies` (misma API Frankfurter). */
export const monedasRouter = Router();

monedasRouter.get(
    "/prices",
    authMiddleware,
    currenciesController.getMonedaPrices
);
