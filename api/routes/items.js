const router = require("express").Router();
const moment = require("moment");
const Item = require("../models/Item");
// GET ALL DRUGS
router.get("/", async (req, res) => {
  const { storeId } = req.query;
  try {
    const items = await Item.find({ storeId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
// ADD
router.post("/", async (req, res) => {
  const {
    name,
    stock,
    supplier,
    dosage,
    implications,
    price,
    storeId,
    expiry,
    id,
    createdAt,
    updatedAt,
  } = req.body;
  try {
    const newItem = new Item({
      name,
      stock,
      supplier,
      implications,
      dosage,
      price,
      storeId,
      expiry,
      createdAt,
      updatedAt,
      id,
    });
    await newItem.save();
    res.status(200).json("Item has been added successfully");
  } catch (err) {
    res.status(500).json("Something went wrong!");
    console.log(err);
  }
});
// EDIT DRUG
router.put("/:id", async (req, res) => {
  try {
    await Item.findOneAndUpdate({ id: req.params.id }, { $set: req.body });
    res.json("Updated successfully");
  } catch (err) {
    res.status(500).json("Oooops! Try again");
    console.log(err);
  }
});
// RESTOCK DRUG
router.put("/restock/:id", async (req, res) => {
  try {
    await Item.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { stock: req.body.stock } }
    );
    res.json("Restocked successfully");
  } catch (err) {
    res.status(500).json("Oooops! Try again");
    console.log(err.message);
  }
});
// DELETE DRUG
router.delete("/:id", async (req, res) => {
  try {
    await Item.findOneAndDelete({ id: req.params.id });
    res.json("Deletion successful!");
  } catch (err) {
    res.status(500).json("Oooops! Try again");
  }
});
module.exports = router;
