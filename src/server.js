// En server.js
const express = require('express');
const app = express();
const port = 8080;
const productsRouter = require('./routes/products.router');
const cartsRouter = require("./routes/carts.router.js")


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Instancia de ProductManager
const ProductManager = require('./controllers/ProductManager.js');
const productManager = new ProductManager('./src/models/productos.json');

// Rutas
app.use('/api', productsRouter);
app.use("/api",cartsRouter)

// Ruta principal con un mensaje específico
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!¡CON EXPRESS!!!');
});

// Endpoint para obtener todos los productos con posibilidad de limitarlos
app.get('/products', async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();
  const responseProducts = limit ? products.slice(0, parseInt(limit)) : products;
  res.json(responseProducts);
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
