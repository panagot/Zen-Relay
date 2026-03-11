import app from '../relay/server.js';

export const config = { runtime: 'nodejs' };

export default function handler(req, res) {
  // Rewrite sends /api/* to /api/relay?path=$1; parse path from req.url (req.query may be unset in serverless).
  const u = req.url || '';
  const path = (() => {
    try {
      const i = u.indexOf('?');
      if (i < 0) return '';
      return new URLSearchParams(u.slice(i)).get('path') || '';
    } catch {
      return '';
    }
  })();
  req.url = path ? '/api/' + path : '/api';
  return app(req, res);
}
