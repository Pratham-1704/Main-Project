const mongoose = require('mongoose');

let BrandSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    srno: {
        type: Number,
        required: true,
        unique: true
    }
});

let Brand = mongoose.model("Brand",BrandSchema);

module.exports = Brand;
