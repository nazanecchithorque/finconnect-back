import express from "express";
import usuariosRoutes from "./src/routes/usuarios.routes";
import authRoutes from "./src/routes/auth.routes";
import cuentasRoutes from "./src/routes/cuentas.routes";
import { customErrorHandler } from "./src/middlewares/errorHandler";
import { errorHandler } from "bradb";
import movimientosRoutes from "@/routes/movimientos.routes";
import transferenciasRoutes from "@/routes/transferencias.routes";

export const app = express();

app.use(express.json());

app.use("/usuarios", usuariosRoutes);
app.use("/auth", authRoutes);
app.use("/cuentas", cuentasRoutes);
app.use("/movimientos", movimientosRoutes);
app.use("/transferencias", transferenciasRoutes);

// Importante ponerlo despues de todas las rutas, de otra forma no va a agarrar los errores
app.use(errorHandler);
app.use(customErrorHandler);
