import { getExchangeRates } from "@/lib/frankfurter";
import type { ConvertOption } from "@/lib/criptomonedas";

/** Monedas fiat listadas (tipo de cambio respecto a `convert`) */
export const FIAT_SYMBOLS = ["EUR", "USD", "JPY", "BRL", "GBP"] as const;
export type FiatSymbol = (typeof FIAT_SYMBOLS)[number];

const FIAT_NAMES: Record<FiatSymbol, string> = {
    EUR: "Euro",
    USD: "Dólar estadounidense",
    JPY: "Yen japonés",
    BRL: "Real brasileño",
    GBP: "Libra esterlina"
};

export type MonedaPrecio = {
    tipo: string;
    symbol: FiatSymbol;
    name: string;
    price: number;
    percentChange24h: number | null;
    lastUpdated: string;
};

/**
 * Cotizaciones de monedas fiat: precio de 1 unidad de cada divisa expresado en `convert`.
 * (Misma idea que getCriptoPreciosPorTipo para criptomonedas.)
 */
export async function getMonedaPreciosPorTipo(
    convert: ConvertOption = "ARS"
): Promise<MonedaPrecio[]> {
    const lastUpdated = new Date().toISOString();

    const items = await Promise.all(
        FIAT_SYMBOLS.map(async (symbol): Promise<MonedaPrecio> => {
            if (symbol === convert) {
                return {
                    tipo: symbol.toLowerCase(),
                    symbol,
                    name: FIAT_NAMES[symbol],
                    price: 1,
                    percentChange24h: null,
                    lastUpdated
                };
            }
            const r = await getExchangeRates(symbol, 1, [convert]);
            const price = r.rates[convert];
            if (price == null || typeof price !== "number") {
                throw new Error(
                    `No se pudo obtener la cotización de ${symbol} en ${convert}`
                );
            }
            return {
                tipo: symbol.toLowerCase(),
                symbol,
                name: FIAT_NAMES[symbol],
                price,
                percentChange24h: null,
                lastUpdated
            };
        })
    );

    return items;
}
