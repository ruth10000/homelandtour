import express from 'express';
import connectDB from './src/config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

// Routes
import authRoute from './src/routes/UserRoutes.js';
import tourRoute from './src/routes/TourRoutes.js';
import PackageRoute from './src/routes/PackageRoutes.js';
import HotelRoute from './src/routes/HotelRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Define uploads directory relative to project root
const uploadsDir = path.resolve('uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve static images
app.use('/uploads', express.static(uploadsDir));

// API Endpoints
app.use('/api/auth', authRoute);
app.use('/api/tours', tourRoute);
app.use('/api/packages', PackageRoute);
app.use('/api/hotels', HotelRoute);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();