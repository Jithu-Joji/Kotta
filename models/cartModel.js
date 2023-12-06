const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroceryItem' }],
  groupName: { type: String, required: true }, // Group name
  purchasedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroceryItem' }], // Items marked as purchased
}, { collection: 'carts' });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
