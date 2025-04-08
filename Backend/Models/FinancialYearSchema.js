const mongoose = require("mongoose");

const financialYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const FinancialYear = mongoose.model("FinancialYear", financialYearSchema);

module.exports = FinancialYear;
