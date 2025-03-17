const mongoose=require('mongoose');

let AdminSchema=new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileno: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

let Admin=mongoose.model("admin",AdminSchema);

module.exports=Admin;