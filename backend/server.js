const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// ✅ ENABLE CORS - Critical for frontend-backend communication
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  try {
    console.log('Connecting to PostgreSQL Aurora...');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    
    const client = await pool.connect();
    console.log('✓ Successfully connected to database');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table "users" is ready');
    
    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log(`✓ Current users in database: ${result.rows[0].count}`);
    
    client.release();
    console.log('✓ Database initialization completed');
  } catch (err) {
    console.error('✗ Error initializing database:', err.message);
  }
}

initDB();

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      service: 'backend',
      timestamp: new Date(),
      database: 'connected',
      dbTime: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: err.message 
    });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      service: 'backend',
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: err.message 
    });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    console.log('Fetching all users...');
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    console.log(`Found ${result.rows.length} users`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  try {
    console.log('Creating new user:', { name, email });
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    console.log('User created successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log('Deleting user:', id);
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User deleted successfully');
    res.json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log('=================================');
  console.log(`✓ Backend server running on port ${port}`);
  console.log(`✓ API endpoint: http://0.0.0.0:${port}/api`);
  console.log(`✓ CORS enabled for all origins`);
  console.log('=================================');
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database pool...');
  await pool.end();
  process.exit(0);
});
