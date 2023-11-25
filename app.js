const express = require("express");
const viewRouter = require("./routes/view");
const authRouter = require("./routes/login");
const app = express();
app.set("view engine", "ejs");

module.exports = { app };

app.use("", viewRouter);
app.use("/get", authRouter);
