var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var port = process.env.PORT || 80;
app.listen(port, function() {
  console.log("Listening on port "+port);
});


// application code
openSessions = new Array();

io.sockets.on('connection', function (socket) {
  // create an open session for this client
  // TODO: generate a random four-digit code that has not been used before. (allocate/free semantics?)
  var session = {
    name: openSessions.length,
    host: socket,
    controller: null
  };
  openSessions[session.name] = session;

  socket.set('sessionName', session.name, function() {
    // Return the allocated session name for display on the client.
    socket.emit('id', {sessionName: session.name});

    // The joinsession event is emitted by the controller client when the user types a session code.
    socket.on('joinsession', function (data) {
      var session;
      // find session and its host socket
      console.log(socket.id + " is joining session " + data.sessionName);
      if (openSessions[data.sessionName] !== undefined && openSessions[data.sessionName] !== null) {
        // session is not open anymore - keep local copy and remove from array.
        session = openSessions[data.sessionName];
        openSessions[data.sessionName] = null;
        session.controller = socket;
        
        // Start Controller client, forwarding events from it to Host client
        // Stop listening for join requests from it, and remove the unused session allocated.
        session.controller
          .removeAllListeners('joinsession')
          .emit('startsession', {sessionName: session.name})
          .get('sessionName', function(err, sessionName) {
            // Remove open session for client, since this will never be used.
            // TODO return sessionName to store of available names
            openSessions[sessionName] = null;
          })
          .on('update', function (data) {
            // TODO: based on eventName, send volatile or nonvolatile event.
            // TODO: use different socket.io events rather than encapsulating everything in 'update'.
            session.host.emit('update', {updateData: data.updateData});
          });

        // Start Host client
        // and stop listening for join requests from it.
        session.host
          .removeAllListeners('joinsession')
          .emit('startsession', {sessionName:session.name});
      } else {
        // session id not found 
        console.log("client provided unknown session id");
        socket.emit('error', {msg: "Unknown Session Name"});
      }
    });
  });
});



// basic http handler to server static content.
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

