import { env } from "@/env";
import { getExchangeRates } from "@/lib/frankfurter";
import type { ConvertOption } from "@/lib/criptomonedas";
import type { TipoAccionType } from "@/schemas/acciones.schema";
import { tipoAccionKeys } from "@/schemas/acciones.schema";

const FINNHUB_QUOTE = "https://finnhub.io/api/v1/quote";

/** Ticker NYSE/NASDAQ y nombre para mostrar */
export const ACCION_META: Record<
    TipoAccionType,
    { symbol: string; name: string }
> = {
    apple: { symbol: "AAPL", name: "Apple" },
    microsoft: { symbol: "MSFT", name: "Microsoft" },
    alphabet: { symbol: "GOOGL", name: "Alphabet" },
    amazon: { symbol: "AMZN", name: "Amazon" },
    nvidia: { symbol: "NVDA", name: "NVIDIA" }
};

export const accionTickerMap: Record<TipoAccionType, string> = {
    apple: "AAPL",
    microsoft: "MSFT",
    alphabet: "GOOGL",
    amazon: "AMZN",
    nvidia: "NVDA"
};

/** Cotización simulada en USD (las demás divisas se derivan con tipo de cambio) */
const MOCK_USD: Record<
    TipoAccionType,
    { price: number; percentChange24h: number }
> = {
    apple: { price: 250, percentChange24h: -0.4 },
    microsoft: { price: 420, percentChange24h: 0.6 },
    alphabet: { price: 175, percentChange24h: -0.2 },
    amazon: { price: 205, percentChange24h: 1.1 },
    nvidia: { price: 140, percentChange24h: -1.8 }
};

export type AccionPrecio = {
    tipo: TipoAccionType | string;
    symbol: string;
    name: string;
    price: number;
    percentChange24h: number | null;
    lastUpdated: string;
};

type FinnhubQuote = {
    c: number;
    dp: number | null;
    t: number;
};

async function fetchFinnhubUsd(ticker: string): Promise<FinnhubQuote> {
    const token = env.FINNHUB_API_KEY;
    if (!token) {
        throw new Error("FINNHUB_API_KEY no está configurada en .env");
    }
    const url = `${FINNHUB_QUOTE}?symbol=${encodeURIComponent(ticker)}&token=${token}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Finnhub API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<FinnhubQuote>;
}

async function precioEnMoneda(
    precioUsd: number,
    convert: ConvertOption
): Promise<number> {
    if (convert === "USD") {
        return precioUsd;
    }
    const r = await getExchangeRates("USD", precioUsd, [convert]);
    const price = r.rates[convert];
    if (price == null || typeof price !== "number") {
        throw new Error(`No se pudo convertir USD a ${convert}`);
    }
    return price;
}

/** Precios mock + conversión (Frankfurter). Sin llamadas a Finnhub. */
async function preciosDesdeMockUsd(
    convert: ConvertOption
): Promise<AccionPrecio[]> {
    const lastUpdated = new Date().toISOString();
    return Promise.all(
        tipoAccionKeys.map(async (tipo): Promise<AccionPrecio> => {
            const meta = ACCION_META[tipo];
            const { price: usd, percentChange24h } = MOCK_USD[tipo];
            const price = await precioEnMoneda(usd, convert);
            return {
                tipo,
                symbol: meta.symbol,
                name: meta.name,
                price,
                percentChange24h,
                lastUpdated
            };
        })
    );
}

async function preciosFinnhub(
    convert: ConvertOption = "ARS"
): Promise<AccionPrecio[]> {
    const lastUpdated = new Date().toISOString();
    return Promise.all(
        tipoAccionKeys.map(async (tipo): Promise<AccionPrecio> => {
            const meta = ACCION_META[tipo];
            const quote = await fetchFinnhubUsd(meta.symbol);
            const usd = quote.c;
            if (usd == null || typeof usd !== "number" || usd <= 0) {
                throw new Error(`Cotización inválida para ${meta.symbol}`);
            }
            const price = await precioEnMoneda(usd, convert);
            const ts =
                quote.t && quote.t > 0
                    ? new Date(quote.t * 1000).toISOString()
                    : lastUpdated;
            return {
                tipo,
                symbol: meta.symbol,
                name: meta.name,
                price,
                percentChange24h: quote.dp ?? null,
                lastUpdated: ts
            };
        })
    );
}

/**
 * Cotizaciones de acciones (precio en `convert`, cotización base en USD vía Finnhub o mock).
 * Sin `FINNHUB_API_KEY` o con `MOCK=true` se usan precios mock (evita 500 en /acciones/prices).
 */
export async function getAccionPreciosPorTipo(
    convert: ConvertOption = "ARS"
): Promise<AccionPrecio[]> {
    const usarSoloMock = env.MOCK || !env.FINNHUB_API_KEY;
    if (usarSoloMock) {
        return preciosDesdeMockUsd(convert);
    }

    try {
        return await preciosFinnhub(convert);
    } catch (err) {
        console.warn(
            "[acciones] Finnhub falló, usando cotizaciones mock:",
            err instanceof Error ? err.message : err
        );
        return preciosDesdeMockUsd(convert);
    }
}
