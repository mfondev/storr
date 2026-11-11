import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.ts";
import itemRoutes from "./routes/itemRoutes.ts";
import { errorHandler } from "./middleware/errorMiddleware.ts";
import { config } from "dotenv";

import { connectDB,disconnectDB } from "./config/db.js";
  
// Create an Express application
// The app will handle requests and responses from clients
const app = express();

config()
connectDB()


// Allow the frontend (browser/web) to call this API and send the auth cookie.
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:8081",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//API Routes
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

// Error handler — must be last, after all routes.
app.use(errorHandler);

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});