const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 80;

// ✅ ENABLE CORS on frontend too
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(__dirname));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'frontend' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✓ Frontend server running on port ${port}`);
  console.log(`✓ CORS enabled for all origins`);
});
