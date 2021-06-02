let path = require('path');
let express = require('express');
let app = module.exports = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve('client/index.html'));
});
