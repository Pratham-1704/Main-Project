const mongoose=require('mongoose');

let AdminSchema=new mongoose.Schema({
    id: { type: String }, // ID Field
    name: { type: String },
    username: { type: String },
    password: { type: String },
    mobileno: { type: Number },
    role: { type: String },
    status: { type: String },
});

let Admin=mongoose.model("admin",AdminSchema);

module.exports=Admin;