import { parentPort } from "worker_threads";
import { fib } from "./utils";

if (parentPort) {
  parentPort.on("message", (data: number) => {
    const result = fib(data);
    parentPort?.postMessage(result);
  });
}
