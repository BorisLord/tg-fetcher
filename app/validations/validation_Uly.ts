import "@std/dotenv/load";
import { z } from "zod";

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
      message: `chat.id doit être ${env.chatId}`,
    }),
  }),
  from: z.object({
    id: z.number().refine((id) => id === env.userId, {
      message: `from.id doit être ${env.userId}`,
    }),
    firstName: z.string().refine((name) => name === env.firstName, {
      message: `from.firstName doit être "${env.firstName}"`,
    }),
    username: z.string().refine((username) => username === env.username, {
      message: `from.username doit être "${env.username}"`,
    }),
  }),
  text: z.string().min(1, {
    message: "Le champ text est requis et ne peut pas être vide.",
  }),
});

// const data = {
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
