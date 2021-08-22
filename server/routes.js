let path = require('path');
let express = require('express');
let app = module.exports = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve('client/html/start.html'));
});

app.post('/createRoom', (req, res) => {
    // console.log(req)
    // res.send('hi');
    // res.err
    let roomDetails = {

    }
});

