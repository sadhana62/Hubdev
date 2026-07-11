const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const routes = require("./routes/health.routes");

// app.use("/", rout    es);
app.use("/api/v1", routes);

app.get("/",(req,res) =>{
    res.send(`<h1>backend of devhub</h1>`)
})
// const { getHealth } = require("./controllers/health.controller");

// app.get("/", getHealth);

module.exports = app;