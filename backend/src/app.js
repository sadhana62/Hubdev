const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const { getHealth } = require("./controllers/health.controller");

app.get("/", getHealth);

module.exports = app;