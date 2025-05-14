const express = require('express');
const app = express();
const port = 3000;
const pool = require('./models/db');
const commandesRouter = require('./routes/commandes');
app.use('/api/commandes', commandesRouter);


app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.json());

// Simple route test
app.get('/', (req, res) => {
  res.send('Middleware PFE is running!');
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
