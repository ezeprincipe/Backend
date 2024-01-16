const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.readFromFile() || [];
    this.productIdCounter = this.calculateNextId();
  }

  addProduct(newProduct) {
    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock) {
      console.error("Todos los campos son obligatorios");
      return null;
    }

    if (this.products.some(product => product.code === newProduct.code)) {
      console.error("El código del producto ya existe");
      return null;
    }

    const product = {
      id: this.productIdCounter++,
      ...newProduct,
      thumbnail: `assets/${newProduct.thumbnail}`,
    };

    this.products.push(product);
    this.writeToFile();
    console.log(`Producto agregado: ${product.title}`);
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === id);

    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
      this.writeToFile();
      console.log(`Producto actualizado con éxito: ${this.products[productIndex].title}`);
      return this.products[productIndex];
    } else {
      console.error("Producto no encontrado");
      return null;
    }
  }

  deleteProduct(id) {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== id);

    if (this.products.length < initialLength) {
      this.writeToFile();
      console.log("Producto eliminado correctamente");
    } else {
      console.error("No se encontró un producto con ese ID");
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);

    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado");
      return null;
    }
  }

  async getCartProductIds() {
    try {
      const cartProducts = await this.getProducts();
      return cartProducts.map(product => product.id);
    } catch (error) {
      console.error('Error al obtener IDs del carrito:', error);
      throw error;
    }
  }

  readFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  writeToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  calculateNextId() {
    return this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
  }
}

module.exports = ProductManager;
