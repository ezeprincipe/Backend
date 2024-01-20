const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
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

// Configure socket events
io.on('connection', (socket) => {
  console.log('User connected');

  // Configure socket events here

  // For example, send a message to the client on connection
  socket.emit('message', 'Welcome!');

  // Listen to client events
  socket.on('clientEvent', (data) => {
    console.log('Client event:', data);
  });
});

// Main route with a specific message
app.get('/', async (req, res) => {
  try {
    // Logic to get data needed for the home page
    const products = await productManager.getProducts();

    // Render the 'index' view and pass the necessary data
    res.render('index', { pageTitle: 'Home', products });
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

// Route rendering the view with Socket.IO
app.get('/realtime', (req, res) => {
  res.render('realtime');
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
