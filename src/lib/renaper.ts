import { env } from "@/env";

export type DatosRenaper = {
    dni: string;
    nombre: string;
    apellido: string;
    genero: "masculino" | "femenino" | "otro";
    /** Número de trámite del DNI (opcional; requerido por algunos flujos oficiales) */
    numeroTramite?: string;
};

/**
 * Valida formato de DNI argentino (solo dígitos, 7 u 8 caracteres).
 */
export function validarFormatoDni(dni: string): boolean {
    const limpio = dni.replace(/\D/g, "");
    return limpio.length >= 7 && limpio.length <= 8;
}

/**
 * Validación simulada RENAPER (desarrollo / sin API configurada).
 * Rechaza DNIs obviamente inválidos para pruebas (ej. todo ceros).
 */
function validarMock(datos: DatosRenaper): { ok: true } | { ok: false; mensaje: string } {
    const dni = datos.dni.replace(/\D/g, "");
    if (!validarFormatoDni(datos.dni)) {
        return { ok: false, mensaje: "El DNI debe tener entre 7 y 8 dígitos" };
    }
    if (/^0+$/.test(dni)) {
        return { ok: false, mensaje: "Los datos de identidad no coinciden con el registro nacional" };
    }
    if (datos.numeroTramite) {
        const tram = datos.numeroTramite.replace(/\D/g, "");
        if (tram.length < 4 || tram.length > 11) {
            return { ok: false, mensaje: "Número de trámite inválido" };
        }
    }
    return { ok: true };
}

/**
 * Llama a la API RENAPER si está configurada (contrato genérico).
 * Espera JSON `{ valido: boolean, mensaje?: string }` o HTTP 2xx sin cuerpo = válido.
 */
async function validarPorApi(datos: DatosRenaper): Promise<{ ok: true } | { ok: false; mensaje: string }> {
    const url = env.RENAPER_API_URL?.trim();
    const key = env.RENAPER_API_KEY;
    if (!url) {
        return validarMock(datos);
    }

    const body: Record<string, string> = {
        dni: datos.dni.replace(/\D/g, ""),
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        genero: datos.genero,
    };
    if (datos.numeroTramite) {
        body.numeroTramite = datos.numeroTramite.replace(/\D/g, "");
    }

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(key ? { Authorization: `Bearer ${key}` } : {}),
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        return {
            ok: false,
            mensaje: "No se pudo validar la identidad con RENAPER",
        };
    }

    const text = await res.text();
    if (!text) {
        return { ok: true };
    }

    try {
        const json = JSON.parse(text) as { valido?: boolean; mensaje?: string };
        if (json.valido === false) {
            return {
                ok: false,
                mensaje: json.mensaje ?? "Los datos no coinciden con el registro nacional",
            };
        }
        return { ok: true };
    } catch {
        return { ok: true };
    }
}

/**
 * Valida identidad contra RENAPER (mock, API configurada, o solo formato).
 */
export async function validarIdentidadRenaper(
    datos: DatosRenaper
): Promise<{ ok: true } | { ok: false; mensaje: string }> {
    if (env.MOCK) {
        return validarMock(datos);
    }
    if (env.RENAPER_API_URL?.trim()) {
        return validarPorApi(datos);
    }
    return validarMock(datos);
}
