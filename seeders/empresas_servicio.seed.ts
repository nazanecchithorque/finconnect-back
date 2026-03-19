import { db } from "../src/db";
import { resetIdentity } from ".";
import {
    empresasServicioTable,
    categoriaEmpresaServicio
} from "../src/schemas/empresas_servicio.schema";
import { InferInsertModel } from "drizzle-orm";

type EmpresaServicioInsert = InferInsertModel<typeof empresasServicioTable>;

const empresasSeed: EmpresaServicioInsert[] = [
    { nombre: "Edesur", categoria: categoriaEmpresaServicio.luz },
    { nombre: "Edenor", categoria: categoriaEmpresaServicio.luz },
    { nombre: "Aysa", categoria: categoriaEmpresaServicio.agua },
    { nombre: "Agua y Saneamientos Argentinos", categoria: categoriaEmpresaServicio.agua },
    { nombre: "Movistar", categoria: categoriaEmpresaServicio.internet },
    { nombre: "Personal", categoria: categoriaEmpresaServicio.internet },
    { nombre: "Claro", categoria: categoriaEmpresaServicio.internet },
    { nombre: "Fibertel", categoria: categoriaEmpresaServicio.internet },
    { nombre: "Netflix", categoria: categoriaEmpresaServicio.streaming },
    { nombre: "Spotify", categoria: categoriaEmpresaServicio.streaming },
    { nombre: "Disney+", categoria: categoriaEmpresaServicio.streaming },
    { nombre: "HBO Max", categoria: categoriaEmpresaServicio.streaming },
    { nombre: "YouTube Premium", categoria: categoriaEmpresaServicio.streaming },
    { nombre: "Amazon Prime", categoria: categoriaEmpresaServicio.streaming },
    { nombre: "Servicio General", categoria: categoriaEmpresaServicio.otros },
];

export async function seedEmpresasServicio() {
    await resetIdentity(empresasServicioTable);
    await db.insert(empresasServicioTable).values(empresasSeed);
}
