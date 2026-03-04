import express, { Request, Response, NextFunction } from "express";
import { usuariosRouter } from "@/routes/usuarios.router";
import authRoutes from "@/routes/auth.router";
import { cuentasRouter } from "@/routes/cuentas.router";
import { errorHandler } from "bradb";
import { movimientosRouter } from "@/routes/movimientos.router";
import { transferenciasRouter } from "@/routes/transferencias.router";
import { requestLogger, responseLogger } from "@/middlewares/logging";

export const app = express();

app.use(requestLogger);
app.use(responseLogger);

app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/auth", authRoutes);
app.use("/cuentas", cuentasRouter);
app.use("/movimientos", movimientosRouter);
app.use("/transferencias", transferenciasRouter);

// Importante ponerlo despues de todas las rutas, de otra forma no va a agarrar los errores
// Healthcheck
app.use("/eso", (req, res) => {
  res.send("brad");
});

app.use(errorHandler);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).json({
    code: 500,
    message: "Internal Server error",
  });
});
