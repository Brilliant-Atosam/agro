const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Store = require("../models/Store");
const moment = require("moment");
// LOGIN
router.post("/", async (req, res) => {
  const { id, password, admin } = req.body;
  try {
    const store = await Store.findOne({ id });
    const adm = await bcrypt.compare(password, store.admin);
    const attendant = await bcrypt.compare(password, store.password);
    admin && adm
      ? res.json({ mode: "Admin", ...store })
      : !admin && attendant
      ? res.json({ mode: "Attendant", ...store })
      : res.status(409).json("Invalid login credentials");
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
  }
});
module.exports = router;
