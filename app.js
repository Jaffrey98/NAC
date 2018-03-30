const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
// const db = require('./modules/db.js');

app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
   res.sendFile('index.html');
});


io.on('connection', function(socket) {
   console.log('A user connected');

   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});



server.listen(3000, function() {
   console.log('listening on localhost:3000');
});