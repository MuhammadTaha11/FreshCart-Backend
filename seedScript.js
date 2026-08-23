import mongoose from "mongoose";
import Product  from "./src/models/products.js";
import { productsData } from "./seedData.js";
import dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = productsData.map((product) => ({
      ...product,
    }));
    await Product.insertMany(products);
    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

seedDatabase();
