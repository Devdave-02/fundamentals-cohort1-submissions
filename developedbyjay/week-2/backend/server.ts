import express, { Request, Response } from "express";
import { fib } from "./utils";
import { Worker } from "worker_threads";
import path from "path";


const app = express();
app.use(express.json());

function runWorker(data: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, "worker.js"));
    worker.postMessage(data);

    worker.on("message", (result) => {
      resolve(result);
      worker.terminate();
    });

    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}



app.post("/api/process-data", async (req: Request, res: Response) => {
  try {
    const input = 30;
    const fibonacci = await runWorker(input);
    // const fibonaci = fib(input)
    
    res.status(200).json({
      input,
      result: fibonacci,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
