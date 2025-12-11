import express from "express";
import clientRoutes from "./src/routes/client.routes";
import productRoutes from "./src/routes/product.routes";
import { customErrorHandler } from "./src/middlewares/errorHandler";
import { errorHandler } from "bradb";

export const app = express();

app.use(express.json());

app.use("/clients", clientRoutes);
app.use("/products", productRoutes);

// Importante ponerlo despues de todas las rutas, de otra forma no va a agarrar los errores
app.use(errorHandler);
app.use(customErrorHandler);
