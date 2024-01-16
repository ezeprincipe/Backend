const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.readFromFile() || [];
    this.cartIdCounter = this.calculateNextId();
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

  addToCart(productId, quantity) {
    // Validar que se proporcionaron productId y quantity en la solicitud
    if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
      return { success: false, message: "productId y quantity son campos obligatorios y quantity debe ser un número positivo." };
    }

    // Buscar el carrito activo del usuario (en este ejemplo, suponemos que solo hay un carrito activo por usuario)
    let activeCart = this.carts.find(cart => !cart.checkoutDate);

    // Si no hay un carrito activo, crear uno nuevo
    if (!activeCart) {
      activeCart = this.createCart();
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = activeCart.products.find(product => product.id === productId);

    if (existingProduct) {
      // Si el producto ya está en el carrito, actualizar la cantidad
      existingProduct.quantity += parseInt(quantity);
    } else {
      // Si el producto no está en el carrito, agregarlo
      activeCart.products.push({ id: productId, quantity: parseInt(quantity) });
    }

    // Actualizar el archivo con la nueva información del carrito
    this.writeToFile();

    return { success: true, message: "Producto agregado al carrito correctamente." };
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
