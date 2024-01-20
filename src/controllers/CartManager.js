const fs = require('fs');

class CartManager {
  constructor(filePath, productManager) {
    this.path = filePath;
    this.carts = this.readFromFile() || [];
    this.cartIdCounter = this.calculateNextId();
    this.productManager = productManager; // Instance of ProductManager
  }

  createCart() {
    const newCart = {
      id: this.cartIdCounter++,
      products: []
    };

    this.carts.push(newCart);
    this.writeToFile();
    return newCart;
  }

  addToCart(productId, quantity, cartId) {
    // Validate that productId and quantity are provided in the request
    if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
      return { success: false, message: "productId and quantity are mandatory fields, and quantity must be a positive number." };
    }

    // Validate if the product exists before adding it to the cart
    const existingProduct = this.productManager.getProductById(productId);

    if (!existingProduct) {
      return { success: false, message: "Product not found. Cannot add to the cart." };
    }

    // Find the active user cart (in this example, we assume there's only one active cart per user)
    let activeCart = this.carts.find(cart => cart.id === cartId && !cart.checkoutDate);

    // If there's no active cart, create a new one
    if (!activeCart) {
      activeCart = this.createCart();
    }

    // Check if the product is already in the cart
    const existingCartItem = activeCart.products.find(product => product.id === productId);

    if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      existingCartItem.quantity += parseInt(quantity);
    } else {
      // If the product is not in the cart, add it
      activeCart.products.push({ id: productId, quantity: parseInt(quantity) });
    }

    // Update the file with the new cart information
    this.writeToFile();

    return { success: true, message: "Product added to the cart successfully." };
  }

  getCartProductIds() {
    return this.carts.map(cart => cart.products.map(product => product.id)).flat();
  }

  getCartProducts(cartId) {
    const cart = this.carts.find(cart => cart.id === parseInt(cartId));
    return cart ? cart.products : null;
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
    fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
  }

  calculateNextId() {
    return this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0) + 1;
  }
}

module.exports = CartManager;