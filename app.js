const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
var fs = require('fs');

var exec = require('child_process').exec;

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
	res.sendFile('index.html');
});

// for log => Get-Content access.log -Wait

io.on('connection', function (socket) {
	// console.log('A user connected');

	var content;
	var write = "";
	var put = "";
	var network = "localnet" // later comes from client

	// first read
	fs.readFile('F:/Squid/etc/squid/squid.conf', function (err, data) {
		content = data.toString().split("\r\n");
		console.log("content: \n" + content)
	});

	socket.on('toggle', function (text) {
		write = ""
		console.log("text: " + text)
		if (text == "enable") {
			put = "allow"
		} else {
			put = "deny"
		}

		fs.readFile('F:/Squid/etc/squid/squid.conf', function (err, data) {
			content = data.toString().split("\r\n");
			console.log(content)

			for (i = 0; i < content.length; i++) {
				var words = content[i].split(" ");
				if (words[2] == network) {
					write = write + words[0] + " " + put + " " + network + "\r\n"
				} else if (i < content.length - 1) {
					write = write + content[i] + "\r\n"
				} else {
					write = write + content[i]
				}
				console.log("in for")
				console.log("write: " + write)
			}
			console.log("write: " + write)

			fs.writeFile('F:/Squid/etc/squid/squid.conf', write, function (err) {
				if (err) {
					return console.error(err);
				} else {
					exec('net stop "Squid for Windows" && net start "Squid for Windows"', function (error, stdout, stderr) {
						console.log(stdout);
					});
				}

				// exec('net start "Squid for Windows"', function(error, stdout, stderr) {
				//     console.log(stdout);
				// });

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