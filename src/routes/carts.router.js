const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/carrito.json");

// Rutas
router.get("/carts", async (req, res) => {
    try {
        const cartIds = await productManager.getCartProductIds();
        res.json(cartIds);
    } catch (error) {
        console.error("error al obtener carrito");
        res.json({ error: "error del servidor" });
    }
});

module.exports = router;