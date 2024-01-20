
const express = require("express");
const router = express.Router();
const CartManager = require('../controllers/CartManager'); 
const cartManager = new CartManager('./src/models/carrito.json');

// Get product IDs in the cart
router.get("/", async (req, res) => {
    try {
        const cartIds = await cartManager.getCartProductIds();
        res.json(cartIds);
    } catch (error) {
        console.error("Error retrieving cart IDs");
        res.status(500).json({ error: "Server error retrieving cart IDs" });
    }
});

// Add product to the cart
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Validate that quantity was provided in the request body
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            res.status(400).json({ error:"Quantity is a required field and must be a positive number." });
            return;
        }

        // Add some console logs for debugging
        console.log('Request received to add product to the cart:');
        console.log('Cart ID:', cid);
        console.log('Product ID:', pid);
        console.log('Quantity:', quantity);


          // Add product to the cart
        const result = await cartManager.addToCart(parseInt(pid), parseInt(quantity), parseInt(cid));

        if (result.success) {
            res.status(201).json({ mensaje: result.message });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        console.error("Error adding product to the cart:", error);
        res.status(500).json({ error: "Server error adding product to the cart" });
    }
});

// Create a new cart
router.post("/create", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ mensaje: 'New cart created', cartId: newCart.id });
    } catch (error) {
        console.error("Error creating a new cart:", error);
        res.status(500).json({ error: "Server error creating a new cart" });
    }
});

// Get a cart by its ID
router.get("/:cartId", async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cartProducts = await cartManager.getCartProducts(cartId);

        if (cartProducts) {
            res.json(cartProducts);
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        console.error("Error getting a cart by its ID:", error);
        res.status(500).json({ error: "Server error getting a cart by its ID" });
    }
});

module.exports = router;
