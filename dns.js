const fs = require('fs');

const dns2 = require('dns2');

const { Packet } = dns2;

const server = dns2.createServer({
  udp: true,
  handle: (request, send, rinfo) => {
    const response = Packet.createResponseFromRequest(request);
    const [ question ] = request.questions;
    const { name } = question;
	fs.readFile(question.name, 'utf8', function (err,data) {

if (err) {
	//console.error(err); 
	console.log("FILE READ ERROR : Record probably doesn't exist");
		    response.answers.push({
		      name,
		      type: Packet.TYPE.A,
		      class: Packet.CLASS.IN,
		      ttl: 300,
		      address: '127.0.0.1'
		    });  console.log(response.answers[0].address); send(response);


  } else{
		    response.answers.push({
		      name,
		      type: Packet.TYPE.A,
		      class: Packet.CLASS.IN,
		      ttl: 300,
		      address: data
		    });     console.log(response.answers[0].address); send(response); }
  });
    //console.log(question.name);

  }
});

server.on('request', (request, response, rinfo) => {
  console.log(request.header.id, request.questions[0].name);
});

server.on('listening', () => {
server.listening.then(function(serverinfo) { console.log("DNS SERVER LISTENING ON :"); console.log(serverinfo); });
});

server.on('close', () => {
  console.log('server closed');
});

server.listen({
  udp: 5333
});

// eventually
//server.close();
