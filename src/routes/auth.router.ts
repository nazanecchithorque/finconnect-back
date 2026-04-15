import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);

/** Desde la wallet (usuario logueado): obtiene código de 15 min para enlazar Telegram/IA. */
router.post("/telegram/code", authMiddleware, authController.createTelegramLinkCode);
/** Público: canjea el código por JWT (usa el bot de Telegram). */
router.post("/telegram/redeem", authController.redeemTelegramLinkCode);

export default router;
