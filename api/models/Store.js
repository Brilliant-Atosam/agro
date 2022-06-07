const mongoose = require("mongoose");
const storeSchema = new mongoose.Schema({
  id: String,
  name: String,
  phone: String,
  password: String,
  admin: String,
  createdAt: String,
  lastVerified: String,
  nextVerification: String,
});
module.exports = mongoose.model("Store", storeSchema);
