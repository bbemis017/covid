const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

let jsonData = JSON.parse(fs.readFileSync('src/worldometer.json', 'utf-8'));

app.get('/ping', function (req, res) {
 return res.send('pong');
});


app.get('/data', (req, res) => {
    console.log('get data');
    return res.json(jsonData);
});



app.listen(process.env.PORT || 3001);