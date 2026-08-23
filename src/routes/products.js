import { createProduct, getProductById, getProducts } from "../controllers/products.js";

export const productRoutes = (fastify , options)=>{
    fastify.get("/products", getProducts);

    fastify.post("/products", createProduct);
    fastify.get("/products/:id", getProductById);
}