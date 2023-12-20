const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.readFromFile() || []; // Llamar al array vacío si no se lee correctamente
    this.productIdCounter = this.calculateNextId();
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
      thumbnail: `assets/${thumbnail}`, // Ajusta la ruta de la imagen
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
      // Actualizar el producto con los campos proporcionados
      this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };

      // Guardar el array actualizado en el archivo
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

    // Filtrar los productos para excluir el producto con el id especificado
    this.products = this.products.filter(product => product.id !== id);

    if (this.products.length < initialLength) {
      // Solo guardar si se eliminó un producto
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
      return null; // Retorna null en lugar de undefined para consistencia
    }
  }

  // Método privado para leer desde el archivo
  readFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o hay un error al leerlo, devolver null
      return null;
    }
  }

  // Método privado para escribir en el archivo
  writeToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  // Método privado para calcular el próximo id basado en los productos actuales
  calculateNextId() {
    return this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
  }
}

// productos de tecnología
const productManager = new ProductManager('./products.json');

productManager.addProduct("Alienware m15 R4", "Laptop gaming de Alienware con potente rendimiento", 2500, "alienware-laptop.jpg", "ALM001", 10);
productManager.addProduct("iPhone 13 Pro Max", "Teléfono inteligente de Apple con avanzadas funciones", 1200, "iphone-13-pro-max.jpg", "IP13PM002", 20);
productManager.addProduct("Samsung Odyssey G7", "Monitor curvo para juegos con resolución QLED", 800, "samsung-odyssey-g7.jpg", "SOC003", 15);
productManager.addProduct("Sony WH-1000XM4", "Auriculares inalámbricos con cancelación de ruido", 350, "sony-headphones.jpg", "SWH004", 25);
productManager.addProduct("LG OLED C1", "Smart TV 4K OLED con funciones inteligentes", 1800, "lg-oled-c1.jpg", "LGTV005", 12);

console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
console.log(productManager.getProductById(6)); // Debería mostrar "Producto no encontrado"
productManager.updateProduct(1, { price: 2600, stock: 15 });
productManager.deleteProduct(3);
console.log(productManager.getProducts());
module.exports = ProductManager;