# ZK proof demo (Zen Relay)

This folder contains a **minimal ZK proof of knowledge** to show we can implement the same pattern we will use for Zen Relay’s **ZK membership proof** (prove you’re on an allowlist without revealing your address).

## What’s here

- **`docs/ZK-MEMBERSHIP-DESIGN.md`** — Full design: statement to prove, public/private inputs, how it fits Zen Relay’s allowlist and relay.
- **`preimage.circom`** — Minimal Circom 2 circuit: prove knowledge of a private `secret` such that `Poseidon(secret) = root` (public). Same idea as “I know a leaf that hashes to this root.”
- **`merkle_path.circom`** — Merkle path verification circuit (concept): private leaf + path, public root; proves membership without revealing the leaf. This is the pattern for production ZK membership.
- **Verification script** — `verify_preimage.js` uses snarkjs to verify a Groth16 proof (run after building and proving).

## How to run

**Prerequisites:** [Circom 2](https://docs.circom.io/) installed (e.g. `cargo install circom`), Node.js.

```bash
cd zk-demo
npm install
```

**Build and prove (requires Circom):**

```bash
# Compile circuit (add circomlib circuits to include path)
mkdir -p build/preimage
circom preimage.circom -l node_modules/circomlib/circuits --r1cs --wasm -o build/preimage

# Trusted setup (use a small Powers of Tau file from snarkjs; e.g. download pot12_final.ptau)
snarkjs groth16 setup build/preimage/preimage.r1cs ../../pot12_final.ptau build/preimage/preimage_0000.zkey
snarkjs zkey contribute build/preimage/preimage_0000.zkey build/preimage/preimage_final.zkey --name="Zen Relay" -v
snarkjs zkey export verificationkey build/preimage/preimage_final.zkey build/preimage/vkey.json

# Generate witness and proof (example: secret = 12345, root = Poseidon(12345))
node build/preimage/preimage_js/generate_witness.js build/preimage/preimage_js/preimage.wasm input.json build/preimage/witness.wtns
snarkjs groth16 prove build/preimage/preimage_final.zkey build/preimage/witness.wtns build/preimage/proof.json build/preimage/public.json
snarkjs groth16 verify build/preimage/vkey.json build/preimage/public.json build/preimage/proof.json
# Or: node verify_preimage.js build/preimage/proof.json build/preimage/vkey.json
```

(You’ll need an `input.json` with `secret` and `root`, and a Powers of Tau file; see [snarkjs docs](https://github.com/iden3/snarkjs).)

## Integration with Zen Relay

- **Today:** Allowlist join sends (address, Merkle proof) to the relay; relay verifies and sees the address.
- **With ZK (grant deliverable):** Client runs a circuit like `merkle_path.circom` with (leaf = hash(address), path, root); sends only (root, proof). Relay runs `snarkjs.groth16.verify(vkey, [root], proof)` and never sees the address.

Same pattern as this demo; production will use the full Merkle path circuit and the same relay/verification flow.
