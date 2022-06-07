const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const server = express();
require("dotenv").config();
const bcrypt = require("bcryptjs");
// DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION_STRING, (err) => {
  err ? console.log(err.message) : console.log("Connected to DB");
});
server.use(express.json());
// CORS SETTINGS
server.use(cors());
server.use("/auth", require("./routes/auth"));
server.use("/store", require("./routes/store"));
server.use("/items", require("./routes/items"));
server.use("/sales", require("./routes/sales"));
server.listen(process.env.PORT || 8000, () => console.log("Server is running"));
