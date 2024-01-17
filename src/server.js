const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const CartManager = require('./managers/CartManager');
const ProductManager = require('./controllers/ProductManager');  // Importa ProductManager

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar el motor de vistas Handlebars
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

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Instancias de managers
const cartManager = new CartManager('./src/models/carrito.json');
const productManager = new ProductManager('./src/models/products.json', io);   // Instancia de ProductManager

// Rutas de productos
app.use('/api/products', productsRouter);

// Rutas de carritos
app.use('/api/carts', cartsRouter);

// Configurar eventos socket
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Configurar eventos socket aquí

  // Por ejemplo, enviar un mensaje al cliente cuando se conecta
  socket.emit('message', '¡Bienvenido!');

  // Escuchar eventos del cliente
  socket.on('clientEvent', (data) => {
    console.log('Evento del cliente:', data);
  });
});

// Ruta principal con un mensaje específico
app.get('/', async (req, res) => {
  try {
    // Lógica para obtener datos necesarios para la página de inicio
    const products = await productManager.getProducts();

    // Renderizar la vista 'index' y pasar los datos necesarios
    res.render('index', { pageTitle: 'Inicio', products });
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
});

// Ruta que renderiza la vista con Socket.IO
app.get('/realtime', (req, res) => {
  res.render('realtime');
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
