const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  mail: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
  },
});
module.exports=mongoose.model("user",userSchema,"user")