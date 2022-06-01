const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Store = require("../models/Store");
const moment = require("moment");
// LOGIN
router.post("/", async (req, res) => {
  const { id, password } = req.body;
  try {
    const store = await Store.findOne({ id });
    const passed = store
      ? await bcrypt.compare(password, store?.password)
      : true;
    !store || !passed
      ? res.status(401).json("Invalid login details")
      : res.json(store);
  } catch (err) {
    res.status(500).json("Oooops! Please try again");
    console.log(err.messsages);
  }
});
// LOGIN
router.post("/admin", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      email !== process.env.LOGIN_EMAIL ||
      password !== process.env.LOGIN_PASSWORD
    ) {
      res.status(409).send("Invalid login credentials");
    } else {
      res.json("Logged in!");
    }
  } catch (err) {
    res.status(500).json("Oooops! Please try again");
    console.log(err.messsages);
  }
});
// LOGIN again
router.post("/renew", async (req, res) => {
  const { id } = req.body;
  try {
    const updatedStore = await Store.findOneAndUpdate(
      { id },
      {
        lastVerified: moment().format("MM/DD/YYYY"),
        nextVerification: moment().add(30, "days").format("MM/DD/YYYY"),
      }
    );
    res.json(updatedStore);
    console.log(updatedStore);
  } catch (err) {
    res.status(500).json("Oooops! Please try again");
    console.log(err);
  }
});

module.exports = router;
