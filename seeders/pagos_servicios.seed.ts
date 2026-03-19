import { resetIdentity } from ".";
import { db } from "../src/db";
import { cuentasTable } from "../src/schemas/cuentas.schema";
import { facturasTable } from "../src/schemas/facturas.schema";
import { pagosServiciosTable } from "../src/schemas/pagos_servicios.schema";
import {
    movimientosTable,
    sentidoMovimiento,
    tipoOperacion
} from "../src/schemas/movimientos.schema";
import { empresasServicioTable } from "../src/schemas/empresas_servicio.schema";
import { estadoFactura } from "../src/schemas/facturas.schema";
import { eq } from "drizzle-orm";

export async function seedPagosServicios() {
    await resetIdentity(pagosServiciosTable);

    const facturasPendientes = await db
        .select()
        .from(facturasTable)
        .where(eq(facturasTable.estado, estadoFactura.pendiente));

    if (facturasPendientes.length === 0) return;

    const cuentasDb = await db.select().from(cuentasTable);
    const cuentasPorUsuario = new Map<number, typeof cuentasDb>();
    for (const c of cuentasDb) {
        if (!c.activo) continue;
        const uid = c.usuarioId;
        if (!cuentasPorUsuario.has(uid)) {
            cuentasPorUsuario.set(uid, []);
        }
        cuentasPorUsuario.get(uid)!.push(c);
    }

    const facturasAPagar = facturasPendientes.slice(0, Math.min(50, facturasPendientes.length));

    for (const factura of facturasAPagar) {
        const cuentasUsuario = cuentasPorUsuario.get(factura.usuarioId) ?? [];
        const cuentaConSaldo = cuentasUsuario.find(
            (c) => Number(c.saldo) >= Number(factura.monto)
        );
        if (!cuentaConSaldo) continue;

        const empresa = await db
            .select()
            .from(empresasServicioTable)
            .where(eq(empresasServicioTable.id, factura.empresaId))
            .then((r) => r[0]);

        if (!empresa) continue;

        await db.transaction(async (tx) => {
            const [cuentaFresh] = await tx
                .select()
                .from(cuentasTable)
                .where(eq(cuentasTable.id, cuentaConSaldo.id));

            if (!cuentaFresh || Number(cuentaFresh.saldo) < Number(factura.monto)) return;

            const saldoPosterior = (
                Number(cuentaFresh.saldo) - Number(factura.monto)
            ).toString();

            await tx
                .update(cuentasTable)
                .set({ saldo: saldoPosterior })
                .where(eq(cuentasTable.id, cuentaFresh.id));

            await tx.insert(movimientosTable).values({
                cuentaId: cuentaFresh.id,
                tipoOperacion: tipoOperacion.pagoservicio,
                referenciaId: factura.id,
                sentido: sentidoMovimiento.egreso,
                monto: factura.monto,
                saldoPosterior,
                descripcion: `Pago ${empresa.nombre}`,
            });

            await tx.insert(pagosServiciosTable).values({
                facturaId: factura.id,
                cuentaId: cuentaFresh.id,
                monto: factura.monto,
            });

            await tx
                .update(facturasTable)
                .set({ estado: estadoFactura.pagada })
                .where(eq(facturasTable.id, factura.id));
        });
    }
}
