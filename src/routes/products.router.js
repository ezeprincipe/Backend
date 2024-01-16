const express = require('express');
const router = express.Router();

const ProductManager = require('../controllers/ProductManager.js');
const productManager = new ProductManager('./src/models/products.json');

// Rutas:

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = req.body;
    const productoAgregado = await productManager.addProduct(nuevoProducto);
    res.status(201).json({ mensaje: 'Producto agregado con éxito', producto: productoAgregado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Ruta para obtener la lista de productos (puede incluir un límite)
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    const responseProducts = limit ? products.slice(0, parseInt(limit)) : products;
    res.json(responseProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la lista de productos' });
  }
});

// Ruta para obtener detalles de un producto específico
router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener detalles del producto' });
  }
});

module.exports = router;
