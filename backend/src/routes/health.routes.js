const express = require("express");

const router = express.Router();

// const { getHealth } = require("../controllers/health.controller");

// router.get("/", getHealth);

const {signup} = require("../controllers/health.controller")
router.post("/signup",signup)



module.exports = router;