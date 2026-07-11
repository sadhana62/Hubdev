const Post  =require("../modules/post/postModel");
exports.createpost = async(req,res) =>{
    try{
     const {title,body}  = req.body;
     const post = new Post({
        title,body
     })
     const savedpost = await post.save();
     res.json({
        post:savedpost
     })
    }
    catch(err){
        return res.status(400).json({
            error:"Error while/.."
        })
    }
}

exports.getpost = async (req,res) =>{
    try{
        const post  = await Post.find().populate("comments").exec();
       res.json({
        posts:post
     })
    }
    catch(err){
        return res.status(400).json({
            error:"Error while/.."
        })
    }
}
