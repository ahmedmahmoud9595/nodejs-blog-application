const mongoose = require("mongoose"); 
const bcrypt = require("bcrypt")

const userSchems = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 10,
    },
    photo:{type:String},
    role :{
      type:String,
      enum:["superAdmin","admin","user"],
      default:"user"
    }
    
  },
  { timestamps: true }
);

userSchems.pre("save",async function(next){
  if(!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password,10)
})

userSchems.pre(/^find/,function (){
  if(!this.getOptions().includePassword){
    this.select('-password')
  }
})

const User = mongoose.model('User',userSchems)

module.exports = User
