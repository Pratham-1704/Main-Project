const mongoose = require("mongoose");

const FinancialYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Financial year name is required"],
    unique: true,
    trim: true,
    minlength: [4, "Financial year name must be at least 4 characters long"],
    maxlength: [20, "Financial year name must not exceed 20 characters"],
  },
  startdate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  enddate: {
    type: Date,
    required: [true, "End date is required"],
    validate: {
      validator: function (value) {
        return value > this.startdate; // Ensure enddate is after startdate
      },
      message: "End date must be after start date",
    },
  },
});

module.exports = mongoose.model("financialYear", FinancialYearSchema);
