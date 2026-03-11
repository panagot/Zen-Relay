const BASE = '';

async function request(method, path, body) {
  const opts = { method, headers: {} };
  if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const t = await res.text();
    let msg = t;
    try {
      const j = JSON.parse(t);
      msg = j.error || j.message || t;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getChannels() {
  return request('GET', '/api/channels');
}

export async function getChannel(channelId) {
  return request('GET', `/api/channels/${channelId}`);
}

export async function createChannel(body) {
  return request('POST', '/api/channels', body);
}

export async function joinChannel(channelId, body) {
  return request('POST', `/api/channels/${channelId}/join`, body);
}

export async function getMessages(channelId) {
  return request('GET', `/api/channels/${channelId}/messages`);
}

export async function sendMessage(channelId, body) {
  return request('POST', `/api/channels/${channelId}/messages`, body);
}
