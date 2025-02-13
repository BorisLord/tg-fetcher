import { createExchangeClass } from "../config/init_exchange.ts";

// const exchanges = ["phemex", "coinbase"];

const kv = await Deno.openKv();

// export async function enqueueExchangeId() {
//   for (const exchangeId of exchanges) {
//     const task = { exchangeId };
//     await kv.enqueue(task);
//   }
// }

function processTradingPairFetchTasks() {
  kv.listenQueue(async (task) => {
    const { exchangeId } = task;
    // console.log(exchangeId);
    const exchange = createExchangeClass(exchangeId);
    // console.log(exchange)

    try {
      const currencies = await exchange.fetchCurrencies();
      console.log(currencies);
      Deno.writeTextFile(
        "./markets.json",
        JSON.stringify({ exchangeId, currencies }, null, 2),
        { append: true },
      );
      // const pairs = Object.keys(markets);

      // Enregistre les paires dans ta base de données
      // await saveTradingPairsToDatabase(exchangeId, pairs);
      // console.log(`Enregistré ${pairs.length} paires pour ${exchangeId}`);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des paires pour ${exchangeId}:`,
        error,
      );
    }
  });
}

processTradingPairFetchTasks();
