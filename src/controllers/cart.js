import mongoose from "mongoose";
import Cart from "../models/cart.js";

export const addToCart = async (request, reply) => {
  const userId = request.user.userId;
  const { productId, quantity, totalPrice } = request.body;
  console.log("request.user:", request.user);
  console.log("request.body:", request.body);
  console.log("productId:", productId);
  console.log("quantity:", quantity);
  console.log("totalPrice:", totalPrice);
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const existingItemIndex = cart.items.findIndex(
      (item) => String(item.productId) === String(productId),
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice += totalPrice;
    } else {
      cart.items.push({ productId, quantity, totalPrice });
    }
    await cart.save();
    reply.status(200).send(cart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

export const getCart = async (request, reply) => {
  const userId = request.user.userId;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return reply.status(404).send({ message: "Cart not found" });
    }
    reply.status(200).send(cart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

export const removeFromCart = async (request, reply) => {
  const userId = request.user.userId;
  const { productId } = request.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return reply.status(404).send({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => String(item.productId) === String(productId)
    );

    if (itemIndex === -1) {
      return reply.status(404).send({ message: "Product not found in cart" });
    }

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;

      // Update total price
      item.totalPrice =
        (item.totalPrice / (item.quantity + 1)) * item.quantity;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    reply.status(200).send(cart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

export const clearCart = async (request, reply) => {
  const userId = request.user.userId;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return reply.status(404).send({ message: "Cart not found" });
    }
    cart.items = [];
    await cart.save();
    reply.status(200).send(cart);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};
