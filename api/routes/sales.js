const router = require("express").Router();
const Item = require("../models/Item");
const Sales = require("../models/Sales");
// GET ALL SALES
router.get("/", async (req, res) => {
  const { storeId } = req.query;
  try {
    const sales = await Sales.find({ storeId });
    res.json(sales);
  } catch (err) {
    res.status(500).json("Oooops! Try again.");
  }
});
// ADD SALES
router.post("/", async (req, res) => {
  const { item_id, item_name, quantity, cost, storeId, createdAt, id, mode } =
    req.body;
  try {
    const item = await Item.findOne({ id: item_id });
    if (item.stock < quantity) {
      res.status(401).json("Insufficient stock!");
    } else {
      const newSales = new Sales({
        item_id,
        item_name,
        storeId,
        quantity,
        cost,
        createdAt,
        id,
        mode,
      });
      await item.updateOne({ stock: item.stock - quantity });
      await newSales.save();
      res.json("Sales completed successfully");
    }
  } catch (err) {
    res.status(500).json("Oooops! Please try again later");
  }
});
module.exports = router;
