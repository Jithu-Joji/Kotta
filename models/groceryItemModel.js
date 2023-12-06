const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  purchaseCount: { type: Number, default: 0 }, // New field to track item purchases
}, { collection: 'groceryItems' });

const GroceryItem = mongoose.model('GroceryItem', groceryItemSchema);
module.exports = GroceryItem;