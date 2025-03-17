const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    ownername: { type: String, required: true },
    contact: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit number!`
        }
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    logopath: { type: String },
    signaturepath: { type: String },
    stamppath: { type: String }
});

let Agency = mongoose.model("agencies", schema);
module.exports = Agency;