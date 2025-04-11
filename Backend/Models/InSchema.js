const mongoose = require("mongoose");

const InSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    }
  }
);

module.exports = mongoose.model("in", InSchema);
