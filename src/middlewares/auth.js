import jwt from "jsonwebtoken";

export const auth = async (request, reply) => {
  try {
    console.log("Authorization:", request.headers.authorization);

    const token =
      request.headers.authorization?.split(" ")[1];

    console.log("Token:", token);

    if (!token) {
      return reply.status(401).send({
        message: "Token missing",
      });
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded:", decoded);

    request.user = decoded;
  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return reply.status(401).send({
      message: "Unauthorized",
      error: error.message,
    });
  }
};