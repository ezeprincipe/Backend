const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.readFromFile() || [];
    this.productIdCounter = this.calculateNextId();
    this.carts = this.readCartsFromFile() || [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some(product => product.code === code)) {
      console.error("El código del producto ya existe");
      return;
    }

    const product = {
      id: this.productIdCounter++,
      title,
      description,
      price,
      thumbnail: `assets/${thumbnail}`,
      code,
      stock
    };

    this.products.push(product);
    this.writeToFile();
    console.log(`Producto agregado: ${product.title}`);
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

  getCartProducts(cartId) {
    const cart = this.carts.find(cart => cart.id === cartId);
    return cart ? cart.products : [];
  }

  async addToCart(cartId, productId, quantity) {
    try {
      const cart = this.carts.find(cart => cart.id === cartId);

      if (!cart) {
        return { success: false, message: 'Carrito no encontrado' };
      }

      const existingProduct = cart.products.find(product => product.id === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }

      this.writeCartsToFile();

      return { success: true, message: 'Producto agregado al carrito correctamente' };
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      return { success: false, message: 'Error del servidor al agregar producto al carrito' };
    }
  }

  readCartsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  writeCartsToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
  }
}

module.exports = ProductManager;