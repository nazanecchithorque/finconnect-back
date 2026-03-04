import { db } from "../src/db";
import { resetIdentity } from ".";
import { cuentasTable } from "../src/schemas/cuentas.schema";
import { usuariosTable } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";
import { monedaTypesKeys } from "../src/schemas/cuentas.schema";

type CuentaInsert = InferInsertModel<typeof cuentasTable>;

function generarCvu(): string {
    let cvu = "";
    while (cvu.length < 22) {
        cvu += Math.floor(Math.random() * 10).toString();
    }
    return cvu.slice(0, 22);
}

export async function seedCuentas() {
    await resetIdentity(cuentasTable);
    const usuariosDb = await db.select().from(usuariosTable);

    const cuentasSeed: CuentaInsert[] = [];

    for (const usuario of usuariosDb) {
        for (const moneda of monedaTypesKeys) {
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
        await db.insert(cuentasTable).values(cuentasSeed);
    }
}

