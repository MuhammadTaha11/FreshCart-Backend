import mongoose from "mongoose";
import { auth } from "../middlewares/auth.js";

export const cartRoutes = async (app) => {
  const { addToCart, getCart, removeFromCart, clearCart } =
    await import("../controllers/cart.js");
  app.post("/cart",{preHandler: auth} , addToCart);
  app.get("/cart", { preHandler: auth }, getCart);
  app.delete("/cart/all", { preHandler: auth }, clearCart);
  app.delete("/cart", {preHandler: auth} , removeFromCart);
};
