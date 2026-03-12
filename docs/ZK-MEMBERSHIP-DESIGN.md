# ZK membership proof design (Zen Relay)

This document describes the zero-knowledge membership proof used so that **the relay never sees member addresses**: a user proves they are on a channel’s allowlist without revealing their address or the list.

---

## Goal

- **Today:** For allowlist channels, the client sends (address, Merkle proof) to the relay; the relay verifies the proof and learns the address.
- **With ZK:** The client sends a ZK proof that “I know an address and a Merkle path that verify to this channel’s root.” The relay only sees (channelId, root, proof) and verifies the proof; it never sees the address.

---

## Statement to prove

**Private inputs (witness):**

- `leaf` — the member’s address (or its hash, depending on tree construction).
- `pathElements[]` — sibling hashes along the Merkle path.
- `pathIndices[]` — left/right bits (0 = leaf/sibling order: left then right, 1 = right then left).

**Public inputs:**

- `root` — the channel’s allowlist Merkle root (already stored on the relay).
- Optionally `channelId` or a nonce to bind the proof to one channel / one use.

**Relation:**

- Compute Merkle path verification: start from `leaf`, hash with `pathElements[i]` according to `pathIndices[i]` at each level, and check that the final hash equals `root`.
- The circuit constrains this computation; the proof attests that the prover knows a valid (leaf, path) for the public `root`.

This matches the existing logic in `client/src/lib/merkle.js` (proof generation) and `relay/merkle.js` (verification), but the verification is done inside a ZK circuit so the leaf and path stay hidden.

---

## Circuit and tooling

- **Circuit:** Written in **Circom 2** (e.g. Poseidon-based Merkle path so constraint count and performance are practical). Same hash ordering and path format as the current JS Merkle code so we can reuse allowlist trees.
- **Proof system:** **Groth16** (via snarkjs) for small proofs and fast verification. Verification can run in Node on the relay or in a Horizen contract if we want on-chain checks.
- **Flow:** Client builds (leaf, path) from the allowlist as today; instead of sending them to the relay, the client runs a WASM prover (e.g. snarkjs in the browser or a small Node helper) and sends only (root, proof). Relay runs `snarkjs.groth16.verify(vkey, publicSignals, proof)` and allows join if valid.

---

## Privacy and security

- **Privacy:** The relay and any observer see only (root, proof). The address and path are never sent.
- **Binding:** Public inputs include the channel’s root (and optionally channelId/nonce) so the proof cannot be reused for another channel or replayed.
- **Consistency:** The same allowlist and Merkle tree logic used today (SHA-256 in JS) can be mirrored in the circuit; for Circom we may use Poseidon in the circuit and keep the same tree structure (only the hash function in the circuit differs for efficiency).

---

## Integration with Zen Relay

1. **Create channel (allowlist):** Unchanged — creator pastes addresses, client computes Merkle root, relay stores (channelId, root, ruleType).
2. **Join (with ZK):** Client has the invite link (key) and the allowlist. It computes leaf = hash(address), path from our existing `getProof(leaves, address)`. It runs the ZK prover with (leaf, path, root) and sends (channelId, root, proof) to the relay. Relay verifies the proof; if valid, it grants access without ever seeing the address.
3. **Relay:** No change to how messages are stored or encrypted; only the join flow uses ZK instead of sending (address, path).

---

## References in this repo

- Merkle implementation (current, non-ZK): `client/src/lib/merkle.js`, `relay/merkle.js`.
- Minimal ZK demo (circuit + verification): `zk-demo/` — shows the same pattern (private witness, public root, verify) and will be extended to the full Merkle path for production.

This design is what we will implement and document under the Genesis grant (M1: core privacy mechanisms; technical docs and privacy proofs).
