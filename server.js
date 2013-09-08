var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(80);

var clients  = new Array();
var sessions = new Array();


function updateSession(socket, data) {
  if (sessions[data.sessionName]) {
    session = sessions[data.sessionName];
    console.log("updating session with "+session.clients.length+" clients.");
    for (i = 0; i < session.clients.length; i++) {
      client = session.clients[i];
      client.emit("update", {updateData: data.updateData});
    }
  } else {
    socket.emit("error", {msg: "Invalid Session"});
  }
}

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

io.sockets.on('connection', function (socket) {
  id = clients.length;
  console.log(id);
  clients[id] = socket;
  socket.set("clientId", id, function() {
    sessionName = id;

    sessions[sessions.length] = {
      sessionName: sessionName,
      clients: [socket]
    };

    socket.get('clientId', function(err, clientId) {
      console.log("new client connected, giving clientId "+clientId+" and sessionName "+sessionName+".");
      socket.emit('id', {clientId: clientId, sessionName: sessionName});

      socket.on('joinsession', function (data) {
        console.log(data.clientId + " joining session " + data.sessionName);
        if (sessions[data.sessionName] !== undefined) {
          session = sessions[data.sessionName];
          session.clients[session.clients.length] = socket;
          console.log("joining existing session");
          for (i = 0; i < session.clients.length; i++) {
            session.clients[i]
              .emit('startsession', {sessionName: data.sessionName})
              .on('update', function (data) {
                updateSession(socket, data);
              });
          }
        } else {
          socket.emit('error', {msg: "Unknown Session Name"});
        }
      });
    });
  }); 
});
