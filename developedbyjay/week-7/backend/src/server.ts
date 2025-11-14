import { connectToDatabase, disconnectFromDatabase } from "./_lib/mongoose";
import app from "./app";

const PORT = process.env.PORT || 5000;

(async function (): Promise<void> {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();

const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    await disconnectFromDatabase();

    process.exit(0);
  } catch (error) {
    console.error("Error shutting down server", error);
  }
};

process.on("SIGINT", serverTermination);
process.on("SIGTERM", serverTermination);
