import { StorageDenoKV } from "https://deno.land/x/mtkruto@0.18.0/storage/1_storage_deno_kv.ts";
import "@std/dotenv/load";

const denoKvUrl = Deno.env.get("DENO_KV_URL");

const loginDb = new StorageDenoKV(denoKvUrl);
await loginDb.initialize();

const db = await Deno.openKv(denoKvUrl);

export { db, loginDb };
