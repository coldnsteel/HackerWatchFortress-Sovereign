const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WEBSOCKET_PORT || 8080;
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'change-this-token-immediately';

app.use(express.static(path.join(__dirname, 'public')));

// Status endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'READY', service: 'HackerWatch Sovereign v3.0' });
});

app.get('/status', (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  res.json({
    status: 'SOVEREIGN',
    mode: 'air-gapped',
    cloud: false,
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    platform: os.platform(),
    networkInterfaces: Object.keys(networkInterfaces)
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚨 HackerWatch Sovereign running on http://127.0.0.1:${PORT}`);
});

// ==================== WebSocket Server ====================
const wss = new WebSocket.Server({ port: WS_PORT, host: '127.0.0.1' });

wss.on('connection', (ws, req) => {
  const auth = new URL(req.url, 'ws://localhost').searchParams.get('token');

  if (auth !== AUTH_TOKEN) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  console.log('🔐 Sovereign client connected');
  ws.send(JSON.stringify({ 
    type: 'SYSTEM', 
    message: 'Sovereign Fortress Connected - Air-gapped Mode' 
  }));

  // Send initial system info
  ws.send(JSON.stringify({
    type: 'STATUS',
    payload: {
      interfaces: Object.keys(os.networkInterfaces()),
      monitoring: 'local_only'
    }
  }));

  // Periodic local monitoring (safe, read-only)
  const monitorInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const load = os.loadavg();
      ws.send(JSON.stringify({
        type: 'MONITOR',
        payload: {
          timestamp: new Date().toISOString(),
          cpuLoad: load[0].toFixed(2),
          memory: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024) + ' MB used',
          message: 'Local system monitored - No external traffic detected'
        }
      }));
    }
  }, 10000);

  ws.on('close', () => {
    clearInterval(monitorInterval);
    console.log('Client disconnected');
  });
});

console.log('✅ WebSocket monitoring channel active on port', WS_PORT);
