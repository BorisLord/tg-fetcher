import { forcedLoadMarkets } from "../services/exchanges_service.ts";

Deno.cron("Cron loadMarkets forced", "0 * * * *", () => {
  console.log("cron start");
  forcedLoadMarkets();
});
