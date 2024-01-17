// ProductManager.js
const fs = require('fs').promises;

class ProductManager {
  static ultId = 0;

  constructor(filePath, io) {
    this.path = filePath;
    this.products = [];
    this.io = io;  // Agrega io como propiedad
  }

  async addProduct(newProduct) {
    try {
      const arrayProductos = await this.readFromFile();

      if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.code || !newProduct.stock) {
        console.error("Todos los campos son obligatorios");
        return;
      }

      if (arrayProductos.some(product => product.code === newProduct.code)) {
        console.error("El código del producto ya existe");
        return;
      }

      const product = {
        id: ++ProductManager.ultId,
        ...newProduct,
        thumbnail: `assets/${newProduct.thumbnail}`,
      };

      arrayProductos.push(product);
      await this.writeToFile(arrayProductos);
      console.log(`Producto agregado: ${product.title}`);

      // Emitir evento socket cuando se agrega un nuevo producto
      this.io.emit('productAdded', product);

      return product;
    } catch (error) {
      console.error('Error al agregar producto', error);
      throw error;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const arrayProductos = await this.readFromFile();
      const productIndex = arrayProductos.findIndex(product => product.id === id);

      if (productIndex !== -1) {
        arrayProductos[productIndex] = { ...arrayProductos[productIndex], ...updatedFields };
        await this.writeToFile(arrayProductos);
        console.log(`Producto actualizado con éxito: ${arrayProductos[productIndex].title}`);
        return arrayProductos[productIndex];
      } else {
        console.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar producto', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.readFromFile();
      const initialLength = arrayProductos.length;

      this.products = arrayProductos.filter(product => product.id !== id);

      if (arrayProductos.length < initialLength) {
        await this.writeToFile(arrayProductos);
        console.log("Producto eliminado correctamente");
      } else {
        console.error("No se encontró un producto con ese ID");
      }
    } catch (error) {
      console.error('Error al eliminar producto', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return await this.readFromFile();
    } catch (error) {
      console.error('Error al obtener productos', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.readFromFile();
      const product = arrayProductos.find(product => product.id === id);

      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado");
        return null;
      }
    } catch (error) {
      console.error('Error al obtener producto por ID', error);
      throw error;
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

  async readFromFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async writeToFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error al escribir en el archivo', error);
      throw error;
    }
  }

  calculateNextId() {
    // No cambió este método, ya que no involucra operaciones asíncronas.
    return this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
  }
}

module.exports = ProductManager;
