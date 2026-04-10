/**
 * EMMANUEL TRADING — Backend Server
 * Node.js / Express / Clean Architecture
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files (PDFs, Certificates, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Emmanuel Trading API is running' });
});

// Import Routes
const authRoutes = require('./routes/auth');
const formationRoutes = require('./routes/formations');
const paymentRoutes = require('./routes/payments');
const marketRoutes = require('./routes/market');

app.use('/api/auth', authRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/market', marketRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
