import mongoose from "mongoose";
import Product from "../models/products.js";

export const getProducts = async (request, reply) => {
  try {
    const products = await Product.find();
    reply.send(products);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export const getProductById = async (request, reply) => {
  try {
    const { id } = request.params;
    const product = await Product.findById(id);
    if (!product) {
      return reply.status(404).send({ error: "Product not found" });
    }
    reply.send(product);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export const createProduct = async (request, reply) => {
  try {
    const { name, price, quantity, discountPrice, image } = request.body;
    const product = new Product({ name, price, quantity, discountPrice, image });
    await product.save();
    reply.status(201).send(product);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};