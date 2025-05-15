const express = require('express');
const cors = require('cors');

const commandesRoutes = require('./routes/commandes');
const authRoutes = require('./routes/auth');  // your auth routes
// const integrationsRoutes = require('./routes/integrations'); // if you have

const app = express();
const port = 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/commandes', commandesRoutes);
// app.use('/integrations', integrationsRoutes);

app.listen(port, () => {
  console.log(`Middleware API running on http://localhost:${port}`);
});
