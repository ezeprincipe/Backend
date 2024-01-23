const fs = require('fs').promises;

class ProductManager {
  static ultId = 0;

  constructor(filePath, io) {
    this.path = filePath;
    this.products = [];
    this.io = io;
  }

  async addProduct(newProduct) {
    try {
      const arrayProducts = await this.readFromFile();

      // Automatic ID generation
      this.ultId = arrayProducts.length > 0 ? Math.max(...arrayProducts.map(p => p.id)) : this.ultId;

      if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.code || !newProduct.stock) {
        console.error("All fields are mandatory");
        return;
      }

      // Check if a product with the same code already exists
      if (arrayProducts.some(product => product.code === newProduct.code)) {
        console.error("Product with the same code already exists");
        return;
      }

      // Default 'status' field
      newProduct.status = "Available";

      const product = {
        id: ++this.ultId,
        ...newProduct,
        thumbnail: `assets/${newProduct.thumbnail}`,
      };

      arrayProducts.push(product);
      await this.writeToFile(arrayProducts);
      console.log(`Product added: ${product.title}`);

      this.io.emit('productAdded', product);

      return product;
    } catch (error) {
      console.error('Error adding product', error);
      throw error;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const arrayProducts = await this.readFromFile();
      const productIndex = arrayProducts.findIndex(product => product.id === id);

      if (productIndex !== -1) {
        arrayProducts[productIndex] = { ...arrayProducts[productIndex], ...updatedFields };
        await this.writeToFile(arrayProducts);
        console.log(`Product updated successfully: ${arrayProducts[productIndex].title}`);
        return arrayProducts[productIndex];
      } else {
        console.error("Product not found");
        return null;
      }
    } catch (error) {
      console.error('Error updating product', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProducts = await this.readFromFile();
      const initialLength = arrayProducts.length;

      this.products = arrayProducts.filter(product => product.id !== id);

      if (arrayProducts.length < initialLength) {
        await this.writeToFile(arrayProducts);
        console.log("Product deleted successfully");
        return { success: true, message: "Product deleted successfully" };
      } else {
        console.error("No product found with that ID");
        return { success: false, message: "No product found with that ID" };
      }
    } catch (error) {
      console.error('Error deleting product', error);
      throw error;
    }
  }

  async getProducts() {

    try {
      const JSONproducts = await this.readFromFile();
      console.log(JSONproducts);
      return JSONproducts;
    } catch (error) {
      console.error('Error getting products', error);
      throw error;
    }

  } 
  async getProductById(id) {
    try {
      const arrayProducts = await this.readFromFile();
      const product = arrayProducts.find(product => product.id === id);

      if (product) {
        return product;
      } else {
        console.error("Product not found");
        return null;
      }
    } catch (error) {
      console.error('Error getting product by ID', error);
      throw error;
    }
  }

  async getCartProductIds() {
    try {
      const arrayProducts = await this.readFromFile();
      return arrayProducts.map(product => product.id);
    } catch (error) {
      console.error('Error getting product IDs for cart', error);
      throw error;
    }
  }

  async readFromFile() {

    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const JSONproducts = JSON.parse(data);
      return JSONproducts;
    } catch (error) {
      return [];
    }
  }

  async writeToFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
  }
}

module.exports = ProductManager;
