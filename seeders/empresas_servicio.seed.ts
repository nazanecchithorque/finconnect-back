import { db } from "../src/db";
import { resetIdentity } from ".";
import {
    empresasServicioTable,
    categoriaEmpresaServicio,
    type CategoriaEmpresaServicioType,
} from "../src/schemas/empresas_servicio.schema";
import { InferInsertModel } from "drizzle-orm";

type EmpresaServicioInsert = InferInsertModel<typeof empresasServicioTable>;

const POOL_LUZ: string[] = [
    "Edenor",
    "Edesur",
    "EPEC",
    "ELSP",
    "CEMER",
    "Distribuidora Eléctrica Norte",
    "Cooperativa Eléctrica Tandil",
    "UTE",
    "CPEL",
];

const POOL_AGUA: string[] = [
    "AySA",
    "ABSA",
    "AssA",
    "Aguas Cordobesas",
    "OSSE",
    "Sameep",
    "Aguas del Norte",
];

const POOL_INTERNET: string[] = [
    "Movistar Fibra",
    "Claro Hogar",
    "Personal Flow",
    "Telecentro",
    "Metrotel",
    "Cablevisión Fibertel",
    "IP Telecom",
];

const POOL_STREAMING: string[] = [
    "Netflix",
    "Spotify Premium",
    "HBO Max",
    "Disney+",
    "Amazon Prime Video",
    "YouTube Premium",
    "Apple Music",
    "Paramount+",
];

const POOL_OTROS: string[] = [
    "ABL CABA",
    "Patente automotor",
    "ARBA",
    "AFIP Monotributo",
    "Obra social OSDE",
    "Swiss Medical",
    "Medicus",
    "Suterh",
    "SUBE recarga",
    "Peaje del Norte",
];

function poolForCat(cat: CategoriaEmpresaServicioType): string[] {
    switch (cat) {
        case categoriaEmpresaServicio.luz:
            return POOL_LUZ;
        case categoriaEmpresaServicio.agua:
            return POOL_AGUA;
        case categoriaEmpresaServicio.internet:
            return POOL_INTERNET;
        case categoriaEmpresaServicio.streaming:
            return POOL_STREAMING;
        default:
            return POOL_OTROS;
    }
}

/** ~1000 empresas: nombres creíbles por rubro + código único 10001–11000. */
function buildEmpresasSeed(): EmpresaServicioInsert[] {
    const rows: EmpresaServicioInsert[] = [];
    const categorias: CategoriaEmpresaServicioType[] = [
        categoriaEmpresaServicio.luz,
        categoriaEmpresaServicio.agua,
        categoriaEmpresaServicio.internet,
        categoriaEmpresaServicio.streaming,
        categoriaEmpresaServicio.otros,
    ];

    const usedNames = new Set<string>();

    for (let i = 0; i < 1000; i++) {
        const num = 10001 + i;
        const codigo = String(num);
        const cat = categorias[i % categorias.length]!;
        const pool = poolForCat(cat);
        const base = pool[i % pool.length]!;
        let nombre = base;
        const dup = Math.floor(i / pool.length);
        if (dup > 0) {
            nombre = `${base} · Unidad ${dup + 1}`;
        }
        if (usedNames.has(nombre)) {
            nombre = `${base} (${codigo})`;
        }
        usedNames.add(nombre);

        rows.push({
            codigo,
            nombre,
            categoria: cat,
        });
    }
    return rows;
}

const empresasSeed = buildEmpresasSeed();

export async function seedEmpresasServicio() {
    await resetIdentity(empresasServicioTable);
    await db.insert(empresasServicioTable).values(empresasSeed);
}
