const express = require("express");
const cors = require("cors");
const perfumeRoutes = require("./routes/perfumeRoutes");
const authRoutes = require("./routes/authRoutes");  // Import authRoutes
const adminRoutes = require("./routes/adminRoutes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
app.use(bodyParser.json()); // Parse incoming JSON requests

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/perfumes", perfumeRoutes);
app.use("/api/auth", authRoutes);  
app.use("/api/admin",adminRoutes)
// MongoDB connection
mongoose
  .connect("mongodb+srv://lykhoanamvn:KhoaNamlLy@cluster0.dj2dcmd.mongodb.net/?", {})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
