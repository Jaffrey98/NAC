const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
var fs = require('fs');
var child_process = require('child_process');

app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
   res.sendFile('index.html');
});


io.on('connection', function(socket) {
   // console.log('A user connected');

   var content;
   var write = "";
   var put = "";
   var network = "localnet1" // later comes from client

   // first read
   fs.readFile('acl.txt', function (err, data) {
		content = data.toString().split("\r\n");
		console.log("content: \n"+content)
	});

   socket.on('toggle',function(text){
   		write = ""
   		console.log("text: "+text)
   		if (text=="enable"){
   			put = "allow"
   		}
   		else{
   			put = "deny"
   		}

   		fs.readFile('acl.txt', function (err, data) {
   			content = data.toString().split("\r\n");
   		console.log(content)

   		for (i = 0; i < content.length; i++) {
		    var words = content[i].split(" ");
		    if (words[0]==network) {
		    	write = write + words[0] + " " + put + "\r\n"
		    }
		    else if (i < content.length-1){
		    	write = write + content[i] + "\r\n"
		    }
		    else{
		    	write = write + content[i]
		    }
		    console.log("in for")
		    console.log("write: "+ write)
		}
		console.log("write: "+ write)

		 fs.writeFile('acl.txt',write, function(err) {
		      if (err) {
		         return console.error(err);
		      }
			
				// child_process.execSync("mkdir foo"); // server restarting command here

		      
		   });
   		});


   });

   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});



server.listen(3000, function() {
   console.log('listening on localhost:3000');
});