import { db } from "../src/db";
import { resetIdentity } from ".";
import { facturasTable } from "../src/schemas/facturas.schema";
import { usuariosTable } from "../src/schemas/usuarios.schema";
import { empresasServicioTable } from "../src/schemas/empresas_servicio.schema";
import { estadoFactura, type EstadoFacturaType } from "../src/schemas/facturas.schema";
import { userRoles } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type FacturaInsert = InferInsertModel<typeof facturasTable>;

function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function seedFacturas() {
    await resetIdentity(facturasTable);
    const usuarios = await db
        .select()
        .from(usuariosTable)
        .where(eq(usuariosTable.role, userRoles.finalUser));
    const empresas = await db.select().from(empresasServicioTable);

    if (usuarios.length === 0 || empresas.length === 0) return;

    const facturasSeed: FacturaInsert[] = [];
    const ahora = new Date();

    for (const usuario of usuarios) {
        const cantFacturas = randomBetween(3, 8);
        const empresasUsadas = new Set<number>();

        for (let i = 0; i < cantFacturas; i++) {
            const empresa = empresas[randomBetween(0, empresas.length - 1)];
            if (!empresa || empresasUsadas.has(empresa.id)) continue;
            empresasUsadas.add(empresa.id);

            const monto = randomBetween(500, 5000).toString();
            const diasVencimiento = randomBetween(-30, 60);
            const vencimiento = new Date(ahora);
            vencimiento.setDate(vencimiento.getDate() + diasVencimiento);

            let estado: EstadoFacturaType = estadoFactura.pendiente;
            if (diasVencimiento < -7) {
                estado = Math.random() > 0.5 ? estadoFactura.vencida : estadoFactura.pendiente;
            }

            facturasSeed.push({
                usuarioId: usuario.id,
                empresaId: empresa.id,
                monto,
                vencimiento,
                estado,
            });
        }
    }

    if (facturasSeed.length > 0) {
        await db.insert(facturasTable).values(facturasSeed);
    }

    // Facturas extra para usuario 52 (servicios para pagar)
    const [usuario52] = await db
        .select()
        .from(usuariosTable)
        .where(eq(usuariosTable.id, 52));
    if (usuario52 && empresas.length > 0) {
        const facturasUsuario52: FacturaInsert[] = empresas.slice(0, 10).map((empresa, i) => {
            const vencimiento = new Date(ahora);
            vencimiento.setDate(vencimiento.getDate() + 15 + i);
            return {
                usuarioId: 52,
                empresaId: empresa.id,
                monto: (800 + i * 200).toString(),
                vencimiento,
                estado: estadoFactura.pendiente,
            };
        });
        await db.insert(facturasTable).values(facturasUsuario52);
    }
}
