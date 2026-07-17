import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order (this happens BEFORE payment)
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    const options = {
      amount: Math.round(amount * 100), // Razorpay needs paise (smallest unit)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // frontend needs this to open checkout
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify payment signature (this happens AFTER payment, before saving the order)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      res.json({ verified: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ verified: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};