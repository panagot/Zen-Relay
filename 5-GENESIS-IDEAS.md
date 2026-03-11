# 10 Genesis Program Ideas — Net-New Privacy-First Apps for Horizen

*Tailored to Horizen’s EVM L3, TEE, Private Execution Layer, ZEN, and the four program categories. Ideas 1–5 plus five more (6–10). **We are not pursuing gaming** — Idea 4 is out of scope. Pick one of the others to develop into the main application.*

---

## Where we fit: program “What We’re Looking For”

The program names **four categories** and specific sub-bullets. Here’s how each idea maps to that exact wording.

| Program category | Program sub-bullets | Our idea(s) that fit |
|------------------|---------------------|----------------------|
| **Confidential DeFi** | **Hidden order book DEXs**, **private lending protocols**, **confidential yield farming** | **Idea 6** — hidden order book; **Idea 2** — private lending; **Idea 7** — confidential yield |
| **Privacy-Preserving AI** | Decentralized AI training with encrypted data, verifiable ML inference, confidential data marketplaces | **Idea 8** — verifiable ML inference; **Idea 9** — confidential data marketplace’. (Ideas 8 and 9 fill this category.) |
| **ZK Gaming** | **Games with verifiable randomness**, **private gaming economies**, **confidential player data** | *Out of scope — we are not making a game (Idea 4 skipped).* |
| **Anonymous Infrastructure** | **Private voting systems**, **confidential identity solutions**, **encrypted communication protocols** | **Idea 3** — voting; **Idea 1** — identity (credentials); **Idea 5** — identity (attestation); **Idea 10** — encrypted communication |

**One-line fit for applications:**

- **Idea 1 (Freelancer reputation):** *Anonymous Infrastructure — **confidential identity solutions*** (ZK credentials for work/ratings).
- **Idea 2 (Micro-lending):** *Confidential DeFi — **private lending protocols*** (private credit scoring + lending).
- **Idea 3 (Private voting):** *Anonymous Infrastructure — **private voting systems*** (ZK eligibility + encrypted tally).
- **Idea 4 (ZK gaming):** *Out of scope — we are not making a game.*
- **Idea 5 (Verified content):** *Anonymous Infrastructure — **confidential identity solutions** and **encrypted communication protocols*** (verified content attestation without revealing content or verifier).
- **Idea 6 (Hidden order book DEX):** *Confidential DeFi — **hidden order book DEXs***.
- **Idea 7 (Confidential yield):** *Confidential DeFi — **confidential yield farming***.
- **Idea 8 (Verifiable ML inference):** *Privacy-Preserving AI — **verifiable ML inference***.
- **Idea 9 (Confidential data marketplace):** *Privacy-Preserving AI — **confidential data marketplaces***.
- **Idea 10 (Private messaging / access):** *Anonymous Infrastructure — **encrypted communication protocols***.

Use the row for your chosen idea when filling the form so reviewers see the exact match to “What We’re Looking For.”

---

## Overlap with existing project: ZK proof (proof-of-human gateway)

The **ZK proof** project (`ZK proof/` in this workspace) is also a **confidential identity solution**: users get an anonymous credential (e.g. after phone/email verification), then prove they hold it via a ZK proof (e.g. to zkVerify). Partners get "verified" with no PII. Its roadmap includes proof-of-human, age/eligibility, **private voting**, and proof-of-knowledge.

**Implications for Genesis:**

| Our idea | Relation to ZK proof |
|----------|----------------------|
| **Idea 1** (Freelancer reputation) | Same pattern (credential + ZK proof), different domain (work/ratings vs proof-of-human). Distinct product; same "confidential identity" category. |
| **Idea 3** (Private voting) | **Direct overlap** — ZK proof roadmap already includes "Private voting / polling" (eligibility credential + ZK per vote). |
| **Idea 5** (Verified content) | Different (content attestation vs human verification) but still verification/identity; some design overlap. |
| **Idea 10** (Private messaging / access) | Focus is encrypted comms + access; identity is secondary. Less overlap. |

