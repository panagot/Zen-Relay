/**
 * Verify a Groth16 proof for the Preimage circuit (ZK proof of Poseidon preimage).
 * Run after: npm run build:preimage, snarkjs setup, and prove (see README).
 * Usage: node verify_preimage.js [path-to-proof.json] [path-to-vkey.json]
 */
const snarkjs = require('snarkjs');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'build', 'preimage');
const proofPath = process.argv[2] || path.join(dir, 'proof.json');
const vkeyPath = process.argv[3] || path.join(dir, 'vkey.json');

async function main() {
  if (!fs.existsSync(proofPath) || !fs.existsSync(vkeyPath)) {
    console.log('Proof or vkey not found. Run build and prove first (see zk-demo/README.md).');
    console.log('Expected proof:', proofPath);
    console.log('Expected vkey:', vkeyPath);
    process.exit(1);
  }
  const vkey = JSON.parse(fs.readFileSync(vkeyPath, 'utf8'));
  const proofData = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
  const publicSignals = proofData.publicSignals ?? proofData.public_inputs ?? [];
  const proof = proofData.proof ?? proofData;
  const ok = await snarkjs.groth16.verify(vkey, publicSignals, proof);
  console.log(ok ? 'ZK proof verified OK.' : 'Verification failed.');
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
