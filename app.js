const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
var fs = require('fs');

var exec = require('child_process').exec;

app.use(express.static(__dirname + '/net-access-control/www'));

app.get('/', function (req, res) {
	res.sendFile('index.html');
});

// for log => Get-Content access.log -Wait

io.on('connection', function (socket) {
	// console.log('A user connected');

	var content;
	var write = "";
	var put = "";


	// first read
	fs.readFile('F:/Squid/etc/squid/squid.conf', function (err, data) {
		content = data.toString().split("\r\n");
		// console.log("content: \n" + content)
	});

	socket.on('toggle', function (rec_data) {
		// var data = data;
		var network = rec_data.labName; // later comes from client
		write = ""
		console.log("status: " + rec_data.status)
		if (rec_data.status == "enable") {
			put = "allow"
		} else {
			put = "deny"
		}

		fs.readFile('F:/Squid/etc/squid/squid.conf', function (err, data) {
			content = data.toString().split("\r\n");
			// console.log(content)

			for (i = 0; i < content.length; i++) {
				var words = content[i].split(" ");
				if (words[2] == network) {
					write = write + words[0] + " " + put + " " + network + "\r\n"
					// console.log("write: " + write)

				} else if (i < content.length - 1) {
					write = write + content[i] + "\r\n"
				} else {
					write = write + content[i]
				}
				// console.log("in for")
			}
			console.log("write: " + write)

			fs.writeFile('F:/Squid/etc/squid/squid.conf', write, function (err) {
				if (err) {
					return console.error(err);
					socket.emit('reply', 'fail')
				} else {
					exec('net stop "Squid for Windows" && net start "Squid for Windows"', function (error, stdout, stderr) {
						console.log(stdout);
						console.log("after squid restart: "+rec_data.status);
						socket.emit('reply', rec_data.status);
					});

				}

			});
		});


	});

	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
});



server.listen(3000, function () {
	console.log('listening on localhost:3000');
});