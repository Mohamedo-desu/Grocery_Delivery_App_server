import "dotenv/config";
import fastify from "fastify";
import { PORT } from "./src/config/config.js";
import { connectDB } from "./src/config/connectDB.js";

const startServer = async () => {
  await connectDB(process.env.MONGO_URI);

  const app = fastify();
  app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Grocery App Server listening on ${address}`);
  });
};

startServer();