**If you apply under "confidential identity solutions":** You could position a Genesis app as a **Horizen-native** credential/verification layer (e.g. port or extend the ZK proof pattern to Horizen L3 and ZEN). Alternatively, to **differentiate**, prefer **Confidential DeFi** (2, 6, 7) or **Privacy-Preserving AI** (8, 9), which do not overlap with the ZK proof project. (We are not pursuing ZK Gaming / Idea 4.)

---

## 1. ZK-Verified Private Reputation for Freelancers (Anonymous Infrastructure)

**One-line:** A net-new platform on Horizen where freelancers earn ZK-backed credentials (jobs completed, ratings, skills) without revealing client names, pay, or history; employers verify “eligible” or “tier” privately.

**Category:** Anonymous Infrastructure — confidential identity solutions.

**Privacy tech:** ZK proofs (e.g. Circom/snarkjs or existing circuits) that attest “I have N completed jobs and rating ≥ R” or “I hold credential C” without revealing underlying data. Optional: TEE for credential issuance so the platform never sees raw history in plaintext.

**ZEN utility:** Fees in ZEN for credential issuance or verification; staking ZEN for dispute resolvers or for “verified freelancer” badge; premium features (e.g. featured profile) paid in ZEN.

**Why Horizen:** Fits “confidential identity” and “anonymous infrastructure”; Horizen’s compliance layer (auditable decryption) could later support regulator access to disputed credentials only when authorized.

**Traction path:** Target **250+ → 500+ unique wallets** (freelancers + employers) and **10K+ → 20K+ transactions** (credential checks, issuances). No need for TVL unless you add staking pools.

**Build:** Smart contracts on Horizen L3 for credential commitments and verification; off-chain or TEE-based issuance; frontend (web/mobile) with wallet connect.

---

## 2. Confidential Micro-Lending with Private Credit Scoring (Confidential DeFi)

**One-line:** A new lending protocol on Horizen where borrowers prove creditworthiness (e.g. off-chain score, repayment history) via ZK or TEE so lenders see only “eligible” / “rate tier” and loan size bands, not raw data.

**Category:** Confidential DeFi — private lending protocols.

**Privacy tech:** ZK proofs that “my credit score is in range X” or “I have repaid N loans”; or TEE-based computation that consumes encrypted credit data and outputs only eligibility and risk tier. Loan amounts and terms can be hidden (hidden order book style) until match.

**ZEN utility:** Collateral or liquidity in ZEN; fees in ZEN; staking ZEN for underwriters or insurance pool; governance (e.g. risk parameters) with ZEN.

**Why Horizen:** Direct fit for “private lending”; Horizen’s compliant decryption could allow auditors/regulators to verify portfolio quality without exposing individual borrowers.

**Traction path:** **TVL $50K+ → $100K+ ZEN** in lending pools or collateral; or **10K+ → 20K+ transactions** (applications, repayments, liquidations). Unique wallets 250+ → 500+ as secondary metric.

**Build:** Solidity lending contracts on Horizen L3; ZK circuit or TEE service for credit proof; oracle or attestation for off-chain data; UI for borrowers/lenders.

---

## 3. Private Voting / Governance with ZK Eligibility (Anonymous Infrastructure)

**One-line:** A net-new voting and survey product on Horizen: voters prove eligibility (e.g. token holder, member of a list) via ZK; votes are encrypted and tallied without revealing individual choices; results are verifiable.

**Category:** Anonymous Infrastructure — private voting systems.

**Privacy tech:** ZK proofs of eligibility (e.g. “I own ≥ N tokens” or “I am in the allowlist” without revealing identity or balance); encrypted votes (e.g. homomorphic tally or commit-reveal with ZK); optional TEE for tally to avoid trust in a single party.

**ZEN utility:** Create polls or governance proposals by locking/paying ZEN; voting weight derived from ZEN balance (privately); or ZEN for premium features (e.g. custom polls, analytics).

