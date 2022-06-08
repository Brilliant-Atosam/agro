const router = require("express").Router();
const bcrypt = require("bcryptjs/dist/bcrypt");
const moment = require("moment");
const Store = require("../models/Store");
// GET ALL stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
// ADD Store
router.post("/", async (req, res) => {
  const { name, password, phone, password2, createdAt, id } = req.body;

  try {
    const newStore = new Store({
      name,
      password: await bcrypt.hash(password, 10),
      admin: await bcrypt.hash(password2, 10),
      phone,
      createdAt,
      id,
    });
    await newStore.save();
    res.status(200).json(newStore);
  } catch (err) {
    res.status(500).json("Something went wrong!");
    console.log(err.message);
  }
});
// SUBCRIBE
router.put("/:id", async (req, res) => {
  try {
    await Store.findOneAndUpdate(
      { id: req.params.id },
      {
        lastVerified: moment().format("MM/DD/YYYY"),
        nextVerification: moment().add(30, "days").format("MM/DD/YYYY"),
      }
    );
    res.status(200).json(`Subscription was successful`);
  } catch (err) {
    res.status(500).json("Oooops! Try again");
    console.log(err.message);
  }
});
// Reset store's paasword
router.put("/password/reset", async (req, res) => {
  const { oldPassword, password, admin } = req.body;
  console.log(req.body);
  try {
    const store = await Store.findOne({ id: req.query.id });
    if (!(await bcrypt.compare(oldPassword, store.admin))) {
      res.status(401).json("Wrong password!");
    } else {
      admin
        ? await store.updateOne({ admin: await bcrypt.hash(password, 10) })
        : await store.updateOne({ password: await bcrypt.hash(password, 10) });
      res.json(`Reset of ${admin ? "Admins" : "Attendant's"} was successful!`);
    }
  } catch (err) {
    res.status(500).json("Oooops! Try again");
  }
});
// DELETE STORE
router.delete("/", async (req, res) => {
  try {
    await Store.findOneAndDelete({ id: req.query.id });
    res.json("Deletion successful!");
  } catch (err) {
    res.status(500).json("Oooops! Try again");
  }
});
module.exports = router;
