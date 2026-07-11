const mongoose = require("mongoose");
const user = new mongoose.Schema(
    {
    username:{
        type:String,
        required:true,
        maxLength:50
    },
    email:{
        type:String,
        required:true,
        maxLength:50
    },
    password:{
        type:String,
        required:true,
        maxLength:50
    },
    bio:{
        type:String,
        required:true,
        maxLength:50
    },
//     profile_image: {
//     type: String,
//     default: ""
// }
    createdAt:{
    type: Date,
    required: true,
    default: Date.now
},
        updatedAt:{
            type:Date,
            required:true,
            default:Date.now,
        }

    }
)
module.exports = mongoose.model("User", user)