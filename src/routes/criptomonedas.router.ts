import { Router } from "express";
import { criptomonedasController } from "../controllers/criptomonedas.controller";
import { authMiddleware } from "@/middlewares/auth";

export const criptomonedasRouter = Router();

criptomonedasRouter.get(
    "/prices",
    authMiddleware,
    criptomonedasController.getCriptoPrices
);

criptomonedasRouter.get(
    "/",
    authMiddleware,
    criptomonedasController.getAll
);
