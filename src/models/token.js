const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: Array,
      default: [],
      require: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema)