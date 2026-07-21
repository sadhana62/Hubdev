const Post = require("../modules/post/postModel");
exports.createpost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const post = new Post({
            title, body
        })
        const savedpost = await post.save();
        res.json({
            post: savedpost
        })
    }
    catch (err) {
        return res.status(400).json({
            error: "Error while/.."
        })
    }
}

exports.getpost = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {};

    if (search.trim()) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          body: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const post = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .populate("comments")
      .populate("likes")
      .exec();

    res.json({
      posts: post,
    });
  } catch (err) {
    return res.status(400).json({
      error: "Error while fetching posts",
    });
  }
};