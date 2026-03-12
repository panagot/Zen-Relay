// Minimal ZK proof: prove knowledge of private "secret" such that Poseidon(secret) = public "root".
// Same pattern as Zen Relay's ZK membership: private witness (leaf/path), public root, verify in-circuit.
pragma circom 2.0.0;

include "poseidon.circom";

template Preimage() {
  signal input secret;   // private: the preimage
  signal input root;     // public: the hash we claim to know a preimage for
  component poseidon = Poseidon(1);
  poseidon.inputs[0] <== secret;
  root === poseidon.output;
}

component main = Preimage();
