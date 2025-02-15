const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies and credentials
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', routes);

// Catch-all for preflight requests (OPTIONS)
app.options('*', cors());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API a la espera de consulta, por el puerto ${PORT}`);
});