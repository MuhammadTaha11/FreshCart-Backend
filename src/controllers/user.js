import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.status(200).send({
      user,
    });
  } catch (error) {
    console.log("Profile error:", error);

    return res.status(500).send({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send("Please enter a valid email.");
    }

    if (!password || password.length < 4) {
      return res.status(400).send(
        "Password must be at least 4 characters long."
      );
    }

    if (!/^[A-Za-z0-9]+$/.test(password)) {
      return res.status(400).send(
        "Password can only contain letters and digits."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return user;
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).send("Please enter a valid email.");
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token };
};
