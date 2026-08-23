import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSFastify from "@adminjs/fastify";
import Product from "../models/products.js";
import Order from "../models/order.js";
import Cart from "../models/cart.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [{ resource: Product }, { resource: Order }, { resource: Cart }],
  rootPath: "/admin",
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        if (email === "admin@gmail.com" && password === "123456") {
          return { email };
        }
        return null;
      },
      cookieName: "admin",
      cookiePassword: "supersecretpassword123456789101112131415", // must be long
    },
    app,
  );
};
