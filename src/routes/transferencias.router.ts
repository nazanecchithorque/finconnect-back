import { Router } from "express";
import {
	transferenciasController
	} from "../controllers/transferencias.controller";
import { authMiddleware } from "@/middlewares/auth";
export const transferenciasRouter = Router();

// Get All
transferenciasRouter.get("/", authMiddleware, transferenciasController.getAll);

// Create
transferenciasRouter.post("/", authMiddleware, transferenciasController.create);

// Get one
transferenciasRouter.get("/:id", authMiddleware, transferenciasController.getOne);