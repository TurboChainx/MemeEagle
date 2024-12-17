const ecc = require("tiny-secp256k1");

try {
  // Test a simple elliptic curve operation
  const privateKey = Buffer.alloc(32, 1); // 32-byte private key
  const publicKey = ecc.pointFromScalar(privateKey);
  console.log("Public Key:", publicKey.toString("hex"));
} catch (error) {
  console.error("tiny-secp256k1 error:", error.message);
}
