import app from '../relay/server.js';

export const config = { runtime: 'nodejs20' };

export default function handler(req, res) {
  // Rewrite sends /api/* to /api/relay/$1; restore path so Express sees /api/channels etc.
  const u = req.url || '';
  if (u.startsWith('/api/relay')) {
    req.url = '/api' + (u.slice('/api/relay'.length) || '') || '/api';
  }
  return app(req, res);
}
