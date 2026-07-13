const express = require("express");
const router = express.Router();

const { createpost, getpost } = require("../controllers/post.controller");
const { likePost } = require("../controllers/like.controller");
const { createcomment } = require("../controllers/comment.controller");

// Post
router.post("/posts/create", createpost);
router.get("/posts", getpost);

// Comment
router.post("/comments/create", createcomment);

// Like
// router.post("/likes", likePost);
// router.post("/likes/unlike", unlikepost);

module.exports = router;