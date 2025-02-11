import { StorageDenoKV } from "https://deno.land/x/mtkruto@0.18.0/storage/1_storage_deno_kv.ts";
import { Client } from "@mtkruto/mtkruto";
import "@std/dotenv/load";

const apiId = parseInt(Deno.env.get("API_ID")!);
const apiHash = Deno.env.get("API_HASH")!;

const storage = new StorageDenoKV("../denoKVdata");
await storage.initialize();

const client = new Client({
  storage,
  apiId,
  apiHash,
});

const authString = await storage.get<string>(["auth_string"]);

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
    await storage.set(["auth_string"], newAuthString);
  }
} catch (err) {
  console.log("Error:", err);
  // ping service ?
}

export default client;
