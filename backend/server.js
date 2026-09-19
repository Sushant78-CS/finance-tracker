const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: "https://finance-tracker-wine-six.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// =========================
// ROUTES
// =========================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
// =========================
// ROUTES
// =========================

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/transactions", require("./routes/transactionRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Finance Tracker API is running",
  });
});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
