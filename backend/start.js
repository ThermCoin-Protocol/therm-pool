const app = require('./app');
const config = require('./config/config.json');

app.listen(config.port, () => {
    console.log(`Server started on http://localhost:${config.port}`);
});