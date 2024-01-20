const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/ProductManager");
const productManager = new ProductManager("../models/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("index", {
            products: products
        });
    } catch (error) {
        console.error("Error fetching products", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

router.get("/realtime", async (req, res) => {
    try {
        res.render("realtime");
    } catch (error) {
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

module.exports = router;
