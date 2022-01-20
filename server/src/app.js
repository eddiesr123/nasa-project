const express = require("express");
// const fs = require("fs");
const path = require("path");
const cors = require("cors");
// const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );

// app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use(planetsRouter);

module.exports = app;
