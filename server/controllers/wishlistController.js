import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const exists = wishlist.products.includes(productId);

    if (exists) {
      wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    const populated = await wishlist.populate("products");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};