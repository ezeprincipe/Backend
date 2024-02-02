const express = require('express');
const router = express.Router();
const ProductManager = require('../controllers/ProductManager.js');
const productManager = new ProductManager("./src/models/products.json");

router.post('/add', async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await productManager.addProduct(newProduct);
    res.status(201).json({ message: 'Product added successfully', product: addedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding the product' });
  }
});

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    const responseProducts = limit ? products.slice(0, parseInt(limit)) : products;
    res.json(responseProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting the list of products' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting product details' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    const updatedProduct = await productManager.updateProduct(productId, updatedFields);

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product', error);
    res.status(500).json({ error: 'Internal server error updating product' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    const deleteResult = await productManager.deleteProduct(productId);

    if (deleteResult.success) {
      res.json({ message: deleteResult.message });
    } else {
      res.status(404).json({ error: deleteResult.message });
    }
  } catch (error) {
    console.error('Error deleting product', error);
    res.status(500).json({ error: 'Internal server error deleting product' });
  }
});

module.exports = router;
