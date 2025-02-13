import client from "./config/init_telegram.ts";
import { listenMessage } from "./controllers/telegram_controller.ts";
import { forcedLoadMarkets } from "./jobs/cron_jobs.ts";

function main() {
  client;
  if (client) {
    console.log("Connection started");
    listenMessage();
    forcedLoadMarkets();
  } else {
    console.log("Connection abord");
  }
}

main();
