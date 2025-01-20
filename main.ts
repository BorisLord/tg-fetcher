import client from "./app/init.ts";
import { listenMessage } from "./app/listener.ts";

function main() {
  client;
  if (client) {
    console.log("Connection started");
    listenMessage();
  } else {
    console.log("Connection abord");
  }
}

main();
