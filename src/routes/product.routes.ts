import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/", auth, productController.getAll);

router.get("/:id", auth, productController.getById);

router.post("/", auth, productController.create);

router.put("/:id", auth, productController.update);

router.delete("/:id", auth, productController.delete);

export default router;
