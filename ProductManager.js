class ProductManager {
  constructor() {
    this.products = [];
    this.productIdCounter = 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validar campos obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    // Validar que no se repita el campo "code"
    if (this.products.some(product => product.code === code)) {
      console.error("El código del producto ya existe");
      return;
    }

    // Agregar producto con id autoincrementable
    const product = {
      id: this.productIdCounter++,
      title,
      description,
      price,
      thumbnail: `images/${thumbnail}`, // Ajusta la ruta de la imagen
      code,
      stock
    };

    this.products.push(product);
    console.log(`Producto agregado: ${product.title}`);
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
      return null; // Retorna null en lugar de undefined para consistencia
    }
  }
}

// Ejemplo de uso con productos diferentes
const productManager = new ProductManager();

productManager.addProduct("Tablet", "Tablet ligera para entretenimiento", 300, "tablet.jpg", "TB001", 15);
productManager.addProduct("Auriculares Bluetooth", "Auriculares inalámbricos con sonido envolvente", 100, "headphones.jpg", "AU002", 30);
productManager.addProduct("Smartwatch", "Reloj inteligente con seguimiento de actividad", 150, "smartwatch.jpg", "SW003", 20);

console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
console.log(productManager.getProductById(4)); // Debería mostrar "Producto no encontrado"
