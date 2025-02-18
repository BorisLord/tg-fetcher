import "@std/dotenv/load";
import { z } from "zod";
import { definedExchanges } from "../config/defined_exchanges.ts";
import { getExchange } from "../services/exchanges_service.ts";

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
    const firstLine = text.split("\n")[0]; // Extraire la première ligne
    const match = firstLine.match(/🟢\s*([A-Z]+)\s*\(LONG\)\s*🟢/); // Extraction du token

    if (!match) {
      throw new Error("No crypto found in first line message");
    }

    const token = match[1];
    const availability: Record<string, boolean> = {};
    for (const exchangeId of definedExchanges) {
      const ex = getExchange(exchangeId);
      if (!ex) continue;
      const currencies = await ex.fetchCurrencies();
      availability[exchangeId] = Object.keys(currencies).includes(token);
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
