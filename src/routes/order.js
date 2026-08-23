import { createOrder, getOrders } from "../controllers/order.js";
import { auth } from "../middlewares/auth.js";

export const orderRoutes = (fastify, options) => {
  fastify.get("/orders", { preHandler: auth }, getOrders);
  fastify.post("/orders", { preHandler: auth }, createOrder);
};
