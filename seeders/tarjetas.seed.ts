import { db } from "../src/db";
import { resetIdentity } from ".";
import { tarjetasTable } from "../src/schemas/tarjetas.schema";
import { cuentasTable } from "../src/schemas/cuentas.schema";
import { estadoTarjeta, marcaTarjeta } from "../src/schemas/tarjetas.schema";
import { userRoles } from "../src/schemas/usuarios.schema";
import { usuariosTable } from "../src/schemas/usuarios.schema";
import { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

type TarjetaInsert = InferInsertModel<typeof tarjetasTable>;

function isValidLuhn(pan: string): boolean {
    let sum = 0;
    let alt = false;
    for (let i = pan.length - 1; i >= 0; i--) {
        let n = parseInt(pan[i!]!, 10);
        if (alt) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alt = !alt;
    }
    return sum % 10 === 0;
}

function randomDigit(): string {
    return String(Math.floor(Math.random() * 10));
}

function generarPan16Mastercard(): string {
    const bins = ["51", "52", "53", "54", "55"] as const;
    const prefix = bins[Math.floor(Math.random() * bins.length)]!;
    let base = prefix;
    for (let i = 0; i < 13; i++) base += randomDigit();
    for (let d = 0; d <= 9; d++) {
        const candidate = base + String(d);
        if (isValidLuhn(candidate)) return candidate;
    }
    throw new Error("No se pudo generar el número de tarjeta");
}

export async function seedTarjetas() {
    await resetIdentity(tarjetasTable);

    const usuarios = await db
        .select()
        .from(usuariosTable)
        .where(eq(usuariosTable.role, userRoles.finalUser));
    const cuentas = await db.select().from(cuentasTable);

    const cuentasPorUsuario = cuentas.filter((c) =>
        usuarios.some((u) => u.id === c.usuarioId)
    );
    const cuentasActivas = cuentasPorUsuario.filter((c) => c.activo);

    const tarjetasSeed: TarjetaInsert[] = [];
    const fechaEmision = new Date();
    const fechaVencimiento = new Date(fechaEmision);
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 5);

    for (const cuenta of cuentasActivas) {
        const numeroCompleto = generarPan16Mastercard();
        const ultimos4 = numeroCompleto.slice(-4);

        tarjetasSeed.push({
            cuentaId: cuenta.id,
            ultimos4,
            tipo: "VIRTUAL",
            marca: marcaTarjeta.mastercard,
            estado: estadoTarjeta.activa,
            fechaEmision: new Date(fechaEmision),
            fechaVencimiento: new Date(fechaVencimiento),
            activo: true,
        });
    }

    if (tarjetasSeed.length > 0) {
        await db.insert(tarjetasTable).values(tarjetasSeed);
    }
}
