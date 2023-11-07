const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const poolRouter = require('./routes/pool');

app.use(cors({
  origin: 'http://localhost:3001',  // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
  credentials: true  // Allow cookies
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.use('/pool', poolRouter);

// Check if the file is being run directly, if so, start the server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

module.exports = app;  // Export the app instance for testing purposes