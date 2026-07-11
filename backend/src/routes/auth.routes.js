const express = require("express");
const {
    signup,
    login,
    refreshAccessToken,
    getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", protect, getMe);

module.exports = router;
