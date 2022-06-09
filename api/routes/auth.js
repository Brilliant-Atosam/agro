const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Store = require("../models/Store");
// LOGIN
router.post("/", async (req, res) => {
  const { password, admin } = req.body;
  try {
    const store = await Store.findOne({ id: req.body.id });
    const adm = await bcrypt.compare(password, store.admin);
    const attendant = await bcrypt.compare(password, store.password);
    const { id, name, ...other } = store._doc;
    admin && adm
      ? res.json({ mode: "Admin", id, name })
      : !admin && attendant
      ? res.json({ mode: "Attendant", id, name })
      : res.status(401).json("Invalid login credentials");
  } catch (err) {
    res.status(500).json("Oooops! Please try again");
    console.log(err);
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
      res.status(401).send("Invalid login credentials");
    } else {
      res.json("Logged in!");
    }
  } catch (err) {
    res.status(500).json("Oooops! Please try again");
  }
});
module.exports = router;
