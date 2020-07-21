
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);


let isPeerConnected = false;
let participants = [];
let isConferanceActive = false;
let peerInitiatorSocketID;


app.use(express.static(__dirname + '/public'));


app.get('/start-video-call', (req, res) => {
   res.sendFile(__dirname + '/public/peer-initiate.html');
});

app.get('/connect', (req, res) => {
   res.sendFile(__dirname + '/public/peer.html');
});

app.get('/conference', (req, res) => {
   res.sendFile(__dirname + '/public/conference.html');
});

app.get('/conference', (req, res) => {
   res.sendFile(__dirname + '/public/conference.html');
});

app.get('/start-confer', (req, res) => {
   isConferanceActive = true;
   participants = [];
   res.redirect('/conference?name=hamza');
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

   socket.on('joinConference', () => {
      if (isConferanceActive) {
         socket.emit('connectAllPeer', participants)
         participants.push(socket.id);
      }

      socket.on('disconnect', () => participants = participants.filter(v => v != socket.id));
   })

   socket.on("offer", payload => {
      console.log(`Offer From: ${payload.callerName}`);
      io.to(payload.target).emit("offer", payload)
   });

   socket.on("answer", payload => {
      console.log(`Answer From: ${payload.callerName}`);
      io.to(payload.target).emit("answer", payload)
   });

   socket.on("ice-candidate", incoming => io.to(incoming.target).emit("ice-candidate", incoming.candidate));


});

const port = +process.env.PORT || 8000;
server.listen(port, () => console.log(`Express Server started on port: ${port}`));