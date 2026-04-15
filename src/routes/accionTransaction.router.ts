import { Router } from "express";
import { accionTransactionController } from "../controllers/accionTransaction.controller";
import { authMiddleware } from "@/middlewares/auth";

export const accionTransactionRouter = Router();

accionTransactionRouter.get(
    "/",
    authMiddleware,
    accionTransactionController.getAll
);

accionTransactionRouter.post(
    "/",
    authMiddleware,
    accionTransactionController.create
);

accionTransactionRouter.get(
    "/:id",
    authMiddleware,
    accionTransactionController.getOne
);

accionTransactionRouter.put(
    "/:id",
    authMiddleware,
    accionTransactionController.update
);

accionTransactionRouter.delete(
    "/:id",
    authMiddleware,
    accionTransactionController.remove
);
