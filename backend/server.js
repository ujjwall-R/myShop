import express from "express";
import {} from "dotenv/config";
import connectDB from "./config/db.js";
import colors from "colors";

import productRoutes from "./routes/productsRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

connectDB();

const app = express();

// var cors = require("cors");

// app.use(cors());

app.get("/", (req, res) => {
  res.send("Yo");
});

app.use("/api/products", productRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`.yellow
      .bold
  )
);