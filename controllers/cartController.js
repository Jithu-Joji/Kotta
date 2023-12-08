const Cart = require('../models/cartModel');
const GroceryItem = require('../models/groceryItemModel');

async function createGroceryItem(req, res) {
  
  try {
    console.log('Received data in backend:', req.body);
    const { name, imageUrl } = req.body;

    console.log('Received request to create grocery item:', { name, imageUrl });

    const newGroceryItem = new GroceryItem({
      name: name,
      imageUrl: imageUrl,
    });

    console.log('About to save new grocery item:', newGroceryItem);

    // Wrap the save in a try-catch block for more detailed logging
    try {
      await newGroceryItem.save();
      console.log('Grocery item created successfully');
    } catch (saveError) {
      console.error('Error saving grocery item to the database:', saveError.message);
      throw saveError; // Re-throw the error for the outer catch block to handle
    }

    res.status(201).json({ message: 'Grocery item created successfully' });
  } catch (error) {
    console.error('Error creating grocery item:', error.message);
    res.status(500).json({ error: 'Could not create grocery item' });
  }
}


async function addToCart(req, res) {
    const { groupName } = req.params;
    const { itemId } = req.body;

    console.log('Group Name:', groupName);
    console.log('Item ID:', itemId);
  
    try {
      const itemToAdd = await GroceryItem.findById(itemId);
  
      if (!itemToAdd) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      let cart = await Cart.findOne({ groupName });
  
      if (!cart) {
        cart = new Cart({ groupName, items: [] });
      }
  
      cart.items.push(itemToAdd);
      await cart.save();
  
      res.status(200).json({ message: 'Item added to cart', cart });
    } catch (error) {
      res.status(500).json({ message: 'Error adding item to cart', error });
    }
  }


  async function fetchCartItems(req, res) {
    const { itemIds } = req.query; // Expecting comma-separated item IDs in the query string
    
    try {
        const fetchedItems = await GroceryItem.find({ _id: { $in: itemIds.split(',') } }); // Fetch items by their IDs
        
        res.status(200).json({ message: 'Cart items fetched', items: fetchedItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Error fetching cart items', error });
    }
}

async function removeFromCart(req, res) {
  const { groupName, itemId } = req.params; // Extract itemId from route params

  try {
    const cart = await Cart.findOne({ groupName });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart based on the provided itemId
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
}


async function viewCart(req, res) {
    const { groupName } = req.params;
  
    try {
      let cart = await Cart.findOne({ groupName }).populate('items');
  
      if (!cart) {
        cart = new Cart({ groupName, items: [] });
      }
  
      res.status(200).json({ message: 'Cart items retrieved', cart });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart items', error });
    }
  }
  

async function markItemsAsPurchased(req, res) {
    const { groupName } = req.params;
    const { itemIds } = req.body;
  
    try {
      const cart = await Cart.findOne({ groupName });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const itemsToMarkPurchased = await GroceryItem.find({ _id: { $in: itemIds } });
  
      cart.purchasedItems.push(...itemsToMarkPurchased);
      await cart.save();
  
      res.status(200).json({ message: 'Items marked as purchased', cart });
    } catch (error) {
      res.status(500).json({ message: 'Error marking items as purchased', error });
    }
  }
  

async function searchItems(req, res) {
    const { query } = req.params;
  
    try {
      const items = await GroceryItem.find({ name: { $regex: query, $options: 'i' } });
  
      if (!items || items.length === 0) {
        return res.status(404).json({ message: 'No items found' });
      }
  
      res.status(200).json({ message: 'Items found', items });
    } catch (error) {
      res.status(500).json({ message: 'Error searching items', error });
    }
  }

  async function clearCart(req, res) {
    const { groupName } = req.params;
  
    try {
      const cart = await Cart.findOne({ groupName });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.items = [];
      cart.purchasedItems = [];
      await cart.save();
  
      res.status(200).json({ message: 'Cart cleared', cart });
    } catch (error) {
      res.status(500).json({ message: 'Error clearing cart', error });
    }
  }
  
  async function updatePurchaseCount(req, res) {
    // Implementation for updating purchase count
    const { itemId } = req.params;
  
    try {
      // Fetch the item by its ID and update the purchase count
      const item = await GroceryItem.findById(itemId);
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      item.purchaseCount = item.purchaseCount ? item.purchaseCount + 1 : 1; // Increment the purchase count
      await item.save();
  
      res.status(200).json({ message: 'Purchase count updated', item });
    } catch (error) {
      res.status(500).json({ message: 'Error updating purchase count', error });
    }
  }
  
  async function getMostBoughtItems(req, res) {
    const limit = 8; // Fetch top 8 most bought items
  
    try {
      // Fetch items with the highest purchase counts
      const mostBoughtItems = await GroceryItem.find()
        .sort({ purchaseCount: -1 })
        .limit(limit);
  
      res.status(200).json({ message: 'Most bought items fetched', items: mostBoughtItems });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching most bought items', error });
    }
  }  

module.exports = {
  createGroceryItem, 
  addToCart,
  viewCart,
  markItemsAsPurchased,
  clearCart,
  searchItems,
  fetchCartItems,
  removeFromCart,
  updatePurchaseCount,
  getMostBoughtItems,
};
