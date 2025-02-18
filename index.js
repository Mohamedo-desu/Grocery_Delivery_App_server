import "dotenv/config";
import fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import { PORT } from "./src/config/config.js";
import { connectDB } from "./src/config/connectDB.js";
import { buildAdminRouter } from "./src/config/setup.js";
import keepAwake from "./src/cronJobs/keepAwake.js";
import { registerRoutes } from "./src/routes/index.js";

const startServer = async () => {
  await connectDB(process.env.MONGO_URI);

  const app = fastify();
  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });
  await registerRoutes(app);
  await buildAdminRouter(app);
  app.get("/ping", async (_, reply) => {
    return reply.send("pong");
  });

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Grocery App Server listening on ${address}`);
  });
  app.ready().then(() => {
    if (process.env.NODE_ENV === "production") {
      keepAwake.start();
    }

    // Handle WebSocket connections
    app.io.on("connection", (socket) => {
      console.log("A user connected ✅");

      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log("❤ User joined room", orderId);
      });

      socket.on("disconnect", () => {
        console.log("A user Disconnected ❌");
      });
    });
  });
};

startServer();
