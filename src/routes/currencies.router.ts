import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth";
import { currenciesController } from "../controllers/currencies.controller";

export const currenciesRouter = Router();

currenciesRouter.get(
    "/convert",
    authMiddleware,
    currenciesController.convert
);
