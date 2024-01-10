
const express = require('express');
const router = express.Router();

const ProductManager = require('../controllers/ProductManager.js');
const productManager = new ProductManager('./src/models/products.json');

// RUTAS:
router.get('/products', async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();
  const responseProducts = limit ? products.slice(0, parseInt(limit)) : products;
  res.json(responseProducts);
});

router.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;