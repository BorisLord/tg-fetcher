import client from "../config/init_telegram.ts";
import "@std/dotenv/load";
import { messageSchema } from "../validations/validation_Uly.ts";
import { db } from "../config/init_dbs.ts";

const chatId = parseInt(Deno.env.get("CHAT_ID")!);

export const listenMessage = () => {
  client.on("message:text", async (ctx) => {
    if (ctx.msg) {
      const message = ctx.msg;
      if (message.chat.id === chatId) {
        try {
          // console.log("pre validate", message);
          const validateMsg = messageSchema.parseAsync(message);
          console.log("post validate", await validateMsg);
          // await db.set(
          //   ["validateMsg"],
          //   validateMsg,
          // );
        } catch (err) {
          console.log("error:", err);
        }

        // const v = await db.get(["validateMsg"]);
        // console.log("vvvvvvvvvvvv", v);

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
