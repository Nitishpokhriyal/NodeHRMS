
const { connectDB, closeDB } = require('./config/dbConfig');
const userRoutes = require('./src/routes/userRoutes');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Connect to database
connectDB().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api', userRoutes);

// Start the server
const port = 3003;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});
