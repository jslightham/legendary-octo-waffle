const express = require('express');
const app = express();
const webSockets = express();
const bodyParser = require('body-parser');
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');
const config = require('./DB.js');
const roomRoute = require('./room.route');
var expressWs = require('express-ws')(app);

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/rooms', roomRoute);

app.listen(PORT, function () {
    console.log('Express server running on port:', PORT);
})

app.ws('/:id', function (ws, req) {

    ws.on('message', function (msg) {
        msgJ = JSON.parse(msg);
        console.log(req.params.id);
        console.log(msgJ.playerId);
        ws.send(msg);
    });

    ws.onclose = function (event) {
        console.log("Client disconnected from: " + req.params.id);
    };
    console.log("Client connected to: " + req.params.id);
});