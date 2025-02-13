import { createExchangeClass } from "../config/init_exchange.ts";

const exchanges = ["phemex", "coinbase"];

export async function forcedLoadMarkets() {
  for (const exchangeId of exchanges) {
    const exchange = createExchangeClass(exchangeId);
    await exchange.loadMarkets(true);
    console.log(`Markets for "${exchangeId}" reloaded`);
  }
}

Deno.cron("Cron loadMarkets forced", "* * * * *", () => {
  forcedLoadMarkets();
});
