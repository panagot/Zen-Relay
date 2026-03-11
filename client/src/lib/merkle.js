async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function compareHex(a, b) {
  if (a.length !== b.length) return a.length < b.length ? -1 : 1;
  for (let i = 0; i < a.length; i++) {
    const x = parseInt(a.slice(i, i + 2), 16);
    const y = parseInt(b.slice(i, i + 2), 16);
    if (x !== y) return x - y;
  }
  return 0;
}

async function hashPair(a, b) {
  const [left, right] = compareHex(a, b) <= 0 ? [a, b] : [b, a];
  return sha256Hex(left + right);
}

export async function merkleRoot(leaves) {
  if (!leaves || leaves.length === 0) return null;
  const hashed = await Promise.all(
    leaves.map((a) => sha256Hex((a || '').toLowerCase().trim()).then((h) => h))
  );
  const filtered = hashed.filter(Boolean);
  if (filtered.length === 0) return null;
  let layer = [...filtered];
  while (layer.length > 1) {
    const next = [];
    for (let i = 0; i < layer.length; i += 2) {
      if (i + 1 < layer.length) {
        next.push(await hashPair(layer[i], layer[i + 1]));
      } else {
        next.push(layer[i]);
      }
    }
    layer = next;
  }
  return layer[0];
}

export async function getProof(leaves, leaf) {
  const normalized = leaves.map((a) => (a || '').toLowerCase().trim());
  const target = (leaf || '').toLowerCase().trim();
  const idx = normalized.indexOf(target);
  if (idx === -1) return null;
  let layer = await Promise.all(normalized.map((a) => sha256Hex(a)));
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
        next.push(await hashPair(layer[i], layer[i + 1]));
      } else {
        next.push(layer[i]);
      }
    }
    layer = next;
    index = Math.floor(index / 2);
  }
  return proof;
}
