const express = require('express');
const WebSocket = require('ws');
const app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>HackerWatch Sovereign v3.0</title>
  <style>
    body { background: #0a0a0a; color: #00ff00; font-family: monospace; padding: 20px; }
    .banner { background: #ff0000; color: #000; padding: 15px; text-align: center; font-weight: bold; margin-bottom: 20px; }
    .section { border: 2px solid #00ff00; padding: 20px; margin: 15px 0; border-radius: 10px; }
    button { background: #00ff00; color: #000; padding: 12px 25px; border: none; cursor: pointer; margin: 10px 5px; font-weight: bold; }
    .log { font-size: 0.9em; border-left: 3px solid #00ff00; padding-left: 10px; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="banner">HackerWatch Sovereign v3.0 - No Government Ties</div>
  
  <div class="section">
    <h2>System Status</h2>
    <div>Status: <strong id="status">READY</strong></div>
    <div>IP: <span id="ip">Loading...</span></div>
    <button onclick="connect()">Connect Backend</button>
    <button onclick="startMonitoring()">Start Monitoring</button>
  </div>
  
  <div class="section">
    <h2>Security Logs</h2>
    <div id="logs">
      <div class="log">[INIT] Sovereign Fortress v3.0</div>
      <div class="log">[INFO] No government ties</div>
      <div class="log">[INFO] Personal use only</div>
    </div>
  </div>
  
  <div style="text-align:center;margin-top:20px;">
    <p>Contact: lexalytics@yahoo.com</p>
    <p>Emmanuel - God With Us</p>
  </div>
  
  <script>
    let ws = null;
    
    async function detectIP() {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        document.getElementById('ip').textContent = data.ip;
        addLog('IP detected: ' + data.ip);
      } catch (error) {
        document.getElementById('ip').textContent = 'Detection failed';
      }
    }
    
    function connect() {
      ws = new WebSocket('ws://localhost:8080');
      ws.onopen = () => {
        document.getElementById('status').textContent = 'CONNECTED';
        addLog('Backend connected');
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        addLog(data.message);
      };
      ws.onerror = () => addLog('Connection error');
    }
    
    function startMonitoring() {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ command: 'start' }));
        addLog('Monitoring started');
      } else {
        addLog('Connect backend first');
      }
    }
    
    function addLog(message) {
      const now = new Date().toLocaleTimeString();
      document.getElementById('logs').innerHTML += 
        '<div class="log">[' + now + '] ' + message + '</div>';
    }
    
    detectIP();
  </script>
</body>
</html>`);
});

app.get('/health', (req, res) => res.json({ ok: true }));

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'SYSTEM', message: 'Sovereign Fortress connected' }));
  ws.on('message', data => {
    try {
      const cmd = JSON.parse(data);
      if (cmd.command === 'start') {
        ws.send(JSON.stringify({ type: 'SYSTEM', message: 'Monitoring activated' }));
      }
    } catch (e) {}
  });
});

app.listen(3000, () => console.log('Sovereign Fortress running on port 3000'));
