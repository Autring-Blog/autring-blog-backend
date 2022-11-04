const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, "Please Enter blog heading"],
        tirm: true
    },
    description: {
        type: String,
        required: [true, "Please Enter blog description"]
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter blog category"],
    },
   
    //which user added the product
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Blog",blogSchema);