**Why Horizen:** “Private voting” is an explicit category; Horizen’s auditable decryption could support court-ordered disclosure of a specific vote in extreme cases while keeping the rest private.

**Traction path:** **10K+ → 20K+ transactions** (votes, registrations) or **250+ → 500+ unique wallets** participating. TVL optional if you add ZEN lock for proposal creation.

**Build:** Smart contracts for proposals, eligibility commitments, and tally; ZK circuits for eligibility and optionally for correct tally; frontend for DAOs, communities, or surveys.

---

## 4. ZK Gaming: Verifiable Randomness + Private Inventory (ZK Gaming) — *Out of scope (we are not making a game)*

**One-line:** A new game deployed on Horizen where (a) loot, matchmaking, or outcomes use verifiable randomness (VRF or ZK-proof of fair RNG), and (b) player inventory and balances are confidential (ZK or encrypted state); optional PvP or marketplace with private bids.

**Category:** ZK Gaming — verifiable randomness, private gaming economies, confidential player data.

**Privacy tech:** Verifiable randomness (e.g. VRF on Horizen or commit–reveal with ZK); ZK proofs for “I have item X” or “my balance is in range” without revealing full inventory; encrypted or hashed state for sensitive player data.

**ZEN utility:** In-game currency or entry fees in ZEN; NFT mints or marketplace fees in ZEN; staking ZEN for rewards or for “premium” access; governance (e.g. game parameters) with ZEN.

**Why Horizen:** Matches “ZK Gaming” and “confidential player data”; EVM makes it easy to integrate with existing game engines or web frontends; TEE could later be used for anti-cheat or fairness attestation.

**Traction path:** **250+ → 500+ unique wallets** and **10K+ → 20K+ transactions** (game actions, mints, trades). TVL if you add ZEN staking or liquidity for in-game assets.

**Build:** Solidity contracts for items, randomness, and marketplace; ZK circuits for privacy and fairness; web or mobile client; optional integration with LayerZero for cross-chain assets later.

---

## 5. Confidential “Verified Content” Attestation (Anonymous Infrastructure)

**One-line:** A net-new app on Horizen where users get a ZK-backed attestation that a piece of content (image, document, or hash) was “verified” (e.g. from a real source, not modified, or meets a policy) without revealing the content or the verifier’s identity.

**Category:** Anonymous Infrastructure — confidential identity / verification solutions.

**Privacy tech:** ZK proofs that “I hold a valid attestation for hash H” or “this content meets policy P”; attestations issued in TEE or by a decentralized set of signers so the platform never sees raw content. Content hashes or commitments on-chain; full data off-chain or in encrypted storage.

**ZEN utility:** Pay ZEN per attestation or per verification; staking ZEN for attestation signers (reputation); ZEN for premium tiers (e.g. batch verification, API access); optional marketplace for “verified” content licenses in ZEN.

**Why Horizen:** Fits “confidential identity” and “encrypted communication protocols” (verified but private); aligns with Obscura-style “verifiable reputation” and AdPriva-style “proof without tracking”; Horizen’s compliance layer could allow lawful disclosure of who attested what, if ever required.

**Traction path:** **250+ → 500+ unique wallets** (creators, verifiers, consumers) and **10K+ → 20K+ transactions** (attestations, checks). TVL if you add ZEN staking for signers or liquidity for a content marketplace.

**Build:** Smart contracts for attestation registry and verification; ZK circuits for “valid attestation for H”; TEE or multi-party signers for issuance; frontend and API for integrators (e.g. marketplaces, social apps).

---

## 6. Hidden Order Book DEX (Confidential DeFi)

**One-line:** A net-new DEX on Horizen where the order book is hidden: orders and sizes are encrypted or committed (ZK/TEE); matching runs confidentially; only executed trades (and optionally aggregate stats) are revealed.

**Category:** Confidential DeFi — hidden order book DEXs.

