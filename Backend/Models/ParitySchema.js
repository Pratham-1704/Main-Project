const mongoose = require("mongoose");

const parityEntrySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    parity: {
        type: String,
        required: true,
    },
});

const paritySchema = new mongoose.Schema({
    parityName: {
        type: String,
        required: true,
    },
    rateDate: {
        type: Date,
        required: true,
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    entries: [parityEntrySchema],
});

module.exports = mongoose.model("Parity", paritySchema);
