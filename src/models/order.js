import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  // Save product information with the order
  // so old orders still work even if the product is deleted.
  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    default: 1,
  },

  // Price of the item at the time the order was placed
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  items: {
    type: [orderItemSchema],
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;