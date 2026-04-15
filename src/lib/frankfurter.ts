import { env } from "@/env";

const FRANKFURTER_BASE = "https://api.frankfurter.dev/v1";

export type FrankfurterRates = Record<string, number>;

export interface FrankfurterLatestResponse {
    amount: number;
    base: string;
    date: string;
    rates: FrankfurterRates;
}

/** Tasas mock: 1 USD = X en cada moneda (valores aproximados) */
const MOCK_RATES_FROM_USD: Record<string, number> = {
    USD: 1,
    EUR: 0.87,
    GBP: 0.75,
    BRL: 5.3,
    ARS: 1000,
    AUD: 1.43,
    CAD: 1.37,
    CHF: 0.79,
    CNY: 6.9,
    JPY: 159,
    MXN: 17.9,
};

function getMockRates(from: string, amount: number): FrankfurterLatestResponse {
    const fromUpper = from.toUpperCase();
    const rateFrom = MOCK_RATES_FROM_USD[fromUpper] ?? 1;
    const rates: FrankfurterRates = {};
    for (const [curr, rateTo] of Object.entries(MOCK_RATES_FROM_USD)) {
        if (curr === fromUpper) continue;
        rates[curr] = Math.round((amount * (rateTo / rateFrom)) * 10000) / 10000;
    }
    return {
        amount,
        base: fromUpper,
        date: new Date().toISOString().slice(0, 10),
        rates,
    };
}

/**
 * Frankfurter (ECB) no cotiza ARS ni otras monedas LATAM. Si la respuesta OK viene sin ellas,
 * completamos solo claves faltantes con el mismo modelo que el fallback mock (misma base/monto).
 */
function fillMissingRatesFromMock(data: FrankfurterLatestResponse): FrankfurterLatestResponse {
    const mock = getMockRates(data.base, data.amount);
    const merged: FrankfurterRates = { ...data.rates };
    for (const [curr, val] of Object.entries(mock.rates)) {
        if (merged[curr] == null || Number.isNaN(merged[curr])) {
            merged[curr] = val;
        }
    }
    return { ...data, rates: merged };
}

function filterRatesTo(
    data: FrankfurterLatestResponse,
    to: string[]
): FrankfurterLatestResponse {
    const filtered: FrankfurterRates = {};
    for (const c of to) {
        const key = c.toUpperCase();
        if (data.rates[key] != null) {
            filtered[key] = data.rates[key];
        }
    }
    return { ...data, rates: filtered };
}

/**
 * Obtiene las tasas de cambio desde una moneda base.
 * Si amount y to no se pasan, devuelve el equivalente de 1 unidad en todas las monedas soportadas.
 */
export async function getExchangeRates(
    from: string,
    amount: number = 1,
    to?: string[]
): Promise<FrankfurterLatestResponse> {
    if (env.MOCK) {
        const result = getMockRates(from, amount);
        if (to && to.length > 0) {
            const filtered: FrankfurterRates = {};
            for (const c of to) {
                const key = c.toUpperCase();
                if (result.rates[key] != null) {
                    filtered[key] = result.rates[key];
                }
            }
            return { ...result, rates: filtered };
        }
        return result;
    }

    const params = new URLSearchParams({
        amount: amount.toString(),
        from: from.toUpperCase(),
    });
    if (to && to.length > 0) {
        params.set("to", to.map((c) => c.toUpperCase()).join(","));
    }
    const url = `${FRANKFURTER_BASE}/latest?${params}`;

    try {
        const res = await fetch(url);
        if (res.ok) {
            const raw = (await res.json()) as FrankfurterLatestResponse;
            const normalized: FrankfurterLatestResponse = {
                ...raw,
                base: raw.base.toUpperCase(),
                rates: Object.fromEntries(
                    Object.entries(raw.rates || {}).map(([k, v]) => [k.toUpperCase(), v])
                ),
            };
            const filled = fillMissingRatesFromMock(normalized);
            if (to && to.length > 0) {
                return filterRatesTo(filled, to);
            }
            return filled;
        }
        console.warn(
            `Frankfurter ${res.status} ${res.statusText} (${url}) — usando tasas mock (p. ej. ARS no está en ECB/Frankfurter)`
        );
    } catch (err) {
        console.warn("Frankfurter fetch falló, usando tasas mock:", err);
    }

    const mock = getMockRates(from, amount);
    if (to && to.length > 0) {
        return filterRatesTo(mock, to);
    }
    return mock;
}
