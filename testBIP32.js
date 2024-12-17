const bip32 = require("bip32");

console.log("bip32 exports:", bip32);

const { randomBytes } = require("crypto");
const seed = randomBytes(32);

try {
  const root = bip32.fromSeed(seed);
  console.log("Public Key:", root.publicKey.toString("hex"));
} catch (error) {
  console.error("Error:", error.message);
}
