const mongoose=require("mongoose")
require("dotenv").config();

connectdb=()=>{
    mongoose.connect(process.env.url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("error: " + err.message));
}
module.exports=connectdb