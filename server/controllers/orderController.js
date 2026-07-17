import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { sendOrderEmail } from "../services/emailService.js";

// CREATE order (after successful payment)
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0] || "",
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentId,
      paymentStatus: "paid",
      orderStatus: "placed",
    });

    // Clear the cart after order is placed
    cart.items = [];
    await cart.save();

    // Send confirmation email (don't block response if it fails)
    sendOrderEmail(req.user.email, req.user.name, order._id, "Placed");

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET logged-in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;
    await order.save();

    sendOrderEmail(order.user.email, order.user.name, order._id, orderStatus);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};