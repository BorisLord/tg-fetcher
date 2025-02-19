import "@std/dotenv/load";
import { z } from "zod";
import { definedExchanges } from "../config/defined_exchanges.ts";
import { getExchange } from "../services/exchanges_service.ts";
import { Exchange } from "ccxt";

type availability = {
  exchange: string;
  token: string;
  orientation: string;
  entryPrice: number[];
  takeProfit: number[];
  stopLoss: number[];
};

const env = {
  chatId: parseInt(Deno.env.get("CHAT_ID") || "0"),
  userId: parseInt(Deno.env.get("USERID") || "0"),
  firstName: Deno.env.get("FIRSTNAME") || "",
  username: Deno.env.get("USERNAME") || "",
};

// Schéma de validation avec Zod
export const messageSchema = z.object({
  chat: z.object({
    id: z.number().refine((id) => id === env.chatId, {
      message: `chat.id must be ${env.chatId}`,
    }),
  }),
  from: z.object({
    id: z.number().refine((id) => id === env.userId, {
      message: `from.id must be ${env.userId}`,
    }),
    firstName: z.string().refine((name) => name === env.firstName, {
      message: `from.firstName must be "${env.firstName}"`,
    }),
    username: z.string().refine((username) => username === env.username, {
      message: `from.username must be "${env.username}"`,
    }),
  }),
  text: z.string().transform(async (text) => {
    const lines = text.split("\n");
    const match = lines[0].match(/([A-Z]+)\s*\((LONG|SHORT)\)/);

    if (!match) {
      throw new Error("No crypto found in first line message");
    }

    const token = match[1];
    const orientation = match[2];
    const entryPrice: number[] = [];
    const takeProfit: number[] = [];
    let stopLoss: number[] = [];

    let currentSection = "";

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.includes("Prix")) {
        currentSection = "entryPrice";
        const prices = line.match(/[\d.,-]+/g);
        if (prices) {
          prices.forEach((price) => {
            if (price.includes("-")) {
              const [min, max] = price.split("-").map((p) =>
                parseFloat(p.replace(",", "."))
              );
              entryPrice.push(min, max);
            } else {
              entryPrice.push(parseFloat(price.replace(",", ".")));
            }
          });
        }
      } else if (line.includes("TP")) {
        currentSection = "takeProfit";
      } else if (line.includes("SL")) {
        currentSection = "stopLoss";
        stopLoss = line.match(/[\d.,]+/g)?.map((price) =>
          parseFloat(price.replace(",", "."))
        ) || [];
      } else if (currentSection === "takeProfit" && line.match(/[\d.,]+/)) {
        takeProfit.push(
          ...line.match(/[\d.,]+/g)?.map((price) =>
            parseFloat(price.replace(",", "."))
          ) || [],
        );
      }
    }

    const availability: availability[] = [];
    for (const exchangeId of definedExchanges) {
      const ex = getExchange(exchangeId);
      if (!ex) continue;

      // ! Refined search for futur / margin
      const currencies = await ex.fetchCurrencies();
      const isAvailable = Object.keys(currencies).includes(token);
      if (isAvailable) {
        availability.push({
          exchange: exchangeId,
          token,
          orientation,
          entryPrice,
          takeProfit,
          stopLoss,
        });
      }
    }

    return availability;
  }),
});

// fetchCurrencies ()

// const return data = {
//   chat: { id: -4671567446 },
//   date: "2025-01-20T19:46:39.000Z",
//   from: {
//     id: 1233174651,
//     firstName: "Yodah",
//     username: "Yodahhhh",
//   },
//   text: "saedf",
// };

// try {
//   messageSchema.parse(data);
//   console.log("Données valides !");
// } catch (e) {
//   console.error("Validation échouée :", e.errors);
// }

// "BTC": {
//   "id": "BTC",
//   "info": {
//     "currency": "BTC",
//     "name": "Bitcoin",
//     "code": "1",
//     "valueScale": "8",
//     "minValueEv": "1",
//     "maxValueEv": "5000000000000000000",
//     "needAddrTag": "0",
//     "status": "Listed",
//     "displayCurrency": "BTC",
//     "inAssetsDisplay": "1",
//     "perpetual": "0",
//     "stableCoin": "0",
//     "assetsPrecision": "8"
//   },
//   "code": "BTC",
//   "name": "Bitcoin",
//   "active": true,
//   "precision": 1e-8,
//   "limits": {
//     "amount": {
//       "min": 1e-8,
//       "max": 50000000000
//     },
//     "withdraw": {}
//   },
//   "valueScale": 8,
//   "networks": {}
// },

// "DOGE": {
//   "info": {
//     "asset_id": "d9a3edfa-1be7-589c-bd20-c034f3830b60",
//     "code": "DOGE",
//     "name": "Dogecoin",
//     "color": "#BA9F33",
//     "sort_index": "155",
//     "exponent": "8",
//     "type": "crypto",
//     "address_regex": "^((D|A|9)[a-km-zA-HJ-NP-Z1-9]{25,34})$"
//   },
//   "id": "DOGE",
//   "code": "DOGE",
//   "type": "crypto",
//   "name": "Dogecoin",
//   "active": true,
//   "limits": {
//     "amount": {},
//     "withdraw": {}
//   }
// },
