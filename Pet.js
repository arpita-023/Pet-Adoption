const mongoose = require("mongoose")


const PetSchema = mongoose.Schema({
  name: String,
  breed: String,
  imageUrl: String,
  disability: String,
  color: String,
  age: Number,
});

module.exports=mongoose.model('petupload',PetSchema)