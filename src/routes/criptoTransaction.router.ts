import { Router } from "express";
import {
	criptoTransactionController
	} from "../controllers/criptoTransaction.controller";
import { authMiddleware } from "@/middlewares/auth";
export const criptoTransactionRouter = Router();

// Get All
criptoTransactionRouter.get("/", authMiddleware, criptoTransactionController.getAll);

// Create
criptoTransactionRouter.post("/", authMiddleware, criptoTransactionController.create);

// Get one
criptoTransactionRouter.get("/:id", authMiddleware, criptoTransactionController.getOne);

// Update
criptoTransactionRouter.put("/:id", authMiddleware, criptoTransactionController.update);

// Delete
criptoTransactionRouter.delete("/:id", authMiddleware, criptoTransactionController.remove);