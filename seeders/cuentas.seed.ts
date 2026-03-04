import { db } from "../src/db";
import { cuentas } from "../src/schemas/cuentas.schema";
import { usuarios } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";

type CuentaInsert = InferInsertModel<typeof cuentas>;

const MONEDAS = ["ARS", "USD", "EUR", "BRL"] as const;

function generarCvu(): string {
    let cvu = "";
    while (cvu.length < 22) {
        cvu += Math.floor(Math.random() * 10).toString();
    }
    return cvu.slice(0, 22);
}

export async function seedCuentas() {
    const usuariosDb = await db.select().from(usuarios);

    const cuentasSeed: CuentaInsert[] = [];

    for (const usuario of usuariosDb) {
        for (const moneda of MONEDAS) {
            cuentasSeed.push({
                usuarioId: usuario.id,
                cvu: generarCvu(),
                alias: `usuario.${usuario.id}.${moneda.toLowerCase()}`,
                moneda,
                saldo: "10000",
                activo: true
            });
        }
    }

    if (cuentasSeed.length > 0) {
        await db.insert(cuentas).values(cuentasSeed);
    }
}

