import { loginDb } from "./init_dbs.ts";
import { Client } from "@mtkruto/mtkruto";
import "@std/dotenv/load";

const apiId = parseInt(Deno.env.get("API_ID")!);
const apiHash = Deno.env.get("API_HASH")!;

const client = new Client({
  storage: loginDb,
  apiId,
  apiHash,
});

const authString = await loginDb.get<string>(["auth_string"]);

try {
  if (authString) {
    await client.importAuthString(authString);
    await client.start();
  } else {
    await client.start({
      phone: () => prompt("Enter your phone number:")!,
      code: () => prompt("Enter the code you received:")!,
      password: () => prompt("Enter your account's password:")!,
    });
    const newAuthString = await client.exportAuthString();
    await loginDb.set(["auth_string"], newAuthString);
  }
} catch (err) {
  console.log("Error:", err);
}

export default client;
