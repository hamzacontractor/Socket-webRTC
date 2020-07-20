
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);


let isPeerConnected = false;
let participants = [];
let isConferanceActive = true;
let peerInitiatorSocketID;


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

app.get('/start-video-call', (req, res) => {
   res.sendFile(__dirname + '/public/peer-initiate.html');
});

app.get('/connect', (req, res) => {
   res.sendFile(__dirname + '/public/peer.html');
});

app.get('/conference', (req, res) => {
   res.sendFile(__dirname + '/public/conference.html');
});



io.on("connection", socket => {
   socket.on("join", type => {
      console.log(`${socket.id} connected as ${type}`);
      if (!isPeerConnected && type === 'peerInitator') {
         isPeerConnected = true;
         peerInitiatorSocketID = socket.id;
         socket.on('disconnect', () => {
            isPeerConnected = false;
            peerInitiatorSocketID = '';
         });
      }
      if (isPeerConnected && type === 'peer') {
         socket.emit("connectPeer", peerInitiatorSocketID);
         socket.on("connected", () => socket.to(peerInitiatorSocketID).emit("peerConnected", socket.id));
         socket.on('disconnect', () => {
            socket.to(peerInitiatorSocketID).emit('peerDisconnected', socket.id);
         });
      }
   });

   socket.on('joinConference', name => {
      if (isConferanceActive) {
         socket.emit('connectAllPeer', participants)
      }
      participants.push(socket.id);
   })

   socket.on("offer", payload => {
      io.to(payload.target).emit("offer", payload);
   });

   socket.on("answer", payload => {
      io.to(payload.target).emit("answer", payload);
   });

   socket.on("ice-candidate", incoming => {
      io.to(incoming.target).emit("ice-candidate", incoming.candidate);
   });

});

const port = +process.env.PORT || 8000;
server.listen(port, () => console.log(`Express Server started on port: ${port}`));