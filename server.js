const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WEBSOCKET_PORT || 8080;
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'change-this-token-immediately';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.json({ status: 'READY', service: 'HackerWatch Sovereign v3.0' }));

app.get('/status', (req, res) => {
  const interfaces = os.networkInterfaces();
  res.json({
    status: 'SOVEREIGN',
    mode: 'air-gapped',
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    platform: os.platform(),
    interfaces: Object.keys(interfaces),
    note: 'Packet-level capture requires additional privileges (tcpdump / Wireshark)'
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚨 HackerWatch Sovereign v3.0 running on http://127.0.0.1:${PORT}`);
});

// WebSocket for live system info
const wss = new WebSocket.Server({ port: WS_PORT, host: '127.0.0.1' });

wss.on('connection', (ws, req) => {
  const auth = new URL(req.url, 'ws://localhost').searchParams.get('token');
  if (auth !== AUTH_TOKEN) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  ws.send(JSON.stringify({ type: 'SYSTEM', message: 'Sovereign Fortress Connected' }));

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const load = os.loadavg();
      ws.send(JSON.stringify({
        type: 'MONITOR',
        payload: {
          timestamp: new Date().toISOString(),
          cpuLoad: load[0].toFixed(2),
          memoryUsedMB: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
          message: 'Local system monitored (read-only)'
        }
      }));
    }
  }, 8000);

  ws.on('close', () => clearInterval(interval));
});

console.log('✅ WebSocket monitoring active on port', WS_PORT);
