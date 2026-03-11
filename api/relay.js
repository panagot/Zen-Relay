import app from '../relay/server.js';

export const config = { runtime: 'nodejs' };

export default function handler(req, res) {
  // Rewrite sends /api/* to /api/relay?path=$1 so this function is always hit; restore path for Express.
  const path = (req.query && req.query.path) || '';
  req.url = path ? '/api/' + path : '/api';
  return app(req, res);
}
