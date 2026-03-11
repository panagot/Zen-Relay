import express from 'express';
import cors from 'cors';
import { verifyProof } from './merkle.js';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

const channels = new Map();
const members = new Map();
const messages = new Map();

const RULE_TYPES = ['none', 'allowlist', 'minBalance', 'nft'];

function id() {
  return Math.random().toString(36).slice(2, 12);
}

function parseRule(body) {
  const type = body?.rule?.type;
  if (!type || !RULE_TYPES.includes(type)) return null;
  if (type === 'none') return { type: 'none' };
  if (type === 'allowlist' && body.rule.merkleRoot) {
    return { type: 'allowlist', merkleRoot: String(body.rule.merkleRoot).trim() };
  }
  if (type === 'minBalance' && body.rule.amount != null) {
    const amount = String(body.rule.amount).replace(/,/g, '').trim();
    const token = (body.rule.token || 'ZEN').trim();
    const tokenAddress = body.rule.tokenAddress ? String(body.rule.tokenAddress).trim() : null;
    return { type: 'minBalance', token, amount, tokenAddress };
  }
  if (type === 'nft' && body.rule.collection) {
    return { type: 'nft', collection: String(body.rule.collection).trim() };
  }
  return null;
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

app.post('/api/channels', (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name required' });
  }
  const channelId = id();
  const rule = parseRule(req.body) || { type: 'none' };
  channels.set(channelId, {
    id: channelId,
    name: name.trim().slice(0, 80),
    rule,
    createdAt: Date.now(),
  });
  messages.set(channelId, []);
  members.set(channelId, new Set());
  res.status(201).json(channels.get(channelId));
});

app.get('/api/channels', (_, res) => {
  res.json(Array.from(channels.values()));
});

app.get('/api/channels/:id', (req, res) => {
  const { id: channelId } = req.params;
  if (!channels.has(channelId)) {
    return res.status(404).json({ error: 'channel not found' });
  }
  res.json(channels.get(channelId));
});

app.post('/api/channels/:id/join', (req, res) => {
  const { id: channelId } = req.params;
  const { address, merkleProof } = req.body || {};
  if (!channels.has(channelId)) {
    return res.status(404).json({ error: 'channel not found' });
  }
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'address required' });
  }
  const ch = channels.get(channelId);
  const addr = address.trim().toLowerCase();

  if (ch.rule.type === 'allowlist') {
    if (!ch.rule.merkleRoot) {
      return res.status(400).json({ error: 'channel has allowlist rule but no root' });
    }
    const proof = Array.isArray(merkleProof) ? merkleProof : [];
    if (!verifyProof(addr, proof, ch.rule.merkleRoot)) {
      return res.status(403).json({ error: 'address not in allowlist' });
    }
  }
  if (ch.rule.type === 'minBalance' || ch.rule.type === 'nft') {
  }

  members.get(channelId).add(addr);
  res.json({ joined: true, channelId });
});

app.get('/api/channels/:id/members', (req, res) => {
  const { id: channelId } = req.params;
  if (!channels.has(channelId)) {
    return res.status(404).json({ error: 'channel not found' });
  }
  res.json({ members: Array.from(members.get(channelId)) });
});

app.post('/api/channels/:id/messages', (req, res) => {
  const { id: channelId } = req.params;
  const { ciphertext, senderId } = req.body || {};
  if (!channels.has(channelId)) {
    return res.status(404).json({ error: 'channel not found' });
  }
  if (!ciphertext || typeof ciphertext !== 'string') {
    return res.status(400).json({ error: 'ciphertext required' });
  }
  const list = messages.get(channelId);
  const msg = {
    id: id(),
    channelId,
    ciphertext,
    senderId: senderId || null,
    createdAt: Date.now(),
  };
  list.push(msg);
  res.status(201).json(msg);
});

app.get('/api/channels/:id/messages', (req, res) => {
  const { id: channelId } = req.params;
  if (!channels.has(channelId)) {
    return res.status(404).json({ error: 'channel not found' });
  }
  res.json({ messages: messages.get(channelId) });
});

const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Relay http://localhost:${PORT}`);
  });
}

export default app;
