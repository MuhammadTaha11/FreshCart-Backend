import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/products.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(404).send({
        message: "Cart is empty",
      });
    }

    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(
            `Product not found: ${item.productId}`
          );
        }

        return {
          productId: product._id,
          name: product.name,
          image: product.image,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: orderItems,
      totalPrice,
    });

    await order.save();

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    res.status(201).send({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    res.status(500).send({
      message: error.message,
    });
  }
};


export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).send({
      orders,
    });
  } catch (error) {
    console.log("GET ORDERS ERROR:", error);

    res.status(500).send({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};
