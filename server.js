require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./storage/db');
const cookieParser = require("cookie-parser");



const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow vercel deployments
    if (origin.includes('vercel.app')) return callback(null, true);
    
    // Allow other origins for testing
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Core middleware
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json());
app.use(cookieParser());


// Route modules
const checkRouter = require('./routes/check');
const healthRouter = require('./routes/health');
const contentRouter = require('./routes/content');
const userDNARouter = require('./routes/userDNA');
const funfactsRouter = require('./routes/funfacts');
const summariesRouter = require('./routes/summaries');
const engagementsRouter = require('./routes/engagements');
const fixturesRouter = require('./routes/fixtures');
const loginRouter = require('./routes/login');

app.use('/', checkRouter);
app.use('/health', healthRouter);
app.use('/content', contentRouter);
app.use('/userDNA', userDNARouter);
app.use('/funfacts', funfactsRouter);
app.use('/summaries', summariesRouter);
app.use('/engagements', engagementsRouter);
app.use('/fixtures', fixturesRouter);
app.use('/login', loginRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});




app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({ error: message });
});


async function start() {
  try {
    // Verify DB connectivity before starting the server
    // await pool.query('SELECT 1');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
  }
}

start();