**Privacy tech:** Commitments or encryption for order price/size; ZK proofs or TEE-based matching engine that never exposes the full book; settlement on Horizen L3.

**ZEN utility:** Trading pairs with ZEN; fees in ZEN; liquidity incentives or staking in ZEN; governance with ZEN.

**Why Horizen:** Direct fit for "hidden order book DEXs"; differentiator vs ZENDEX, Stratos by hiding flow and strategy.

**Traction path:** TVL $50K+ → $100K+ ZEN and/or 10K+ → 20K+ transactions; 250+ → 500+ wallets.

**Build:** Solidity for settlement and vaults; off-chain or TEE order book and matching; frontend + API for traders/bots.

---

## 7. Confidential Yield Farming (Confidential DeFi)

**One-line:** A net-new yield product on Horizen where staking or LP positions are private: users prove "I have yield tier X" or "I am in pool P" without revealing position size; rewards verified via ZK or TEE.

**Category:** Confidential DeFi — confidential yield farming.

**Privacy tech:** ZK proofs of position eligibility or yield tier; encrypted or committed balances; TEE for reward computation; optional private autocompound.

**ZEN utility:** Stake ZEN or provide ZEN in LPs; rewards in ZEN; fee share and governance with ZEN.

**Why Horizen:** Fits "confidential yield farming"; complements ZENDEX with privacy for yield strategies.

**Traction path:** TVL $50K+ → $100K+ ZEN; 250+ → 500+ wallets; or 10K+ → 20K+ tx (deposit/claim/compound).

**Build:** Solidity for pools and rewards; ZK or TEE for private position and reward logic; frontend for depositors.

---

## 8. Verifiable ML Inference (Privacy-Preserving AI)

**One-line:** A net-new platform on Horizen where users get ML predictions without sending raw data: inference runs in TEE or is verified with ZK so correctness can be checked without exposing model or input.

**Category:** Privacy-Preserving AI — verifiable ML inference.

**Privacy tech:** TEE for confidential inference (model + input inside enclave); or ZK proofs that inference was computed correctly given commitments to input and output.

**ZEN utility:** Pay ZEN per inference or subscription; staking ZEN for model providers; ZEN for premium models or SLA.

**Why Horizen:** Fills "verifiable ML inference"; Horizen TEE and future HCCE align with confidential compute.

**Traction path:** 250+ → 500+ wallets and 10K+ → 20K+ transactions (inference requests, attestations).

**Build:** TEE service or ZK circuit for inference verification; smart contracts for payment and attestation on Horizen; API and frontend.

---

## 9. Confidential Data Marketplace (Privacy-Preserving AI)

**One-line:** A net-new marketplace on Horizen where data buyers and sellers transact without exposing full datasets: ZK proofs of data quality, schema, or compliance; payments on-chain; data transfer off-chain or encrypted.

**Category:** Privacy-Preserving AI — confidential data marketplaces.

**Privacy tech:** ZK proofs that "dataset meets schema S" or "quality ≥ Q" without revealing rows; TEE for escrow or sample verification; encrypted delivery.

**ZEN utility:** List and buy with ZEN; fees in ZEN; staking ZEN for curators or dispute resolvers; governance with ZEN.

**Why Horizen:** Fits "confidential data marketplaces"; differentiate by vertical (health, geodata) or ZK-heavy verification.

**Traction path:** 10K+ → 20K+ transactions and 250+ → 500+ wallets.

**Build:** Smart contracts for listings, payments, dispute; ZK circuits for data proofs; TEE or secure channel for delivery; frontend and API.

---

## 10. Private Messaging / Encrypted Access (Anonymous Infrastructure)

**One-line:** A net-new encrypted communication or access layer on Horizen: E2E encrypted channels or messages; ZK proofs of membership, delivery, or "right to access" without revealing identity or content; optional private group credentials.

**Category:** Anonymous Infrastructure — encrypted communication protocols.

