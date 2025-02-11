import client from "./app/initTg.ts";
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
