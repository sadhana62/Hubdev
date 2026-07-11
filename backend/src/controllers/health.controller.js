// const getHealth = (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "DevHub Backend is running"
//     });
// };

// module.exports = {
//     getHealth
// };
const mongoose  = require("mongoose")
const User = require("../modules/auth/user/user.model");
exports.signup = async(req,res) =>{
    try{
        const {username,email,password,bio}  =req.body;
        const userData = {username,email,password,bio};
        const user = await User.create(userData);

    }
    catch(err){
        console.log(err);
        console.log(err);
        res.status(500)
        .json({
            success:false,
            data:"internal server error",
            message:err.message,
        })
    }
}


