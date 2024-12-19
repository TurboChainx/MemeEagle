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
  return bech32.encode("0x", words);
};

// Function to generate a random Ethereum or Binance wallet
const generateRandomWallet = async () => {
  try {
    // Randomly choose between Ethereum and Binance
    const isEthereum = Math.random() > 0.5;
    const buyer = isEthereum
      ? ethers.Wallet.createRandom().address
      : ethers.Wallet.createRandom().address;

    // Generate a random amount between 33333 and 666660
    // const amount = Math.floor(Math.random() * (666660 - 33333 + 1)) + 33333;
    const amount = Math.floor(Math.random() * (100000 - 33333 + 1)) + 33333;
    // const amount = Math.floor(Math.random() * (1000000 - 33333 + 1)) + 3333300;
    // const amount = 3333200;

    // Save to the database
    const newWallet = new Wallet({
      buyer,
      paymentMethod: isEthereum ? "ETH" : "BNB",
      amount,
    });
    await newWallet.save();

    console.log(
      `Generated Wallet - Address: ${buyer}, paymentMethod: ${
        isEthereum ? "ETH" : "BNB"
      }, Amount: ${amount}`
    );
  } catch (error) {
    console.error("Error generating wallet:", error);
  }
};

// Function to get a random interval between 10 and 15 minutes
const getRandomInterval = () => {
  return Math.floor(Math.random() * (30 - 20 + 1) + 20) * 60 * 1000;
  // return Math.floor(Math.random() * (2 - 1 + 1) + 1) * 10 * 1000;
  // return Math.floor(Math.random() * (39 - 33 + 1) + 33) * 60 * 1000;
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
