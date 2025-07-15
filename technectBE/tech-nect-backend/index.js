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

const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);


// Health check
app.get('/', (req, res) => res.send('Tech-Nect Backend Running!'));

// Sync DB and start
const PORT = process.env.PORT || 4000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
