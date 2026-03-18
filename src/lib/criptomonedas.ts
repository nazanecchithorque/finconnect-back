import { env } from "@/env";
import type { TipoCriptomonedaType } from "@/schemas/criptomonedas.schema";

const CMC_BASE = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";

/** Precios mock por moneda (valores aproximados en cada divisa) */
const MOCK_PRECIOS: Record<
    string,
    Record<TipoCriptomonedaType, { price: number; percentChange24h: number }>
> = {
    ARS: {
        bitcoin: { price: 98_000_000, percentChange24h: -2.5 },
        ethereum: { price: 3_000_000, percentChange24h: -1.8 },
        usdt: { price: 1200, percentChange24h: 0.1 },
        solana: { price: 125_000, percentChange24h: -3.2 },
        cardano: { price: 1200, percentChange24h: 1.5 },
        polkadot: { price: 8500, percentChange24h: -0.9 },
        avalanche: { price: 45000, percentChange24h: 2.1 },
        binance: { price: 600_000, percentChange24h: -1.2 },
        xrp: { price: 600, percentChange24h: 0.5 },
        dogecoin: { price: 450, percentChange24h: -4.2 }
    },
    USD: {
        bitcoin: { price: 98_000, percentChange24h: -2.5 },
        ethereum: { price: 3_000, percentChange24h: -1.8 },
        usdt: { price: 1, percentChange24h: 0.1 },
        solana: { price: 125, percentChange24h: -3.2 },
        cardano: { price: 1.2, percentChange24h: 1.5 },
        polkadot: { price: 8.5, percentChange24h: -0.9 },
        avalanche: { price: 45, percentChange24h: 2.1 },
        binance: { price: 600, percentChange24h: -1.2 },
        xrp: { price: 0.6, percentChange24h: 0.5 },
        dogecoin: { price: 0.45, percentChange24h: -4.2 }
    },
    EUR: {
        bitcoin: { price: 92_000, percentChange24h: -2.5 },
        ethereum: { price: 2_800, percentChange24h: -1.8 },
        usdt: { price: 0.95, percentChange24h: 0.1 },
        solana: { price: 118, percentChange24h: -3.2 },
        cardano: { price: 1.1, percentChange24h: 1.5 },
        polkadot: { price: 8, percentChange24h: -0.9 },
        avalanche: { price: 42, percentChange24h: 2.1 },
        binance: { price: 560, percentChange24h: -1.2 },
        xrp: { price: 0.56, percentChange24h: 0.5 },
        dogecoin: { price: 0.42, percentChange24h: -4.2 }
    },
    JPY: {
        bitcoin: { price: 15_000_000, percentChange24h: -2.5 },
        ethereum: { price: 460_000, percentChange24h: -1.8 },
        usdt: { price: 155, percentChange24h: 0.1 },
        solana: { price: 19_000, percentChange24h: -3.2 },
        cardano: { price: 185, percentChange24h: 1.5 },
        polkadot: { price: 1_320, percentChange24h: -0.9 },
        avalanche: { price: 7_000, percentChange24h: 2.1 },
        binance: { price: 93_000, percentChange24h: -1.2 },
        xrp: { price: 93, percentChange24h: 0.5 },
        dogecoin: { price: 70, percentChange24h: -4.2 }
    },
    BRL: {
        bitcoin: { price: 490_000, percentChange24h: -2.5 },
        ethereum: { price: 15_000, percentChange24h: -1.8 },
        usdt: { price: 5.2, percentChange24h: 0.1 },
        solana: { price: 625, percentChange24h: -3.2 },
        cardano: { price: 6, percentChange24h: 1.5 },
        polkadot: { price: 42, percentChange24h: -0.9 },
        avalanche: { price: 225, percentChange24h: 2.1 },
        binance: { price: 3_000, percentChange24h: -1.2 },
        xrp: { price: 3, percentChange24h: 0.5 },
        dogecoin: { price: 2.25, percentChange24h: -4.2 }
    },
    GBP: {
        bitcoin: { price: 78_000, percentChange24h: -2.5 },
        ethereum: { price: 2_400, percentChange24h: -1.8 },
        usdt: { price: 0.8, percentChange24h: 0.1 },
        solana: { price: 100, percentChange24h: -3.2 },
        cardano: { price: 0.96, percentChange24h: 1.5 },
        polkadot: { price: 6.8, percentChange24h: -0.9 },
        avalanche: { price: 36, percentChange24h: 2.1 },
        binance: { price: 480, percentChange24h: -1.2 },
        xrp: { price: 0.48, percentChange24h: 0.5 },
        dogecoin: { price: 0.36, percentChange24h: -4.2 }
    }
};

const MOCK_NAMES: Record<TipoCriptomonedaType, string> = {
    bitcoin: "Bitcoin",
    ethereum: "Ethereum",
    usdt: "Tether",
    solana: "Solana",
    cardano: "Cardano",
    polkadot: "Polkadot",
    avalanche: "Avalanche",
    binance: "BNB",
    xrp: "XRP",
    dogecoin: "Dogecoin"
};