**Privacy tech:** E2E encryption; ZK proofs of "I am in allowlist" or "message delivered" without revealing who/when; private credentials for channel access; optional TEE for key management or relay.

**ZEN utility:** Pay ZEN to create channels or premium features; staking ZEN for relayers; ZEN for premium storage or history.

**Why Horizen:** Direct fit for "encrypted communication protocols"; DAOs and communities for private coordination with on-chain access rules.

**Traction path:** 250+ → 500+ wallets and 10K+ → 20K+ transactions (join, send, prove access).

**Build:** Smart contracts for access rules and payments; client and relay; ZK for membership/delivery proofs; optional Horizen key escrow or compliance.

**Example (how it could work):** A DAO creates a private channel “Council” and sets a rule on Horizen: only wallets that hold ≥100 ZEN (or a specific NFT) can read/send. Users don’t reveal their wallet or balance to the relay: they prove in ZK “I satisfy the access rule.” The relay sees only a valid proof, then delivers E2E-encrypted messages to that user. Recipients decrypt locally. On-chain you might store only a channel id, access rule (e.g. Merkle root of allowed commitments), and optional payment (ZEN) for creating the channel; who joined and message content stay off-chain and encrypted.

**Build & submission:** We are building this for Genesis submission. **Frontend: React** (create channel, wallet connect, join with proof, send/receive encrypted messages). **Relay:** Node (encrypted blob store, verify Merkle then ZK). **On-chain:** Optional Horizen contract for channel access rule. Phase 0 = E2E + relay + Merkle (demo); Phase 1 = ZK membership proof (submission-ready).

**Prototype feasibility:** Relatively easy to get a demo in weeks. **Easy:** E2E encryption (e.g. libsodium or WebCrypto in the browser), a simple relay (Node/Express) that stores encrypted blobs and a channel allowlist, and a minimal web client (create channel, join with wallet, send/receive). **Medium:** On-chain access rule (one small Horizen contract: channel id to Merkle root of allowed addresses); client sends Merkle proof so relay can check membership without ZK at first. **Harder (optional for v1):** Full ZK proof so relay never sees the address (small circuit + your existing ZK tooling). **Suggested prototype:** Phase 0 = E2E + relay + allowlist with Merkle proof (address still sent to relay for lookup). Phase 1 = replace with ZK proof so relay never sees address.

---

## Quick Comparison

| # | Idea | Category | Privacy | Best traction metric |
|---|------|----------|---------|----------------------|
| 1 | ZK freelancer reputation | Anonymous infra | ZK (+ optional TEE) | Wallets + tx |
| 2 | Confidential micro-lending | Confidential DeFi | ZK or TEE | TVL or tx |
| 3 | Private voting / governance | Anonymous infra | ZK + encryption | Tx or wallets |
| 4 | ZK game (randomness + private inventory) — *out of scope* | ZK Gaming | ZK + VRF | — |
| 5 | Confidential verified-content attestation | Anonymous infra | ZK + TEE | Wallets + tx |
| 6 | Hidden order book DEX | Confidential DeFi | ZK or TEE | TVL or tx |
| 7 | Confidential yield farming | Confidential DeFi | ZK or TEE | TVL or wallets |
| 8 | Verifiable ML inference | Privacy-Preserving AI | TEE or ZK | Wallets + tx |
| 9 | Confidential data marketplace | Privacy-Preserving AI | ZK + TEE | Tx or wallets |
| 10 | Private messaging / encrypted access | Anonymous infra | ZK + encryption | Wallets + tx |

---

## Next Step

Choose one of the 9 in-scope ideas (Idea 4 — gaming — is out of scope) and expand it in `genesis/README.md` (idea summary, architecture, ZEN utility, milestones, team). Use `HORIZEN-ECOSYSTEM-AND-CAPABILITIES.md` and `../HORIZEN-PROGRAMS-REFERENCE.md` (in ProofPic) for program criteria and Horizen tech details.
