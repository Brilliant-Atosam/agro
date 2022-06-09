const mongoose = require("mongoose");
const drugSchema = new mongoose.Schema({
  name: String,
  id: String,
  stock: Number,
  storeId: String,
  supplier: String,
  expiry: String,
  implications: [String],
  dosage: String,
  price: Number,
  createdAt: String,
  updatedAt: String,
});
module.exports = mongoose.model("Item", drugSchema);
