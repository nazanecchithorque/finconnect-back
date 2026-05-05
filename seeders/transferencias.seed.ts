import { resetIdentity } from ".";
import { db } from "../src/db";
import { cuentasTable } from "../src/schemas/cuentas.schema";
import { usuariosTable } from "../src/schemas/usuarios.schema";
import {
    movimientosTable,
    sentidoMovimiento,
    tipoOperacion,
} from "../src/schemas/movimientos.schema";
import { transferenciasTable } from "../src/schemas/transferencias.schema";
import { eq } from "drizzle-orm";

type UsuarioRow = typeof usuariosTable.$inferSelect;

const MOTIVOS_TRANSFERENCIA: string[] = [
    "Alquiler marzo",
    "Expensas edificio",
    "Cuota colegio",
    "Reintegro gastos comunes",
    "Pago freelancer diseño",
    "Regalo cumpleaños",
    "Cena grupo amigos",
    "Préstamo devuelto",
    "Cuota préstamo personal",
    "Pago taller mecánico",
    "Veterinaria",
    "Supermercado compartido",
    "Fiesta fin de año",
    "Viaje grupal (seña)",
    "Honorarios contador",
    "Suscripción equipo fútbol",
    "Obra social familiar",
    "Gas natural hogar",
    "Servicio plomería",
    "Clases particulares",
];

function nombreMostrable(u: UsuarioRow | undefined): string {
    if (!u) return "Usuario";
    const n = `${u.nombre} ${u.apellido}`.trim();
    return n || `ID ${u.id}`;
}

function descripcionTransferencia(
    origen: UsuarioRow | undefined,
    destino: UsuarioRow | undefined,
    moneda: string,
    idx: number
): string {
    const dest = nombreMostrable(destino);
    const motivo = MOTIVOS_TRANSFERENCIA[idx % MOTIVOS_TRANSFERENCIA.length]!;
    const plantillas = [
        `Envío a ${dest} · ${motivo}`,
        `Pago a ${dest}: ${motivo}`,
        `Transferencia en ${moneda} — ${motivo} (dest.: ${dest.split(" ")[0] ?? dest})`,
        `${nombreMostrable(origen).split(" ")[0] ?? "Titular"} → ${dest}: ${motivo}`,
        `A favor de ${dest} · ${motivo}`,
    ];
    return plantillas[idx % plantillas.length]!;
}

export async function seedTransferencias() {
    await resetIdentity(transferenciasTable);
    const cuentasDb = await db.select().from(cuentasTable);
    const usuariosDb = await db.select().from(usuariosTable);
    const usuarioPorId = new Map<number, UsuarioRow>();
    for (const u of usuariosDb) {
        usuarioPorId.set(u.id, u);
    }

    const cuentasActivas = cuentasDb.filter(
        (c) => c.activo && Number(c.saldo) > 0
    );

    if (cuentasActivas.length < 2) {
        return;
    }

    const cuentasPorMoneda: Record<string, typeof cuentasActivas> = {};

    for (const cta of cuentasActivas) {
        const key = cta.moneda;
        if (!cuentasPorMoneda[key]) {
            cuentasPorMoneda[key] = [];
        }
        cuentasPorMoneda[key]!.push(cta);
    }

    let globalIdx = 0;

    for (const moneda of Object.keys(cuentasPorMoneda)) {
        const grupo = cuentasPorMoneda[moneda]!;

        if (grupo.length < 2) continue;

        /** Menos movimientos pero más legibles que 100×moneda. */
        const transfersPorMoneda = Math.min(55, Math.max(18, grupo.length * 4));

        for (let i = 0; i < transfersPorMoneda; i++) {
            const origenIndex = Math.floor(Math.random() * grupo.length);
            let destinoIndex = Math.floor(Math.random() * grupo.length);

            if (grupo.length === 1) break;

            while (destinoIndex === origenIndex) {
                destinoIndex = Math.floor(Math.random() * grupo.length);
            }

            const origen = grupo[origenIndex]!;
            const destino = grupo[destinoIndex]!;

            await db.transaction(async (tx) => {
                const [origenFresh] = await tx
                    .select()
                    .from(cuentasTable)
                    .where(eq(cuentasTable.id, origen.id));

                const [destinoFresh] = await tx
                    .select()
                    .from(cuentasTable)
                    .where(eq(cuentasTable.id, destino.id));

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

                const base = Math.floor(
                    saldoOrigenNum * (0.008 + Math.random() * 0.12)
                );
                const tope =
                    moneda === "ARS"
                        ? 280_000
                        : moneda === "USD"
                          ? 4_500
                          : moneda === "EUR"
                            ? 4_000
                            : 35_000;
                const piso =
                    moneda === "ARS" ? 1_500 : moneda === "BRL" ? 80 : 25;
                const monto = Math.min(tope, Math.max(piso, base));

                if (monto <= 0 || saldoOrigenNum < monto) {
                    return;
                }

                const [transferencia] = await tx
                    .insert(transferenciasTable)
                    .values({
                        cuentaOrigenId: origenFresh.id,
                        cuentaDestinoId: destinoFresh.id,
                        monto: monto.toString(),
                        estado: "completada",
                    })
                    .returning();

                const nuevoSaldoOrigen = saldoOrigenNum - monto;
                const nuevoSaldoDestino = Number(destinoFresh.saldo) + monto;

                const uOrigen = usuarioPorId.get(origenFresh.usuarioId);
                const uDest = usuarioPorId.get(destinoFresh.usuarioId);
                const texto = descripcionTransferencia(
                    uOrigen,
                    uDest,
                    moneda,
                    globalIdx
                );
                globalIdx += 1;

                await tx.insert(movimientosTable).values({
                    cuentaId: origenFresh.id,
                    tipoOperacion: tipoOperacion.transferencia,
                    referenciaId: transferencia.id,
                    sentido: sentidoMovimiento.egreso,
                    monto: monto.toString(),
                    saldoPosterior: nuevoSaldoOrigen.toString(),
                    descripcion: texto,
                });

                await tx.insert(movimientosTable).values({
                    cuentaId: destinoFresh.id,
                    tipoOperacion: tipoOperacion.transferencia,
                    referenciaId: transferencia.id,
                    sentido: sentidoMovimiento.ingreso,
                    monto: monto.toString(),
                    saldoPosterior: nuevoSaldoDestino.toString(),
                    descripcion: `Recibís de ${nombreMostrable(uOrigen)} · Ref. trf. ${transferencia.id}`,
                });

                await tx
                    .update(cuentasTable)
                    .set({ saldo: nuevoSaldoOrigen.toString() })
                    .where(eq(cuentasTable.id, origenFresh.id));

                await tx
                    .update(cuentasTable)
                    .set({ saldo: nuevoSaldoDestino.toString() })
                    .where(eq(cuentasTable.id, destinoFresh.id));
            });
        }
    }
}
