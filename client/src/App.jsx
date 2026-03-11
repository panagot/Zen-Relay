import { useState, useEffect, useCallback } from 'react';
import { getChannels, getChannel, createChannel, joinChannel, getMessages, sendMessage } from './api';
import { generateChannelKey, exportKey, importKey, encrypt, decrypt } from './lib/crypto';
import { merkleRoot, getProof } from './lib/merkle';
import styles from './App.module.css';

const RELAY_KEY = 'zenrelay_channel_keys';
const WALLET_KEY = 'zenrelay_wallet';

function loadChannelKeys() {
  try {
    const raw = sessionStorage.getItem(RELAY_KEY);
    return raw ? new Map(JSON.parse(raw)) : new Map();
  } catch {
    return new Map();
  }
}

function saveChannelKeys(map) {
  sessionStorage.setItem(RELAY_KEY, JSON.stringify([...map]));
}

function getWallet() {
  return sessionStorage.getItem(WALLET_KEY);
}

function setWallet(addr) {
  if (addr) sessionStorage.setItem(WALLET_KEY, addr);
  else sessionStorage.removeItem(WALLET_KEY);
}

export default function App() {
  const [channels, setChannels] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [channelKeys, setChannelKeys] = useState(loadChannelKeys);
  const [wallet, setWalletState] = useState(getWallet);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [ruleType, setRuleType] = useState('none');
  const [allowlistText, setAllowlistText] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [minToken, setMinToken] = useState('ZEN');
  const [nftCollection, setNftCollection] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [joinAllowlistText, setJoinAllowlistText] = useState('');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  const persistKeys = useCallback((next) => {
    setChannelKeys((prev) => {
      const m = new Map(prev);
      next(m);
      saveChannelKeys(m);
      return m;
    });
  }, []);

  const refreshChannels = useCallback(async () => {
    try {
      const list = await getChannels();
      setChannels(list);
    } catch (e) {
      setError('Relay unreachable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshChannels();
  }, [refreshChannels]);

  const refreshMessages = useCallback(async () => {
    if (!selectedId) return;
    try {
      const { messages: list } = await getMessages(selectedId);
      setMessages(list);
    } catch {
      setMessages([]);
    }
  }, [selectedId]);

  useEffect(() => {
    refreshMessages();
    const t = setInterval(refreshMessages, 3000);
    return () => clearInterval(t);
  }, [refreshMessages]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setError('');
    if (!newName.trim()) return;
    let rule = { type: 'none' };
    if (ruleType === 'allowlist' && allowlistText.trim()) {
      const addrs = allowlistText.trim().split(/\n/).map((s) => s.trim()).filter(Boolean);
      if (addrs.length === 0) {
        setError('Allowlist must have at least one address');
        return;
      }
      const root = await merkleRoot(addrs);
      if (!root) {
        setError('Could not build allowlist');
        return;
      }
      rule = { type: 'allowlist', merkleRoot: root };
    } else if (ruleType === 'minBalance' && minAmount.trim()) {
      const amount = minAmount.replace(/,/g, '').trim();
      if (!amount || isNaN(Number(amount))) {
        setError('Enter a valid amount');
        return;
      }
      rule = { type: 'minBalance', token: minToken.trim() || 'ZEN', amount };
    } else if (ruleType === 'nft' && nftCollection.trim()) {
      rule = { type: 'nft', collection: nftCollection.trim() };
    }
    try {
      const ch = await createChannel({ name: newName.trim(), rule });
      const key = await generateChannelKey();
      const raw = await exportKey(key);
      persistKeys((m) => m.set(ch.id, raw));
      setChannels((prev) => [...prev, ch]);
      setNewName('');
      setRuleType('none');
      setAllowlistText('');
      setMinAmount('');
      setNftCollection('');
      setCreateOpen(false);
      setSelectedId(ch.id);
    } catch (err) {
      setError(err.message || 'Create failed');
    }
  };

  const handleJoinByLink = async (e) => {
    e.preventDefault();
    setError('');
    const raw = joinLink.trim();
    let channelId, keyRaw;
    try {
      const url = new URL(raw);
      if (url.hash) {
        const hash = url.hash.slice(1);
        const [path, query] = hash.split('?');
        const match = path.match(/\/channel\/([^/]+)/);
        channelId = match ? match[1] : null;
        keyRaw = query ? new URLSearchParams(query).get('k') : null;
        if (!keyRaw) keyRaw = url.searchParams.get('k');
      } else {
        channelId = url.pathname.replace(/.*\/channel\/?/, '').split('/')[0] || url.searchParams.get('id');
        keyRaw = url.searchParams.get('k');
      }
    } catch {
      setError('Invalid URL');
      return;
    }
    if (!channelId || !keyRaw) {
      setError('Invalid link: need channel id and key (k in query or hash)');
      return;
    }
    const addr = wallet || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    let joinBody = { address: addr };
    try {
      const ch = await getChannel(channelId);
      if (ch.rule?.type === 'allowlist') {
        if (!joinAllowlistText.trim()) {
          setError('This channel uses an allowlist. Paste the list of allowed addresses (one per line) to generate your proof.');
          return;
        }
        const addrs = joinAllowlistText.trim().split(/\n/).map((s) => s.trim()).filter(Boolean);
        if (!addrs.includes(addr.toLowerCase())) {
          setError('Your address is not in the allowlist.');
          return;
        }
        const proof = await getProof(addrs, addr);
        if (!proof) {
          setError('Could not generate proof for your address.');
          return;
        }
        joinBody.merkleProof = proof;
      }
    } catch (_) {}
    try {
      await joinChannel(channelId, joinBody);
      const key = await importKey(keyRaw);
      const raw = await exportKey(key);
      persistKeys((m) => m.set(channelId, raw));
      await refreshChannels();
      setJoinLink('');
      setJoinAllowlistText('');
      setJoinOpen(false);
      setSelectedId(channelId);
    } catch (err) {
      setError(err.message || 'Join failed');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedId || !input.trim()) return;
    const keyRaw = channelKeys.get(selectedId);
    if (!keyRaw) {
      setError('No key for this channel. Use the invite link to get the key.');
      return;
    }
    setError('');
    try {
      const key = await importKey(keyRaw);
      const ciphertext = await encrypt(key, input.trim());
      await sendMessage(selectedId, {
        ciphertext,
        senderId: wallet || null,
      });
      setInput('');
      refreshMessages();
    } catch (err) {
      setError(err.message || 'Send failed');
    }
  };

  const selectedChannel = channels.find((c) => c.id === selectedId);
  const hasKey = selectedId && channelKeys.has(selectedId);
  const ruleSummary = (ch) => {
    if (!ch?.rule || ch.rule.type === 'none') return null;
    if (ch.rule.type === 'allowlist') return 'Allowlist';
    if (ch.rule.type === 'minBalance') return `≥ ${ch.rule.amount} ${ch.rule.token}`;
    if (ch.rule.type === 'nft') return `NFT: ${ch.rule.collection.slice(0, 10)}…`;
    return null;
  };
  const inviteUrl = selectedId && hasKey
    ? `${window.location.origin}${window.location.pathname}#/channel/${selectedId}?k=${encodeURIComponent(channelKeys.get(selectedId))}`
    : '';

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHead}>
          <h1 className={styles.logo}>Zen Relay</h1>
          <p className={styles.tagline}>Encrypted channels</p>
        </div>
        <div className={styles.walletRow}>
          {wallet ? (
            <span className={styles.address} title={wallet}>{wallet.slice(0, 6)}…{wallet.slice(-4)}</span>
          ) : (
            <span className={styles.addressPlaceholder}>No wallet</span>
          )}
          <button
            type="button"
            className={styles.walletBtn}
            onClick={() => {
              const addr = wallet ? null : `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
              setWallet(addr);
              setWalletState(addr);
            }}
          >
            {wallet ? 'Disconnect' : 'Connect'}
          </button>
        </div>
        <nav className={styles.channelList}>
          {loading ? (
            <p className={styles.muted}>Loading…</p>
          ) : (
            channels.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={selectedId === ch.id ? styles.channelActive : styles.channelBtn}
                onClick={() => setSelectedId(ch.id)}
              >
                <span className={styles.channelName}>{ch.name}</span>
                <span className={styles.channelMeta}>
                  {ch.id.slice(0, 8)}
                  {ruleSummary(ch) && ` · ${ruleSummary(ch)}`}
                </span>
              </button>
            ))
          )}
        </nav>
        <div className={styles.sidebarActions}>
          <button type="button" className={styles.primaryBtn} onClick={() => setCreateOpen(true)}>
            New channel
          </button>
          <button type="button" className={styles.secondaryBtn} onClick={() => setJoinOpen(true)}>
            Join with link
          </button>
          <button type="button" className={styles.instructionsBtn} onClick={() => setShowInstructions(true)}>
            How to use
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        {showInstructions ? (
          <InstructionsView onBack={() => setShowInstructions(false)} styles={styles} />
        ) : selectedChannel ? (
          <>
            <header className={styles.threadHead}>
              <h2 className={styles.threadTitle}>{selectedChannel.name}</h2>
              <span className={styles.threadId}>
                {selectedChannel.id}
                {ruleSummary(selectedChannel) && ` · ${ruleSummary(selectedChannel)}`}
              </span>
              {hasKey && (
                <div className={styles.inviteBox}>
                  <label className={styles.inviteLabel}>Invite link (contains key; share privately)</label>
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className={styles.inviteInput}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              )}
            </header>
            <div className={styles.messages}>
              {messages.length === 0 && (
                <p className={styles.muted}>No messages yet. Send one below — only people with the key can read it.</p>
              )}
              {messages.map((m) => (
                <MessageRow key={m.id} message={m} channelKeys={channelKeys} />
              ))}
            </div>
            {hasKey ? (
              <form className={styles.sendForm} onSubmit={handleSend}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message (E2E encrypted)"
                  className={styles.input}
                  rows={2}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend(e))}
                />
                <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
                  Send
                </button>
              </form>
            ) : (
              <p className={styles.noKey}>You don’t have the key for this channel. Join via the creator’s invite link.</p>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Select a channel</p>
            <p className={styles.muted}>Create one or join with an invite link. Open <button type="button" className={styles.inlineLink} onClick={() => setShowInstructions(true)}>How to use</button> for instructions.</p>
          </div>
        )}
        {error && (
          <div className={styles.error}>
            {error}
            <button type="button" className={styles.dismiss} onClick={() => setError('')}>×</button>
          </div>
        )}
      </main>
      {createOpen && (
        <div className={styles.modalBackdrop} onClick={() => setCreateOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>New channel</h3>
            <form onSubmit={handleCreateChannel}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Channel name"
                className={styles.modalInput}
                autoFocus
              />
              <div className={styles.ruleSection}>
                <label className={styles.ruleLabel}>Access rule (who can join)</label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  className={styles.ruleSelect}
                >
                  <option value="none">None (anyone with invite link)</option>
                  <option value="allowlist">Allowlist (addresses you provide)</option>
                  <option value="minBalance">Min. token balance (e.g. 100 ZEN)</option>
                  <option value="nft">Hold NFT (collection)</option>
                </select>
                {ruleType === 'allowlist' && (
                  <textarea
                    value={allowlistText}
                    onChange={(e) => setAllowlistText(e.target.value)}
                    placeholder="One address per line (only the Merkle root is stored; share the list privately with members)"
                    className={styles.ruleTextarea}
                    rows={4}
                  />
                )}
                {ruleType === 'minBalance' && (
                  <div className={styles.ruleRow}>
                    <input
                      type="text"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Amount (e.g. 100)"
                      className={styles.ruleInput}
                    />
                    <input
                      type="text"
                      value={minToken}
                      onChange={(e) => setMinToken(e.target.value)}
                      placeholder="Token (e.g. ZEN)"
                      className={styles.ruleInput}
                    />
                  </div>
                )}
                {ruleType === 'nft' && (
                  <input
                    type="text"
                    value={nftCollection}
                    onChange={(e) => setNftCollection(e.target.value)}
                    placeholder="NFT collection address (0x...)"
                    className={styles.modalInput}
                  />
                )}
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setCreateOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {joinOpen && (
        <div className={styles.modalBackdrop} onClick={() => setJoinOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Join with link</h3>
            <form onSubmit={handleJoinByLink}>
              <input
                type="text"
                value={joinLink}
                onChange={(e) => setJoinLink(e.target.value)}
                placeholder="Paste invite link (with #k= or ?k= key)"
                className={styles.modalInput}
                autoFocus
              />
              <div className={styles.ruleSection}>
                <label className={styles.ruleLabel}>If channel uses allowlist: paste the list (one address per line)</label>
                <textarea
                  value={joinAllowlistText}
                  onChange={(e) => setJoinAllowlistText(e.target.value)}
                  placeholder="Optional — only needed if the channel has an allowlist rule. Your address must be in this list."
                  className={styles.ruleTextarea}
                  rows={3}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setJoinOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Join</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InstructionsView({ onBack, styles: s }) {
  return (
    <div className={s.instructions}>
      <div className={s.instructionsHead}>
        <button type="button" className={s.instructionsBack} onClick={onBack}>← Back</button>
        <h2 className={s.instructionsTitle}>How to use Zen Relay</h2>
        <p className={s.instructionsIntro}>Private channels with end-to-end encryption. Only people with the invite link (and the key inside it) can read messages. You can add access rules so only certain addresses can join.</p>
      </div>
      <div className={s.instructionsBody}>
        <section className={s.instructionsSection}>
          <h3>1. Connect a wallet</h3>
          <p>Click <strong>Connect</strong> in the sidebar. In this demo, a simulated address is used. On Horizen mainnet you would connect a real wallet (e.g. MetaMask) so the app can prove you meet access rules (tokens, NFT, or allowlist).</p>
        </section>
        <section className={s.instructionsSection}>
          <h3>2. Create a channel</h3>
          <p>Click <strong>New channel</strong>, enter a name, and optionally set an <strong>access rule</strong>:</p>
          <ul>
            <li><strong>None</strong> — Anyone with the invite link can join.</li>
            <li><strong>Allowlist</strong> — Paste addresses (one per line). Only the Merkle root is stored on the server. Share the list privately with members; they paste it when joining to generate a proof.</li>
            <li><strong>Min. token balance</strong> — Require e.g. 100 ZEN (or another token). The rule is stored and shown; on-chain checks can be added later.</li>
            <li><strong>Hold NFT</strong> — Require holding an NFT from a collection (address). Same as above: rule is stored for display and future enforcement.</li>
          </ul>
          <p>After creating, you get an <strong>invite link</strong> in the channel header. That link contains the channel’s decryption key — share it only with people who should read the messages.</p>
        </section>
        <section className={s.instructionsSection}>
          <h3>3. Share the invite link</h3>
          <p>Copy the invite link from the channel header and send it to whoever you want in the channel. If you used an <strong>allowlist</strong>, also share the list of allowed addresses (e.g. in a doc or DM). The server never sees the list; it only stores the Merkle root. Members need the list to generate their proof when joining.</p>
        </section>
        <section className={s.instructionsSection}>
          <h3>4. Join a channel</h3>
          <p>Click <strong>Join with link</strong>, paste the invite link, and click Join. If the channel has an allowlist, paste the same list of addresses (one per line) in the box below the link — your address must be in that list. The app will prove you’re on the list without sending the list to the server.</p>
        </section>
        <section className={s.instructionsSection}>
          <h3>5. Send and read messages</h3>
          <p>Messages are encrypted in your browser before being sent. The relay only stores ciphertext. Only people who have the channel key (from the invite link) can decrypt. Select a channel in the sidebar, type in the box at the bottom, and click <strong>Send</strong>.</p>
        </section>
        <section className={s.instructionsSection}>
          <h3>Privacy at a glance</h3>
          <ul>
            <li>The relay never sees message content or the channel key.</li>
            <li>With an allowlist, the server only stores a Merkle root; members prove membership with a ZK-style proof.</li>
            <li>Min balance and NFT rules are stored for display; you can add on-chain checks later so only holders can join.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function MessageRow({ message, channelKeys }) {
  const [plain, setPlain] = useState(null);
  const [fail, setFail] = useState(false);
  const keyRaw = channelKeys.get(message.channelId);

  useEffect(() => {
    if (!keyRaw) {
      setFail(true);
      return;
    }
    importKey(keyRaw)
      .then((key) => decrypt(key, message.ciphertext))
      .then(setPlain)
      .catch(() => setFail(true));
  }, [message.id, message.ciphertext, keyRaw]);

  const time = new Date(message.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={styles.msgRow}>
      <span className={styles.msgMeta}>{time}</span>
      {fail ? (
        <span className={styles.msgCipher}>Unable to decrypt</span>
      ) : plain === null ? (
        <span className={styles.msgCipher}>…</span>
      ) : (
        <span className={styles.msgPlain}>{plain}</span>
      )}
    </div>
  );
}
