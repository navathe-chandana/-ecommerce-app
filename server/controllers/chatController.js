import Groq from "groq-sdk";
import Order from "../models/Order.js";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const STORE_CONTEXT = `
You are a helpful customer support assistant for "Ecommerce Store", an online shop selling electronics, clothing, and books.

Store policies:
- Payment methods: Credit/debit cards, UPI, netbanking via Razorpay
- Shipping: Orders are processed within 1-2 business days
- Order statuses: placed → processing → shipped → delivered
- Returns: Not currently supported (mention this politely if asked)
- Contact: For urgent issues, tell users to check their order status on the "My Orders" page

Keep responses short (2-4 sentences), friendly, and helpful. If you don't know something specific, say so honestly rather than making it up.
`;

export const chatWithSupport = async (req, res) => {
  try {
    const { message, history } = req.body;
    let orderContext = "";

    // If the user is logged in, include their recent order info
    if (req.user) {
      const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);

      if (orders.length > 0) {
        orderContext = "\n\nThis customer's recent orders:\n" + orders
          .map((o) => `- Order #${o._id.toString().slice(-8)}: ${o.orderStatus}, total ₹${o.totalAmount}, placed ${new Date(o.createdAt).toLocaleDateString()}`)
          .join("\n");
      } else {
        orderContext = "\n\nThis customer has no orders yet.";
      }
    }

    const messages = [
      { role: "system", content: STORE_CONTEXT + orderContext },
      ...(history || []),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.1-8b-instant",
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Failed to get response" });
  }
};