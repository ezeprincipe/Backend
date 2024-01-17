const express = require("express");
const router = express.router();
const ProductManager = require("../controllers/ProductManager")
const productmanager = new ProductManager("../models/products.json")


router.get("/", async (req, res)=> {
    try{
        const products = await productManager.getProducts();
        res.render("index" ,{
            products:products
        });
    } catch (error) {
        console.error("error al obtener productos", error);
        res.status(500).json({
            error:"error interno del servidor"
        });
    }
})


router.get("/realtime", async (req, res) => {
    try {
        res.render("realtime");
    }catch (error){
        res.status(500).json({
            error: "error interno del servidor"
        });
    }
})

module.exports = router;