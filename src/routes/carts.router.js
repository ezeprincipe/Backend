// carts.router.js

const express = require("express");
const router = express.Router();
const CartManager = require('../managers/CartManager'); 
const cartManager = new CartManager('./src/models/carrito.json');

// Obtener IDs de productos en el carrito
router.get("/", async (req, res) => {
    try {
        const cartIds = await cartManager.getCartProductIds();
        res.json(cartIds);
    } catch (error) {
        console.error("Error al obtener IDs del carrito");
        res.status(500).json({ error: "Error del servidor al obtener IDs del carrito" });
    }
});

// Agregar producto al carrito
router.post("/add", async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validar que se proporcionaron productId y quantity en el cuerpo de la solicitud
        if (!productId || !quantity) {
            res.status(400).json({ error: "productId y quantity son campos obligatorios" });
            return;
        }

        // Agregar algunos registros de consola para depurar
        console.log('Solicitud recibida para agregar producto al carrito:');
        console.log('Carrito ID:', req.params.cartId);
        console.log('Producto ID:', productId);
        console.log('Cantidad:', quantity);

        // Agregar producto al carrito
        const result = await cartManager.addToCart(productId, quantity);

        if (result.success) {
            res.status(201).json({ mensaje: result.message });
        } else {
            res.status(404).json({ error: result.message });
        }
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error del servidor al agregar producto al carrito" });
    }
});

// Crear un nuevo carrito
router.post("/create", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ mensaje: 'Nuevo carrito creado', cartId: newCart.id });
    } catch (error) {
        console.error("Error al crear un nuevo carrito:", error);
        res.status(500).json({ error: "Error del servidor al crear un nuevo carrito" });
    }
});

// Obtener un carrito por su ID
router.get("/:cartId", async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cartProducts = await cartManager.getCartProducts(cartId);

        if (cartProducts) {
            res.json(cartProducts);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error("Error al obtener un carrito por su ID:", error);
        res.status(500).json({ error: "Error del servidor al obtener un carrito por su ID" });
    }
});

module.exports = router;
