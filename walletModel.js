const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  buyer: { type: String, required: true },
  paymentMethod: { type: String, enum: ["ETH", "BNB"], required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Wallet", WalletSchema);
