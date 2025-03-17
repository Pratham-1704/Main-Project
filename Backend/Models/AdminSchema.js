const mongoose = require('mongoose');

let AdminSchema=new mongoose.Schema({
    id: { type: String }, // ID Field
    name: { type: String },
    username: { type: String },
    password: { type: String },
    mobileno: { type: Number },
    role: { type: String },
    status: { type: String },
});

let Agency = mongoose.model("agencies", schema);
module.exports = Agency;