import { db } from "../src/db";
import { resetIdentity } from ".";
import { cuentasTable, monedaTypes } from "../src/schemas/cuentas.schema";
import { usuariosTable } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";
import { userRoles } from "../src/schemas/usuarios.schema";

type CuentaInsert = InferInsertModel<typeof cuentasTable>;

function generarCvu(): string {
    let cvu = "";
    while (cvu.length < 22) {
        cvu += Math.floor(Math.random() * 10).toString();
    }
    return cvu.slice(0, 22);
}

function slugPart(s: string): string {
    const t = s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .slice(0, 12);
    return t || "user";
}

/** Saldos iniciales realistas por moneda (antes de transferencias y pagos). */
function saldoInicialForMoneda(
    moneda: (typeof monedaTypes)[keyof typeof monedaTypes]
): string {
    const r = (min: number, max: number) =>
        (Math.floor(Math.random() * (max - min + 1)) + min).toString();

    switch (moneda) {
        case monedaTypes.ARS:
            return r(180_000, 4_500_000);
        case monedaTypes.USD:
            return r(800, 48_000);
        case monedaTypes.EUR:
            return r(600, 22_000);
        case monedaTypes.BRL:
            return r(3_000, 120_000);
        default:
            return "50000";
    }
}

export async function seedCuentas() {
    await resetIdentity(cuentasTable);
    const usuariosDb = await db.select().from(usuariosTable);

    const cuentasSeed: CuentaInsert[] = [];

    for (const usuario of usuariosDb) {
        if (usuario.role !== userRoles.finalUser) continue;
        const slug = `${slugPart(usuario.nombre)}.${slugPart(usuario.apellido)}.${usuario.id}`;

        for (const moneda of Object.values(monedaTypes)) {
            cuentasSeed.push({
                usuarioId: usuario.id,
                cvu: generarCvu(),
                alias: `${slug}.${moneda.toLowerCase()}`,
                moneda,
                saldo: saldoInicialForMoneda(moneda),
                activo: true,
            });
        }
    }

    if (cuentasSeed.length > 0) {
        await db.insert(cuentasTable).values(cuentasSeed);
    }
}
