import { db } from "../src/db";
import { cuentas } from "../src/schemas/cuentas.schema";
import {
    movimientos,
    sentidoMovimiento,
    tipoOperacion
} from "../src/schemas/movimientos.schema";
import { transferencias } from "../src/schemas/transferencias.schema";
import { eq } from "drizzle-orm";

export async function seedTransferencias() {
    const cuentasDb = await db.select().from(cuentas);

    // Necesitamos al menos 2 cuentas para poder transferir
    const cuentasActivas = cuentasDb.filter(
        (c) => c.activo && Number(c.saldo) > 0
    );

    if (cuentasActivas.length < 2) {
        return;
    }

    // Agrupamos cuentas por moneda para que siempre coincidan
    const cuentasPorMoneda: Record<string, typeof cuentasActivas> = {};

    for (const cta of cuentasActivas) {
        const key = cta.moneda;
        if (!cuentasPorMoneda[key]) {
            cuentasPorMoneda[key] = [];
        }
        cuentasPorMoneda[key].push(cta);
    }

    // Para cada grupo de moneda generamos varias transferencias "reales"
    for (const moneda of Object.keys(cuentasPorMoneda)) {
        const grupo = cuentasPorMoneda[moneda];

        if (grupo.length < 2) continue;

        // Cantidad de transferencias por moneda (proporcional a cantidad de cuentas)
        const transfersPorMoneda = Math.min(100, grupo.length * 10);

        for (let i = 0; i < transfersPorMoneda; i++) {
            const origenIndex = Math.floor(Math.random() * grupo.length);
            let destinoIndex = Math.floor(Math.random() * grupo.length);

            if (grupo.length === 1) break;

            // Aseguramos que origen y destino sean distintos
            while (destinoIndex === origenIndex) {
                destinoIndex = Math.floor(Math.random() * grupo.length);
            }

            const origen = grupo[origenIndex];
            const destino = grupo[destinoIndex];

            await db.transaction(async (tx) => {
                const [origenFresh] = await tx
                    .select()
                    .from(cuentas)
                    .where(eq(cuentas.id, origen.id));

                const [destinoFresh] = await tx
                    .select()
                    .from(cuentas)
                    .where(eq(cuentas.id, destino.id));

                if (!origenFresh || !destinoFresh) {
                    return;
                }

                if (!origenFresh.activo || !destinoFresh.activo) {
                    return;
                }

                if (origenFresh.moneda !== destinoFresh.moneda) {
                    return;
                }

                const saldoOrigenNum = Number(origenFresh.saldo);

                if (saldoOrigenNum <= 0) {
                    return;
                }

                // Monto entre 1% y 25% del saldo, acotado a [100, 5000]
                const base = Math.floor(
                    saldoOrigenNum * (0.01 + Math.random() * 0.24)
                );
                const monto = Math.min(
                    5000,
                    Math.max(100, base)
                );

                if (monto <= 0 || saldoOrigenNum < monto) {
                    return;
                }

                const [transferencia] = await tx
                    .insert(transferencias)
                    .values({
                        cuentaOrigenId: origenFresh.id,
                        cuentaDestinoId: destinoFresh.id,
                        monto: monto.toString(),
                        estado: "completada"
                    })
                    .returning();

                const nuevoSaldoOrigen = saldoOrigenNum - monto;
                const nuevoSaldoDestino = Number(destinoFresh.saldo) + monto;

                await tx.insert(movimientos).values({
                    cuentaId: origenFresh.id,
                    tipoOperacion: tipoOperacion.transferencia,
                    referenciaId: transferencia.id,
                    sentido: sentidoMovimiento.egreso,
                    monto: monto.toString(),
                    saldoPosterior: nuevoSaldoOrigen.toString()
                });

                await tx.insert(movimientos).values({
                    cuentaId: destinoFresh.id,
                    tipoOperacion: tipoOperacion.transferencia,
                    referenciaId: transferencia.id,
                    sentido: sentidoMovimiento.ingreso,
                    monto: monto.toString(),
                    saldoPosterior: nuevoSaldoDestino.toString()
                });

                await tx
                    .update(cuentas)
                    .set({ saldo: nuevoSaldoOrigen.toString() })
                    .where(eq(cuentas.id, origenFresh.id));

                await tx
                    .update(cuentas)
                    .set({ saldo: nuevoSaldoDestino.toString() })
                    .where(eq(cuentas.id, destinoFresh.id));
            });
        }
    }
}

