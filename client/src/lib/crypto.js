const ALG = 'AES-GCM';
const IV_LEN = 12;
const KEY_LEN = 256;

export async function generateChannelKey() {
  return crypto.subtle.generateKey(
    { name: ALG, length: KEY_LEN },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function exportKey(key) {
  const buf = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function importKey(rawBase64) {
  const bin = atob(rawBase64.replace(/-/g, '+').replace(/_/g, '/'));
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return crypto.subtle.importKey('raw', buf, { name: ALG, length: KEY_LEN }, true, ['encrypt', 'decrypt']);
}

export async function encrypt(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const enc = await crypto.subtle.encrypt(
    { name: ALG, iv, tagLength: 128 },
    key,
    new TextEncoder().encode(plaintext)
  );
  const combined = new Uint8Array(iv.length + enc.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(enc), iv.length);
  return btoa(String.fromCharCode(...combined)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function decrypt(key, ciphertextBase64) {
  const raw = ciphertextBase64.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(raw);
  const combined = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) combined[i] = bin.charCodeAt(i);
  const iv = combined.slice(0, IV_LEN);
  const data = combined.slice(IV_LEN);
  const dec = await crypto.subtle.decrypt(
    { name: ALG, iv, tagLength: 128 },
    key,
    data
  );
  return new TextDecoder().decode(dec);
}
