import client from "../config/init_telegram.ts";
import "@std/dotenv/load";
import { messageSchema } from "../validations/validation_Uly.ts";
import { db } from "../config/init_dbs.ts";
import { format } from "jsr:@std/datetime/format";
import type { availability } from "../types/index.ts";

const chatId = parseInt(Deno.env.get("CHAT_ID")!);

export const listenMessage = () => {
  client.on("message:text", async (ctx) => {
    if (ctx.msg) {
      const message = ctx.msg;
      if (message.chat.id === chatId) {
        try {
          // console.log("pre validate", message);
          const validateMsg = await messageSchema.parseAsync(message);
          console.log("post validate", validateMsg);

          const currentDate = format(new Date(), "yyyy-MM-dd"); // Format YYYY-MM-DD

          for (const order of validateMsg.text) {
            if (order.orderType !== null) {
              const ordersKey = [
                validateMsg.chat.id,
                "orders",
                order.orderType,
                currentDate,
              ];

              // Récupérer les ordres existants pour ce type et cette date
              const existingOrders = await db.get<availability[]>(ordersKey) ||
                [];

              // Mettre à jour les ordres
              const updatedOrders = existingOrders?.value
                ? [...existingOrders.value, order]
                : [order];

              // Stocker les ordres mis à jour
              await db.set(ordersKey, updatedOrders);
            }
          }
        } catch (err) {
          console.log("error:", err);
        }

        const v = await db.get([chatId, "orders"]);
        console.log("vvvvvvvvvvvv", v);

        // Deno.writeTextFile(
        //   "./app/channel_messages.json",
        //   JSON.stringify(message, null, 2),
        //   { append: true },
        // );
      }
    } else {
      //wait
    }
  });
};
