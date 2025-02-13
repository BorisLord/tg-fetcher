import ccxt from "ccxt";
import type { Exchange } from "ccxt";

export function createExchangeClass(exchangeId: string): Exchange {
  const exchangeClass = (ccxt as any)[exchangeId] as typeof Exchange;
  if (!exchangeClass) {
    throw new Error(`Exchange ${exchangeId} is not supported`);
  }

  return new exchangeClass();
}
