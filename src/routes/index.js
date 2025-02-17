import { authRoutes } from "./authRoute.js";
import { orderRoutes } from "./orderRoute.js";
import { categoryRoutes, productRoutes } from "./productRoute.js";

const prefix = "/api";

export const registerRoutes = async (fastify) => {
  fastify.register(authRoutes, { prefix });
  fastify.register(productRoutes, { prefix });
  fastify.register(categoryRoutes, { prefix });
  fastify.register(orderRoutes, { prefix });
};
