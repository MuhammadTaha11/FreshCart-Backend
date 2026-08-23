import mongoose from "mongoose";
import fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import {productRoutes} from "./src/routes/products.js";
import { cartRoutes } from "./src/routes/cart.js";
import { orderRoutes } from "./src/routes/order.js";
import { buildAdminRouter } from "./src/config/admin.js";
import { userRoutes } from "./src/routes/user.js";

dotenv.config();

const app = fastify();

await app.register(cors);
await app.register(productRoutes);
await app.register(cartRoutes);
await app.register(orderRoutes)
await app.register(userRoutes)
await buildAdminRouter(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", async (request, reply) => {
  reply.send("Hello World!");
});

app.listen({port: process.env.PORT || 5000 , host:"0.0.0.0"}, (err,   address) => {
  if (err) {
    console.log("Error starting server:", err);
    }
  console.log(`Server listening at ${address}`);
});
