// ZK Merkle path verification (concept for Zen Relay allowlist membership).
// Prover shows they know (leaf, path) such that MerklePath(leaf, path) = root, without revealing leaf.
// Public: root. Private: leaf, pathElements[], pathIndices[].
// This circuit uses Poseidon for in-circuit hashing (same pattern as production; our JS code uses SHA-256).
pragma circom 2.0.0;

include "poseidon.circom";

template MerklePath(depth) {
  signal input leaf;
  signal input pathElements[depth];
  signal input pathIndices[depth];  // 0 = leaf is left, 1 = leaf is right
  signal input root;

  signal hashes[depth + 1];
  hashes[0] <== leaf;

  component poseidon2[depth];
  for (var i = 0; i < depth; i++) {
    poseidon2[i] = Poseidon(2);
    // left = pathIndex 0 ? current : sibling, right = pathIndex 0 ? sibling : current
    poseidon2[i].inputs[0] <== pathIndices[i] * (pathElements[i] - hashes[i]) + hashes[i];
    poseidon2[i].inputs[1] <== pathIndices[i] * (hashes[i] - pathElements[i]) + pathElements[i];
    hashes[i + 1] <== poseidon2[i].output;
  }

  root === hashes[depth];
}

// 2-level tree (4 leaves) for demo; production would use depth 10–20.
component main = MerklePath(2);
