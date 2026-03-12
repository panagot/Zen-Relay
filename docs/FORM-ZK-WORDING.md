# ZK proof and team experience

## Describe your team's experience with privacy technologies and cryptography (with GitHub links)

Our experience is demonstrated in the Zen Relay repo: E2E encryption (AES-GCM in the browser, keys only in the client), Merkle allowlist with proof generation and verification (client and relay), and a ZK membership design plus minimal circuits in the repo. **GitHub:** https://github.com/panagot/Zen-Relay

We added a design doc and a runnable ZK demo in the same repo: https://github.com/panagot/Zen-Relay/blob/main/docs/ZK-MEMBERSHIP-DESIGN.md (statement to prove, public/private inputs, integration with the relay) and https://github.com/panagot/Zen-Relay/tree/main/zk-demo (Circom 2 circuits: Poseidon preimage proof and Merkle path membership, plus a Node script that verifies proofs with snarkjs). This shows we can implement the same pattern for production so the relay verifies membership without ever seeing the member’s address. We will extend this into the full join flow and document it under the grant.

---

## How will your project leverage privacy-preserving technology (ZK, TEE, FHE, MPC)?

We use E2E encryption today (AES-GCM in the browser; relay never sees keys or plaintext). With the grant we add **ZK membership proof**: users prove they satisfy the channel’s access rule (e.g. allowlist) without revealing their address to the relay. We have already designed the circuit and added a minimal demo in the repo: see docs/ZK-MEMBERSHIP-DESIGN.md and zk-demo/ at https://github.com/panagot/Zen-Relay (Circom 2 + snarkjs). We will implement the full Merkle-path circuit and integrate it into the join flow; verification will run on the relay (and optionally on-chain). We do not rely on Horizen Labs providing ZK infra by a specific date; we implement it ourselves or with standard tooling (Circom/snarkjs).

---

## Describe your technical architecture and privacy implementation approach

For ZK membership we have a written design and a minimal demo in the repo: docs/ZK-MEMBERSHIP-DESIGN.md (statement, inputs, how it fits the allowlist) and **zk-demo/** (Circom 2 preimage and Merkle path circuits, snarkjs verification). Production will use the same pattern: client proves “I know a leaf and path that verify to this root” and sends only (root, proof); the relay verifies the proof and never sees the address.

---

## How will you measure and demonstrate privacy preservation in your application?

For ZK membership we document the design (docs/ZK-MEMBERSHIP-DESIGN.md) and provide a minimal circuit and verification script (zk-demo/). Once integrated, we will demonstrate that the relay receives and verifies only (channelId, root, proof) and never sees member addresses; we will publish the circuit and verification flow and seek a security/privacy review where possible.

---

## If implementing ZK Proofs, which type will you be using?

ZK-SNARKs (Groth16 via snarkjs) for membership proof: the user proves “I know a leaf and Merkle path that verify to this root” without revealing the leaf. We use Circom 2 for the circuit and snarkjs for proof generation and verification. A minimal circuit and verification script are in the repo (zk-demo/); production will use the same tooling with the full Merkle path circuit.
