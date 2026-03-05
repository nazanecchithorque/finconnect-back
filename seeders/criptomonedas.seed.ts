import { db } from "../src/db";
import { resetIdentity } from ".";
import { usuariosTable } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";
import {
    criptomonedasTable,
    tipoCriptomonedaKeys
} from "../src/schemas/criptomonedas.schema";

type CriptomonedaInsert = InferInsertModel<typeof criptomonedasTable>;

export async function seedCriptomonedas() {
    await resetIdentity(criptomonedasTable);
    const usuariosDb = await db.select().from(usuariosTable);

    const criptomonedasSeed: CriptomonedaInsert[] = [];

    for (const usuario of usuariosDb) {
        for (const tipoCriptomoneda of tipoCriptomonedaKeys) {
            criptomonedasSeed.push({
                usuarioId: usuario.id,
                tipoCriptomoneda,
                monto: "0"
            });
        }
    }

    if (criptomonedasSeed.length > 0) {
        await db.insert(criptomonedasTable).values(criptomonedasSeed);
    }
}
