const express = require('express');
const app = express();
const port = 8080;
const productsRouter = require('./routes/products.router');
const cartsRouter = require("./routes/carts.router.js");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Instancia de CartManager (CORREGIDO)
const CartManager = require('./managers/CartManager.js');
const cartManager = new CartManager('./src/models/carrito.json');

// Rutas de productos (MODIFICADO)
app.use('/api/products', productsRouter);

// Rutas de carritos (MODIFICADO)
app.use("/api/carts", cartsRouter);

// Ruta principal con un mensaje específico
app.get('/', (req, res) => {
  res.send('¡Hola, mundo! ¡CON EXPRESS!!!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
