const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  currency: { type: String, enum: ["Ethereum", "BNB"], required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Wallet", WalletSchema);
