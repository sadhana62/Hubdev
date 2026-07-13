const Post  =require("../modules/post/postModel")
const Like = require("../modules/post/likeModel");
exports.likepost = async(req,res) =>{
    try{
        const {user,post} = req.body();
        const like= new Like({
            post,user
        });
        const saveLike=await like.save();

        // now we have to update into the like array 
        const updatesPost = await Post.findByIdAndUpdate(post,{$push :{likes:saveLike._id}},{new:true}).populate("likes").exec()
        res.json({
  post:updatedPost
 })
    }
  catch(error){
    console.log(error);
    return res.status(500).json({
        error:error.message
    })
}
}
// exports.unlikepost = (req,res) =>{
//     try{
//   const {post,a} = req.body;
// //   delete this 
// const deletedLike= await Like.findByIdAndDelete(a);
// if(!deletedLike){
//       return res.status(404).json({
//         error: "Like not found"
//       });
//     }
//     // remove from post
//     const updatedpost = await Post.findByIdAndUpdate(
//       post,
//       { $pull: { likes: a } },
//       { new: true }
//     ).populate("likes");

//     res.json({
//       post: updatedpost
//     });

//   } catch(error){
//     console.log(error);
//     return res.status(500).json({
//       error:error.message
//     });
//   }
// }