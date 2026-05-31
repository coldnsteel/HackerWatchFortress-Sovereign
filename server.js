const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WEBSOCKET_PORT || 8080;
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'change-this-token-immediately';

app.use(express.static(path.join(__dirname, 'public')));

// Status endpoints
app.get('/health', (req, res) => res.json({ status: 'READY', service: 'HackerWatch Sovereign' }));
app.get('/status', (req, res) => {
  res.json({
    status: 'SOVEREIGN',
    mode: 'air-gapped',
    cloud: false,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚨 HackerWatch Sovereign running on http://127.0.0.1:${PORT}`);
});

// Local WebSocket
const wss = new WebSocket.Server({ port: WS_PORT, host: '127.0.0.1' });

wss.on('connection', (ws, req) => {
  const auth = new URL(req.url, 'ws://localhost').searchParams.get('token');
  if (auth !== AUTH_TOKEN) {
    ws.close(1008, 'Unauthorized');
    return;
  }
  ws.send(JSON.stringify({ type: 'SYSTEM', message: 'Sovereign Fortress Connected - No Government Ties' }));
});

console.log('✅ Sovereign Fortress Initialized');
