import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.ts";
import itemRoutes from "./routes/itemRoutes.ts";

import { config } from "dotenv";
import { connectDB,disconnectDB } from "./config/db.js";
  
// Create an Express application
// The app will handle requests and responses from clients
const app = express();

config()
connectDB()


app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//API Routes
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

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