const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const poolRouter = require('./routes/pool');

const rateLimit = require('express-rate-limit');

// Define a rate limit: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiter to all requests
app.use(limiter);

app.use(cors({
  origin: '*',  // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
  credentials: true  // Allow cookies
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'alive' });
});

app.use('/pool', poolRouter);

// Check if the file is being run directly, if so, start the server
if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = app;  // Export the app instance for testing purposes