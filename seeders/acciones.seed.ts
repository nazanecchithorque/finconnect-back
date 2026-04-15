import { db } from "../src/db";
import { resetIdentity } from ".";
import { usuariosTable } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";
import { accionesTable, tipoAccionKeys } from "../src/schemas/acciones.schema";
import { userRoles } from "../src/schemas/usuarios.schema";

type AccionInsert = InferInsertModel<typeof accionesTable>;

export async function seedAcciones() {
    await resetIdentity(accionesTable);
    const usuariosDb = await db.select().from(usuariosTable);

    const rows: AccionInsert[] = [];

    for (const usuario of usuariosDb) {
        if (usuario.role !== userRoles.finalUser) continue;
        for (const tipoAccion of tipoAccionKeys) {
            rows.push({
                usuarioId: usuario.id,
                tipoAccion,
                monto: "0"
            });
        }
    }

    if (rows.length > 0) {
        await db.insert(accionesTable).values(rows);
    }
}
