# Zen Relay

Private channels with end-to-end encryption and access rules (allowlist, min balance, NFT). Messages are encrypted in the browser; the relay never sees keys or plaintext.

## Run locally

```bash
npm install
cd relay && npm install && cd ..
cd client && npm install && cd ..
npm run dev
```

- Relay: http://localhost:3001  
- Client: http://localhost:5173 (or next available port)

## Deploy (Vercel)

Deploy the **client** only. Set **Root Directory** to `client`, **Build Command** to `npm run build`, **Output Directory** to `dist`. Run the relay separately (e.g. Railway, Render) and set the client API base URL to your relay URL.

## License

MIT
