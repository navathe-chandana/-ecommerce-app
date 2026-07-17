import Cart from "../models/Cart.js";

// GET user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD or UPDATE item in cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SYNC local cart (guest cart from localStorage) into DB after login
export const syncCart = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }, ...]

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    items.forEach(({ productId, quantity }) => {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) {
        existingItem.quantity = Math.max(existingItem.quantity, quantity);
      } else {
        cart.items.push({ product: productId, quantity });
      }
    });

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};