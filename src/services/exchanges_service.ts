import { definedExchanges } from "../config/defined_exchanges.ts";
import ccxt from "ccxt";
import type { Exchange } from "ccxt";

// deno-lint-ignore no-explicit-any
const exchanges: Record<string, any> = {};

export function createExchangeClass(exchangeId: string): Exchange {
  // deno-lint-ignore no-explicit-any
  const exchangeClass = (ccxt as any)[exchangeId] as typeof Exchange;
  if (!exchangeClass) {
    throw new Error(`Exchange ${exchangeId} is not supported`);
  }

  return new exchangeClass();
}

export async function forcedLoadMarkets() {
  for (const exchangeId of definedExchanges) {
    const exchange = createExchangeClass(exchangeId);
    await exchange.loadMarkets(true);
    exchanges[exchangeId] = exchange;
    console.log("Load Market:", exchangeId);
  }
}

export function getExchange(exchangeId: string): Exchange {
  return exchanges[exchangeId] || null;
}
