const express = require('express');
const ProductManager = require('./ProductManager'); // Ajusta la ruta según tu estructura de archivos

const app = express();
const port = 3000; // Puedes cambiar el puerto según tus necesidades

const productManager = new ProductManager('../products.json');

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

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
