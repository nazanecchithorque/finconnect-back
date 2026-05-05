import { db } from "../src/db";
import { cuentasTable, monedaTypes } from "../src/schemas/cuentas.schema";
import {
    movimientosTable,
    sentidoMovimiento,
    tipoOperacion,
} from "../src/schemas/movimientos.schema";
import { eq } from "drizzle-orm";

const INGRESOS: string[] = [
    "Acreditación de haberes · Sueldo mensual",
    "Reintegro promoción banco",
    "Cashback Mastercard fin de mes",
    "Transferencia inmediata recibida (alias externo)",
    "Bonificación por saldo promedio",
    "Reversión cargo duplicado",
];

const EGRESOS: string[] = [
    "Comisión mantenimiento cuenta premium",
    "Cargo seguro de vida (débito automático)",
    "Débito suscripción Club beneficios",
    "Impuesto sellos movimiento",
    "Costo reemplazo plástico tarjeta",
    "Ajuste menor saldo (redondeo)",
];

/**
 * Movimientos `otros` que enriquecen el detalle sin duplicar "transferencia".
 * Corrige saldo de la cuenta en la misma transacción.
 */
export async function seedMovimientosMisc() {
    const cuentas = await db
        .select()
        .from(cuentasTable)
        .where(eq(cuentasTable.activo, true));

    /** Priorizar ARS con saldo holgado. */
    const candidatas = cuentas
        .filter(
            (c) =>
                c.moneda === monedaTypes.ARS &&
                Number(c.saldo) > 25_000
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 160);

    for (let i = 0; i < candidatas.length; i++) {
        const cuenta = candidatas[i]!;
        const ingreso = Math.random() < 0.38;

        await db.transaction(async (tx) => {
            const [fresh] = await tx
                .select()
                .from(cuentasTable)
                .where(eq(cuentasTable.id, cuenta.id));

            if (!fresh || Number(fresh.saldo) < 5000) return;

            const saldo = Number(fresh.saldo);
            let monto: number;
            let descripcion: string;

            if (ingreso) {
                monto =
                    Math.floor(
                        Math.random() * (220_000 - 18_000 + 1)
                    ) + 18_000;
                descripcion = INGRESOS[i % INGRESOS.length]!;
            } else {
                monto = Math.floor(Math.random() * (9_500 - 350 + 1)) + 350;
                if (monto >= saldo * 0.4) {
                    monto = Math.floor(saldo * 0.08);
                }
                descripcion = EGRESOS[i % EGRESOS.length]!;
            }

            if (ingreso) {
                const posterior = saldo + monto;
                await tx.insert(movimientosTable).values({
                    cuentaId: fresh.id,
                    tipoOperacion: tipoOperacion.otros,
                    sentido: sentidoMovimiento.ingreso,
                    monto: monto.toString(),
                    saldoPosterior: posterior.toString(),
                    descripcion,
                });
                await tx
                    .update(cuentasTable)
                    .set({ saldo: posterior.toString() })
                    .where(eq(cuentasTable.id, fresh.id));
            } else {
                if (saldo <= monto) return;
                const posterior = saldo - monto;
                await tx.insert(movimientosTable).values({
                    cuentaId: fresh.id,
                    tipoOperacion: tipoOperacion.otros,
                    sentido: sentidoMovimiento.egreso,
                    monto: monto.toString(),
                    saldoPosterior: posterior.toString(),
                    descripcion,
                });
                await tx
                    .update(cuentasTable)
                    .set({ saldo: posterior.toString() })
                    .where(eq(cuentasTable.id, fresh.id));
            }
        });
    }
}
