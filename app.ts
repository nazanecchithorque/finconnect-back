import express from "express";
import usuariosRoutes from "./src/routes/usuarios.routes";
import { customErrorHandler } from "./src/middlewares/errorHandler";
import { errorHandler } from "bradb";

export const app = express();

app.use(express.json());

app.use("/usuarios", usuariosRoutes);

// Importante ponerlo despues de todas las rutas, de otra forma no va a agarrar los errores
app.use(errorHandler);
app.use(customErrorHandler);
