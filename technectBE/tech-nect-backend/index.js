require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/gigs', require('./routes/gigs'));
app.use('/api/profile', require('./routes/profile'));

// Health check
app.get('/', (req, res) => res.send('Tech-Nect Backend Running!'));

// ✅ Wrap sync and server start in async IIFE
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected ✅');

    await sequelize.sync({ force: true }); // 👈 only once during dev reset

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();
