const mongoose=require('mongoose');



const connectToMongo=()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log(`Connected to database succesfully with ${data.connection.host}`);
    }).catch((error)=>{
        console.log(error);
    })

}
module.exports=connectToMongo