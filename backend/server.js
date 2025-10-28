/**
 * Clean Server.js (UTF-8, No BOM)
 * Backend for Angular Login App — Express + MySQL
 */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

// MySQL Connection
import { db } from '../backend/config/db.js';


// Routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Backend server is running successfully!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
