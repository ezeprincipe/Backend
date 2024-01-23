const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router'); // Import views.router.js
const CartManager = require('./controllers/CartManager');
const ProductManager = require('./controllers/ProductManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configure Handlebars view engine
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Manager instances
const productManager = new ProductManager('./src/models/products.json', io);
const cartManager = new CartManager('./src/models/cart.json', productManager);

// Product routes
app.use('/api/products', productsRouter);

// Cart routes
app.use('/api/carts', cartsRouter);

// Views routes
app.use('/', viewsRouter);

// Configure socket events
io.on('connection', async (socket) => {
  console.log('User connected');

  // Configure socket events here

  // For example, send a message to the client on connection
  socket.emit('message', 'Welcome!');
  socket.emit('products', await productManager.getProducts());

  // Listen to client events
  socket.on('clientEvent', (data) => {
    console.log('Client event:', data);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    // Enviamos el array de productos actualizado a todos los productos:
    io.sockets.emit('products', await productManager.getProducts());
  });

  socket.on('addProduct', async (product) => {
    await productManager.addProduct(product);
    // Enviamos el array de productos actualizado a todos los productos:
    io.sockets.emit('products', await productManager.getProducts());
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
