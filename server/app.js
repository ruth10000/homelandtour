import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";

// Routes
import authRoute from "./src/routes/UserRoutes.js";
import tourRoute from "./src/routes/TourRoutes.js";
import PackageRoute from "./src/routes/PackageRoutes.js";
import HotelRoute from "./src/routes/HotelRoutes.js";

const app = express();

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ===============================
// Health Check
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Homeland Tour API is running",
  });
});

// ===============================
// Database Middleware
// ===============================

// Connect to MongoDB before handling API requests.
// The connection is cached by db.js so Vercel can reuse it.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoute);
app.use("/api/tours", tourRoute);
app.use("/api/packages", PackageRoute);
app.use("/api/hotels", HotelRoute);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// IMPORTANT:
// Do NOT use app.listen() on Vercel.
// Vercel handles the HTTP server for us.

export default app;