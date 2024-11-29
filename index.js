const ethers = require("ethers");
const { generateAddress } = require("binance-address");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const Wallet = require("./walletModel");
const connectDB = require("./config/db");

dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB

// Function to generate random Ethereum or Binance wallet
const generateRandomWallet = async () => {
  try {
    // Decide randomly between Ethereum and Binance
    const isEthereum = Math.random() > 0.5;
    const walletAddress = isEthereum
      ? ethers.Wallet.createRandom().address
      : generateAddress();

    // Random amount between 8000 and 100000
    const amount = Math.floor(Math.random() * (100000 - 8000 + 1)) + 8000;

    // Save to database
    const newWallet = new Wallet({
      walletAddress,
      currency: isEthereum ? "Ethereum" : "BNB",
      amount,
    });
    await newWallet.save();

    console.log(
      `Generated Wallet - Address: ${walletAddress}, Currency: ${
        isEthereum ? "Ethereum" : "BNB"
      }, Amount: ${amount}`
    );
  } catch (error) {
    console.error("Error generating wallet:", error);
  }
};

// Set an interval between 10 and 15 minutes
const getRandomInterval = () => {
  return Math.floor(Math.random() * (15 - 10 + 1) + 10) * 60 * 1000;
};

// Schedule the wallet generation process
const scheduleWalletGeneration = () => {
  const interval = getRandomInterval();
  console.log(`Next wallet generation in ${interval / 60000} minutes.`);
  setTimeout(async () => {
    await generateRandomWallet();
    scheduleWalletGeneration(); // Schedule the next wallet generation
  }, interval);
};

// Start the process
scheduleWalletGeneration();