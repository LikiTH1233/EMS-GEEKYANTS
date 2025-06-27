// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'manager1@example.com' && password === 'password123') {
    res.json({ token: 'real-token-here' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Mock assignments endpoint
app.get('/api/assignments', (req, res) => {
  const token = req.headers.authorization;
  if (!token || !token.includes('Bearer')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json([
    {
      _id: '1',
      projectId: { name: 'Project Alpha' },
      engineerId: { name: 'John Doe' },
      allocationPercentage: 75
    }
  ]);
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
