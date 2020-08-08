const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    token: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;
