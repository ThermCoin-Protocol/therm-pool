const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const poolRouter = require('./routes/pool');

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