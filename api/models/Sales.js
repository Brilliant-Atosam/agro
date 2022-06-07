const mongoose = require("mongoose");
const salesSchema = new mongoose.Schema({
  id: String,
  item_id: String,
  storeId: String,
  item_name: String,
  quantity: Number,
  cost: Number,
  createdAt: String,
  mode: String,
});
module.exports = mongoose.model("Sales", salesSchema);
