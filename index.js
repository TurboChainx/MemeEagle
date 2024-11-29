const ethers = require("ethers");
const bip32 = require("bip32");
const { randomBytes } = require("crypto");
const { bech32 } = require("bech32");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const Wallet = require("./walletModel");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();
connectDB(); // Connect to MongoDB

// Function to generate a Binance-compatible wallet address
const generateBinanceAddress = () => {
  const seed = randomBytes(32); // Generate random seed
  const root = bip32.fromSeed(seed); // Create BIP32 key pair
  const publicKey = root.publicKey;

  // Convert public key to BECH32 format (Binance-compatible)
  const words = bech32.toWords(publicKey);
  return bech32.encode("bnb", words);
};

// Function to generate a random Ethereum or Binance wallet
const generateRandomWallet = async () => {
  try {
    // Randomly choose between Ethereum and Binance
    const isEthereum = Math.random() > 0.5;
    const walletAddress = isEthereum
      ? ethers.Wallet.createRandom().address
      : generateBinanceAddress();

    // Generate a random amount between 8000 and 100000
    const amount = Math.floor(Math.random() * (100000 - 8000 + 1)) + 8000;

    // Save to the database
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

// Function to get a random interval between 10 and 15 minutes
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
