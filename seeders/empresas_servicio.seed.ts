import { db } from "../src/db";
import { resetIdentity } from ".";
import {
    empresasServicioTable,
    categoriaEmpresaServicio
} from "../src/schemas/empresas_servicio.schema";
import { InferInsertModel } from "drizzle-orm";

type EmpresaServicioInsert = InferInsertModel<typeof empresasServicioTable>;

const categorias = [
    categoriaEmpresaServicio.luz,
    categoriaEmpresaServicio.agua,
    categoriaEmpresaServicio.internet,
    categoriaEmpresaServicio.streaming,
    categoriaEmpresaServicio.otros
] as const;

/** 1000 empresas con código único en rango 10001–11000 (seed). */
function buildEmpresasSeed(): EmpresaServicioInsert[] {
    const rows: EmpresaServicioInsert[] = [];
    for (let i = 0; i < 1000; i++) {
        const num = 10001 + i;
        const codigo = String(num);
        rows.push({
            codigo,
            nombre: `Empresa servicio ${codigo}`,
            categoria: categorias[i % categorias.length]
        });
    }
    return rows;
}

const empresasSeed = buildEmpresasSeed();

export async function seedEmpresasServicio() {
    await resetIdentity(empresasServicioTable);
    await db.insert(empresasServicioTable).values(empresasSeed);
}
