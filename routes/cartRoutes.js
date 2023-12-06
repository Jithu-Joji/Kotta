const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

router.post('/:groupName/add-to-cart', CartController.addToCart);
router.get('/:groupName/view-cart', CartController.viewCart);
router.put('/:groupName/mark-as-purchased', CartController.markItemsAsPurchased); 
router.get('/search/:query', CartController.searchItems);
router.get('/fetch-cart-items', CartController.fetchCartItems);
router.delete('/:groupName/remove-from-cart/:itemId', CartController.removeFromCart);
router.delete('/:groupName/clear-cart', CartController.clearCart);
router.put('/update-purchase-count/:itemId', CartController.updatePurchaseCount);
router.get('/most-bought-items', CartController.getMostBoughtItems);
router.post('/groceryItems/create', CartController.createGroceryItem);

module.exports = router;
