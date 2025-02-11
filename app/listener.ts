import client from "./initTg.ts";
import "@std/dotenv/load";
import { messageSchema } from "./validations/validation_Uly.ts";

const chatId = parseInt(Deno.env.get("CHAT_ID")!);

export const listenMessage = () => {
  client.on("message:text", (ctx) => {
    if (ctx.msg) {
      const message = ctx.msg;

      if (message.chat.id === chatId) {
        // console.log("Message object:", message);
        // console.log("Nouveau message de :", message.from?.id);

        try {
          const validateMsg = messageSchema.parse(message);
          console.log("Validated Schema", validateMsg);
        } catch (err) {
          console.log("error:", err);
        }

        // await storage.set(
        //   ["channel_messages", message.id.toString()],
        //   message,
        // );

        Deno.writeTextFile(
          "./app/channel_messages.json",
          JSON.stringify(message, null, 2),
          { append: true },
        );
      }
    } else {
      //wait
    }
  });
};
