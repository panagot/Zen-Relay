# Zen Relay

Private channels with end-to-end encryption and access rules (allowlist, min balance, NFT). Messages are encrypted in the browser; the relay never sees keys or plaintext. Built for the **Horizen Genesis Program** (encrypted communication protocols).

---

## For Horizen Genesis reviewers

- **Category:** Anonymous Infrastructure — **encrypted communication protocols**
- **What’s built:** React frontend + Node relay. E2E encryption (AES-GCM in browser); channel access rules: allowlist (Merkle proof verified on relay), min token balance, hold NFT (rules stored; on-chain checks can be added). Invite links carry the decryption key; relay never sees plaintext or keys.
- **ZEN utility (roadmap):** Pay ZEN to create channels or premium features; staking ZEN for relayers; ZEN for premium storage; optional on-chain access rule contract on Horizen with ZEN fee for channel creation.
- **Traction path:** 250+ → 500+ unique wallets; 10K+ → 20K+ transactions (join, send, prove access).
- **Next steps with grant:** Deploy on Horizen testnet/mainnet; add ZK membership proof so relay never sees address; optional Horizen contract for channel creation and access rules; ZEN payments and staking.

---

## Run locally

```bash
npm install
cd relay && npm install && cd ..
cd client && npm install && cd ..
npm run dev
```

- Relay: http://localhost:3001  
- Client: http://localhost:5173 (or next available port)

Open **How to use** in the app for instructions.

## Deploy (Vercel)

Deploy from the **repo root** (no need to set Root Directory). The root `package.json` has `npm run build` which builds the client; `vercel.json` sets `outputDirectory` to `client/dist` and rewrites all routes to `index.html` for the SPA.

1. In Vercel: **Import** the repo.
2. Leave **Root Directory** empty (repo root).
3. **Build Command:** `npm run build` (default)
4. **Output Directory:** overridden by `vercel.json` to `client/dist`.
5. Deploy. The app will load at your Vercel URL.

The relay runs elsewhere (e.g. Railway or Render). API calls to `/api/*` will 404 until you host the relay and set the client’s `VITE_API_URL` to that URL.

---

## Submission & funding (Genesis)

**Suggested ask:** **$10,000** (or the program’s ZEN equivalent, e.g. mid-tier if they use tiers) is a strong choice. It’s enough to show seriousness and fund 4–6 months of focused work (Horizen deployment, ZK membership proof, on-chain rules, ZEN utility) without looking oversized for a net-new app. With ~15% acceptance, a working prototype + clear milestones + a realistic ask improves your odds.

**How to frame it in the form:**
- **Use of funds:** Horizen testnet/mainnet deployment; ZK circuit + integration so the relay never sees member addresses; optional Horizen contract for channel creation (ZEN fee) and access rules; ZEN payments for channel creation and premium features; documentation and security review.
- **Milestones:** M1 — Deploy relay + client on Horizen testnet, wallet connect. M2 — ZK membership proof, 250+ wallets or 10K+ tx. M3 — Mainnet, ZEN utility (pay to create channel, staking for relayers), 500+ wallets or 20K+ tx.
- **Why this amount:** Enables one builder to reach mainnet and traction milestones without overreaching; aligns with program’s encrypted-communication focus and ZEN utility goals.

## License

MIT
