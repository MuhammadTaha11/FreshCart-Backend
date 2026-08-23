import { createUser , getMyProfile, loginUser } from "../controllers/user.js";
import { auth } from "../middlewares/auth.js";


export const userRoutes = async (fastify , options) => {
    fastify.post("/register", createUser);
    fastify.post("/login", loginUser);
    fastify.get("/profile", { preHandler: auth  }, getMyProfile);
}