/** Mapeo de nuestro tipo interno al símbolo de CoinMarketCap */
export const TIPO_TO_SYMBOL: Record<TipoCriptomonedaType, string> = {
    bitcoin: "BTC",
    ethereum: "ETH",
    usdt: "USDT",
    solana: "SOL",
    cardano: "ADA",
    polkadot: "DOT",
    avalanche: "AVAX",
    binance: "BNB",
    xrp: "XRP",
    dogecoin: "DOGE"
};

export type CriptoPrecio = {
    tipo: TipoCriptomonedaType | string;
    symbol: string;
    name: string;
    price: number;
    percentChange24h: number | null;
    lastUpdated: string;
};

type CmcQuoteItem = {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    platform: { id: number; name: string; symbol: string } | null;
    cmc_rank: number | null;
    quote: {
        ARS?: {
            price: number;
            percent_change_24h: number | null;
            last_updated: string;
        };
    };
};

type CmcResponse = {
    status: { error_code: number; error_message: string | null };
    data: Record<string, CmcQuoteItem[]>;
};

/**
 * Obtiene el item "principal" de un array de coins (mismo símbolo).
 * Prioriza: platform === null (nativo) y menor cmc_rank.
 */
function pickMainCoin(items: CmcQuoteItem[]): CmcQuoteItem | null {
    if (!items?.length) return null;
    const withRank = items.filter((c) => c.cmc_rank != null);
    const native = withRank.filter((c) => c.platform == null);
    const candidates = native.length ? native : withRank;
    if (!candidates.length) return items[0];
    return candidates.sort((a, b) => (a.cmc_rank ?? 9999) - (b.cmc_rank ?? 9999))[0];
}

/**
 * Obtiene precios de criptomonedas desde CoinMarketCap.
 * @param symbols Símbolos CMC (ej: ["BTC","ETH","USDT"])
 * @param convert Moneda de conversión (default: ARS)
 */
export async function getCriptoPrecios(
    symbols: string[] = Object.values(TIPO_TO_SYMBOL),
    convert = "ARS"
): Promise<CriptoPrecio[]> {
    if (env.MOCK) {
        const mockData = MOCK_PRECIOS[convert] ?? MOCK_PRECIOS.ARS;
        return Object.entries(TIPO_TO_SYMBOL).map(([tipo, symbol]) => {
            const data = mockData[tipo as TipoCriptomonedaType] ?? {
                price: 0,
                percentChange24h: 0
            };
            return {
                tipo: tipo as TipoCriptomonedaType,
                symbol,
                name: MOCK_NAMES[tipo as TipoCriptomonedaType] ?? symbol,
                price: data.price,
                percentChange24h: data.percentChange24h,
                lastUpdated: new Date().toISOString()
            };
        });
    }

    const apiKey = env.COINMARKETCAP_API_KEY;
    if (!apiKey) {
        throw new Error("COINMARKETCAP_API_KEY no está configurada en .env");
    }

    const symbolParam = symbols.join(",");
    const url = `${CMC_BASE}?symbol=${symbolParam}&convert=${convert}`;

    const res = await fetch(url, {
        headers: {
            "X-CMC_PRO_API_KEY": apiKey,
            Accept: "application/json"
        }
    });

    if (!res.ok) {
        throw new Error(`CoinMarketCap API error: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as CmcResponse;

    if (json.status?.error_code !== 0) {
        throw new Error(
            json.status?.error_message ?? "Error desconocido de CoinMarketCap"
        );
    }

    const data = json.data ?? {};
    const results: CriptoPrecio[] = [];

    for (const symbol of symbols) {
        const items = data[symbol];
        const coin = pickMainCoin(items ?? []);

        if (!coin) continue;

        const quote = coin.quote?.[convert as keyof typeof coin.quote];
        if (!quote || typeof quote.price !== "number") continue;

        const tipo = (Object.entries(TIPO_TO_SYMBOL).find(
            ([, s]) => s === symbol
        )?.[0] ?? symbol.toLowerCase()) as TipoCriptomonedaType | string;

        results.push({
            tipo,
            symbol: coin.symbol,
            name: coin.name,
            price: quote.price,
            percentChange24h: quote.percent_change_24h ?? null,
            lastUpdated: quote.last_updated ?? ""
        });
    }

    return results;
}

/** Monedas soportadas para conversión */
export const CONVERT_OPTIONS = ["ARS", "EUR", "USD", "JPY", "BRL", "GBP"] as const;
export type ConvertOption = (typeof CONVERT_OPTIONS)[number];

/**
 * Obtiene precios para los tipos de cripto del schema.
 * @param convert Moneda de conversión (ARS, EUR, USD, JPY, BRL, GBP)
 */
export async function getCriptoPreciosPorTipo(
    convert: ConvertOption = "ARS"
): Promise<CriptoPrecio[]> {
    const symbols = Object.values(TIPO_TO_SYMBOL);
    return getCriptoPrecios(symbols, convert);
}
export const criptoSiglasMap: Record<string, string> = {
    bitcoin: "BTC",
    ethereum: "ETH",
    usdt: "USDT",
    solana: "SOL",
    cardano: "ADA",
    polkadot: "DOT",
    avalanche: "AVAX",
    binance: "BNB",
    xrp: "XRP",
    dogecoin: "DOGE"
};