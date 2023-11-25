const express = require("express");
const { index, login, dashboard } = require("../controllers/view");

const router = express.Router();

router.get("/", index);
router.get("/login", login);
router.get("/dashboard", dashboard);

module.exports = router;
