import express from "express";
import { usuariosRouter } from "@/routes/usuarios.router";
import authRoutes from "@/routes/auth.router";
import { cuentasRouter } from "@/routes/cuentas.router";
import { errorHandler } from "bradb";
import { movimientosRouter } from "@/routes/movimientos.router";
import { transferenciasRouter } from "@/routes/transferencias.router";
import { tarjetasRouter } from "@/routes/tarjetas.router";
import { requestLogger, responseLogger } from "@/middlewares/logging";
import { customErrorHandler } from "@/middlewares/errorHandler";

export const app = express();

app.use(requestLogger);
app.use(responseLogger);

app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/auth", authRoutes);
app.use("/cuentas", cuentasRouter);
app.use("/movimientos", movimientosRouter);
app.use("/transferencias", transferenciasRouter);
app.use("/tarjetas", tarjetasRouter);

// Healthcheck
app.get("/eso", (_req, res) => {
  res.send("brad");
});

// Importante ponerlo despues de todas las rutas, de otra forma no va a agarrar los errores
app.use(errorHandler);
app.use(customErrorHandler);
