# Zen Relay

Private channels with end-to-end encryption and access rules (allowlist, min balance, NFT). Messages are encrypted in the browser; the relay never sees keys or plaintext. Built for the **Horizen Genesis Program** (encrypted communication protocols).

---

## Summary

- **Category:** Anonymous Infrastructure — **encrypted communication protocols**
- **What’s built:** React frontend + Node relay. E2E encryption (AES-GCM in browser); channel access rules: allowlist (Merkle proof verified on relay), min token balance, hold NFT (rules stored; on-chain checks can be added). Invite links carry the decryption key; relay never sees plaintext or keys.
- **ZEN utility (roadmap):** Pay ZEN to create channels or premium features; staking ZEN for relayers; ZEN for premium storage; optional on-chain access rule contract on Horizen with ZEN fee for channel creation.
- **Traction path:** 250+ → 500+ unique wallets; 10K+ → 20K+ transactions (join, send, prove access).
- **Next steps with grant:** Deploy on Horizen testnet/mainnet; add ZK membership proof so relay never sees address; optional Horizen contract for channel creation and access rules; ZEN payments and staking.
- **ZK proof:** Design doc and minimal ZK demo in the repo: **[docs/ZK-MEMBERSHIP-DESIGN.md](docs/ZK-MEMBERSHIP-DESIGN.md)** (statement, public/private inputs, integration with Zen Relay) and **[zk-demo/](zk-demo/)** (Circom 2 circuits: preimage proof + Merkle path membership, plus snarkjs verification script). This shows we can implement the same pattern for production (relay verifies proof without seeing member address).

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

## Deploy (Vercel) — frontend + API in one project

Deploy from the **repo root**. One Vercel project serves both the static client and the relay API:

- **Build:** `npm run build` produces `client/dist` (frontend).
- **API:** The `api/` folder is deployed as Vercel Serverless Functions. A catch-all `api/[[...path]].js` forwards all `/api/*` requests to the same Express logic as the local relay, so **Create channel**, **Join**, and **Messages** work without a separate backend.

1. In Vercel: **Import** the repo.
2. Leave **Root Directory** empty (repo root).
3. **Build Command:** `npm run build` (default).
4. **Output Directory:** overridden by `vercel.json` to `client/dist`.
5. Deploy. The app and API will be live at the project's Vercel URL. No need to set `VITE_API_URL` — the client uses the same origin for `/api/*`.

**Note:** The serverless API uses in-memory state (same as the local relay). Data can persist for a while on a warm instance but is not guaranteed across cold starts or regions. For production persistence, add a store (e.g. Vercel KV, Upstash Redis) later. For demos and testing, the all-on-Vercel setup is enough.

**Optional — external relay:** If you later host the relay elsewhere (e.g. Railway), set `VITE_API_URL` in Vercel to that URL and redeploy so the client talks to the external API instead.

---

## Submission & funding (Genesis)

**Ask:** **$20,000** total, disbursed per program: **10%** at approval (application requirements), **20%** at M1 (45 days), **30%** at M2 (90 days), **40%** at M3 (150 days). See **Application summary** below.

---

## Application summary

**Project name:**  
Zen Relay

**Tagline / one-liner:**  
Private channels with end-to-end encryption and access rules (allowlist, min balance, NFT). Messages are encrypted in the browser; the relay never sees keys or plaintext.

**Category:**  
Anonymous Infrastructure — **encrypted communication protocols**

**Project description:**  
Zen Relay is a net-new encrypted group-messaging app for Horizen: users create private channels, set who can join (allowlist via Merkle proof, min token balance, or hold NFT), and share an invite link that carries the decryption key. Messages are E2E encrypted in the browser; the server only stores ciphertext. We have a working prototype: React frontend, Node relay, E2E (AES-GCM), allowlist with Merkle verification, and rule types for min balance and NFT (stored for display; on-chain checks can be added). With the grant we will deploy on Horizen testnet/mainnet, add real wallet connect (e.g. MetaMask), implement ZK membership proof so the relay never sees member addresses, add ZEN utility (pay ZEN to create channels, staking for relayers), and hit program traction targets (250+ then 500+ wallets, or 10K+ then 20K+ tx, or TVL in ZEN).

**Funding amount:**  
$20,000 (disbursed per program: 10% at approval, 20% / 30% / 40% at M1 / M2 / M3)

**Use of funds:**  
Horizen testnet/mainnet deployment and hosting; ZK circuit and integration; Horizen contract for channel creation (ZEN fee) and access rules; ZEN payments and relayer staking; documentation, compliance docs, and security review; runway through 150 days to hit M3 scale metrics.

**Milestones (program structure — 150 days total):**  

- **Application requirements (10% unlocked at approval):** Technical architecture with privacy implementation (E2E + ZK/Merkle); ZK/TEE integration for membership proof and optional relay; privacy-focused UX (keys in client, relay sees only ciphertext); ZEN utility (channel creation fee, relayer staking); team background in crypto/privacy.  

- **Milestone 1 (20%) – 45 days:** Smart contract(s) on Horizen testnet (channel registry, access rules, optional ZEN fee); core privacy mechanisms (E2E, Merkle/ZK membership) implemented and documented; technical docs and privacy proofs published; beta testing with verification and feedback.  

- **Milestone 2 (30%) – 90 days:** Mainnet deployment with full privacy feature set; privacy compliance documentation and audit reports; integration with Horizen ecosystem; **early traction — one of:** TVL $50K+ ZEN (e.g. staking for relayers), **or** 10,000+ transactions, **or** 250+ unique wallets.  

- **Milestone 3 (40%) – 150 days:** **Scale — one of:** TVL $100K+ ZEN, **or** 20,000+ transactions, **or** 500+ unique wallets utilizing privacy features.

**Why Horizen:**  
Zen Relay fits “encrypted communication protocols” on a privacy-first chain. Horizen’s EVM L3 and compliance layer allow us to build private coordination for DAOs and communities with optional on-chain access rules and ZEN payments, while keeping message content and membership proofs confidential.

**Live demo:**  
https://zen-relay.vercel.app/

**Repository:**  
https://github.com/panagot/Zen-Relay

**ZK proof:** Design and minimal demo in repo: [docs/ZK-MEMBERSHIP-DESIGN.md](docs/ZK-MEMBERSHIP-DESIGN.md) (statement, inputs, integration) and [zk-demo/](zk-demo/) (Circom 2 preimage + Merkle path circuits, snarkjs verification). Same pattern will be used for production (relay verifies proof without seeing address).

**ZEN utility:**  
Pay ZEN to create channels or premium features; staking ZEN for relayers; ZEN for premium storage; optional on-chain channel creation fee. Drives demand for ZEN and aligns with Horizen’s privacy and infrastructure goals.

---

## License

MIT
