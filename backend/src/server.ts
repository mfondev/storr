import express from "express";

import authRoutes from "./routes/authRoutes.ts";
import itemRoutes from "./routes/itemRoutes.ts";

const app = express();

app.use(express.json());

//API Routes
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
