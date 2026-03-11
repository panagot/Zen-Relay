import crypto from 'crypto';

function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function hashPair(a, b) {
  const [left, right] = Buffer.from(a, 'hex') < Buffer.from(b, 'hex') ? [a, b] : [b, a];
  return hash(left + right);
}

export function verifyProof(leaf, proof, root) {
  let node = hash(leaf.toLowerCase().trim());
  for (const sibling of proof) {
    if (typeof sibling !== 'string') continue;
    node = hashPair(node, sibling);
  }
  return node === root;
}

export function merkleRoot(leaves) {
  if (leaves.length === 0) return null;
  const hashed = leaves.map((a) => hash(a.toLowerCase().trim())).filter(Boolean);
  if (hashed.length === 0) return null;
  let layer = hashed;
  while (layer.length > 1) {
    const next = [];
    for (let i = 0; i < layer.length; i += 2) {
      if (i + 1 < layer.length) {
        next.push(hashPair(layer[i], layer[i + 1]));
      } else {
        next.push(layer[i]);
      }
    }
    layer = next;
  }
  return layer[0];
}

export function getProof(leaves, leaf) {
  const normalized = leaves.map((a) => a.toLowerCase().trim());
  const target = leaf.toLowerCase().trim();
  const idx = normalized.indexOf(target);
  if (idx === -1) return null;
  let layer = normalized.map((a) => hash(a));
  const proof = [];
  let index = idx;
  while (layer.length > 1) {
    const next = [];
    const isRight = index % 2 === 1;
    const siblingIdx = isRight ? index - 1 : index + 1;
    if (siblingIdx >= 0 && siblingIdx < layer.length) {
      proof.push(layer[siblingIdx]);
    }
    for (let i = 0; i < layer.length; i += 2) {
      if (i + 1 < layer.length) {
        next.push(hashPair(layer[i], layer[i + 1]));
      } else {
        next.push(layer[i]);
      }
    }
    layer = next;
    index = Math.floor(index / 2);
  }
  return proof;
}
